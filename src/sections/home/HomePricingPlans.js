import PropTypes from 'prop-types';
import { m } from 'framer-motion';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Grid, Card, Stack, Button, Container, Typography, Chip } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import { varFade, MotionViewport } from '../../components/animate';
// hooks
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundColor: theme.palette.background.neutral,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}));

// ----------------------------------------------------------------------

export default function HomePricingPlans() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { translate: t } = useLocales();

  const handleWhatsAppClick = (message) => {
    const phoneNumber = '+5492944703443';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get plans from translations
  const plans = [
    {
      name: t('pricingPlans.plans.singleVideo.name'),
      price: t('pricingPlans.plans.singleVideo.price'),
      period: t('pricingPlans.plans.singleVideo.period'),
      description: t('pricingPlans.plans.singleVideo.description'),
      popular: false,
      whatsappMessage: t('pricingPlans.plans.singleVideo.whatsappMessage'),
    },
    {
      name: t('pricingPlans.plans.tenVideos.name'),
      price: t('pricingPlans.plans.tenVideos.price'),
      period: t('pricingPlans.plans.tenVideos.period'),
      description: t('pricingPlans.plans.tenVideos.description'),
      popular: true,
      whatsappMessage: t('pricingPlans.plans.tenVideos.whatsappMessage'),
    },
    {
      name: t('pricingPlans.plans.hundredVideos.name'),
      price: t('pricingPlans.plans.hundredVideos.price'),
      period: t('pricingPlans.plans.hundredVideos.period'),
      description: t('pricingPlans.plans.hundredVideos.description'),
      popular: false,
      whatsappMessage: t('pricingPlans.plans.hundredVideos.whatsappMessage'),
    },
  ];


  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <m.div variants={varFade().inUp}>
            <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
              {t('pricingPlans.title')}
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              {t('pricingPlans.subtitle')}
            </Typography>
          </m.div>
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{
                color: isLight ? 'text.secondary' : 'text.primary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              {t('pricingPlans.description')}
            </Typography>
          </m.div>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan, index) => (
            <Grid key={plan.name} item xs={12} sm={6} lg={4}>
              <m.div variants={varFade().inUp}>
                <PlanCard plan={plan} onWhatsAppClick={handleWhatsAppClick} />
              </m.div>
            </Grid>
          ))}
        </Grid>

        <m.div variants={varFade().in}>
          <Box sx={{ p: 5, mt: 10, textAlign: 'center' }}>
            <m.div variants={varFade().inDown}>
              <Typography variant="h3">{t('pricingPlans.contactTitle')}</Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography sx={{ mt: 3, mb: 5, color: 'text.secondary' }}>
                {t('pricingPlans.contactSubtitle')}
              </Typography>
            </m.div>

            <m.div variants={varFade().inUp}>
              <Button
                size="large"
                variant="contained"
                onClick={() => handleWhatsAppClick(t('pricingPlans.contactMessage'))}
                startIcon={<Iconify icon="logos:whatsapp-icon" />}
                sx={{
                  backgroundColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#128C7E',
                  },
                }}
              >
                {t('pricingPlans.contactButton')}
              </Button>
            </m.div>
          </Box>
        </m.div>
      </Container>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

PlanCard.propTypes = {
  plan: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    period: PropTypes.string,
    description: PropTypes.string,
    popular: PropTypes.bool,
    whatsappMessage: PropTypes.string,
  }),
  onWhatsAppClick: PropTypes.func,
};

function PlanCard({ plan, onWhatsAppClick }) {
  const { name, price, period, description, popular, whatsappMessage } = plan;
  const { translate: t } = useLocales();
  

  return (
    <Card
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: popular ? (theme) => theme.customShadows.z24 : 0,
        border: popular ? 2 : 1,
        borderColor: popular ? 'primary.main' : 'divider',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows.z20,
        },
      }}
    >
      {popular && (
        <Chip
          label={t('pricingPlans.popular')}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 600,
          }}
        />
      )}

      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography variant="h3" component="span">
              {typeof price === 'number' ? `$${price}` : price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              /{period}
            </Typography>
          </Box>
        </Box>


        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            size="large"
            fullWidth
            variant="contained"
            onClick={() => onWhatsAppClick(whatsappMessage)}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {t('pricingPlans.subscribe')}
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}