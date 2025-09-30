import { Box, Container, Typography, Button, Grid, Stack, Card } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { MotionViewport, varFade } from 'src/components/animate';
import useLocales from 'src/hooks/useLocales';
import Iconify from 'src/components/Iconify';

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

export default function VideoCoachLandingBanner() {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();

  const handleGoToVideoCoach = () => {
    const lang = currentLang?.value || 'es';
    navigate(`/${lang}/video-coach`);
  };

  return (
    <Container maxWidth="lg">
      <MotionViewport>
        <m.div variants={varFade().inUp}>
          <BannerContainer elevation={0}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 2,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {translate('videoCoachLanding.title', { defaultValue: 'VideoCoach: Correcciones por IA y Pros' })}
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {translate('videoCoachLanding.subtitle', { defaultValue: 'Subí tu video y recibí feedback en minutos.' })}
                  </Typography>
                </Stack>

                <CTAButton onClick={handleGoToVideoCoach} size="large" startIcon={<Iconify icon="eva:video-outline" />}> 
                  {translate('videoCoachLanding.cta', { defaultValue: 'Ir a VideoCoach' })}
                </CTAButton>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="hugeicons:ai-video" width={40} height={40} />
                    <Typography variant="caption" color="text.secondary">
                      {translate('videoCoachLanding.point1', { defaultValue: 'Análisis con IA (Snow)' })}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="eva:person-outline" width={40} height={40} />
                    <Typography variant="caption" color="text.secondary">
                      {translate('videoCoachLanding.point2', { defaultValue: 'Correcciones por instructores' })}
                    </Typography>
                  </Stack>
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="eva:clock-outline" width={40} height={40} />
                    <Typography variant="caption" color="text.secondary">
                      {translate('videoCoachLanding.point3', { defaultValue: 'Feedback rápido' })}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </BannerContainer>
        </m.div>
      </MotionViewport>
    </Container>
  );
}


