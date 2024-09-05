import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST, PATH_PAGE } from '../../routes/paths';
// components
import Logo from '../../components/Logo';
import SocialsButton from '../../components/SocialsButton';

// ----------------------------------------------------------------------
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
      { name: 'FAQs', href: PATH_PAGE.faqs }

    ],
  },
  {
    headline: 'Profesores',
    children: Array(200).fill(0).map((_, index) => ({ name: `Teacher ${index}`, href: PATH_GUEST.viewTeacher(index) }))
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and Condition', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  },
  {
    headline: 'Contact',
    children: [
      { name: 'office@snowmatch.pro', href: '#' },
      { name: 'San Martin de los Andes, Patagonia Argentina', href: '#' },
    ],
  },
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Logo sx={{ mx: { xs: 'auto', md: 'inherit' } }} />
          </Grid>
          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Take your job to the next level with SnowMatch
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton sx={{ mx: 0.5 }} links={{ instagram: "https://www.instagram.com/snow.match" }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <Link
                      to={link.href}
                      key={link.name}
                      color="inherit"
                      variant="body2"
                      component={RouterLink}
                      sx={{ display: 'block' }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
              <Stack>
                <Link
                  to='/clases-de-ski-bariloche'
                  key='Bariloche'
                  color="inherit"
                  variant="body2"
                  component={RouterLink}
                  sx={{ display: 'block' }}
                >
                  Bariloche
                </Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 10,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2021. All rights reserved
        </Typography>
      </Container>
    </RootStyle>
  );
}
