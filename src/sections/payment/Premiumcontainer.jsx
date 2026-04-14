import { useState } from 'react';
import {
  SwipeableDrawer,
  Button,
  Box,
  Typography,
  Stack,
  Radio,
  RadioGroup,
  Card,
  CardContent,
  AvatarGroup,
  Avatar,
  Grid,
  CircularProgress,
} from '@mui/material';
import useLocales from 'src/hooks/useLocales';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { snowmatchBookingWhatsAppUrl } from 'src/utils/snowmatchWhatsApp';

const productIds = ['pro.snowmatch.oneshot', 'pro.snowmatch.progress', 'pro.videos.hundred'];

const memberships = [
  {
    id: 'pro.snowmatch.oneshot',
    name: 'Single Shot',
    price: '$10 USD',
    benefits: [
      '📹 1 corrección de video por un experto',
      '🧠 Snowmatch Intelligence',
      '🎯 Perfecto para probar la experiencia',
    ],
  },
  {
    id: 'pro.snowmatch.progress',
    name: 'Progress Pack',
    price: '$50 USD',
    benefits: [
      '📹 10 correcciones de video para mejorar progresivamente',
      '🧠 Snowmatch Intelligence',
      '🔥 Desbloquea tu siguiente nivel de esquí',
    ],
  },
  {
    id: 'pro.videos.hundred',
    name: 'Master Pack',
    price: '$100 USD',
    benefits: [
      '📹 100 correcciones de video para un entrenamiento intensivo',
      '🧠 Snowmatch Intelligence',
      '🥇 Acceso exclusivo a contenido premium',
    ],
  },
];

const PremiumContainer = () => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { translate } = useLocales();
  const [selectedMembership, setSelectedMembership] = useState(productIds[0]);

  const openWhatsAppForPlan = () => {
    const name = translate(`memberships.${selectedMembership}.name`);
    const text = `Hola, me gustaría comprar el paquete: ${name} (${selectedMembership})`;
    window.open(snowmatchBookingWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
  };

  const handlePaymentConfirm = async () => {
    setPaymentLoading(true);
    try {
      openWhatsAppForPlan();
    } finally {
      setPaymentLoading(false);
      setShowPaymentDialog(false);
    }
  };

  const handleSelect = (id) => {
    setSelectedMembership(id);
    setShowPaymentDialog(true);
  };

  return (
    <Grid container direction="row" alignItems="center" px={2} pt={1}>
      <Grid item xs={12}>
        <Stack direction="column" alignItems="center" spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 48, height: 48, border: '2px solid white' } }}>
              <Avatar src="/assets/pro/1.png" />
              <Avatar src="/assets/pro/2.png" />
              <Avatar src="/assets/pro/3.png" />
            </AvatarGroup>
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {translate('reviewRequestBox.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {translate('reviewRequestBox.subtitle')}
          </Typography>
          <Box width="100%">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <RadioGroup
                sx={{ width: '100%' }}
                value={selectedMembership}
                onChange={(e) => setSelectedMembership(e.target.value)}
              >
                {memberships.map((membership) => {
                  const isEnabled = true;
                  return (
                    <Card
                      key={membership.id}
                      sx={{
                        mb: 2,
                        width: '100%',
                        borderRadius: 2,
                        border:
                          selectedMembership === membership.id && isEnabled
                            ? '2px solid #1976d2'
                            : '2px solid transparent',
                        transition: '0.3s',
                        opacity: isEnabled ? 1 : 0.6,
                        position: 'relative',
                        '&:hover': isEnabled ? { boxShadow: 3 } : {},
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSelect(membership.id)}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Radio sx={{ display: 'none' }} value={membership.id} disabled={!isEnabled} />
                          <Box sx={{ flexGrow: 1, pl: 1 }}>
                            <Typography variant="h6">
                              {translate(`memberships.${membership.id}.name`)}{' '}
                              <Typography component="span" color="textSecondary">
                                ({membership.price})
                              </Typography>
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                              {membership.benefits.map((benefit, idx) => (
                                <Typography key={benefit} variant="body2" component="li">
                                  {translate(`memberships.${membership.id}.benefits.${idx + 1}`)}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                        {!isEnabled && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'rgba(0,0,0,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="body1" color="white" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                              Próximamente
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </RadioGroup>
            </Box>
          </Box>
        </Stack>
      </Grid>

      <SwipeableDrawer
        anchor="bottom"
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onOpen={() => setShowPaymentDialog(true)}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            pb: 'env(safe-area-inset-bottom)',
            pt: 'env(safe-area-inset-top)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {translate('premiumVideoPlans.paymentMethodTitle')}
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={handlePaymentConfirm}
              disabled={paymentLoading}
              sx={{ py: 1.5, bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
            >
              {paymentLoading ? <CircularProgress size={24} color="inherit" /> : translate('premiumVideoPlans.continueOnWhatsApp')}
            </Button>
            <Button variant="outlined" onClick={() => setShowPaymentDialog(false)} sx={{ mt: 1 }}>
              {translate('premiumVideoPlans.cancel')}
            </Button>
          </Stack>
        </Box>
      </SwipeableDrawer>
    </Grid>
  );
};

export default PremiumContainer;
