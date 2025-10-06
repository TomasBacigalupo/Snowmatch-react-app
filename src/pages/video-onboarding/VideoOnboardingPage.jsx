import { useState, useRef } from 'react';
import { Box, Container, Stepper, Step, StepLabel, StepConnector, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import VideoOnboarding from './VideoOnboarding';
import useLocales from '../../hooks/useLocales';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getSteps = (translate) => [
  { label: translate('videoOnboarding.stepper.tips'), icon: 'eva:bulb-fill' },
  { label: translate('videoOnboarding.stepper.upload'), icon: 'eva:video-fill' },
  { label: translate('videoOnboarding.stepper.location'), icon: 'eva:map-fill' },
  { label: translate('videoOnboarding.stepper.payment'), icon: 'eva:credit-card-fill' }
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

export default function VideoOnboardingPage() {
  const { translate } = useLocales();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepperRef = useRef();
  
  const STEPS = getSteps(translate);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (stepperRef.current) {
      stepperRef.current.handleNext();
    }
  };

  const handleBack = () => {
    if (stepperRef.current) {
      stepperRef.current.handleBack();
    }
  };

  const handleComplete = () => {
    // Handle completion - redirect to dashboard or success page
    window.location.href = '/dashboard';
  };

  return (
    <>
      <Helmet>
        <title>{translate('videoOnboarding.page.title')}</title>
      </Helmet>

      <Box
        component={m.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        sx={{
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          py: { xs: 2, md: 4 }
        }}
      >
        <Container maxWidth="lg">

          {/* Main Content */}
          <Box
            component={m.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <VideoOnboarding
              ref={stepperRef}
              onStepChange={handleStepChange}
              onNext={handleNext}
              onBack={handleBack}
              isSubmitting={isSubmitting}
              onComplete={handleComplete}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}
