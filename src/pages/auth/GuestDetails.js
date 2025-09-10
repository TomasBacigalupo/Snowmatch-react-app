import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Typography, LinearProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
// hooks
import useAuth from 'src/hooks/useAuth';
import useLocales from 'src/hooks/useLocales';
// components
import Page from 'src/components/Page';
import StudentStepperForm from 'src/sections/auth/register/StudentStepperForm';
import MobileHeader from 'src/components/MobileHeader';
// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// ----------------------------------------------------------------------

const MobileModalStyle = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'white',
  zIndex: 1000,
  overflow: 'hidden',
}));

const MobileCardStyle = styled('div')(({ theme }) => ({
  paddingTop: `calc(env(safe-area-inset-top) + ${theme.spacing(2)})`,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const MobileContentStyle = styled('div')(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  paddingTop: 0,
}));

const MobileStickyFooterStyle = styled('div')(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  backgroundColor: 'white',
  padding: theme.spacing(2),
  paddingBottom: `calc(${theme.spacing(2)} + env(safe-area-inset-bottom))`,
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 10,
}));

// ----------------------------------------------------------------------

export default function GuestDetails() {
  const { translate } = useLocales();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepperRef, setStepperRef] = useState(null);

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  // Update current step when stepper ref changes
  useEffect(() => {
    if (stepperRef && stepperRef.activeStep !== undefined) {
      setCurrentStep(stepperRef.activeStep);
    }
  }, [stepperRef]);

  const handleNext = () => {
    if (stepperRef && stepperRef.handleNext) {
      stepperRef.handleNext();
    }
  };

  const handleBack = () => {
    if (stepperRef && stepperRef.handleBack) {
      stepperRef.handleBack();
    }
  };

  const getButtonText = () => {
    if (currentStep === 5) return 'Completar Perfil';
    return 'Siguiente';
  };

  const handleRegistrationComplete = () => {
    // Redirect to dashboard after successful registration
    navigate(PATH_DASHBOARD.root);
  };

  const handleMobileBack = () => {
    navigate(-1);
  };

  if (isMobile) {
    return (
      <Page title="Guest Details">
        <MobileModalStyle>
          <MobileCardStyle>
            <MobileHeader 
              title="Configurar Perfil"
              onBack={handleMobileBack}
            />
            <MobileContentStyle>
              <StudentStepperForm 
                onStepChange={handleStepChange}
                isSubmitting={isSubmitting}
                onComplete={handleRegistrationComplete}
                ref={setStepperRef}
              />
            </MobileContentStyle>

            <MobileStickyFooterStyle>
              {/* Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={((currentStep + 1) / 6) * 100} 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'black',
                      borderRadius: 2
                    }
                  }} 
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                  Paso {currentStep + 1} de 6
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LoadingButton
                  variant="outlined"
                  fullWidth
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  sx={{ 
                    py: 1.5,
                    borderColor: 'black',
                    color: 'black',
                    borderRadius: 2,
                    '&:hover': { 
                      borderColor: 'grey.700',
                      bgcolor: 'grey.50'
                    },
                    '&:disabled': {
                      borderColor: 'grey.300',
                      color: 'grey.400'
                    }
                  }}
                >
                  Atrás
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  fullWidth
                  onClick={handleNext}
                  loading={isSubmitting}
                  sx={{ 
                    py: 1.5,
                    bgcolor: currentStep === 5 ? 'primary.main' : 'black',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': { 
                      bgcolor: currentStep === 5 ? 'primary.dark' : 'grey.800',
                      color: 'white'
                    },
                    '&:disabled': {
                      bgcolor: 'grey.400',
                      color: 'grey.600'
                    }
                  }}
                >
                  {getButtonText()}
                </LoadingButton>
              </Box>
            </MobileStickyFooterStyle>
          </MobileCardStyle>
        </MobileModalStyle>
      </Page>
    );
  }

  // Desktop version
  return (
    <Page title="Guest Details">
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '20px' : '40px',
        backgroundColor: theme.palette.background.default
      }}>
        <div style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '800px',
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[3],
          padding: isMobile ? '20px' : '40px',
          overflow: 'hidden'
        }}>
          <StudentStepperForm 
            onStepChange={handleStepChange}
            isSubmitting={isSubmitting}
            onComplete={handleRegistrationComplete}
            ref={setStepperRef}
          />
        </div>
      </div>
    </Page>
  );
}