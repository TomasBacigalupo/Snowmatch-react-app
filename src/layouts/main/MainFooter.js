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
import resortTransformation from 'src/utils/resortTransformation';

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
      { name: 'Aspen', href: '/aspen' },
      { name: 'Vail', href: '/vail' },
      { name: 'Buttermilk', href: '/buttermilk' },
      { name: 'Snowmass', href: '/snowmass' },
      { name: 'Highlands', href: '/highlands' },
      { name: 'Zermatt', href: '/zermatt' },
      { name: 'Grandvalira', href: '/grandvalira' },
      { name: 'Soldeu', href: '/soldeu' },
      { name: 'Tarter', href: '/tarter' },
      { name: 'Canillo', href: '/canillo' },
      { name: translate('footer.links.faqs'), href: PATH_PAGE.faqs },
      { name: translate('footer.links.blog'), href: "/noticias" },
    ],
  },
  {
    headline: translate('footer.sections.instructors'),
    children: [
      { name: 'Benito Bacigalupo', href: '/profile/12' },
      { name: 'Gaston Keenan', href: '/profile/16' },
      { name: 'Patricio Gherlone', href: '/profile/138' },
      { name: translate('footer.links.viewAllInstructors'), href: '/all-teachers' },
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
      { name: translate('footer.links.email'), href: 'mailto:office@snowmatch.pro' }
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
                    {section.children.map((link) => {
                      const isExternalLink = link.href.startsWith('http') || link.href.startsWith('mailto:');
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          component={isExternalLink ? 'a' : RouterLink}
                          to={!isExternalLink ? link.href : undefined}
                          color="inherit"
                          variant="body2"
                          underline="hover"
                          rel={isExternalLink ? "nofollow" : undefined}
                          target={isExternalLink && link.href.startsWith('http') ? "_blank" : undefined}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
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