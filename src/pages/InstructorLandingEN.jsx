import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const benefits = [
  {
    title: 'Set your own prices',
    description:
      'Full control to maximize your earnings based on demand and experience.',
  },
  {
    title: 'Choose when and where you work',
    description:
      'Define availability by hours, days or weeks. Full days or half days.',
  },
  {
    title: 'Direct client communication',
    description:
      'Manage inquiries and bookings from your phone with real-time messages.',
  },
  {
    title: 'Work less, earn more',
    description:
      'Competitive commission. You keep the majority of what you charge.',
  },
  {
    title: 'Cancellation protection',
    description:
      'Set your policy and get paid if clients cancel close to the lesson date.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create your profile',
    description: 'Showcase your experience with photos and videos. We help you optimize it.',
  },
  {
    step: '02',
    title: 'You are in control',
    description: 'Choose resort(s), discipline(s), prices, booking rules and availability.',
  },
  {
    step: '03',
    title: 'Meet new clients',
    description: 'We bring you demand to fill specific weeks or your whole season.',
  },
  {
    step: '04',
    title: 'Manage from the app',
    description: 'Reply to messages and handle bookings quickly and easily.',
  },
];

const plans = [
  {
    name: 'Lite',
    price: 'Free',
    features: ['Work all year round', 'Unlimited resorts and disciplines', '10% commission'],
    highlight: false,
  },
  {
    name: 'Basic',
    price: 'USD 249/year',
    features: [
      'Schedule and pricing management',
      'Professional profile',
      'Secure payments and cancellation protection',
      '10% commission',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'USD 499/year',
    features: ['Lower commission (7.2%)', 'More resorts and disciplines', 'Priority with partners', 'Boosted ranking'],
    highlight: true,
  },
];

export default function InstructorLandingEN() {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const enUrl = `${origin}/en/instructor`;
  const esUrl = `${origin}/instructor`;
  const CONTACT_EMAIL = 'office@snowmatch.pro';
  const WHATSAPP_NUMBER = '5492944263223';
  const [contactOpen, setContactOpen] = useState(false);

  const handleOpenContact = () => setContactOpen(true);
  const handleCloseContact = () => setContactOpen(false);
  const handleEmail = () => {
    const subject = 'Instructor program inquiry';
    const body = `Hi Snowmatch team, I would like to talk about the instructor program.\nPage: ${pageUrl}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const handleWhatsApp = () => {
    const message = `Hi Snowmatch team, I would like to talk about the instructor program.\nPage: ${pageUrl}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Become an independent instructor | Snowmatch</title>
        <meta
          name="description"
          content="Join our independent instructor community. Set prices, manage availability, and connect with new clients."
        />
        <link rel="canonical" href={enUrl} />
        <link rel="alternate" hrefLang="en" href={enUrl} />
        <link rel="alternate" hrefLang="es" href={esUrl} />
        <link rel="alternate" hrefLang="x-default" href={enUrl} />
        <meta property="og:title" content="Become an independent instructor | Snowmatch" />
        <meta property="og:description" content="Set your prices and availability. Connect with new clients from your phone." />
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
                <Button size="small" color="inherit" href="/instructor" variant="text">
                  ES
                </Button>
                <Button size="small" color="inherit" href="/en/instructor" variant="contained">
                  EN
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
                  Carve your own future
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                  Join as an independent instructor and connect with new clients.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large" href="/auth/register">
                    Get started
                  </Button>
                  <Button variant="outlined" size="large" color="inherit" href="#benefits">
                    See benefits
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Card sx={{ bgcolor: 'grey.800', color: 'common.white' }}>
                  <CardContent>
                    <Typography variant="overline" sx={{ opacity: 0.72 }}>
                      Income estimator
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                      Up to USD 30,000 per season
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.72 }}>
                      Earnings depend on resort, availability, experience and demand. Optimize your profile to improve your ranking.
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
            The platform for independent instructors
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
              How it works
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
            Plans to grow at your pace
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
                      Choose
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
              Frequently asked questions
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} mx="auto">
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">Who can sign up as an instructor?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      Certified ski or snowboard instructors with appropriate coverage and permission to work in their resort.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">How much does it cost?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      You can start for free with the Lite plan. Paid plans reduce commission and add benefits.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">How do cancellations work?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      Set your own policy. If a client cancels close to the lesson date, you get paid as per your conditions.
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
                    Ready to start?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Create your profile in minutes and start getting new clients this season.
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
                      Create my profile
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={handleOpenContact}
                      sx={{
                        width: { xs: '100%', md: 'auto' },
                        px: 3.5,
                        py: 1.25,
                        borderRadius: 2,
                        fontWeight: 700,
                        borderWidth: 2,
                      }}
                    >
                      Talk to the team
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>

        {/* Contact Modal */}
        <Dialog open={contactOpen} onClose={handleCloseContact} fullWidth maxWidth="xs">
          <DialogTitle>Talk to the team</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Button variant="contained" startIcon={<EmailIcon />} onClick={handleEmail} size="large">
                Email
              </Button>
              <Button variant="outlined" startIcon={<WhatsAppIcon />} onClick={handleWhatsApp} size="large">
                WhatsApp
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseContact}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

