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
          }}
        >
          <m.div>
            <Image
              visibleByDefault
              alt="Instructor de esquí certificado - SnowMatch"
              src="https://image.snowmatch.pro/profile/23-ef7b4fa1-8880-4915-9f0d-76b428e989c9"
              disabledEffect
              sx={{ maxWidth: 460 }}
            />
          </m.div>
        </Box>

        <Box
          component="article"
          sx={{
            pl: { md: 10 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box component={m.div} variants={varFade().inDown} sx={{ color: 'common.white', mb: 5 }}>
            <Typography component="h2" variant="h2">
              {translate("landingPRO.getStartedToday")}
            </Typography>
            <Typography 
              component="p" 
              variant="h5" 
              sx={{ 
                mt: 2,
                color: 'common.white',
                opacity: 0.9
              }}
            >
              Únete a nuestra comunidad de esquiadores y snowboarders. 
              Aprende con los mejores instructores certificados de Argentina.
            </Typography>
          </Box>
          <m.div variants={varFade().inDown}>
            <Button
              size="large"
              variant="contained"
              target="_blank"
              rel="noopener"
              href={PATH_AUTH.register}
              aria-label="Registrarse en SnowMatch"
              sx={{
                whiteSpace: 'nowrap',
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
                bgcolor: 'common.white',
                '&:hover': { bgcolor: 'grey.300' },
              }}
            >
              Registrarse
            </Button>
          </m.div>
        </Box>
      </ContentStyle>
    </Container>
  );
}
