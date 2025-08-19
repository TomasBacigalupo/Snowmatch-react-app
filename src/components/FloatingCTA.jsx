import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Slide,
} from '@mui/material';
import Iconify from './Iconify';
import { useWhatsAppLink } from '../hooks/useWhatsAppLink';

const FloatingCTARoot = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  left: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(2.5, 3),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(45deg, #25D366 0%, #128C7E 100%)',
  boxShadow: '0 12px 35px rgba(37, 211, 102, 0.4)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  '&:hover': {
    background: 'linear-gradient(45deg, #128C7E 0%, #075E54 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 16px 45px rgba(37, 211, 102, 0.5)',
    border: 'none',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
  },
}));

const FloatingCTA = ({ 
  destination, 
  phone = '+5492944567890',
  show = true 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const pageUrl = window.location.href;
  const whatsappLink = useWhatsAppLink({
    phone,
    destino: destination,
    dates: { checkin: null, checkout: null },
    pax: { adultos: 2, menores: 0 },
    nivel: 'intermedio',
    pageUrl,
  });

  const handleWhatsAppClick = () => {
    // Tracking event
    if (window.gtag) {
      window.gtag('event', 'cta_whatsapp_click', {
        destination,
        source: 'floating_cta',
      });
    }
    window.open(whatsappLink, '_blank');
  };

  if (!isMobile || !show) return null;

  return (
    <Slide direction="up" in={show} mountOnEnter unmountOnExit>
      <FloatingCTARoot>
        <FloatingButton
          variant="contained"
          fullWidth
          size="large"
          onClick={handleWhatsAppClick}
          startIcon={<Iconify icon="logos:whatsapp-icon" />}
        >
          Armar mi viaje ahora
        </FloatingButton>
      </FloatingCTARoot>
    </Slide>
  );
};

export default FloatingCTA; 