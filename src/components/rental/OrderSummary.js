import {
  Box,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { useRentalCart } from '../../contexts/RentalCartContext';

// ----------------------------------------------------------------------

export default function OrderSummary({ deliveryData, ridersData, onBack, onNext, items: cartItems }) {
  const { items, upsells, getTotal, getDaysCount } = useRentalCart();
  
  const total = getTotal();
  const daysCount = getDaysCount();
  const discount = daysCount >= 3 ? total * 0.1 : 0;
  const finalTotal = total - discount;

  const generateWhatsAppMessage = () => {
    const reservationNumber = `SNW-${Date.now().toString().slice(-6)}`;
    
    let message = `🏂 *NUEVA RESERVA DE EQUIPOS - Snowmatch*\n\n`;
    message += `📋 *Número de reserva:* ${reservationNumber}\n\n`;
    
    // Delivery information
    if (deliveryData) {
      message += `📍 *DATOS DE ENTREGA:*\n`;
      message += `• Nombre: ${deliveryData.fullName}\n`;
      message += `• Teléfono: ${deliveryData.phone}\n`;
      message += `• Email: ${deliveryData.email}\n`;
      message += `• Dirección: ${deliveryData.address}\n`;
      if (deliveryData.accommodation) {
        message += `• Alojamiento: ${deliveryData.accommodation}\n`;
      }
      if (deliveryData.reference) {
        message += `• Referencia: ${deliveryData.reference}\n`;
      }
      message += `• Horario de entrega: ${deliveryData.timeWindow}\n\n`;
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
    
    message += `💰 *TOTAL A PAGAR:* $${finalTotal}\n\n`;
    message += `📞 *Contacto:* +54 9 2944 26-3223\n`;
    message += `🌐 *Web:* www.snowmatch.com`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5492944263223?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Resumen de la orden
      </Typography>

      <Stack spacing={3}>
        {/* Delivery Information */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Información de entrega
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Nombre
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {deliveryData.fullName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {deliveryData.email}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Teléfono
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {deliveryData.phone}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Horario de entrega
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {deliveryData.timeWindow}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Dirección
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {deliveryData.address}
              </Typography>
              {deliveryData.accommodation && (
                <Typography variant="body2" color="text.secondary">
                  {deliveryData.accommodation}
                </Typography>
              )}
              {deliveryData.reference && (
                <Typography variant="body2" color="text.secondary">
                  Ref: {deliveryData.reference}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Card>

        {/* Riders Information */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Información de riders
          </Typography>
          
          <Stack spacing={2}>
            {ridersData.map((rider, index) => (
              <Box key={index}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {rider.name}
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  <Chip label={`${rider.height}cm`} size="small" variant="outlined" />
                  <Chip label={`${rider.weight}kg`} size="small" variant="outlined" />
                  <Chip label={`Pie: ${rider.footSize} ${rider.footSizeSystem}`} size="small" variant="outlined" />
                  <Chip label={rider.level} size="small" color="primary" />
                  {rider.style && <Chip label={rider.style} size="small" variant="outlined" />}
                  {rider.flexPreference && <Chip label={rider.flexPreference} size="small" variant="outlined" />}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Items */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Equipos alquilados
          </Typography>
          
          <Stack spacing={2}>
            {items.map((item, index) => (
              <Box key={index}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.size}cm • Bota {item.bootSize} {item.bootSizeSystem}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {item.includes.map((include) => (
                        <Chip key={include} label={include} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${item.price}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>

          {upsells.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Extras:
              </Typography>
              <Stack spacing={1}>
                {upsells.map((upsell) => (
                  <Stack key={upsell.id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {upsell.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${upsell.price}{upsell.pricePerDay ? '/día' : ''}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </Card>

        {/* Policies */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Políticas y términos
          </Typography>
          
          <Stack spacing={2}>
            <Alert severity="info" icon={<CheckCircle />}>
              <Typography variant="body2">
                <strong>Política de cancelación:</strong> Puedes cancelar hasta 24 horas antes de la entrega sin cargo.
              </Typography>
            </Alert>
            
            <Alert severity="info" icon={<CheckCircle />}>
              <Typography variant="body2">
                <strong>Cambios sin costo:</strong> Incluimos cambios de equipo durante tu estadía.
              </Typography>
            </Alert>
            
            <Alert severity="info" icon={<CheckCircle />}>
              <Typography variant="body2">
                <strong>Soporte en pista:</strong> Asistencia técnica disponible en el cerro.
              </Typography>
            </Alert>
          </Stack>
        </Card>

        {/* Total */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Total a pagar
          </Typography>
          
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">${total}</Typography>
            </Stack>
            
            {discount > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" color="success.main">
                  Descuento ({daysCount}+ días):
                </Typography>
                <Typography variant="body1" color="success.main">
                  -${discount}
                </Typography>
              </Stack>
            )}
            
            <Divider />
            
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Total:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ${finalTotal}
              </Typography>
            </Stack>
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
            endIcon={<ArrowForward />}
            onClick={handleWhatsAppClick}
            sx={{
              py: 1.5,
              px: 4,
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