import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// components
import { MotionContainer, varFade } from '../../components/animate';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

const HERO_IMAGE = '/assets/bariloche.webp';

const RootStyle = styled('div')(({ theme }) => ({
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: `linear-gradient(to right, ${theme.palette.grey[900]}CC 0%, ${theme.palette.grey[900]}66 50%, transparent 100%), url(${HERO_IMAGE})`,
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    minHeight: 520,
    padding: 0,
    display: 'flex',
    alignItems: 'flex-end',
  },
}));

const ContentStyle = styled('div')(({ theme }) => ({
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
    paddingBottom: theme.spacing(10),
  },
}));

// ----------------------------------------------------------------------

export default function AboutHero() {
  const { translate } = useLocales();

  return (
    <RootStyle>
      <Container component={MotionContainer} sx={{ position: 'relative', height: '100%', width: 1 }}>
        <ContentStyle>
          <m.div variants={varFade().inUp}>
            <Typography
              variant="h1"
              sx={{
                color: 'primary.main',
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.15,
              }}
            >
              {translate('aboutPage.hero.headline')}
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              variant="h5"
              sx={{
                mt: 3,
                color: 'common.white',
                fontWeight: 400,
                maxWidth: 560,
                mx: { xs: 'auto', md: 0 },
                lineHeight: 1.5,
              }}
            >
              {translate('aboutPage.hero.subheadline')}
            </Typography>
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
