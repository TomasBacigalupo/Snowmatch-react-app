// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Box, Grid, Card, Stack } from '@mui/material';
// components
import Page from '../components/Page';
import { ContactForm } from '../sections/contact';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: '#f8fafc',
  minHeight: '100vh',
}));

const InfoCardStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  backgroundColor: '#ffffff',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
  },
}));

const InfoItemStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: '#f8fafc',
  marginBottom: theme.spacing(2),
}));

// ----------------------------------------------------------------------

export default function Contact() {
  const contactInfo = [
    {
      icon: 'eva:phone-fill',
      title: 'Teléfono',
      description: 'Llamanos directamente',
      value: '+54 9 294 470 3443',
      color: '#25D366',
    },
    {
      icon: 'eva:email-fill',
      title: 'Email',
      description: 'Envíanos un correo',
      value: 'office@snowmatch.pro',
      color: '#1890FF',
    },
    {
      icon: 'eva:clock-fill',
      title: 'Horarios',
      description: 'Disponibilidad',
      value: 'Lun - Vie: 9:00 - 18:00',
      color: '#3366FF',
    },
    {
      icon: 'eva:pin-fill',
      title: 'Ubicación',
      description: 'Estamos en Argentina',
      value: 'San Carlos de Bariloche',
      color: '#1890FF',
    },
  ];

  return (
    <Page title="Contacto - SnowMatch">
      <RootStyle>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h2" fontWeight={700} color="text.primary" gutterBottom>
              ¿Cómo podemos ayudarte?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Elige la forma que prefieras para contactarnos. Estamos aquí para resolver todas tus dudas sobre clases de ski y snowboard.
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} lg={8}>
              <ContactForm />
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <InfoCardStyle>
                  <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
                    Información de contacto
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Puedes contactarnos de diferentes maneras
                  </Typography>
                  
                  {contactInfo.map((info, index) => (
                    <InfoItemStyle key={index}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: info.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify 
                          icon={info.icon} 
                          width={20} 
                          sx={{ color: 'white' }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          {info.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {info.description}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="primary.main">
                          {info.value}
                        </Typography>
                      </Box>
                    </InfoItemStyle>
                  ))}
                </InfoCardStyle>

                <InfoCardStyle>
                  <Typography variant="h6" fontWeight={600} color="text.primary" gutterBottom>
                    Respuesta rápida
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Iconify icon="eva:checkmark-circle-2-fill" width={16} sx={{ mr: 1, color: '#25D366' }} />
                    WhatsApp: Respuesta inmediata
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Iconify icon="eva:checkmark-circle-2-fill" width={16} sx={{ mr: 1, color: '#25D366' }} />
                    Email: Respuesta en 24 horas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Iconify icon="eva:checkmark-circle-2-fill" width={16} sx={{ mr: 1, color: '#25D366' }} />
                    Teléfono: Lunes a Viernes
                  </Typography>
                </InfoCardStyle>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
