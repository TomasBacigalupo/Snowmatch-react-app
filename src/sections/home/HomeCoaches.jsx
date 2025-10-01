import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent, Container, Grid, Stack, Typography, Avatar, IconButton, Link, Tooltip, Chip } from '@mui/material';
import Iconify from '../../components/Iconify';
import { MotionViewport, varFade } from '../../components/animate';

const RootStyle = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  backgroundColor: theme.palette.background.paper,
}));

const CoachCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const RoleChip = styled(Chip)(({ theme, rolecolor }) => ({
  backgroundColor: rolecolor || theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': {
    paddingLeft: 12,
    paddingRight: 12,
  },
}));

function CoachCardContent({ photo, name, role, roleColor, subtitle, instagramHandle, bio }) {
  const instagramUrl = instagramHandle ? `https://www.instagram.com/${instagramHandle}` : undefined;

  return (
    <CardContent sx={{ p: 4, height: '100%' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
        <Avatar 
          src={photo} 
          alt={name} 
          sx={{ 
            width: 120, 
            height: 120,
            border: '3px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          }} 
        />

        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            {role && <RoleChip label={role} rolecolor={roleColor} />}
          </Stack>
          
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: 'text.primary', 
            mb: 0.5,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}>
            {name}
          </Typography>
          
          {subtitle && (
            <Typography variant="h6" sx={{ 
              color: 'text.secondary', 
              mb: 2,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}>
              {subtitle}
            </Typography>
          )}

          <Stack direction="row" spacing={1} sx={{ mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            {instagramUrl && (
              <Link href={instagramUrl} target="_blank" rel="noopener" aria-label={`${name} Instagram`} underline="none">
                <Tooltip title="Instagram" placement="top">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { 
                        backgroundColor: 'action.hover',
                        color: 'primary.main'
                      }
                    }}
                  >
                    <Iconify icon="ant-design:instagram-filled" sx={{ width: 20, height: 20 }} />
                  </IconButton>
                </Tooltip>
              </Link>
            )}
          </Stack>

          <Typography variant="body1" sx={{ 
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}>
            {bio}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  );
}

export default function HomeCoaches() {
  const coaches = [
    {
      photo: '/assets/avatars/avatar_1.png',
      name: 'Tomas Bacigalupo',
      role: 'FOUNDER',
      roleColor: undefined, // Usará el color primario del tema
      subtitle: 'Alpine Skier',
      instagramHandle: 'snow.match',
      bio:
        'Tomas es el fundador de Snowmatch, corredor de esquí alpino. Participó en los Juegos Olímpicos de la Juventud y está a cargo del desarrollo y el entrenamiento de Snow, tu instructor IA.',
    },
    {
      photo: '/assets/avatars/avatar_2.png',
      name: 'Tomas Soleño',
      role: 'LEAD COACH',
      roleColor: undefined, // Usará el color primario del tema
      subtitle: 'Instructor Nivel 5 · Guía de pesca Patagonia',
      instagramHandle: undefined,
      bio:
        'Guía de pesca en la Patagonia y profesor de esquí en Japón, Argentina y Estados Unidos. Está a cargo de las correcciones.',
    },
  ];

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box component={m.div} variants={varFade().inDown} sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 800, 
            color: 'text.primary',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            mb: 2
          }}>
            Meet your coaches
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            fontWeight: 400
          }}>
            Conocé a las personas detrás de Snowmatch.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {coaches.map((coach) => (
            <Grid key={coach.name} item xs={12} md={6}>
              <CoachCard component={m.div} variants={varFade().inUp}>
                <CoachCardContent {...coach} />
              </CoachCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}


