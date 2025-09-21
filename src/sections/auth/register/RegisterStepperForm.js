import * as Yup from 'yup';
import { useState, useCallback, forwardRef, useImperativeHandle, useMemo, useEffect } from 'react';
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
import WelcomeStep from './WelcomeStep';
import PersonalProfileStep from './PersonalProfileStep';
import ResortDisciplines from './ResortDisciplines';
import SkierTypesStep from './SkierTypesStep';
import LanguagesStep from './LanguagesStep';
import ResortSelection from './ResortSelection';
import DescriptionTipsStep from './DescriptionTipsStep';
import DescriptionStep from './DescriptionStep';
import PricingStep from './PricingStep';
import TeacherCardPreview from './TeacherCardPreview';
import PreviewStep from './PreviewStep';
// redux
import { useDispatch } from '../../../redux/store';
import { updateTeacher, changeProfilePicture } from '../../../redux/slices/teachers';
// utils
import axios from '../../../utils/axios';
// mock
import { countries } from "src/_mock";
import { ski_resorts } from "src/_mock";
import Disciplines from './Disciplines';

// ----------------------------------------------------------------------

const STEPS = [
  { label: '¡Vamos a Empezar!', icon: 'eva:rocket-fill' },
  { label: 'Perfil Personal', icon: 'eva:camera-fill' },
  { label: 'Disciplinas', icon: 'eva:star-fill' },
  { label: 'Tipos de Esquiador', icon: 'eva:activity-fill' },
  { label: 'Idiomas', icon: 'eva:message-circle-fill' },
  { label: 'Resorts', icon: 'eva:map-fill' },
  { label: 'Ahora Descríbete', icon: 'eva:edit-fill' },
  { label: 'Descripción', icon: 'eva:file-text-fill' },
  { label: 'Precios', icon: 'eva:credit-card-fill' },
  { label: 'Vista Previa', icon: 'eva:eye-fill' }
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
        bgcolor: 'transparent',
        borderRadius: '50%',
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
  const { user, updateUser, refreshUser } = useAuth();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Step-specific validation schemas
  const getStepValidationSchema = (step) => {
    switch (step) {
      case 1: // Personal Profile - Only photo required
        return Yup.object().shape({
          photoURL: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
        });
        
      case 2: // Disciplines
        return Yup.object().shape({
          sports: Yup.array().of(Yup.string()),
        });
        
      case 3: // Skier Types
        return Yup.object().shape({
          skills: Yup.array().of(Yup.string()),
        });
        
      case 4: // Languages
        return Yup.object().shape({
          languages: Yup.array().of(Yup.string()),
        });
        
      case 5: // Resorts
        return Yup.object().shape({
          resorts: Yup.array().of(Yup.string()).min(1, 'Debes seleccionar al menos un resort').max(100, 'Máximo 100 resorts'),
        });
        
      case 7: // Description
        return Yup.object().shape({
          information: Yup.string().required('Descripción corta es requerida').max(150, 'Máximo 150 caracteres'),
          description: Yup.string().required('Descripción larga es requerida').min(50, 'Mínimo 50 caracteres'),
        });
        
      case 8: // Pricing
        return Yup.object().shape({
          currency: Yup.string().required('Moneda es requerida'),
          price2Hours: Yup.number().required('Precio por 2 horas es requerido').min(1, 'El precio debe ser mayor a 0'),
          price3Hours: Yup.number().required('Precio por 3 horas es requerido').min(1, 'El precio debe ser mayor a 0'),
          price6Hours: Yup.number().required('Precio por 6 horas es requerido').min(1, 'El precio debe ser mayor a 0'),
        });
        
      case 9: // Additional Information
        return Yup.object().shape({
          school: Yup.string(),
          skills: Yup.array().of(Yup.string()),
          information: Yup.string().nullable().max(100),
          description: Yup.string().nullable().max(100),
        });
        
      default:
        return Yup.object().shape({}); // No validation for other steps
    }
  };

  const defaultValues = {
    // Step 1
    gender: 'M',
    country: '',
    photoURL: '',
    
    // Step 2
    sports: [],
    
    // Step 3
    skills: [],
    
    // Step 4
    languages: [],
    
    // Step 5
    resorts: [],
    
    // Step 6
    information: '',
    description: '',
    
    // Step 7: Pricing
    currency: 'USD',
    price2Hours: '',
    price3Hours: '',
    price6Hours: '',
    
    // Step 8: Additional Information
    school: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = methods;

  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting || formIsSubmitting;

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return []; // No validation for intro step
      case 1:
        return ['photoURL'];
      case 2:
        return ['sports'];
      case 3:
        return ['skills'];
      case 4:
        return ['languages'];
      case 5:
        return ['resorts'];
      case 6:
        return []; // No validation needed - only shows tips
      case 7:
        return ['information', 'description'];
      case 8:
        return ['currency', 'price2Hours', 'price3Hours', 'price6Hours'];
      case 9:
        return []; // No validation needed for preview step
      default:
        return [];
    }
  };

  const saveStepData = async (currentData, step) => {
    if (!user) return;
    
    // Prepare data based on current step
    let stepData = {};
    
    switch (step) {
      case 1: // Personal Profile - Only photo
        stepData = {
          // Only handle photo upload, no other data to save
        };
        break;
        
      case 2: // Disciplines
        stepData = {
          sports: currentData.sports,
        };
        break;
        
      case 3: // Skier Types
        stepData = {
          skills: currentData.skills,
        };
        break;
        
      case 4: // Languages
        stepData = {
          languages: currentData.languages,
        };
        break;
        
      case 5: // Resorts
        stepData = {
          resorts: currentData.resorts,
          resortsEnum: currentData.resorts,
        };
        break;
        
      case 6: // Description Tips - no data to save
        return;
        
      case 7: // Description
        stepData = {
          information: currentData.information,
          description: currentData.description,
        };
        break;
        
      case 8: // Pricing
        stepData = {
          currency: currentData.currency,
          price2Hours: currentData.price2Hours,
          price3Hours: currentData.price3Hours,
          price6Hours: currentData.price6Hours,
        };
        break;
        
      case 9: // Preview - no additional data to save
        return;
        
      default:
        return;
    }
    
    // Update user data locally
    const updatedUser = { ...user, ...stepData };
    
    // Handle profile picture upload if provided (only for step 1)
    if (step === 1 && typeof currentData.photoURL === "object" && currentData.photoURL.path) {
      dispatch(changeProfilePicture(currentData.photoURL, (succeed) => {
        if (succeed) {
          refreshUser({
            ...updatedUser,
            imageLink: currentData.photoURL.preview
          });
          axios.put("/api/images/image");
        }
      }));
    }
    
    // Update teacher profile via API
    const response = await dispatch(updateTeacher(updatedUser));
    
    if (response.messages) {
      for (const entry of response.messages.entry) {
        setError(entry.key, {
          type: "server",
          message: entry.value,
        });
      }
      throw new Error('Failed to save step data');
    }
    
    // Update local user state
    updateUser(updatedUser);
  };

  const validateField = useCallback(async (fieldName, value) => {
    const stepSchema = getStepValidationSchema(activeStep);
    if (stepSchema.fields[fieldName]) {
      try {
        await stepSchema.fields[fieldName].validate(value);
        clearErrors(fieldName);
      } catch (error) {
        setError(fieldName, {
          type: 'validation',
          message: error.message,
        });
      }
    }
  }, [activeStep, clearErrors, setError]);

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
        // Validate the field after setting the value
        validateField('photoURL', file);
      }
    },
    [setValue, validateField]
  );

    const handleNext = async () => {
    // For step 0 (WelcomeStep), no validation needed - just proceed
    if (activeStep === 0) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      if (onStepChange) onStepChange(nextStep);
      if (onNext) onNext();
      return;
    }
    
    // Get current step data
    const currentData = methods.getValues();
    
    // Validate current step using step-specific schema
    const stepSchema = getStepValidationSchema(activeStep);
    try {
      await stepSchema.validate(currentData, { abortEarly: false });
    } catch (validationError) {
      // Set validation errors for the current step fields
      if (validationError.inner) {
        validationError.inner.forEach((error) => {
          setError(error.path, {
            type: 'validation',
            message: error.message,
          });
        });
      }
      return; // Don't proceed if validation fails
    }
    
    // Clear any previous errors for this step
    const stepFields = getStepFields(activeStep);
    stepFields.forEach(field => {
      clearErrors(field);
    });
    
    // Save current step data
    setUserData(prev => ({ ...prev, ...currentData }));
    
    // Always save to API on each step (except the last one which will be handled by onSubmit)
    if (activeStep < STEPS.length - 1) {
      setInternalIsSubmitting(true);
      try {
        await saveStepData(currentData, activeStep);
        setCompletedSteps(prev => new Set([...prev, activeStep]));
        setSaveSuccess(true);
        // Hide success message after 2 seconds
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch (error) {
        console.error('Error saving step data:', error);
        // Continue to next step even if save fails
      } finally {
        setInternalIsSubmitting(false);
      }
    }
    
    if (activeStep === STEPS.length - 1) {
      // Final step - redirect to dashboard
      window.location.href = '/dashboard';
      return;
    } else {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      if (onStepChange) onStepChange(nextStep);
      if (onNext) onNext();
    }
  };

  const handleBack = () => {
    // Clear errors when going back
    const currentStepFields = getStepFields(activeStep);
    currentStepFields.forEach(field => {
      clearErrors(field);
    });
    
    const prevStep = activeStep - 1;
    setActiveStep(prevStep);
    if (onStepChange) onStepChange(prevStep);
    if (onBack) onBack();
  };

  const handleStepClick = (stepIndex) => {
    // Allow navigation to completed steps or the next available step
    if (completedSteps.has(stepIndex) || stepIndex === activeStep || stepIndex === activeStep + 1) {
      // Clear errors when changing steps
      const currentStepFields = getStepFields(activeStep);
      currentStepFields.forEach(field => {
        clearErrors(field);
      });
      
      setActiveStep(stepIndex);
      if (onStepChange) onStepChange(stepIndex);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Validate final step
      const finalStepSchema = getStepValidationSchema(9);
      await finalStepSchema.validate(data, { abortEarly: false });
      
      // Final step - only handle additional information
      if (user) {
        const profileData = {
          ...user,
          school: data.school,
          skills: data.skills,
          information: data.information,
          description: data.description,
        };

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
      if (error.name === 'ValidationError') {
        // Handle validation errors
        if (error.inner) {
          error.inner.forEach((validationError) => {
            setError(validationError.path, {
              type: 'validation',
              message: validationError.message,
            });
          });
        }
      } else if (error.messages && error.messages.entry) {
        // Handle server errors
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
          return <WelcomeStep />;

        case 1:
          return <PersonalProfileStep onAvatarDrop={handleAvatarDrop} validateField={validateField} />;

        case 2:
          return <Disciplines validateField={validateField} />;

        case 3:
          return <SkierTypesStep validateField={validateField} />;

        case 4:
          return <LanguagesStep validateField={validateField} />;

        case 5:
          return <ResortSelection validateField={validateField} />;

        case 6:
          return <DescriptionTipsStep />;
        case 7:
          return <DescriptionStep methods={methods} validateField={validateField} />;
        case 8:
          return <PricingStep validateField={validateField} />;

        case 9:
          return <PreviewStep formData={methods.getValues()} user={user} />;

        default:
          return null;
      }
    })();

    return (
      <>
        {stepContent}
      </>
    );
  }, [handleAvatarDrop, translate, countries, ski_resorts, validateField]);

  // Load existing user data when component mounts
  useEffect(() => {
    if (user) {
      const existingData = {
        gender: user.gender || '',
        country: user.country || '',
        photoURL: user.imageLink || '',
        sports: user.sports || user.disciplines || [],
        skills: user.skills || user.skierTypes || [],
        languages: user.languages || [],
        resorts: user.resorts ? user.resorts.map(name => ({ name, category: 'selected' })) : [],
        information: user.information || '',
        description: user.description || '',
        currency: user.currency || 'USD',
        price2Hours: user.price2Hours || '',
        price3Hours: user.price3Hours || '',
        price6Hours: user.price6Hours || '',
        school: user.school || '',
        skills: user.skills || [],
        information: user.information || '',
        description: user.description || '',
      };
      
      // Set form values
      Object.keys(existingData).forEach(key => {
        setValue(key, existingData[key]);
      });
      
      // Determine completed steps based on existing data
      const completed = new Set();
      if (existingData.photoURL) completed.add(1);
      if (existingData.sports?.length > 0) completed.add(2);
      if (existingData.skills?.length > 0) completed.add(3);
      if (existingData.languages?.length > 0) completed.add(4);
      if (existingData.resorts?.length > 0) completed.add(5);
      if (existingData.information && existingData.description) completed.add(7);
      if (existingData.price2Hours && existingData.price3Hours && existingData.price6Hours) completed.add(8);
      
      setCompletedSteps(completed);
      setUserData(existingData);
    }
  }, [user, setValue]);

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
          ¡Perfil Completado!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tu perfil ha sido configurado exitosamente. Ya puedes comenzar a recibir solicitudes de estudiantes.
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              {translate('registerForm.stepProgress', {
                current: activeStep + 1,
                total: STEPS.length,
                completed: completedSteps.size,
                totalSteps: STEPS.length - 1
              })}
            </Typography>
          </Box>
        )}

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Navigation Buttons - Desktop only */}
        {!isMobile && (
          <Box sx={{ 
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            zIndex: 1000
          }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ 
                textDecoration: 'underline',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
              variant="text"
            >
              Back
            </Button>
            
            <LoadingButton
              variant="contained"
              onClick={handleNext}
              loading={isSubmitting}
              disabled={isSubmitting}
              sx={{ 
                backgroundColor: '#666666',
                color: 'white',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#555555'
                }
              }}
            >
              {isSubmitting ? 'Guardando...' : activeStep === STEPS.length - 1 ? 'Ir al Dashboard' : 'Next'}
            </LoadingButton>
          </Box>
        )}
      </Stack>
    </FormProvider>
  );
});

RegisterStepperForm.displayName = 'RegisterStepperForm';

export default RegisterStepperForm; 