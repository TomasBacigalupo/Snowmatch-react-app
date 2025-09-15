import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { PATH_DASHBOARD, PATH_GUEST, PATH_PAGE } from '../../routes/paths';
import Logo from '../../components/Logo';
import SocialsButton from '../../components/SocialsButton';
import useLocales from '../../hooks/useLocales';

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  minHeight: '300px', // Altura mínima fija
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end'
}));

const getLinks = (translate) => [
  {
    headline: translate('footer.sections.snowmatch'),
    children: [
      { name: translate('footer.links.catedral'), href: PATH_GUEST.independent },
      { name: translate('footer.links.snowMatchX'), href: PATH_GUEST.snowMatchX },
      { name: translate('footer.links.intermediate'), href: PATH_GUEST.intermedios },
      { name: translate('footer.links.beginners'), href: PATH_GUEST.principiantes },
      { name: translate('footer.links.heliski'), href: '/heliski' },
      { name: translate('footer.links.clinic'), href: PATH_GUEST.clinic },
      { name: translate('footer.links.family'), href: PATH_GUEST.family },
      { name: translate('footer.links.children'), href: PATH_GUEST.children },
      { name: translate('footer.links.freeRide'), href: PATH_GUEST.freeRide },
      { name: translate('footer.links.groupCatedral'), href: PATH_GUEST.grupales },
      { name: translate('footer.links.raceClinic'), href: PATH_GUEST.palos },
      { name: translate('footer.links.faqs'), href: PATH_PAGE.faqs },
      { name: translate('footer.links.blog'), href: "/noticias" },
    ],
  },
  {
    headline: translate('footer.sections.instructors'),
    children: [
      { name: 'Profe de SM Tomas', href: PATH_GUEST.viewTeacher(14) },
      { name: 'Profe de SM Popi', href: PATH_GUEST.viewTeacher(592) },
      { name: 'Profe de SM Agos', href: PATH_GUEST.viewTeacher(897) },
      { name: translate('footer.links.viewAllInstructors'), href: '/match/independent?resort=Cerro%20Catedral' },
    ],
  },
  {
    headline: translate('footer.sections.legal'),
    children: [
      { name: translate('footer.links.terms'), href: '/legal/terms' },
      { name: translate('footer.links.privacy'), href: '/legal/privacy' },
    ],
  },
  {
    headline: translate('footer.sections.contact'),
    children: [
      { name: translate('footer.links.whatsapp'), href: 'https://wa.me/5492944263223' },
      { name: translate('footer.links.email'), href: 'mailto:office@snowmatch.pro' },
      { name: translate('footer.links.location'), href: 'https://goo.gl/maps/...'} // reemplazá con link real
    ],
  },
];

export default function MainFooter() {
  const { translate } = useLocales();
  const LINKS = getLinks(translate);
  
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
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              height: '100%',
              minHeight: '200px' // Altura mínima para el contenedor del logo
            }}>
              <Logo sx={{ mb: 2 }} />
              <Typography variant="body2" sx={{ maxWidth: 300 }}>
                {translate('footer.description')}
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
            </Box>
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
          © {new Date().getFullYear()}. {translate('footer.copyright')}
        </Typography>
      </Container>
    </RootStyle>
  );
}