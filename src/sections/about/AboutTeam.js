import { useState } from 'react';
import { m } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { MotionViewport, varFade } from '../../components/animate';
import useLocales from '../../hooks/useLocales';

// Image files: add under public/assets/team/ using these basenames (webp, jpg, jpeg, or png).
const TEAM_ROWS = [
  { slug: 'tomas-bacigalupo', i18nKey: 'tomasBacigalupo' },
  { slug: 'juan-manuel-faccio', i18nKey: 'juanManuelFaccio' },
  { slug: 'maricu-manzano', i18nKey: 'maricuManzano' },
  { slug: 'mathias-pinna', i18nKey: 'mathiasPinna' },
  { slug: 'danisa', i18nKey: 'danisa' },
  { slug: 'tomas-soleno', i18nKey: 'tomasSoleno' },
  { slug: 'fede-marcachini', i18nKey: 'fedeMarcachini' },
  { slug: 'mati-marcachini', i18nKey: 'matiMarcachini' },
  { slug: 'juana-pinedo', i18nKey: 'juanaPinedo' },
  { slug: 'coco-evia', i18nKey: 'cocoEvia' },
  { slug: 'juana-castro-sicneros', i18nKey: 'juanaCastroSicneros' },
];

// ----------------------------------------------------------------------

const RootStyle = styled('section')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  backgroundColor: theme.palette.background.paper,
}));

const MemberCard = styled(Card)(({ theme }) => ({
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

const RoleChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  '& .MuiChip-label': {
    paddingLeft: 12,
    paddingRight: 12,
  },
}));

function initialsFromName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function TeamAvatar({ slug, name }) {
  const variants = ['webp', 'jpg', 'jpeg', 'png'].map((ext) => `/assets/team/${slug}.${ext}`);
  const [index, setIndex] = useState(0);
  const src = index < variants.length ? variants[index] : undefined;

  return (
    <Avatar
      src={src}
      alt={name}
      imgProps={{
        onError: () => setIndex((i) => i + 1),
      }}
      sx={{
        width: 120,
        height: 120,
        border: '3px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        fontSize: '2rem',
        fontWeight: 700,
      }}
    >
      {initialsFromName(name)}
    </Avatar>
  );
}

function MemberCardContent({ slug, name, role, subtitle, bio }) {
  return (
    <CardContent sx={{ p: 4, height: '100%' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
        <TeamAvatar slug={slug} name={name} />

        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          {role ? (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <RoleChip label={role} />
            </Stack>
          ) : null}

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              mb: 0.5,
              fontSize: { xs: '1.35rem', md: '1.75rem' },
            }}
          >
            {name}
          </Typography>

          {subtitle ? (
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 2,
                fontWeight: 400,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              {subtitle}
            </Typography>
          ) : null}

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6, fontSize: '1rem' }}>
            {bio}
          </Typography>
        </Box>
      </Stack>
    </CardContent>
  );
}

// ----------------------------------------------------------------------

export default function AboutTeam() {
  const { translate } = useLocales();

  const members = TEAM_ROWS.map(({ slug, i18nKey }) => {
    const base = `aboutPage.team.members.${i18nKey}`;
    return {
      slug,
      name: translate(`${base}.name`),
      role: translate(`${base}.role`),
      subtitle: translate(`${base}.subtitle`),
      bio: translate(`${base}.bio`),
    };
  });

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box component={m.div} variants={varFade().inDown} sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
            }}
          >
            {translate('aboutPage.team.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              maxWidth: 640,
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            {translate('aboutPage.team.subtitle')}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {members.map((member) => (
            <Grid key={member.slug} item xs={12} md={6}>
              <MemberCard component={m.div} variants={varFade().inUp}>
                <MemberCardContent {...member} />
              </MemberCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </RootStyle>
  );
}
