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

const getLinks = (translate, currentLang) => [
  {
    headline: translate('footer.sections.snowmatch'),
    children: [
      { name: 'Aspen', href: `/${currentLang.value}/aspen` },
      { name: 'Vail', href: `/${currentLang.value}/vail` },
      { name: 'Buttermilk', href: `/${currentLang.value}/buttermilk` },
      { name: 'Snowmass', href: `/${currentLang.value}/snowmass` },
      { name: 'Highlands', href: `/${currentLang.value}/highlands` },
      { name: 'Zermatt', href: `/${currentLang.value}/zermatt` },
      { name: 'Grandvalira', href: `/${currentLang.value}/grandvalira` },
      { name: 'Soldeu', href: `/${currentLang.value}/soldeu` },
      { name: 'Tarter', href: `/${currentLang.value}/tarter` },
      { name: 'Canillo', href: `/${currentLang.value}/canillo` },
      { name: translate('footer.links.faqs'), href: `/${currentLang.value}${PATH_PAGE.faqs}` },
      { name: translate('footer.links.blog'), href: `/${currentLang.value}/noticias` },
    ],
  },
  {
    headline: translate('footer.sections.instructors'),
    children: [
      { name: 'Benito Bacigalupo', href: `/${currentLang.value}/profile/12` },
      { name: 'Gaston Keenan', href: `/${currentLang.value}/profile/16` },
      { name: 'Patricio Gherlone', href: `/${currentLang.value}/profile/138` },
      { name: translate('footer.links.viewAllInstructors'), href: `/${currentLang.value}/all-teachers` },
      { name: translate('footer.links.becomeAnInstructor'), href: `/${currentLang.value}/instructor` },
    ],
  },
  {
    headline: translate('footer.sections.videoCoach'),
    children: [
      { name: translate('footer.links.video'), href: `/${currentLang.value}/video-coach` },
      { name: translate('footer.links.onboarding'), href: `/${currentLang.value}/video-onboarding` },
    ],
  },
  {
    headline: translate('footer.sections.legal'),
    children: [
      { name: translate('footer.links.terms'), href: `/${currentLang.value}/legal/terms` },
      { name: translate('footer.links.privacy'), href: `/${currentLang.value}/legal/privacy` },
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
  const { translate, currentLang } = useLocales();
  const LINKS = getLinks(translate, currentLang);
  
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

        {/* Hidden links for react-snap to discover all language versions */}
        <Box sx={{ 
          fontSize: '1px',
          lineHeight: '1px',
          color: 'transparent',
          height: '1px',
          overflow: 'hidden',
          position: 'absolute',
          left: '-1px',
          top: '-1px'
        }}>
          {['es', 'en', 'pt', 'fr'].map((lang) => (
            <Box key={lang}>
              {['aspen', 'vail', 'buttermilk', 'snowmass', 'highlands', 'zermatt', 'grandvalira', 'soldeu', 'tarter', 'canillo', 'cerro-catedral', 'cerro-chapelco', 'cerro-bayo', 'cerro-perito-moreno'].map((resort) => (
                <Link
                  key={`${lang}-${resort}`}
                  component={RouterLink}
                  to={`/${lang}/${resort}`}
                  sx={{ 
                    fontSize: '1px',
                    color: 'transparent',
                    textDecoration: 'none'
                  }}
                >
                  {resort} {lang}
                </Link>
              ))}
            </Box>
          ))}
        </Box>

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