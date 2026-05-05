import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LoginIcon from '@mui/icons-material/Login';
import PaymentsIcon from '@mui/icons-material/Payments';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Page from '../components/Page';
import { MotionContainer, MotionViewport, varFade } from '../components/animate';
import Iconify from '../components/Iconify';
import { PATH_AUTH, PATH_DASHBOARD, PATH_GUEST } from '../routes/paths';

const SCHOOL_FEATURES = [
  'AI-assisted lesson matching and scheduling',
  'Unified calendar for instructors, groups, and privates',
  'Admin review flows for bookings and intents',
  'Financial and operations dashboards built for ski schools',
];

const RENTAL_FEATURES = [
  'Streamlined gear applications and checkout',
  'Location-based catalogs and product pages',
  'Order visibility for your rental desk and admin team',
  'Integrated payment paths for deposits and balances',
];

export default function AdminPlatformIndex() {
  const theme = useTheme();

  return (
    <Page title="Snowmatch for schools & rentals">
      <Helmet>
        <meta
          name="description"
          content="Snowmatch admin platform for ski schools powered with AI and rental operations—bookings, gear, and teams in one place."
        />
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/index`} />
      </Helmet>

      <Box
        component="main"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'grey.900',
          color: 'common.white',
          minHeight: '70vh',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(theme.palette.info.main, 0.35)}, transparent),
              radial-gradient(ellipse 60% 40% at 100% 0%, ${alpha(theme.palette.secondary.main, 0.25)}, transparent),
              linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${alpha(theme.palette.grey[900], 0.97)} 40%, ${theme.palette.grey[900]} 100%)`,
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 8, md: 12 } }}>
          <MotionContainer sx={{ maxWidth: 720, mx: 'auto', mb: 6 }}>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Box component={m.div} variants={varFade().inUp}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ typography: 'overline', color: 'info.light' }}>
                  <Iconify icon="mdi:snowflake" width={20} />
                  <span>Admin platform</span>
                </Stack>
              </Box>

              <Box component={m.div} variants={varFade().inUp}>
                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  Snowmatch for{' '}
                  <Box component="span" sx={{ color: 'info.light' }}>
                    ski schools
                  </Box>{' '}
                  and{' '}
                  <Box component="span" sx={{ color: 'secondary.light' }}>
                    rentals
                  </Box>
                </Typography>
              </Box>

              <Box component={m.div} variants={varFade().inUp}>
                <Typography variant="h6" sx={{ color: alpha('#fff', 0.72), fontWeight: 400, maxWidth: 560 }}>
                  One place to run lessons with AI-powered workflows and to make rental applications easy—from first
                  inquiry to pickup on the snow.
                </Typography>
              </Box>

              <Box component={m.div} variants={varFade().inUp}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1, justifyContent: 'center' }}>
                  <Button
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    variant="contained"
                    size="large"
                    color="info"
                    startIcon={<LoginIcon />}
                    sx={{ px: 3, fontWeight: 700 }}
                  >
                    Sign in to admin
                  </Button>
                  <Button
                    component={RouterLink}
                    to={PATH_GUEST.rental}
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 3,
                      fontWeight: 700,
                      borderColor: alpha('#fff', 0.4),
                      color: 'common.white',
                      '&:hover': { borderColor: 'common.white', bgcolor: alpha('#fff', 0.06) },
                    }}
                  >
                    View rental experience
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </MotionContainer>

          <MotionViewport>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box component={m.div} variants={varFade().inUp}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: alpha(theme.palette.grey[800], 0.85),
                      border: `1px solid ${alpha('#fff', 0.08)}`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.info.main, 0.2),
                            color: 'info.light',
                          }}
                        >
                          <SchoolIcon fontSize="medium" />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          Ski schools, powered with AI
                        </Typography>
                      </Stack>

                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 2 }}>
                        Match students to the right offering, keep your team aligned, and reduce manual back-and-forth
                        with tooling built for snow sports operations.
                      </Typography>

                      <List dense disablePadding>
                        {SCHOOL_FEATURES.map((text) => (
                          <ListItem key={text} disableGutters sx={{ py: 0.5, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 36, color: 'info.light', mt: 0.25 }}>
                              <AutoAwesomeIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', sx: { color: alpha('#fff', 0.88) } }} />
                          </ListItem>
                        ))}
                      </List>

                      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 3 }}>
                        <ChipIcon icon={<PsychologyIcon sx={{ fontSize: 18 }} />} label="AI matching" />
                        <ChipIcon icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />} label="Scheduling" />
                        <ChipIcon icon={<DashboardIcon sx={{ fontSize: 18 }} />} label="Admin dashboards" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box component={m.div} variants={varFade().inUp}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: alpha(theme.palette.grey[800], 0.85),
                      border: `1px solid ${alpha('#fff', 0.08)}`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.secondary.main, 0.2),
                            color: 'secondary.light',
                          }}
                        >
                          <Inventory2Icon fontSize="medium" />
                        </Box>
                        <Typography variant="h5" fontWeight={700}>
                          Rentals, easy to apply
                        </Typography>
                      </Stack>

                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 2 }}>
                        Let guests choose gear and dates with a guided flow while your staff sees bookings, equipment,
                        and revenue in the same admin hub as lessons.
                      </Typography>

                      <List dense disablePadding>
                        {RENTAL_FEATURES.map((text) => (
                          <ListItem key={text} disableGutters sx={{ py: 0.5, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 36, color: 'secondary.light', mt: 0.25 }}>
                              <DownhillSkiingIcon sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', sx: { color: alpha('#fff', 0.88) } }} />
                          </ListItem>
                        ))}
                      </List>

                      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 3 }}>
                        <ChipIcon icon={<Inventory2Icon sx={{ fontSize: 18 }} />} label="Gear catalog" />
                        <ChipIcon icon={<PaymentsIcon sx={{ fontSize: 18 }} />} label="Payments" />
                        <ChipIcon icon={<SupportAgentIcon sx={{ fontSize: 18 }} />} label="Operations" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </MotionViewport>

          <MotionViewport>
            <Box component={m.div} variants={varFade().inUp}>
              <Stack
                alignItems="center"
                spacing={2}
                sx={{
                  mt: { xs: 6, md: 8 },
                  p: { xs: 3, md: 4 },
                  borderRadius: 2,
                  border: `1px solid ${alpha('#fff', 0.1)}`,
                  bgcolor: alpha(theme.palette.grey[800], 0.5),
                }}
              >
                <Typography variant="subtitle1" sx={{ color: alpha('#fff', 0.85), textAlign: 'center' }}>
                  Already part of Snowmatch? Open the dashboard for reviews, bookings, rental admin, and more.
                </Typography>
                <Button
                  component={RouterLink}
                  to={PATH_DASHBOARD.admin.review}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ fontWeight: 700 }}
                >
                  Go to admin dashboard
                </Button>
              </Stack>
            </Box>
          </MotionViewport>
        </Container>
      </Box>
    </Page>
  );
}

function ChipIcon({ icon, label }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      sx={{
        typography: 'caption',
        fontWeight: 600,
        color: alpha('#fff', 0.85),
        px: 1.25,
        py: 0.5,
        borderRadius: 10,
        bgcolor: (theme) => alpha(theme.palette.common.white, 0.08),
      }}
    >
      {icon}
      <span>{label}</span>
    </Stack>
  );
}
