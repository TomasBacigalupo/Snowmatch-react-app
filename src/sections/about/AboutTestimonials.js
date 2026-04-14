import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Grid, Paper, Rating, Container, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import useLocales from '../../hooks/useLocales';
// utils
import cssStyles from '../../utils/cssStyles';
// components
import Iconify from '../../components/Iconify';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const BG_IMAGE = '/assets/how-to/screens.webp';

const RootStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(10, 0),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.grey[900], 0.88)} , ${alpha(
    theme.palette.grey[900],
    0.88
  )}), url(${BG_IMAGE})`,
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    padding: 0,
    minHeight: 720,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
}));

// ----------------------------------------------------------------------

export default function AboutTestimonials() {
  const isDesktop = useResponsive('up', 'md');
  const { translate } = useLocales();
  const items = translate('aboutPage.testimonials.items', { returnObjects: true });
  const list = Array.isArray(items) ? items : [];

  const { lng } = useParams();
  const lang = lng || 'en';
  const contactPath = `/${lang}/contact-us`;

  return (
    <RootStyle>
      <Container component={MotionViewport} sx={{ position: 'relative', py: { xs: 0, md: 10 } }}>
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent={{ xs: 'center', md: 'space-between' }}
        >
          <Grid item xs={10} md={4}>
            <Box sx={{ maxWidth: { md: 380 } }}>
              <m.div variants={varFade().inUp}>
                <Typography component="p" variant="overline" sx={{ mb: 2, color: 'primary.light' }}>
                  {translate('aboutPage.testimonials.overline')}
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography variant="h2" sx={{ mb: 3, color: 'common.white', fontWeight: 800 }}>
                  {translate('aboutPage.testimonials.title')}
                </Typography>
              </m.div>

              <m.div variants={varFade().inUp}>
                <Typography sx={{ color: 'grey.300' }}>{translate('aboutPage.testimonials.intro')}</Typography>
              </m.div>

              {!isDesktop && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <m.div variants={varFade().inUp}>
                    <Button
                      component={RouterLink}
                      to={contactPath}
                      color="inherit"
                      variant="outlined"
                      endIcon={<Iconify icon="ic:round-arrow-right-alt" sx={{ width: 20, height: 20 }} />}
                      sx={{ color: 'common.white', borderColor: 'rgba(255,255,255,0.5)' }}
                    >
                      {translate('aboutPage.testimonials.readMore')}
                    </Button>
                  </m.div>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={7}
            lg={6}
            sx={{
              right: { md: 24 },
              position: { md: 'absolute' },
            }}
          >
            <Grid container spacing={isDesktop ? 3 : 0} alignItems="flex-start">
              <Grid item xs={12} md={6}>
                {list.slice(0, 3).map((testimonial) => (
                  <m.div key={testimonial.name} variants={varFade().inUp}>
                    <TestimonialCard testimonial={testimonial} />
                  </m.div>
                ))}
              </Grid>

              <Grid item xs={12} md={6}>
                {list.slice(3, 6).map((testimonial) => (
                  <m.div key={testimonial.name} variants={varFade().inUp}>
                    <TestimonialCard testimonial={testimonial} />
                  </m.div>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {isDesktop && (
          <Box sx={{ mt: 6, display: { md: 'block' } }}>
            <m.div variants={varFade().inLeft}>
              <Button
                component={RouterLink}
                to={contactPath}
                color="inherit"
                variant="text"
                endIcon={<Iconify icon="ic:round-arrow-right-alt" sx={{ width: 20, height: 20 }} />}
                sx={{ color: 'common.white' }}
              >
                {translate('aboutPage.testimonials.readMore')}
              </Button>
            </m.div>
          </Box>
        )}
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

TestimonialCard.propTypes = {
  testimonial: PropTypes.shape({
    content: PropTypes.string,
    date: PropTypes.string,
    name: PropTypes.string,
    rating: PropTypes.number,
  }),
};

function TestimonialCard({ testimonial }) {
  const theme = useTheme();

  const { name, date, content } = testimonial;

  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
        color: 'common.white',
        ...cssStyles().bgBlur({
          color: theme.palette.common.white,
          opacity: 0.04,
        }),
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {name}
      </Typography>
      <Typography gutterBottom component="p" variant="caption" sx={{ color: 'grey.500' }}>
        {date}
      </Typography>
      <Rating value={5} readOnly size="small" />
      <Typography variant="body2" sx={{ mt: 1.5 }}>
        {content}
      </Typography>
    </Paper>
  );
}
