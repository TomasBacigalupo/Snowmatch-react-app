import { Box, Container, Typography, Grid, Card, Avatar, Rating } from '@mui/material';
import { styled } from '@mui/material/styles';
import { m } from 'framer-motion';
import { MotionViewport, varFade } from '../../components/animate';
import useLocales from 'src/hooks/useLocales';

const TestimonialCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

export default function StudentTestimonials() {
  const { translate } = useLocales();

  const testimonials = [
    {
      id: 1,
      name: translate('studentTestimonials.testimonials.testimonial1.name'),
      avatar: '/assets/avatars/avatar_1.png',
      rating: 5,
      resort: translate('studentTestimonials.testimonials.testimonial1.resort'),
      discipline: translate('studentTestimonials.testimonials.testimonial1.discipline'),
      text: translate('studentTestimonials.testimonials.testimonial1.text'),
    },
    {
      id: 2,
      name: translate('studentTestimonials.testimonials.testimonial2.name'),
      avatar: '/assets/avatars/avatar_2.png',
      rating: 5,
      resort: translate('studentTestimonials.testimonials.testimonial2.resort'),
      discipline: translate('studentTestimonials.testimonials.testimonial2.discipline'),
      text: translate('studentTestimonials.testimonials.testimonial2.text'),
    },
    {
      id: 3,
      name: translate('studentTestimonials.testimonials.testimonial3.name'),
      avatar: '/assets/avatars/avatar_3.png',
      rating: 5,
      resort: translate('studentTestimonials.testimonials.testimonial3.resort'),
      discipline: translate('studentTestimonials.testimonials.testimonial3.discipline'),
      text: translate('studentTestimonials.testimonials.testimonial3.text'),
    },
  ];
  return (
    <Box
      component="section"
      aria-labelledby="testimonials-heading"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.neutral',
      }}
    >
      <Container maxWidth="lg">
        <Box component={MotionViewport}>
          <Typography
            id="testimonials-heading"
            component="h2"
            variant="h2"
            align="center"
            sx={{ mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            {translate('studentTestimonials.title')}
          </Typography>

          <Typography
            component="p"
            variant="h5"
            align="center"
            sx={{ mb: 8, color: 'text.secondary' }}
          >
            {translate('studentTestimonials.subtitle')}
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item key={testimonial.id} xs={12} md={4}>
                <m.div variants={varFade().inUp}>
                  <TestimonialCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" component="h3">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.discipline} en {testimonial.resort}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography
                      component="blockquote"
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        flexGrow: 1,
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </TestimonialCard>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
} 