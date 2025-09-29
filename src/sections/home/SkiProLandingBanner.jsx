import { Box, Container, Typography, Button, Grid, Stack, Card, CardContent } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { MotionViewport, varFade } from '../../components/animate';
import useLocales from 'src/hooks/useLocales';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const BannerContainer = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
  borderRadius: theme.spacing(3),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: theme.spacing(5),
  margin: theme.spacing(4, 0),
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4),
    margin: theme.spacing(3, 0),
    borderRadius: theme.spacing(2),
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    paddingRight: 0,
    paddingBottom: theme.spacing(4),
    marginBottom: theme.spacing(4),
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const RightSection = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    background: 'rgba(255, 255, 255, 0.95)',
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.2)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

// ----------------------------------------------------------------------

export default function SkiProLandingBanner() {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const currentLanguage = currentLang?.value || 'es';
    navigate(`/${currentLanguage}/instructor`);
  };

  const features = [
    {
      icon: 'eva:clock-outline',
      text: translate('skiProLanding.feature1'),
    },
    {
      icon: 'eva:person-outline',
      text: translate('skiProLanding.feature2'),
    },
    {
      icon: 'eva:video-outline',
      text: translate('skiProLanding.feature3'),
    },
  ];

  return (
    <Container maxWidth="lg">
      <MotionViewport>
        <m.div variants={varFade().inUp}>
          <BannerContainer elevation={0}>
            <Grid container spacing={4} alignItems="center">
              {/* Left Section */}
              <Grid item xs={12} md={6}>
                <LeftSection>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 3,
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      lineHeight: 1.2,
                    }}
                  >
                    {translate('skiProLanding.title')}
                  </Typography>
                  
                  <Stack spacing={2.5} sx={{ mb: 4 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      {translate('skiProLanding.subtitle1')}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.6,
                      }}
                    >
                      {translate('skiProLanding.subtitle2')}
                    </Typography>
                  </Stack>

                  <CTAButton 
                    variant="contained" 
                    onClick={handleLearnMore}
                    size="large"
                  >
                    {translate('skiProLanding.ctaButton')}
                  </CTAButton>
                </LeftSection>
              </Grid>

              {/* Right Section */}
              <Grid item xs={12} md={6}>
                <RightSection>
                  <Grid container spacing={3}>
                    {features.map((feature, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <FeatureCard elevation={0}>
                          <IconContainer>
                            <Iconify
                              icon={feature.icon}
                              sx={{
                                width: 28,
                                height: 28,
                                color: 'primary.main',
                              }}
                            />
                          </IconContainer>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.primary',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              lineHeight: 1.5,
                              fontWeight: 500,
                            }}
                            dangerouslySetInnerHTML={{
                              __html: feature.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                            }}
                          />
                        </FeatureCard>
                      </Grid>
                    ))}
                  </Grid>
                </RightSection>
              </Grid>
            </Grid>
          </BannerContainer>
        </m.div>
      </MotionViewport>
    </Container>
  );
}
