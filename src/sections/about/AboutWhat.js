import { m } from 'framer-motion';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Button, Container, Typography, Stack } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import useLocales from '../../hooks/useLocales';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import { MotionViewport, varFade } from '../../components/animate';
import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(20),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

const FEATURE_ICONS = ['eva:shield-fill', 'eva:map-fill', 'eva:video-fill'];

// ----------------------------------------------------------------------

export default function AboutWhat() {
  const theme = useTheme();
  const { translate } = useLocales();
  const { lng } = useParams();
  const lang = lng || 'en';
  const homePath = PATH_PAGE.marketingHome(lang);

  const isDesktop = useResponsive('up', 'md');

  const isLight = theme.palette.mode === 'light';

  const shadow = `-40px 40px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.48)}`;

  const features = [
    {
      icon: FEATURE_ICONS[0],
      title: translate('aboutPage.what.feature1Title'),
      body: translate('aboutPage.what.feature1Body'),
    },
    {
      icon: FEATURE_ICONS[1],
      title: translate('aboutPage.what.feature2Title'),
      body: translate('aboutPage.what.feature2Body'),
    },
    {
      icon: FEATURE_ICONS[2],
      title: translate('aboutPage.what.feature3Title'),
      body: translate('aboutPage.what.feature3Body'),
    },
  ];

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Grid container spacing={3}>
          {isDesktop && (
            <Grid item xs={12} md={6} lg={7} sx={{ pr: { md: 7 } }}>
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={6}>
                  <m.div variants={varFade().inUp}>
                    <Image
                      alt={translate('aboutPage.what.image1Alt')}
                      src="/assets/bariloche.jpg"
                      ratio="3/4"
                      sx={{
                        borderRadius: 2,
                        boxShadow: shadow,
                      }}
                    />
                  </m.div>
                </Grid>
                <Grid item xs={6}>
                  <m.div variants={varFade().inUp}>
                    <Image
                      alt={translate('aboutPage.what.image2Alt')}
                      src="/assets/chapelco.png"
                      ratio="1/1"
                      sx={{ borderRadius: 2 }}
                    />
                  </m.div>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={5}>
            <m.div variants={varFade().inRight}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                {translate('aboutPage.what.title')}
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography
                sx={{
                  color: (t) => (t.palette.mode === 'light' ? 'text.secondary' : 'common.white'),
                }}
              >
                {translate('aboutPage.what.body')}
              </Typography>
            </m.div>

            <Stack spacing={2.5} sx={{ my: 5 }}>
              {features.map((item) => (
                <m.div key={item.title} variants={varFade().inRight}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: 'primary.main',
                        flexShrink: 0,
                      }}
                    >
                      <Iconify icon={item.icon} width={26} height={26} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.body}
                      </Typography>
                    </Box>
                  </Stack>
                </m.div>
              ))}
            </Stack>

            <m.div variants={varFade().inRight}>
              <Button
                component={RouterLink}
                to={homePath}
                variant="contained"
                color="primary"
                size="large"
                endIcon={<Iconify icon="ic:round-arrow-right-alt" width={24} height={24} />}
              >
                {translate('aboutPage.what.cta')}
              </Button>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}
