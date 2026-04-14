import { m } from 'framer-motion';
// @mui
import { Box, Container, Typography, Grid } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';
import useLocales from '../../hooks/useLocales';

const VISION_IMAGE = '/assets/perito-moreno.png';

// ----------------------------------------------------------------------

export default function AboutVision() {
  const { translate } = useLocales();

  return (
    <Container component={MotionViewport} sx={{ mt: 10 }}>
      <Box
        sx={{
          mb: 10,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Image src={VISION_IMAGE} alt={translate('aboutPage.vision.imageAlt')} effect="black-and-white" />
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8}>
          <m.div variants={varFade().inUp}>
            <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 600, lineHeight: 1.35 }}>
              {translate('aboutPage.vision.quote')}
            </Typography>
          </m.div>
        </Grid>
      </Grid>
    </Container>
  );
}
