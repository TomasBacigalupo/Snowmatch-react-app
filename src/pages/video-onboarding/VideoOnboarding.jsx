import * as Yup from 'yup';
import { useState, useCallback, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
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
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
// components
import Iconify from '../../components/Iconify';
import { FormProvider } from '../../components/hook-form';
import VideoTipsStep from './VideoTipsStep';
import VideoUploadStep from './VideoUploadStep';
import VideoLocationStep from './VideoLocationStep';
import VideoReviewStep from './VideoReviewStep';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const getSteps = (translate) => [
  { label: translate('videoOnboarding.stepper.tips'), icon: 'eva:bulb-fill' },
  { label: translate('videoOnboarding.stepper.upload'), icon: 'eva:video-fill' },
  { label: translate('videoOnboarding.stepper.location'), icon: 'eva:map-fill' },
  { label: translate('videoOnboarding.stepper.review'), icon: 'eva:star-fill' }
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

const VideoOnboarding = forwardRef(({ onStepChange, onNext, onBack, isSubmitting: externalIsSubmitting, onComplete }, ref) => {
  const { user, updateUser } = useAuth();
  const { translate } = useLocales();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeStep, setActiveStep] = useState(0);
  const [videoData, setVideoData] = useState({});
  const [isVideoProcessingComplete, setIsVideoProcessingComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Ref for video upload step to access trim functionality
  const videoUploadStepRef = useRef(null);

  // Step-specific validation schemas
  const getStepValidationSchema = (step) => {
    switch (step) {
      case 1: // Video Upload
        return Yup.object().shape({
          videoFile: Yup.mixed().required(translate('videoOnboarding.validation.videoRequired')),
        });

      case 2: // Video Location
        return Yup.object().shape({
          resort: Yup.string().required(translate('videoOnboarding.validation.resortRequired')),
        });

      case 3: // Review Selection
        return Yup.object().shape({
          reviewType: Yup.string().required(translate('videoOnboarding.validation.reviewTypeRequired')),
        });

      default:
        return Yup.object().shape({}); // No validation for other steps
    }
  };

  const defaultValues = {
    // Step 1
    videoFile: null,
    trimmedVideo: null,
    videoDuration: 0,

    // Step 2
    resort: '',

    // Step 3
    reviewType: '', // 'ai_analysis', 'certified_instructor'
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
    watch,
    formState: { errors, isSubmitting: formIsSubmitting },
  } = methods;

  // Watch form values to trigger re-render when they change
  const watchedValues = watch();

  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting || formIsSubmitting;

  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return []; // No validation for tips step
      case 1:
        return ['videoFile'];
      case 2:
        return ['resort'];
      case 3:
        return ['reviewType'];
      default:
        return [];
    }
  };

  // Check if current step is ready to proceed
  const isStepReady = useCallback(() => {
    const currentData = methods.getValues();
    
    switch (activeStep) {
      case 0: // Tips step - always ready
        return true;
      case 1: // Video upload - check if video file exists
        return !!currentData.videoFile;
      case 2: // Location - check if resort is selected
        return !!currentData.resort;
      case 3: // Review - check if review type is selected
        return !!currentData.reviewType;
      default:
        return false;
    }
  }, [activeStep, methods, watchedValues]);

  const saveStepData = async (currentData, step) => {
    if (!user) return;

    // Prepare data based on current step - accumulate all data
    let stepData = {};

    switch (step) {
      case 1: // Video Upload
        stepData = {
          videoFile: currentData.videoFile,
          trimmedVideo: currentData.trimmedVideo,
          videoDuration: currentData.videoDuration,
        };
        break;

      case 2: // Video Location
        stepData = {
          resort: currentData.resort,
          videoFile: currentData.videoFile,
          trimmedVideo: currentData.trimmedVideo,
          videoDuration: currentData.videoDuration,
        };
        break;

      case 3: // Review Selection
        stepData = {
          reviewType: currentData.reviewType,
          resort: currentData.resort,
          videoFile: currentData.videoFile,
          trimmedVideo: currentData.trimmedVideo,
          videoDuration: currentData.videoDuration,
        };
        break;

      default:
        return;
    }

    // Update video data locally
    const updatedVideoData = { ...videoData, ...stepData };

    // Save to local state (we'll handle API calls in the final submission)
    setVideoData(updatedVideoData);
    return stepData;
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
    // For step 0 (VideoTipsStep), no validation needed - just proceed
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
    setVideoData(prev => ({ ...prev, ...currentData }));
    console.log('Current data:', currentData);

    // Save step data
    setInternalIsSubmitting(true);
    try {
      // If we're on the video upload step and video needs trimming, trim it automatically
      if (activeStep === 1 && videoUploadStepRef.current?.needsTrimming) {
        console.log('Auto-trimming video...');
        await videoUploadStepRef.current.trimVideo();
      }

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

    const STEPS = getSteps(translate);
    if (activeStep === STEPS.length - 1) {
      // Final step - complete video processing
      setIsVideoProcessingComplete(true);
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
      // Final step - process payment and video submission
      console.log('Final video data:', data);

      // Prepare final data
      const finalData = {
        videoFile: data.videoFile,
        trimmedVideo: data.trimmedVideo,
        videoDuration: data.videoDuration,
        resort: data.resort,
        reviewType: data.reviewType,
      };

      console.log('Final video processing data:', finalData);

      // Here you would typically:
      // 1. Process review selection based on reviewType
      // 2. Upload video to server
      // 3. Submit for procheck analysis
      
      // For now, just mark as complete
      setIsVideoProcessingComplete(true);
      if (onComplete) onComplete();

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
          return <VideoTipsStep />;

        case 1:
          return <VideoUploadStep ref={videoUploadStepRef} validateField={validateField} />;

        case 2:
          return <VideoLocationStep validateField={validateField} onNext={handleNext} />;

        case 3:
          return <VideoReviewStep validateField={validateField} />;

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

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleNext,
    handleBack,
    activeStep,
    isSubmitting
  }), [activeStep, isSubmitting]);

  // Show completion message
  if (isVideoProcessingComplete) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Iconify icon="eva:checkmark-circle-2-fill" sx={{ fontSize: 64, color: 'success.main' }} />
        </Box>
        <Typography variant="h4" gutterBottom>
          {translate('videoOnboarding.completion.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {translate('videoOnboarding.completion.message')}
        </Typography>
        <Button variant="contained" href="/dashboard" sx={{ ':hover': { color: '#3399FF' } }}>
          {translate('videoOnboarding.completion.goToDashboard')}
        </Button>
      </Box>
    );
  }

  const STEPS = getSteps(translate);
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{mt: {xs: 5, md: 0}}}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        {/* Step Content */}
        {renderStepContent(activeStep)}

        {/* Navigation Buttons */}
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '12px 16px' : '16px 24px',
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
              {translate('videoOnboarding.navigation.back')}
            </Button>

            <LoadingButton
              variant="contained"
              onClick={handleNext}
              loading={isSubmitting}
              disabled={isSubmitting}
              sx={{
                backgroundColor: isStepReady() ? '#000000' : '#555555',
                color: 'white',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: isStepReady() ? '#000000' : '#555555',
                  opacity: isStepReady() ? 0.9 : 1
                }
              }}
            >
              {isSubmitting ? translate('videoOnboarding.navigation.processing') : activeStep === STEPS.length - 1 ? translate('videoOnboarding.navigation.complete') : translate('videoOnboarding.navigation.next')}
            </LoadingButton>
          </Box>
      </Stack>
    </FormProvider>
  );
});

VideoOnboarding.displayName = 'VideoOnboarding';

export default VideoOnboarding;
