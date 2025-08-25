import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Alert,
  Divider,
  InputAdornment,
} from '@mui/material';
import { ArrowBack, CreditCard, Apple, Payment } from '@mui/icons-material';

// ----------------------------------------------------------------------

const paymentMethods = [
  {
    id: 'credit-card',
    label: 'Tarjeta de crédito/débito',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
  },
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    icon: Apple,
    description: 'Pago rápido y seguro',
  },
  {
    id: 'mercadopago',
    label: 'Mercado Pago',
    icon: Payment,
    description: 'Transferencia, efectivo, cuotas',
  },
];

const months = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12'
];

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

// ----------------------------------------------------------------------

export default function PaymentForm({ total, onSubmit, onBack, deliveryData, ridersData, items }) {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCardDataChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit-card') {
      if (!cardData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      if (!cardData.cardholderName.trim()) {
        newErrors.cardholderName = 'Nombre del titular es requerido';
      }
      if (!cardData.expiryMonth) {
        newErrors.expiryMonth = 'Mes requerido';
      }
      if (!cardData.expiryYear) {
        newErrors.expiryYear = 'Año requerido';
      }
      if (!cardData.cvv.match(/^\d{3,4}$/)) {
        newErrors.cvv = 'CVV inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateWhatsAppMessage = () => {
    const reservationNumber = `SNW-${Date.now().toString().slice(-6)}`;
    
    let message = `🏂 *NUEVA RESERVA DE EQUIPOS - Snowmatch*\n\n`;
    message += `📋 *Número de reserva:* ${reservationNumber}\n\n`;
    
    // Delivery information
    if (deliveryData) {
      message += `📍 *DATOS DE ENTREGA:*\n`;
      message += `• Nombre: ${deliveryData.name}\n`;
      message += `• Teléfono: ${deliveryData.phone}\n`;
      message += `• Email: ${deliveryData.email}\n`;
      message += `• Dirección: ${deliveryData.address}\n`;
      message += `• Fecha de entrega: ${deliveryData.deliveryDate}\n`;
      message += `• Hora de entrega: ${deliveryData.deliveryTime}\n`;
      message += `• Fecha de devolución: ${deliveryData.pickupDate}\n`;
      message += `• Hora de devolución: ${deliveryData.pickupTime}\n\n`;
    }
    
    // Riders information
    if (ridersData && ridersData.length > 0) {
      message += `👥 *INFORMACIÓN DE RIDERS:*\n`;
      ridersData.forEach((rider, index) => {
        message += `*Rider ${index + 1}:*\n`;
        message += `• Nombre: ${rider.name}\n`;
        message += `• Edad: ${rider.age} años\n`;
        message += `• Nivel: ${rider.level}\n`;
        message += `• Altura: ${rider.height}cm\n`;
        message += `• Peso: ${rider.weight}kg\n`;
        message += `• Talle de pie: ${rider.shoeSize}\n\n`;
      });
    }
    
    // Equipment details
    if (items && items.length > 0) {
      message += `🎿 *EQUIPOS SOLICITADOS:*\n`;
      items.forEach((item, index) => {
        message += `*Equipo ${index + 1}:*\n`;
        message += `• ${item.title}\n`;
        message += `• Tamaño: ${item.size}cm\n`;
        message += `• Bota: ${item.bootSize} ${item.bootSizeSystem}\n`;
        message += `• Precio: $${item.price}\n\n`;
      });
    }
    
    message += `💰 *TOTAL A PAGAR:* $${total}\n\n`;
    message += `📞 *Contacto:* +54 9 2944 26-3223\n`;
    message += `🌐 *Web:* www.snowmatch.com`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5492944263223?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        method: paymentMethod,
        cardData: paymentMethod === 'credit-card' ? cardData : null,
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Método de pago
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Tus datos de pago están protegidos con encriptación SSL de 256 bits.
      </Alert>

      <Stack spacing={3}>
        {/* Payment Method Selection */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
            Selecciona tu método de pago
          </FormLabel>
          
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => handlePaymentMethodChange(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <FormControlLabel
                key={method.id}
                value={method.id}
                control={<Radio />}
                label={
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <method.icon />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {method.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {method.description}
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{
                  border: '1px solid',
                  borderColor: paymentMethod === method.id ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 2,
                  mb: 1,
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              />
            ))}
          </RadioGroup>
        </Card>

        {/* Credit Card Form */}
        {paymentMethod === 'credit-card' && (
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Información de la tarjeta
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número de tarjeta"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardDataChange('cardNumber', formatCardNumber(e.target.value))}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del titular"
                  value={cardData.cardholderName}
                  onChange={(e) => handleCardDataChange('cardholderName', e.target.value)}
                  error={!!errors.cardholderName}
                  helperText={errors.cardholderName}
                  placeholder="Como aparece en la tarjeta"
                  required
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.expiryMonth}>
                  <InputLabel>Mes</InputLabel>
                  <Select
                    value={cardData.expiryMonth}
                    onChange={(e) => handleCardDataChange('expiryMonth', e.target.value)}
                    label="Mes"
                  >
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth error={!!errors.expiryYear}>
                  <InputLabel>Año</InputLabel>
                  <Select
                    value={cardData.expiryYear}
                    onChange={(e) => handleCardDataChange('expiryYear', e.target.value)}
                    label="Año"
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  value={cardData.cvv}
                  onChange={(e) => handleCardDataChange('cvv', e.target.value.replace(/\D/g, ''))}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  placeholder="123"
                  required
                />
              </Grid>
            </Grid>
          </Card>
        )}

        {/* Other Payment Methods */}
        {paymentMethod !== 'credit-card' && (
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {paymentMethod === 'apple-pay' ? 'Apple Pay' : 'Mercado Pago'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {paymentMethod === 'apple-pay' 
                ? 'Serás redirigido a Apple Pay para completar el pago de forma segura.'
                : 'Serás redirigido a Mercado Pago donde podrás elegir tu método de pago preferido.'
              }
            </Typography>
          </Card>
        )}

        {/* Total */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Total a pagar:
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              ${total}
            </Typography>
          </Stack>
        </Card>

        {/* Navigation */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ py: 1.5, px: 4, borderRadius: 2 }}
          >
            Atrás
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleWhatsAppClick}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Continuar al pago
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
} 