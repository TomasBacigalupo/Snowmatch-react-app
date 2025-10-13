import { useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, TextField, Stack, Card, Box, Chip } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const FormCardStyle = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  backgroundColor: '#ffffff',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f1f5f9',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
      boxShadow: '0 0 0 3px rgba(103, 126, 234, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: '#64748b',
  },
}));

const SubmitButtonStyle = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderRadius: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 14px rgba(103, 126, 234, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(103, 126, 234, 0.4)',
  },
  transition: 'all 0.3s ease',
}));

// ----------------------------------------------------------------------

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate a brief delay for better UX
    setTimeout(() => {
      const whatsappNumber = '+5492944703443';
      const message = `Hola! Me pongo en contacto desde el formulario de la web:

Nombre: ${formData.name}
Email: ${formData.email}
Asunto: ${formData.subject}

Mensaje: ${formData.message}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <FormCardStyle component={MotionViewport}>
      <Stack spacing={4}>
        <Box>
          <Chip 
            icon={<Iconify icon="eva:message-circle-fill" />}
            label="Mensaje directo"
            sx={{ 
              backgroundColor: '#667eea',
              color: 'white',
              fontWeight: 600,
              mb: 2
            }} 
          />
          <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
            Envíanos un mensaje
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Completa el formulario y te contactaremos por WhatsApp en minutos
          </Typography>
        </Box>

        <Stack spacing={3}>
          <m.div variants={varFade().inUp}>
            <StyledTextField 
              fullWidth 
              label="Tu nombre" 
              value={formData.name}
              onChange={handleInputChange('name')}
              InputProps={{
                startAdornment: (
                  <Iconify 
                    icon="eva:person-fill" 
                    sx={{ mr: 1, color: 'text.secondary' }} 
                  />
                ),
              }}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <StyledTextField 
              fullWidth 
              label="Email" 
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              InputProps={{
                startAdornment: (
                  <Iconify 
                    icon="eva:email-fill" 
                    sx={{ mr: 1, color: 'text.secondary' }} 
                  />
                ),
              }}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <StyledTextField 
              fullWidth 
              label="Asunto" 
              value={formData.subject}
              onChange={handleInputChange('subject')}
              InputProps={{
                startAdornment: (
                  <Iconify 
                    icon="eva:flag-fill" 
                    sx={{ mr: 1, color: 'text.secondary' }} 
                  />
                ),
              }}
            />
          </m.div>

          <m.div variants={varFade().inUp}>
            <StyledTextField 
              fullWidth 
              label="Tu mensaje" 
              multiline 
              rows={4} 
              value={formData.message}
              onChange={handleInputChange('message')}
              InputProps={{
                startAdornment: (
                  <Iconify 
                    icon="eva:message-square-fill" 
                    sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} 
                  />
                ),
              }}
            />
          </m.div>
        </Stack>

        <m.div variants={varFade().inUp}>
          <SubmitButtonStyle
            size="large" 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.message || isSubmitting}
            startIcon={
              isSubmitting ? (
                <Iconify icon="eos-icons:loading" width={20} />
              ) : (
                <Iconify icon="logos:whatsapp" width={20} />
              )
            }
          >
            {isSubmitting ? 'Enviando...' : 'Enviar por WhatsApp'}
          </SubmitButtonStyle>
        </m.div>

        <Box sx={{ 
          p: 2, 
          backgroundColor: '#f8fafc', 
          borderRadius: 2,
          border: '1px solid #e2e8f0'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Iconify icon="eva:info-fill" width={16} />
            Te redirigiremos a WhatsApp para completar el envío del mensaje
          </Typography>
        </Box>
      </Stack>
    </FormCardStyle>
  );
}
