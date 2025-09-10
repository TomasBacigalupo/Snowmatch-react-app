import * as Yup from 'yup';
import { useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { 
  Stack, 
  Alert, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  StepConnector,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider } from '../../../components/hook-form';
import StudentWelcomeStep from './StudentWelcomeStep';
import StudentGoalStep from './StudentGoalStep';
import StudentLevelStep from './StudentLevelStep';
import StudentTypeStep from './StudentTypeStep';
import StudentResortsStep from './StudentResortsStep';
import StudentLearningStep from './StudentLearningStep';
// utils
import axios from '../../../utils/axios';
import { FILTER_RESORT_OPTIONS } from '../../@dashboard/e-commerce/shop/ShopFilterSidebar';

// ----------------------------------------------------------------------

const STEPS = [
  { label: '¡Bienvenido!', icon: 'eva:rocket-fill' },
  { label: 'Tu Objetivo', icon: 'eva:target-fill' },
  { label: 'Tu Nivel', icon: 'eva:trending-up-fill' },
  { label: 'Tipo de Esquiador', icon: 'eva:activity-fill' },
  { label: 'Dónde Esquías', icon: 'eva:map-fill' },
  { label: 'Cómo Aprender', icon: 'eva:book-open-fill' }
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

const StudentStepperForm = forwardRef(({ onStepChange, onNext, onBack, isSubmitting: externalIsSubmitting, onComplete }, ref) => {
  const { user, updateUser } = useAuth();
  const { translate } = useLocales();
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
      case 1: // Student Goal
        return Yup.object().shape({
          studentGoal: Yup.string().required('Debes seleccionar un objetivo'),
        });
        
      case 2: // Student Level
        return Yup.object().shape({
          studentLevel: Yup.string().required('Debes seleccionar tu nivel'),
        });
        
      case 3: // Student Type
        return Yup.object().shape({
          sports: Yup.array().of(Yup.string()).min(1, 'Debes seleccionar al menos un tipo'),
        });
        
      case 4: // Resorts
        return Yup.object().shape({
          resorts: Yup.array().of(Yup.object().shape({
            name: Yup.string().required(),
            category: Yup.string().required()
          })).min(1, 'Debes seleccionar al menos un resort'),
        });
        
      case 5: // Learning Method
        return Yup.object().shape({
          howToLearn: Yup.string().required('Debes seleccionar cómo quieres aprender'),
        });
        
      default:
        return Yup.object().shape({}); // No validation for other steps
    }
  };

  const defaultValues = {
    // Step 1
    studentGoal: '',
    
    // Step 2
    studentLevel: '',
    
    // Step 3
    sports: [],
    
    // Step 4
    resorts: [],
    
    // Step 5
    howToLearn: '',
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
        return ['studentGoal'];
      case 2:
        return ['studentLevel'];
      case 3:
        return ['sports'];
      case 4:
        return ['resorts'];
      case 5:
        return ['howToLearn'];
      default:
        return [];
    }
  };

  const saveStepData = async (currentData, step) => {
    if (!user) return;
    
    // Prepare data based on current step - accumulate all data
    let stepData = {};
    
    switch (step) {
      case 1: // Student Goal
        stepData = {
          studentGoal: currentData.studentGoal,
        };
        break;
        
      case 2: // Student Level
        stepData = {
          studentLevel: currentData.studentLevel,
          studentGoal: currentData.studentGoal, // Include previous data
        };
        break;
        
      case 3: // Student Type
        stepData = {
          sports: currentData.sports,
          studentLevel: currentData.studentLevel,
          studentGoal: currentData.studentGoal, // Include previous data
        };
        break;
        
      case 4: // Resorts
        stepData = {
          resorts: currentData.resorts?.map(resort => resort.name) || [],
          sports: currentData.sports,
          studentLevel: currentData.studentLevel,
          studentGoal: currentData.studentGoal, // Include previous data
        };
        break;
        
      case 5: // Learning Method
        stepData = {
          howToLearn: currentData.howToLearn,
          resorts: currentData.resorts?.map(resort => resort.name) || [],
          sports: currentData.sports,
          studentLevel: currentData.studentLevel,
          studentGoal: currentData.studentGoal, // Include all previous data
        };
        break;
        
      default:
        return;
    }
    
    // Update user data locally
    const updatedUser = { ...user, ...stepData };
    
    // Update student data via API
    try {
      console.log('Saving student data:', stepData); // Debug log
      const response = await axios.put('/api/users/student-data', stepData);
      
      if (response.data) {
        // Update local user state
        updateUser(updatedUser);
        return response.data;
      }
    } catch (error) {
      console.error('Error saving student data:', error);
      throw error;
    }
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
      // Final step - complete registration
      setIsRegistrationComplete(true);
      if (onComplete) onComplete();
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
      // Final step - save all data
      if (user) {
        // Prepare final data with correct format
        const finalData = {
          studentGoal: data.studentGoal,
          studentLevel: data.studentLevel,
          sports: data.sports,
          resorts: data.resorts?.map(resort => resort.name) || [],
          howToLearn: data.howToLearn,
        };

        console.log('Final student data:', finalData); // Debug log

        const profileData = {
          ...user,
          ...finalData,
        };

        // Update student data
        await axios.put('/api/users/student-data', finalData);
        updateUser(profileData);
        setIsRegistrationComplete(true);
        if (onComplete) onComplete();
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
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  const renderStepContent = useCallback((step) => {
    const stepContent = (() => {
      switch (step) {
        case 0:
          return <StudentWelcomeStep />;

        case 1:
          return <StudentGoalStep validateField={validateField} />;

        case 2:
          return <StudentLevelStep validateField={validateField} />;

        case 3:
          return <StudentTypeStep validateField={validateField} />;

        case 4:
          return <StudentResortsStep validateField={validateField} />;

        case 5:
          return <StudentLearningStep validateField={validateField} />;

        default:
          return null;
      }
    })();

    return (
      <>
        {stepContent}
      </>
    );
  }, [validateField]);

  // Load existing user data when component mounts
  useEffect(() => {
    if (user) {
      // Convert resort names to objects with name and category
      const convertResortsToObjects = (resortNames) => {
        if (!resortNames || !Array.isArray(resortNames)) return [];
        
        const allResorts = [];
        FILTER_RESORT_OPTIONS.forEach((country) => {
          country.resorts.forEach((resort) => {
            allResorts.push({
              name: resort,
              category: country.category
            });
          });
        });
        
        return resortNames.map(name => {
          const found = allResorts.find(resort => resort.name === name);
          return found || { name, category: 'Other' };
        });
      };

      const existingData = {
        studentGoal: user.studentGoal || '',
        studentLevel: user.studentLevel || '',
        sports: user.sports || [],
        resorts: convertResortsToObjects(user.resorts),
        howToLearn: user.howToLearn || '',
      };
      
      // Set form values
      Object.keys(existingData).forEach(key => {
        setValue(key, existingData[key]);
      });
      
      // Determine completed steps based on existing data
      const completed = new Set();
      if (existingData.studentGoal) completed.add(1);
      if (existingData.studentLevel) completed.add(2);
      if (existingData.sports?.length > 0) completed.add(3);
      if (existingData.resorts?.length > 0) completed.add(4);
      if (existingData.howToLearn) completed.add(5);
      
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
          Tu perfil de estudiante ha sido configurado exitosamente. Ya puedes comenzar a buscar instructores y mejorar tu técnica.
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
              Paso {activeStep + 1} de {STEPS.length} - {completedSteps.size} completados
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
              Atrás
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
              {isSubmitting ? 'Guardando...' : activeStep === STEPS.length - 1 ? 'Completar' : 'Siguiente'}
            </LoadingButton>
          </Box>
        )}
      </Stack>
    </FormProvider>
  );
});

StudentStepperForm.displayName = 'StudentStepperForm';

export default StudentStepperForm;