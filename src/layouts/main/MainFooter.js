import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
} from '@mui/material';
import { PATH_DASHBOARD, PATH_GUEST, PATH_PAGE } from '../../routes/paths';
import Logo from '../../components/Logo';
import SocialsButton from '../../components/SocialsButton';

const RootStyle = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

const LINKS = [
  {
    headline: 'SnowMatch',
    children: [
      { name: 'Catedral', href: PATH_GUEST.independent },
      { name: 'SnowMatchX', href: PATH_GUEST.snowMatchX },
      { name: 'Intermedios', href: PATH_GUEST.intermedios },
      { name: 'Principiantes', href: PATH_GUEST.principiantes },
      { name: 'Clinic', href: PATH_GUEST.clinic },
      { name: 'Family', href: PATH_GUEST.family },
      { name: 'Children', href: PATH_GUEST.children },
      { name: 'Free Ride', href: PATH_GUEST.freeRide },
      { name: 'Clase grupal Catedral', href: PATH_GUEST.grupales },
      { name: 'Clinica de Carrera', href: PATH_GUEST.palos },
      { name: 'FAQs', href: PATH_PAGE.faqs },
      { name: 'Blog', href: 'https://blog.snowmatch.pro' },
    ],
  },
  {
    headline: 'Profesores',
    children: [
      { name: 'Profe de SM Tomas', href: PATH_GUEST.viewTeacher(14) },
      { name: 'Profe de SM Popi', href: PATH_GUEST.viewTeacher(592) },
      { name: 'Profe de SM Agos', href: PATH_GUEST.viewTeacher(897) },
      { name: 'Ver todos los profesores', href: '/match/independent?resort=Cerro%20Catedral' },
    ],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Términos y condiciones', href: '/legal/terms' },
      { name: 'Política de privacidad', href: '/legal/privacy' },
    ],
  },
  {
    headline: 'Contacto',
    children: [
      { name: 'office@snowmatch.pro', href: 'mailto:office@snowmatch.pro' },
      { name: 'San Martín de los Andes, Patagonia Argentina', href: 'https://goo.gl/maps/...'} // reemplazá con link real
    ],
  },
];

export default function MainFooter() {
  return (
    <RootStyle role="contentinfo">
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          spacing={4}
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          {/* Logo + Intro + Redes */}
          <Grid item xs={12} md={3}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' }, mb: 2 }} />
            <Typography variant="body2" sx={{ maxWidth: 300 }}>
              Elevá tu experiencia en la nieve con SnowMatch.
            </Typography>
            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 3 }}
            >
              <SocialsButton
                sx={{ mx: 0.5 }}
                links={{ instagram: 'https://www.instagram.com/snow.match' }}
              />
            </Stack>
          </Grid>

          {/* Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {LINKS.map((section) => (
                <Grid item xs={6} sm={4} key={section.headline}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {section.headline}
                  </Typography>
                  <Stack spacing={1}>
                    {section.children.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        component={RouterLink}
                        color="inherit"
                        variant="body2"
                        underline="hover"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Typography
          variant="body2"
          sx={{
            mt: 8,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: 'center', md: 'left' },
            color: 'text.secondary',
          }}
        >
          © {new Date().getFullYear()}. Todos los derechos reservados.
        </Typography>
      </Container>
    </RootStyle>
  );
}