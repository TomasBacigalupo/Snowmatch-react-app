import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const benefits = [
  {
    title: 'Fijá tus propios precios',
    description:
      'Control total para maximizar tus ingresos según la demanda y tu experiencia.',
  },
  {
    title: 'Elegí cuándo y dónde trabajar',
    description:
      'Definí tu disponibilidad por horas, días o semanas. Full day o medias jornadas.',
  },
  {
    title: 'Contactá directo con tus clientes',
    description:
      'Gestioná consultas y reservas desde el celular con mensajes en tiempo real.',
  },
  {
    title: 'Trabajá menos y ganá más',
    description:
      'Comisión competitiva. Te quedás con la mayor parte de lo que cobrás.',
  },
  {
    title: 'Protección por cancelaciones',
    description:
      'Definí tu política de cancelación y cobrá si cancelan cerca de la clase.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Creá tu perfil',
    description:
      'Mostrá tu experiencia, subí fotos y videos. Te ayudamos a optimizarlo.',
  },
  {
    step: '02',
    title: 'Vos tenés el control',
    description:
      'Elegí resort(es), disciplina(s), precios, reglas de reserva y disponibilidad.',
  },
  {
    step: '03',
    title: 'Recibí nuevos clientes',
    description:
      'Te acercamos demanda para completar semanas puntuales o la temporada completa.',
  },
  {
    step: '04',
    title: 'Gestioná desde la app',
    description:
      'Respondé consultas y administrá reservas de manera simple y ágil.',
  },
];

const plans = [
  {
    name: 'Lite',
    price: 'Gratis',
    features: [
      'Trabajá todo el año',
      'Resorts y disciplinas ilimitadas',
      '10% de comisión',
    ],
    highlight: false,
  },
  {
    name: 'Basic',
    price: 'USD 249/año',
    features: [
      'Gestión de agenda y precios',
      'Perfil profesional',
      'Pagos seguros y protección de cancelación',
      '10% de comisión',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'USD 499/año',
    features: [
      'Menor comisión (7.2%)',
      'Más resorts y disciplinas',
      'Prioridad en búsquedas y socios',
      'Ranking mejorado',
    ],
    highlight: true,
  },
];

export default function InstructorLanding() {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const esUrl = `${origin}/instructor`;
  const enUrl = `${origin}/en/instructor`;

  return (
    <>
      <Helmet>
        <title>Conviértete en instructor independiente | Snowmatch</title>
        <meta
          name="description"
          content="Unite a la comunidad de instructores independientes. Definí precios, disponibilidad y conectá con nuevos clientes."
        />
        <link rel="canonical" href={esUrl} />
        <link rel="alternate" hrefLang="es" href={esUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content="Conviértete en instructor independiente | Snowmatch" />
        <meta property="og:description" content="Definí precios y disponibilidad. Conectá con nuevos clientes desde tu celular." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Box sx={{ bgcolor: 'background.default' }}>
        {/* Hero */}
        <Box
          sx={{
            pt: { xs: 10, md: 14 },
            pb: { xs: 8, md: 12 },
            background: (theme) =>
              `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
            color: 'common.white',
          }}
        >
          <Container>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1}>
                <Button size="small" color="inherit" href="/instructor" variant="contained">
                  ES
                </Button>
                <Button size="small" color="inherit" href="/en/instructor" variant="text">
                  EN
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                  Trazá tu propio camino
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                  Unite como instructor independiente y conectá con nuevos clientes.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large" href="/auth/register">
                    Empezar ahora
                  </Button>
                  <Button variant="outlined" size="large" color="inherit" href="#benefits">
                    Ver beneficios
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card sx={{ bgcolor: 'grey.800', color: 'common.white' }}>
                  <CardContent>
                    <Typography variant="overline" sx={{ opacity: 0.72 }}>
                      Estimador de ingresos
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                      Hasta USD 30.000 por temporada
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.72 }}>
                      Tus ingresos dependerán del resort, disponibilidad, experiencia y
                      demanda. Optimiza tu perfil para mejorar tu posicionamiento.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Benefits */}
        <Container id="benefits" sx={{ py: { xs: 8, md: 10 } }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 800 }}>
            La plataforma para instructores independientes
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((b) => (
              <Grid key={b.title} item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <CheckCircleIcon color="success" />
                      <Typography variant="h6">{b.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {b.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* How it works */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container>
            <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 800 }}>
              Cómo funciona
            </Typography>
            <Grid container spacing={3}>
              {steps.map((s) => (
                <Grid key={s.step} item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="overline" color="text.secondary">
                        {s.step}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {s.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {s.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Plans */}
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Typography variant="h3" align="center" sx={{ mb: 6, fontWeight: 800 }}>
            Planes para crecer a tu ritmo
          </Typography>
          <Grid container spacing={3}>
            {plans.map((p) => (
              <Grid key={p.name} item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', borderWidth: p.highlight ? 2 : 1, borderStyle: 'solid', borderColor: p.highlight ? 'primary.main' : 'divider' }}>
                  <CardContent>
                    <Typography variant="overline" color={p.highlight ? 'primary.main' : 'text.secondary'}>
                      {p.name}
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
                      {p.price}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {p.features.map((f) => (
                        <Stack key={f} direction="row" spacing={1} alignItems="center">
                          <CheckCircleIcon color="success" fontSize="small" />
                          <Typography variant="body2">{f}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button fullWidth variant={p.highlight ? 'contained' : 'outlined'} href="/auth/register">
                      Elegir
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* FAQs */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.neutral' }}>
          <Container>
            <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 800 }}>
              Preguntas frecuentes
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} mx="auto">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">¿Quién puede registrarse como instructor?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      Instructores certificados de ski o snowboard, con cobertura adecuada y permiso para trabajar en su resort.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">¿Qué costo tiene?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      Podés comenzar gratis con el plan Lite o Part time. Los planes pagos reducen comisión y agregan beneficios.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">¿Cómo manejo cancelaciones?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      Definí tu política. Si un cliente cancela cerca de la fecha, recibís el pago según las condiciones elegidas.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA */}
        <Container sx={{ py: { xs: 8, md: 10 } }}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    ¿Listo para empezar?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Creá tu perfil en minutos y empezá a recibir nuevos clientes esta temporada.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    justifyContent={{ xs: 'stretch', md: 'flex-end' }}
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    sx={{ width: '100%', flexWrap: 'wrap' }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      href="/auth/register"
                      disableElevation
                      sx={{
                        width: { xs: '100%', md: 'auto' },
                        px: 3.5,
                        py: 1.25,
                        borderRadius: 2,
                        fontWeight: 700,
                      }}
                    >
                      Crear mi perfil
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      href="/contact-us"
                      sx={{
                        width: { xs: '100%', md: 'auto' },
                        px: 3.5,
                        py: 1.25,
                        borderRadius: 2,
                        fontWeight: 700,
                        borderWidth: 2,
                      }}
                    >
                      Hablar con el equipo
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

