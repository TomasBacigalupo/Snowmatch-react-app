import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography, Tooltip, useTheme, useMediaQuery } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_AUTH, PATH_GUEST } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { RegisterStepperForm } from '../../sections/auth/register';
import useLocales from 'src/hooks/useLocales';
import { LoadingButton } from '@mui/lab';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  paddingTop: 'env(safe-area-inset-top)',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// Mobile Modal Style
const MobileModalStyle = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  zIndex: 1300,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
}));

const MobileCardStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100vh',
  borderRadius: 0,
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
}));

const MobileHeaderStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 3),
  paddingTop: `calc(${theme.spacing(2)} + env(safe-area-inset-top))`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
}));

const MobileContentStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  overflow: 'auto',
  height: 'calc(100vh - 120px - env(safe-area-inset-top) - 80px)', // Account for header, bottom navigation, and sticky footer
  paddingBottom: theme.spacing(2),
}));

const MobileStickyFooterStyle = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2, 3),
  paddingBottom: `calc(${theme.spacing(2)} + env(safe-area-inset-bottom))`,
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: 10,
}));

// ----------------------------------------------------------------------

export default function Register() {
  const {translate} = useLocales()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepperRef, setStepperRef] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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

  const handleEmailVerificationSuccess = () => {
    setIsEmailVerified(true);
  };

  // Get email verification status from stepper
  useEffect(() => {
    if (stepperRef && stepperRef.isEmailVerified !== undefined) {
      setIsEmailVerified(stepperRef.isEmailVerified);
    }
  }, [stepperRef]);

  const getButtonText = () => {
    if (currentStep === 8) return 'Completar Registro';
    return 'Siguiente';
  };

  if (isMobile) {
    return (
      <Page title="Register">
        <MobileModalStyle>
          <MobileCardStyle>
            <MobileHeaderStyle>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {translate("auth.getStartedFree")}
              </Typography>
              <Link 
                component={RouterLink} 
                to={PATH_AUTH.login}
                sx={{ 
                  color: 'text.secondary',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <Typography variant="body2">
                  {translate("auth.login")}
                </Typography>
              </Link>
            </MobileHeaderStyle>
            
            <MobileContentStyle>

              <RegisterStepperForm 
                onStepChange={handleStepChange}
                isSubmitting={isSubmitting}
                onEmailVerificationSuccess={handleEmailVerificationSuccess}
                ref={setStepperRef}
              />
            </MobileContentStyle>

            <MobileStickyFooterStyle>
              {/* Progress Bar */}
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={((currentStep + 1) / 10) * 100} 
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
                  Paso {currentStep + 1} de 10
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LoadingButton
                  variant="outlined"
                  fullWidth
                  onClick={handleBack}
                  disabled={currentStep === 0 || currentStep === 4}
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
                  disabled={(currentStep === 2 || currentStep === 3) && !isEmailVerified}
                  sx={{ 
                    py: 1.5,
                    bgcolor: 'black',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': { 
                      bgcolor: 'grey.800',
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

  // Desktop version (unchanged)
  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }} align="right">
              {translate("auth.haveAccount")}{' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
                {translate("auth.login")}
              </Link>
              <><br /></>
              {translate("auth.notATeacher")} {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_GUEST.root}>
                Match
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Manage the job more effectively with SnowMatch
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              alt="register"
              src="https://minimals.cc/assets/illustrations/illustration_register.png"
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>

            <RegisterStepperForm onEmailVerificationSuccess={handleEmailVerificationSuccess} />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              {translate("auth.registrationMessage")}&nbsp;
              <Link underline="always" color="text.primary" href="https://github.com/lpagn/snowmatchfiles/blob/main/Snow%20Match%20Terms%20of%20Service.pdf">
                {translate("auth.terms")}&nbsp;
              </Link>
              {translate("auth.and")}&nbsp;
              <Link underline="always" color="text.primary" href="https://github.com/lpagn/snowmatchfiles/blob/main/Snow%20Match%20Privacy%20Policy.pdf">
                {translate("auth.privacy")}
              </Link>
              .
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                {translate("auth.haveAccount")}{' '}
                <Link variant="subtitle2" to={PATH_AUTH.login} component={RouterLink}>
                  {translate("auth.login")}
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
