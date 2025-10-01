import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Container, Grid, Stack, Typography, Card } from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
import { useEffect, useMemo, useState } from 'react';

const RootStyle = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
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
  padding: theme.spacing(2, 0),
}));

function Feature({ index, title, description, active, onClick }) {
  return (
    <FeatureCard component={m.div} variants={varFade().inUp}>
      <Stack direction="row" spacing={2} alignItems="flex-start" onClick={onClick} sx={{ cursor: 'pointer' }}>
        <NumberBadge active={active}>{index}</NumberBadge>
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: active ? 'text.primary' : 'text.primary' }}>
              {title}
            </Typography>
            {active && (
              <Box sx={{ width: 64, height: 3, bgcolor: 'primary.main', mt: 1, borderRadius: 2 }} />
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
  const features = useMemo(() => [
    {
      title: 'Planes de clases personalizados para esquiar',
      description:
        'Creamos tu plan de clases y práctica en base a tu nivel, objetivos y calendario de viaje. Sesiones variadas y entretenidas para progresar en la pista.',
      image: '/assets/courses/class.jpg',
    },
    {
      title: 'Profesores certificados y verificados',
      description:
        'Conectate con instructores habilitados en tu centro de ski. Elegí por idioma, especialidad y experiencia para tener la clase ideal.',
      image: '/assets/avatars/pros-esquiando2.png',
    },
    {
      title: 'Acompañamiento integral en técnica y seguridad',
      description:
        'Recibí consejos sobre postura, control de velocidad, elección de equipo y normas de montaña para disfrutar con confianza.',
      image: '/assets/rental/beginner-ski.jpg',
    },
    {
      title: 'Entrenamiento de fuerza y movilidad para esquiadores',
      description:
        'Accedé a rutinas complementarias para evitar lesiones y rendir mejor en la nieve: estabilidad, core y trabajo de piernas.',
      image: '/assets/courses/groom.jpeg',
    },
  ], []);

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
        <Grid container spacing={6} alignItems="center">
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
                height: { xs: 260, md: 420 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box component={m.div} variants={varFade().inDown}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800 }}>
                  Por qué Snowmatch
                </Typography>
                <Typography variant="h2" sx={{ fontWeight: 900, mt: 1 }}>
                  Diseñado para mejorar tu ski
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 760, mt: 1 }}>
                  Todo lo que necesitás para aprender, perfeccionar tu técnica y vivir una experiencia segura y divertida en la montaña.
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


