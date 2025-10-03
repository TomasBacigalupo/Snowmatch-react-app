import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Container, Typography } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 456,
  margin: 'auto',
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    maxWidth: '100%',
    paddingBottom: 0,
    alignItems: 'center',
    padding: theme.spacing(6),
    minHeight: 400,
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(8),
    minHeight: 450,
  },
}));

// ----------------------------------------------------------------------

export default function HomeAdvertisement() {
  const {translate} = useLocales()
  return (
    <Container component={MotionViewport}>
      <ContentStyle>
        <Box
          component={m.div}
          variants={varFade().inUp}
          sx={{
            mb: { xs: 3, md: 0 },
            flex: { md: '0 0 50%' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <m.div>
            <Image
              visibleByDefault
              alt="Instructor de esquí certificado - SnowMatch"
              src="https://image.snowmatch.pro/profile/23-ef7b4fa1-8880-4915-9f0d-76b428e989c9"
              disabledEffect
              sx={{ 
                maxWidth: { xs: 280, sm: 320, md: 380, lg: 420 },
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows.z20,
              }}
            />
          </m.div>
        </Box>

        <Box
          component="article"
          sx={{
            pl: { md: 6, lg: 8 },
            textAlign: { xs: 'center', md: 'left' },
            flex: { md: '0 0 50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box component={m.div} variants={varFade().inDown} sx={{ color: 'common.white', mb: { xs: 3, md: 4 } }}>
            <Typography 
              component="h2" 
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {translate("landingPRO.getStartedToday")}
            </Typography>
            <Typography 
              component="p" 
              variant="h5" 
              sx={{ 
                mt: 2,
                color: 'common.white',
                opacity: 0.9,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' },
                lineHeight: 1.6,
                maxWidth: { md: '90%' },
              }}
            >
              {translate("landing.advertisement.subtitle") || "Únete a nuestra comunidad de esquiadores y snowboarders. Aprende con los mejores instructores certificados de Argentina."}
            </Typography>
          </Box>
          <m.div variants={varFade().inDown}>
            <Button
              size="large"
              variant="contained"
              target="_blank"
              rel="noopener"
              href={PATH_AUTH.register}
              aria-label={translate("auth.register") || "Registrarse en SnowMatch"}
              sx={{
                whiteSpace: 'nowrap',
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
                bgcolor: 'common.white',
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 600,
                '&:hover': { 
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.customShadows.z12,
                },
                transition: 'all 0.3s ease',
              }}
            >
              {translate("auth.register") || "Registrarse"}
            </Button>
          </m.div>
        </Box>
      </ContentStyle>
    </Container>
  );
}
