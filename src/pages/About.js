// @mui
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
// components
import Page from '../components/Page';
import useLocales from '../hooks/useLocales';
import { AboutHero, AboutWhat, AboutTeam, AboutVision, AboutTestimonials } from '../sections/about';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function About() {
  const { translate } = useLocales();

  return (
    <Page title={translate('aboutPage.pageTitle')}>
      <RootStyle>
        <AboutHero />

        <AboutWhat />

        <AboutVision />

        <Divider orientation="vertical" sx={{ my: 10, mx: 'auto', width: 2, height: 40 }} />

        <AboutTeam />

        <AboutTestimonials />
      </RootStyle>
    </Page>
  );
}
