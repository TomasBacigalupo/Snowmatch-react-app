import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import {
  LocalShipping,
  Person,
  Receipt,
  CheckCircle,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useRentalCart } from '../../contexts/RentalCartContext';
import DeliveryForm from '../../components/rental/DeliveryForm';
import RiderForm from '../../components/rental/RiderForm';
import OrderSummary from '../../components/rental/OrderSummary';
import useAuth from '../../hooks/useAuth';
import Login from '../auth/Login';

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Datos de entrega',
    icon: LocalShipping,
    description: 'Dirección y contacto',
  },
  {
    label: 'Talles y perfil',
    icon: Person,
    description: 'Información de riders',
  },
  {
    label: 'Resumen',
    icon: Receipt,
    description: 'Revisar pedido',
  },
];

// ----------------------------------------------------------------------

export default function RentalCheckout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { items, getTotal, getDaysCount, clearCart } = useRentalCart();
  const { isAuthenticated } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryData, setDeliveryData] = useState({});
  const [ridersData, setRidersData] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const total = getTotal();
  const daysCount = getDaysCount();
  const discount = daysCount >= 3 ? total * 0.1 : 0;
  const finalTotal = total - discount;

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && loginModalOpen && pendingAction) {
      setLoginModalOpen(false);
      // Execute the pending action
      if (pendingAction.type === 'delivery') {
        setDeliveryData(pendingAction.data);
        setActiveStep(1);
      } else if (pendingAction.type === 'riders') {
        setRidersData(pendingAction.data);
        setActiveStep(2);
      } else if (pendingAction.type === 'next') {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
      setPendingAction(null);
    }
  }, [isAuthenticated, loginModalOpen, pendingAction, clearCart]);

  const handleNext = () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      setPendingAction({ type: 'next' });
      setLoginModalOpen(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDeliverySubmit = (data) => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      setPendingAction({ type: 'delivery', data });
      setLoginModalOpen(true);
      return;
    }
    setDeliveryData(data);
    handleNext();
  };

  const handleRidersSubmit = (data) => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      setPendingAction({ type: 'riders', data });
      setLoginModalOpen(true);
      return;
    }
    setRidersData(data);
    handleNext();
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return Object.keys(deliveryData).length > 0;
      case 1:
        return ridersData.length > 0;
      case 2:
        return true;
      default:
        return false;
    }
  };

  if (items.length === 0 && !orderConfirmed) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info">
          No hay items en el carrito. <Button href="/rental">Volver al alquiler</Button>
        </Alert>
      </Container>
    );
  }

  if (orderConfirmed) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            ¡Reserva confirmada!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Tu número de reserva es: <strong>SNW-{Date.now().toString().slice(-6)}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Te hemos enviado un email con todos los detalles de tu reserva.
            Nuestro equipo se pondrá en contacto contigo para coordinar la entrega.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" size="large">
              Agregar a calendario
            </Button>
            <Button variant="contained" size="large">
              WhatsApp soporte
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Alquiler de Esquí | Snowmatch</title>
        <meta name="description" content="Completa tu reserva de alquiler de esquí" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
            Completar reserva
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Estás a un paso de tu próxima aventura
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Stepper */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Stepper
                activeStep={activeStep}
                orientation={isMobile ? 'vertical' : 'horizontal'}
                sx={{ mb: 4 }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      icon={<step.icon />}
                      optional={
                        <Typography variant="caption" color="text.secondary">
                          {step.description}
                        </Typography>
                      }
                    >
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Step Content */}
              <Box sx={{ mt: 4 }}>
                {activeStep === 0 && (
                  <DeliveryForm
                    initialData={deliveryData}
                    onSubmit={handleDeliverySubmit}
                  />
                )}
                
                {activeStep === 1 && (
                  <RiderForm
                    initialData={ridersData}
                    onSubmit={handleRidersSubmit}
                    onBack={handleBack}
                  />
                )}
                
                {activeStep === 2 && (
                  <OrderSummary
                    deliveryData={deliveryData}
                    ridersData={ridersData}
                    onBack={handleBack}
                    onNext={handleNext}
                    items={items}
                  />
                )}
                

              </Box>
            </Card>
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Resumen del pedido
              </Typography>

              <Stack spacing={2}>
                {items.map((item, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.size}cm • Bota {item.bootSize} {item.bootSizeSystem}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${item.price}
                      </Typography>
                    </Stack>
                  </Box>
                ))}

                <Divider />

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">${total}</Typography>
                  </Stack>
                  
                  {discount > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="success.main">
                        Descuento ({daysCount}+ días):
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        -${discount}
                      </Typography>
                    </Stack>
                  )}
                  
                  <Divider />
                  
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      ${finalTotal}
                    </Typography>
                  </Stack>
                </Stack>

                {daysCount >= 3 && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    ¡Ahorras ${discount} por alquilar {daysCount}+ días!
                  </Alert>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

              <Drawer
          anchor="bottom"
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: '90vh',
              maxHeight: '90vh',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 6, borderRadius: 3, bgcolor: 'grey.300' }} />
          </Box>
          <Login fromModal={true} />
        </Drawer>
    </>
  );
} 