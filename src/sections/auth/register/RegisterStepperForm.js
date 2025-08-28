import * as Yup from 'yup';
import { useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { 
  Stack, 
  IconButton, 
  InputAdornment, 
  Alert, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Grid,
  Tooltip,
  StepConnector,
  useTheme,
  useMediaQuery,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// framer motion
import { m } from 'framer-motion';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { 
  FormProvider, 
  RHFRadioGroup, 
  RHFSelect, 
  RHFTextField, 
  RHFUploadSingleFile,
  RHFUploadAvatar,
  RHFMultipleSelect
} from '../../../components/hook-form';
// redux
import { useDispatch } from '../../../redux/store';
import { updateTeacher, changeProfilePicture } from '../../../redux/slices/teachers';
// utils
import axios from '../../../utils/axios';
// mock
import { countries } from "src/_mock";
import { ski_resorts } from "src/_mock";

// ----------------------------------------------------------------------

const STEPS = [
  { label: '¡Vamos a Empezar!', icon: 'eva:rocket-fill' },
  { label: 'Información Básica', icon: 'eva:person-fill' },
  { label: 'Certificación', icon: 'eva:award-fill' },
  { label: 'Perfil Personal', icon: 'eva:camera-fill' },
  { label: 'Especialidades', icon: 'eva:star-fill' },
  { label: 'Ahora Descríbete', icon: 'eva:edit-fill' },
  { label: 'Precios', icon: 'eva:credit-card-fill' },
  { label: 'Información Adicional', icon: 'eva:file-text-fill' }
];

// Custom Step Connector
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// Custom Step Icon
function QontoStepIcon({ active, completed, icon }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : completed ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon="eva:checkmark-fill" sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Iconify icon={icon} sx={{ zIndex: 1, width: 20, height: 20 }} />
      )}
    </Box>
  );
}

const RegisterStepperForm = forwardRef(({ onStepChange, onNext, onBack, isSubmitting: externalIsSubmitting }, ref) => {
  const { register, user, updateUser, refreshUser } = useAuth();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({});
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);

  const RegisterSchema = Yup.object().shape({
    // Step 1: Basic Information
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string()
      .transform((value, originalValue) => originalValue.toLowerCase())
      .email('Email must be a valid email address')
      .required('Email is required'),
    cellphone: Yup.string().required('Phone number required').matches(
      "^[0-9]{10}$",
      "Phone number is not valid"
    ),
    countryCode: Yup.string().required(),
    password: Yup.string().required('Password is required'),
    
    // Step 2: Certification
    entity: Yup.string().required('Certification entity is required'),
    certificate: Yup.mixed().required('Certification File is required', (value) => value !== ''),
    
    // Step 3: Personal Profile
    gender: Yup.string().required('Gender is required'),
    country: Yup.string(),
    photoURL: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
    
    // Step 4: Specialties
    disciplines: Yup.array().of(Yup.string()),
    speaks: Yup.array().of(Yup.string()),
    sports: Yup.array().of(Yup.string()),
    resorts: Yup.array().of(Yup.string()),
    
    // Step 5: Description
    shortDescription: Yup.string().required('Descripción corta es requerida').max(150, 'Máximo 150 caracteres'),
    longDescription: Yup.string().required('Descripción larga es requerida').min(50, 'Mínimo 50 caracteres'),
    
    // Step 6: Pricing
    currency: Yup.string().required('Moneda es requerida'),
    price1Hour: Yup.number().required('Precio por 1 hora es requerido').min(1, 'El precio debe ser mayor a 0'),
    price2Hours: Yup.number().required('Precio por 2 horas es requerido').min(1, 'El precio debe ser mayor a 0'),
    price3Hours: Yup.number().required('Precio por 3 horas es requerido').min(1, 'El precio debe ser mayor a 0'),
    price6Hours: Yup.number().required('Precio por 6 horas es requerido').min(1, 'El precio debe ser mayor a 0'),
    
    // Step 7: Additional Information
    school: Yup.string(),
    skills: Yup.array().of(Yup.string()),
    information: Yup.string().nullable().max(100),
    description: Yup.string().nullable().max(100),
  });

  const defaultValues = {
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    countryCode: '54',
    cellphone: '',
    
    // Step 2
    entity: 'AADIDESS',
    certificate: null,
    
    // Step 3
    gender: 'M',
    country: '',
    photoURL: '',
    
    // Step 4
    disciplines: [],
    speaks: [],
    sports: [],
    resorts: [],
    
    // Step 5
    shortDescription: '',
    longDescription: '',
    
    // Step 6: Pricing
    currency: 'USD',
    price1Hour: '',
    price2Hours: '',
    price3Hours: '',
    price6Hours: '',
    
    // Step 7: Additional Information
    school: '',
    skills: [],
    information: '',
    description: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = methods;

  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting || formIsSubmitting;

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return []; // No validation for intro step
      case 1:
        return ['firstName', 'lastName', 'email', 'cellphone', 'countryCode', 'password'];
      case 2:
        return ['entity', 'certificate'];
      case 3:
        return ['gender', 'country', 'photoURL'];
      case 4:
        return ['disciplines', 'speaks', 'sports', 'resorts'];
      case 5:
        return ['shortDescription', 'longDescription'];
      case 6:
        return ['currency', 'price1Hour', 'price2Hours', 'price3Hours', 'price6Hours'];
      case 7:
        return ['school', 'skills', 'information', 'description'];
      default:
        return [];
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'certificate',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleAvatarDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleNext = async () => {
    // Validate current step before proceeding
    const currentStepFields = getStepFields(activeStep);
    const isValid = await methods.trigger(currentStepFields);
    
    if (isValid) {
      // Save current step data
      const currentData = methods.getValues();
      setUserData(prev => ({ ...prev, ...currentData }));
      
      if (activeStep === STEPS.length - 1) {
        // Final step - submit registration
        setInternalIsSubmitting(true);
        await handleSubmit(onSubmit)();
        setInternalIsSubmitting(false);
      } else {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        if (onStepChange) onStepChange(nextStep);
        if (onNext) onNext();
      }
    }
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    if (onStepChange) onStepChange(prevStep);
    if (onBack) onBack();
  };

  const handleStepClick = (stepIndex) => {
    // Allow navigation to completed steps or the next available step
    if (completedSteps.has(stepIndex) || stepIndex === activeStep || stepIndex === activeStep + 1) {
      setActiveStep(stepIndex);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Combine all data
      const finalData = { ...userData, ...data };
      
      // Register user with basic info first
      await register(
        finalData.email, 
        finalData.password, 
        finalData.firstName, 
        finalData.lastName, 
        finalData.countryCode, 
        finalData.cellphone, 
        finalData.entity, 
        finalData.certificate
      );

      // After successful registration, update the profile with additional data
      if (user) {
        const profileData = {
          ...user,
          gender: finalData.gender,
          country: finalData.country,
          information: finalData.information,
          description: finalData.description,
          shortDescription: finalData.shortDescription,
          longDescription: finalData.longDescription,
          speaks: finalData.speaks,
          skills: finalData.skills,
          disciplines: finalData.disciplines,
          sports: finalData.sports,
          resorts: finalData.resorts,
          school: finalData.school,
          currency: finalData.currency,
          price1Hour: finalData.price1Hour,
          price2Hours: finalData.price2Hours,
          price3Hours: finalData.price3Hours,
          price6Hours: finalData.price6Hours,
        };

        // Handle profile picture upload if provided
        if (typeof finalData.photoURL === "object" && finalData.photoURL.path) {
          dispatch(changeProfilePicture(finalData.photoURL, (succeed) => {
            if (succeed) {
              refreshUser({
                ...user,
                imageLink: finalData.photoURL.preview
              });
              axios.put("/api/images/image");
            }
          }));
        }

        // Update teacher profile
        const response = await dispatch(updateTeacher(profileData));
        
        if (response.messages) {
          for (const entry of response.messages.entry) {
            setError(entry.key, {
              type: "server",
              message: entry.value,
            });
          }
        } else {
          updateUser(profileData);
          setIsRegistrationComplete(true);
        }
      }
      
    } catch (error) {
      if (error.messages && error.messages.entry) {
        error.messages.entry.forEach(e => {
          setError(e.key, { type: "server", message: e.value });
        });
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const renderStepContent = useCallback((step) => {
    const stepContent = (() => {
      switch (step) {
        case 0:
          return (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Iconify icon="eva:rocket-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  ¡Vamos a Empezar!
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
                {/* Icon Card - Left Side */}
                <m.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                >
                  <Box 
                    sx={{ 
                      p: 4, 
                      borderRadius: 3, 
                      boxShadow: 3,
                      bgcolor: 'primary.main',
                      color: 'white',
                      textAlign: 'center',
                      minWidth: 200,
                      maxWidth: 280
                    }}
                  >
                    <m.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    >
                      <Iconify 
                        icon="eva:person-fill" 
                        sx={{ 
                          fontSize: 64, 
                          color: 'white',
                          mb: 2
                        }} 
                      />
                    </m.div>
                    <m.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Instructor de Esquí
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Únete a nuestra comunidad
                      </Typography>
                    </m.div>
                  </Box>
                </m.div>

                {/* Content - Right Side */}
                <m.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  style={{ flex: 1 }}
                >
                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                      Vamos a empezar tu proceso de alta de instructor
                    </Typography>
                  </m.div>

                  <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                      Te ayudaremos a configurar tu perfil para que puedas comenzar a recibir estudiantes y generar ingresos haciendo lo que más te apasiona.
                    </Typography>
                  </m.div>

                  <Stack spacing={3}>
                    {/* Benefits List */}
                    <m.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Iconify 
                          icon="eva:people-fill" 
                          sx={{ 
                            fontSize: 20, 
                            color: 'success.main', 
                            mr: 2
                          }} 
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Recibir clientes
                        </Typography>
                      </Box>
                    </m.div>

                    <m.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Iconify 
                          icon="eva:calendar-fill" 
                          sx={{ 
                            fontSize: 20, 
                            color: 'info.main', 
                            mr: 2
                          }} 
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Manejar tu calendario de temporada
                        </Typography>
                      </Box>
                    </m.div>

                    <m.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Iconify 
                          icon="eva:video-fill" 
                          sx={{ 
                            fontSize: 20, 
                            color: 'warning.main', 
                            mr: 2
                          }} 
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Corregir videos de alumnos
                        </Typography>
                      </Box>
                    </m.div>

                    <m.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Iconify 
                          icon="eva:star-fill" 
                          sx={{ 
                            fontSize: 20, 
                            color: 'primary.main', 
                            mr: 2
                          }} 
                        />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Dar clases con videoanálisis para que tus clientes queden super contentos
                        </Typography>
                      </Box>
                    </m.div>
                  </Stack>

                  {/* Call to Action */}
                  <m.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    style={{ marginTop: 32 }}
                  >
                    <Box sx={{ p: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify 
                          icon="eva:bulb-fill" 
                          sx={{ 
                            fontSize: 24, 
                            color: 'warning.main', 
                            mr: 2
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          <strong>¿Listo para empezar?</strong> Completa tu perfil y comienza a recibir solicitudes de estudiantes de todo el mundo.
                        </Typography>
                      </Box>
                    </Box>
                  </m.div>
                </m.div>
              </Box>
            </>
          );

        case 1:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:person-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Información Básica
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comencemos con tus datos personales básicos
              </Typography>
              
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <RHFTextField name="firstName" label={translate('registerForm.name')} />
                  <RHFTextField name="lastName" label={translate('registerForm.lastName')} />
                </Stack>

                <RHFTextField name="email" label={translate('registerForm.email')} />
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <RHFSelect name="countryCode" label={translate('registerForm.countryCode')} placeholder="Country Code">
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.phone}>
                        {option.label} (+{option.phone})
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFTextField name="cellphone" label={translate('registerForm.phone')} />
                </Stack>

                <RHFTextField
                  name="password"
                  label={translate('registerForm.password')}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              {/* Disclaimer - Only shown in basic information step */}
              <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                  Al registrarme, estoy de acuerdo con SnowMatch{' '}
                  <Link 
                    underline="always" 
                    color="text.primary" 
                    href="https://github.com/lpagn/snowmatchfiles/blob/main/Snow%20Match%20Terms%20of%20Service.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Términos y Condiciones
                  </Link>
                  {' '}y{' '}
                  <Link 
                    underline="always" 
                    color="text.primary" 
                    href="https://github.com/lpagn/snowmatchfiles/blob/main/Snow%20Match%20Privacy%20Policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de Privacidad
                  </Link>
                  .
                </Typography>
              </Box>
            </m.div>
          );

        case 2:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:award-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Certificación
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sube tu certificación de instructor
              </Typography>
              
              <Stack spacing={3}>
                <Typography variant="subtitle1">{translate('registerForm.certification')}</Typography>
                <RHFRadioGroup name='entity' options={["AADIDESS", "PSIA", "ENISSCHAG"]} />
                <RHFUploadSingleFile 
                  name="certificate" 
                  accept="image/*" 
                  maxSize={16000000} 
                  onDrop={handleDrop}
                />
              </Stack>
            </m.div>
          );

        case 3:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:camera-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Perfil Personal
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Completa tu información personal
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <RHFUploadAvatar
                      name="photoURL"
                      accept="image/*"
                      maxSize={16000000}
                      onDrop={handleAvatarDrop}
                      helperText={
                        <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'center', color: 'text.secondary' }}>
                          Foto de perfil
                        </Typography>
                      }
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Stack spacing={3}>
                    <RHFSelect name="gender" label={translate("general.form.gender")} placeholder={translate("general.form.gender")}>
                      <option key={1} value={"M"}>
                        {translate("general.form.male")}
                      </option>
                      <option key={2} value={"F"}>
                        {translate("general.form.female")}
                      </option>
                    </RHFSelect>
                    
                    <RHFSelect name="country" label={translate("general.form.country")} placeholder={translate("general.form.country")}>
                      <option value="" />
                      {countries.map((option) => (
                        <option key={option.code} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Grid>
              </Grid>
            </m.div>
          );

        case 4:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:star-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Especialidades
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Define tus disciplinas y especialidades
              </Typography>
              
              <Stack spacing={3}>
                <RHFMultipleSelect 
                  name="disciplines" 
                  label={translate("general.form.disciplines")} 
                  list={["Ski", "SnowBoard"]} 
                />
                
                <RHFMultipleSelect 
                  name="speaks" 
                  label={translate("general.form.languages")} 
                  list={["Español", "English", "Portugues", "Italiano"]} 
                />
                
                <RHFMultipleSelect 
                  name="sports" 
                  label={translate("general.form.sports")} 
                  list={["SKI", "SNOWBOARD"]} 
                />
                
                <RHFMultipleSelect 
                  name="resorts" 
                  label={translate("general.form.resorts")} 
                  freeSolo={true} 
                  grouped={true} 
                  list={ski_resorts} 
                />
              </Stack>
            </m.div>
          );

        case 5:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:edit-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Ahora Descríbete
                </Typography>
              </Box>
              
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Cuéntanos sobre ti para que los clientes puedan conocerte mejor
                </Typography>
              </m.div>
              
              <Stack spacing={4}>
                {/* Short Description Section */}
                <m.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <m.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Iconify 
                        icon="eva:info-fill" 
                        sx={{ 
                          fontSize: 20, 
                          color: 'info.main', 
                          mr: 1.5,
                          cursor: 'pointer'
                        }} 
                      />
                    </m.div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'info.main' }}>
                      Descripción Corta
                    </Typography>
                  </Box>
                  
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Esta descripción aparecerá en tu tarjeta del marketplace. Sé conciso y atractivo.
                    </Typography>
                    
                    <RHFTextField 
                      name="shortDescription"
                      label="Descripción corta (máximo 150 caracteres)"
                      multiline
                      rows={3}
                      inputProps={{ maxLength: 150 }}
                      helperText="Ej: Instructor certificado con 5 años de experiencia en esquí alpino"
                    />
                  </m.div>
                </m.div>

                {/* Long Description Section */}
                <m.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <m.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <Iconify 
                        icon="eva:file-text-fill" 
                        sx={{ 
                          fontSize: 20, 
                          color: 'primary.main', 
                          mr: 1.5,
                          cursor: 'pointer'
                        }} 
                      />
                    </m.div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Descripción Completa
                    </Typography>
                  </Box>
                  
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Esta descripción aparecerá en tu página de instructor. Cuenta tu historia, experiencia y enfoque de enseñanza.
                    </Typography>
                    
                    <RHFTextField 
                      name="longDescription"
                      label="Descripción completa (mínimo 50 caracteres)"
                      multiline
                      rows={6}
                      inputProps={{ minLength: 50 }}
                      helperText="Cuenta sobre tu experiencia, metodología de enseñanza, logros y lo que hace especial tu enfoque"
                    />
                  </m.div>
                </m.div>

                {/* Tips Section */}
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Box sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Iconify 
                        icon="eva:bulb-fill" 
                        sx={{ 
                          fontSize: 18, 
                          color: 'warning.main', 
                          mr: 1.5,
                          mt: 0.2
                        }} 
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'warning.main', mb: 1 }}>
                          Consejos para una buena descripción:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          • Menciona tu experiencia y certificaciones<br/>
                          • Describe tu estilo de enseñanza<br/>
                          • Incluye logros o especialidades<br/>
                          • Sé auténtico y personal
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </m.div>
              </Stack>
            </m.div>
          );

        case 6:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:credit-card-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Precios
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configura tus precios por duración de clase
              </Typography>
              
              <Stack spacing={3}>
                <RHFSelect name="currency" label="Moneda" placeholder="Selecciona tu moneda">
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="BRL">BRL - Real Brasileño</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                </RHFSelect>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField 
                      name="price1Hour" 
                      label="Precio por 1 hora" 
                      type="number"
                      inputProps={{ min: 1, step: 0.01 }}
                      helperText="Precio por clase de 1 hora"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField 
                      name="price2Hours" 
                      label="Precio por 2 horas" 
                      type="number"
                      inputProps={{ min: 1, step: 0.01 }}
                      helperText="Precio por clase de 2 horas"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField 
                      name="price3Hours" 
                      label="Precio por 3 horas" 
                      type="number"
                      inputProps={{ min: 1, step: 0.01 }}
                      helperText="Precio por clase de 3 horas"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField 
                      name="price6Hours" 
                      label="Precio por 6 horas" 
                      type="number"
                      inputProps={{ min: 1, step: 0.01 }}
                      helperText="Precio por clase de 6 horas"
                    />
                  </Grid>
                </Grid>

                {/* Tips Section */}
                <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Iconify
                      icon="eva:bulb-fill"
                      sx={{
                        fontSize: 18,
                        color: 'warning.main',
                        mr: 1.5,
                        mt: 0.2
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'warning.main', mb: 1 }}>
                        Consejos para establecer precios:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        • Considera tu experiencia y certificaciones<br/>
                        • Revisa precios de otros instructores en tu zona<br/>
                        • Ofrece descuentos por clases más largas<br/>
                        • Los precios se pueden ajustar después
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </m.div>
          );

        case 7:
          return (
            <m.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Iconify icon="eva:file-text-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                  Información Adicional
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Información adicional sobre tu experiencia
              </Typography>
              
              <Stack spacing={3}>
                <RHFTextField name="school" label={translate("general.form.school")} />
                
                <RHFMultipleSelect 
                  name="skills" 
                  freeSolo={true} 
                  label={translate("general.form.skills")} 
                  list={["Ski tunning", "Baby sitter", "Car rent"]} 
                />
                
                <Tooltip title={translate("general.form.quickInformationHelper")}>
                  <RHFTextField 
                    multiline
                    rows={2}
                    name="information"
                    label={translate("general.form.quickInformation")}
                  />
                </Tooltip>
                
                <RHFTextField 
                  multiline
                    rows={4}
                    name="description"
                    label={translate("general.form.description")} 
                />
              </Stack>
            </m.div>
          );

        default:
          return null;
      }
    })();

    return (
      <>
        {stepContent}
      </>
    );
  }, [handleDrop, handleAvatarDrop, translate, showPassword, setShowPassword, countries, ski_resorts]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleNext,
    handleBack,
    activeStep,
    isSubmitting
  }), [activeStep, isSubmitting]);

  // Show completion message
  if (isRegistrationComplete) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 64, color: 'success.main' }} />
        </Box>
        <Typography variant="h4" gutterBottom>
          ¡Registro Completado!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tu perfil ha sido creado exitosamente. Ya puedes comenzar a recibir solicitudes de estudiantes.
        </Typography>
        <Button variant="contained" href="/dashboard" sx={{ ':hover': { color: '#3399FF' } }}>
          Ir al Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        {!isMobile && (
          <>
            {/* Progress Indicator - Desktop only */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Paso {activeStep + 1} de {STEPS.length} - {Math.round(((activeStep + 1) / STEPS.length) * 100)}% completado
              </Typography>
            </Box>

            {/* Stepper - Desktop only */}
            <Box sx={{ mb: 4 }}>
              <Stepper 
                activeStep={activeStep} 
                alternativeLabel 
                connector={<QontoConnector />}
                sx={{
                  '& .MuiStepLabel-label': {
                    typography: 'subtitle2',
                    color: 'text.disabled',
                    '&.Mui-active': {
                      color: 'primary.main',
                    },
                    '&.Mui-completed': {
                      color: 'primary.main',
                    },
                  },
                  '& .MuiStepLabel-root': {
                    cursor: 'pointer',
                  },
                }}
              >
                {STEPS.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      onClick={() => handleStepClick(index)}
                      StepIconComponent={(props) => (
                        <QontoStepIcon {...props} icon={step.icon} />
                      )}
                      sx={{
                        cursor: completedSteps.has(index) || index === activeStep || index === activeStep + 1 ? 'pointer' : 'default',
                      }}
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </>
        )}

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Navigation Buttons - Desktop only */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
            >
              Atrás
            </Button>
            
            <LoadingButton
              variant="contained"
              onClick={handleNext}
              loading={isSubmitting}
              endIcon={activeStep === STEPS.length - 1 ? <Iconify icon="eva:checkmark-fill" /> : <Iconify icon="eva:arrow-forward-fill" />}
              sx={{ ':hover': { color: '#3399FF' } }}
            >
              {activeStep === STEPS.length - 1 ? 'Completar Registro' : 'Siguiente'}
            </LoadingButton>
          </Box>
        )}
      </Stack>
    </FormProvider>
  );
});

RegisterStepperForm.displayName = 'RegisterStepperForm';

export default RegisterStepperForm; 