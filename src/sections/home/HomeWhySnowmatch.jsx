import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Stack, Typography, Card } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
import { useEffect, useMemo, useState } from 'react';
import useLocales from '../../hooks/useLocales';

const RootStyle = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  backgroundColor: theme.palette.background.default,
}));

const NumberBadge = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })(({ theme, active }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: `2px solid ${active ? theme.palette.primary.main : theme.palette.divider}`,
  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 16,
  flexShrink: 0,
  transition: 'all 0.2s ease',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  background: 'transparent',
  padding: theme.spacing(1, 0),
}));

function Feature({ index, title, description, active, onClick }) {
  return (
    <FeatureCard component={m.div} variants={varFade().inUp}>
      <Stack direction="row" spacing={2} alignItems="flex-start" onClick={onClick} sx={{ cursor: 'pointer' }}>
        <NumberBadge active={active}>{index}</NumberBadge>
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: active ? 'text.primary' : 'text.primary' }}>
              {title}
            </Typography>
            {active && (
              <Box sx={{ width: 64, height: 3, bgcolor: 'primary.main', mt: 0.5, borderRadius: 2 }} />
            )}
          </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Stack>
      </Stack>
    </FeatureCard>
  );
}

export default function HomeWhySnowmatch() {
  const { translate } = useLocales();

  const features = useMemo(() => [
    {
      title: translate('homeWhySnowmatch.features.1.title'),
      description: translate('homeWhySnowmatch.features.1.description'),
      image: '/assets/courses/class.jpg',
    },
    {
      title: translate('homeWhySnowmatch.features.2.title'),
      description: translate('homeWhySnowmatch.features.2.description'),
      image: '/assets/avatars/pros-esquiando2.png',
    },
    {
      title: translate('homeWhySnowmatch.features.3.title'),
      description: translate('homeWhySnowmatch.features.3.description'),
      image: '/assets/rental/beginner-ski.jpg',
    },
    {
      title: translate('homeWhySnowmatch.features.4.title'),
      description: translate('homeWhySnowmatch.features.4.description'),
      image: '/assets/courses/groom.jpeg',
    },
  ], [translate]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(id);
  }, [features.length]);


  const active = features[activeIndex];

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component={m.img}
              key={active.image}
              variants={varFade().in}
              src={active.image}
              alt={active.title}
              sx={{
                width: '100%',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                objectFit: 'cover',
                height: { xs: 240, md: 320 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box component={m.div} variants={varFade().inDown}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                  {translate('homeWhySnowmatch.overline')}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>
                  {translate('homeWhySnowmatch.title')}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760, mt: 0.5 }}>
                  {translate('homeWhySnowmatch.subtitle')}
                </Typography>
              </Box>

              {features.map((f, i) => (
                <Feature
                  key={f.title}
                  index={i + 1}
                  title={f.title}
                  description={f.description}
                  active={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  );
}


