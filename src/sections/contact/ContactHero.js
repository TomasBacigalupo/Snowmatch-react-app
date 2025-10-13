import { m } from 'framer-motion';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Container, Typography, Stack, Card, Grid, Chip } from '@mui/material';
// hooks
import useLocales from '../../hooks/useLocales';
// components
import { TextAnimate, MotionContainer, varFade } from '../../components/animate';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #1890FF 0%, #3366FF 100%)',
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(8, 0),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
  },
}));

const ContentStyle = styled(Stack)(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  maxWidth: '900px',
  mx: 'auto',
  position: 'relative',
  zIndex: 2,
}));

const ContactCardStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginTop: theme.spacing(4),
}));

const ContactItemStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: 'rgba(24, 144, 255, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(24, 144, 255, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

// ----------------------------------------------------------------------

export default function ContactHero() {
  const { translate } = useLocales();
  const theme = useTheme();

  const contactMethods = [
    {
      icon: 'logos:whatsapp',
      title: 'WhatsApp',
      subtitle: 'Respuesta inmediata',
      contact: '+54 9 294 470 3443',
      color: '#25D366',
      action: () => {
        const whatsappNumber = '+5492944703443';
        const message = 'Hola! Me pongo en contacto desde la web de SnowMatch.';
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
      }
    },
    {
      icon: 'eva:email-fill',
      title: 'Email',
      subtitle: 'Respuesta en 24hs',
      contact: 'office@snowmatch.pro',
      color: '#1890FF',
      action: () => {
        window.location.href = 'mailto:office@snowmatch.pro?subject=Consulta desde SnowMatch';
      }
    },
    {
      icon: 'eva:clock-fill',
      title: 'Horarios',
      subtitle: 'Lunes a Viernes',
      contact: '9:00 - 18:00',
      color: '#3366FF',
      action: null
    }
  ];

  return (
    <RootStyle>
      <Container component={MotionContainer} maxWidth="lg">
        <ContentStyle spacing={4}>
          <m.div variants={varFade().in}>
            <Chip 
              label="¿Necesitas ayuda?"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                mb: 2,
                fontSize: '0.9rem'
              }} 
            />
          </m.div>

          <m.div variants={varFade().in}>
            <TextAnimate 
              text={translate('contactTitle')} 
              sx={{ 
                color: 'white',
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 900,
                lineHeight: 1.2,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              }} 
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {translate('contactSubtitle')}
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <ContactCardStyle>
              <Grid container spacing={3}>
                {contactMethods.map((method, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <ContactItemStyle 
                      onClick={method.action}
                      sx={{ 
                        cursor: method.action ? 'pointer' : 'default',
                        '&:hover': method.action ? {} : { transform: 'none', backgroundColor: 'rgba(24, 144, 255, 0.1)' }
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: method.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify 
                          icon={method.icon} 
                          width={24} 
                          sx={{ color: 'white' }} 
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                          {method.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.subtitle}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="primary.main">
                          {method.contact}
                        </Typography>
                      </Box>
                    </ContactItemStyle>
                  </Grid>
                ))}
              </Grid>
            </ContactCardStyle>
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
