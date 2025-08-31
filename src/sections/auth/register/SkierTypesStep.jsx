import PropTypes from 'prop-types';

// @mui
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

const SkierTypeCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected 
    ? `2px solid #000000` 
    : `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: selected ? '#f5f5f5' : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
    borderColor: selected ? '#000000' : theme.palette.grey[400],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const skierTypes = [
  {
    id: 'FREERIDE',
    label: 'Free Ride',
    description: 'Fuera de pista',
    icon: 'mdi:ski-cross-country',
    color: '#000000'
  },
  {
    id: 'FREESTYLE',
    label: 'Free Style',
    description: 'Park y saltos',
    icon: 'mdi:ski',
    color: '#000000'
  },
  {
    id: 'BACKCOUNTRY',
    label: 'Backcountry',
    description: 'Montaña salvaje',
    icon: 'mdi:terrain',
    color: '#000000'
  },
  {
    id: 'PISTA',
    label: 'Pista',
    description: 'Esquí alpino',
    icon: 'mdi:ski-alpine',
    color: '#000000'
  },
  {
    id: 'CARVING',
    label: 'Carving',
    description: 'Técnica avanzada',
    icon: 'mdi:ski-alpine',
    color: '#000000'
  },
  {
    id: 'SKI_TOURING',
    label: 'Ski Touring',
    description: 'Montañismo',
    icon: 'mdi:hiking',
    color: '#000000'
  },
  {
    id: 'MOGULS',
    label: 'Moguls',
    description: 'Baches',
    icon: 'mdi:terrain',
    color: '#000000'
  },
  {
    id: 'SLALOM',
    label: 'Slalom',
    description: 'Competición',
    icon: 'mdi:flag-checkered',
    color: '#000000'
  },
  {
    id: 'POWDER',
    label: 'Powder',
    description: 'Nieve polvo',
    icon: 'mdi:weather-snowy',
    color: '#000000'
  }
];

const standoutTypes = [
  {
    id: 'HELI_SKI',
    label: 'Heli Ski',
    description: 'Helicóptero',
    icon: 'mdi:helicopter',
    color: '#000000'
  },
  {
    id: 'CAT_SKI',
    label: 'Cat Ski',
    description: 'Gato de nieve',
    icon: 'mdi:car',
    color: '#000000'
  },
  {
    id: 'SPLITBOARD',
    label: 'Splitboard',
    description: 'Tabla partida',
    icon: 'mdi:ski',
    color: '#000000'
  },
  {
    id: 'TELEMARK',
    label: 'Telemark',
    description: 'Técnica clásica',
    icon: 'mdi:ski-cross-country',
    color: '#000000'
  },
  {
    id: 'NORDEGIC',
    label: 'Nórdico',
    description: 'Cross country',
    icon: 'mdi:ski-cross-country',
    color: '#000000'
  },
  {
    id: 'ADAPTIVE',
    label: 'Adaptativo',
    description: 'Esquí adaptado',
    icon: 'mdi:accessibility',
    color: '#000000'
  }
];

SkierTypesStep.propTypes = {
  // Add any props if needed in the future
};

export default function SkierTypesStep() {
  const { translate } = useLocales();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { watch, setValue } = useFormContext();
  const selectedTypes = watch('skills') || [];

  const handleTypeClick = (typeId) => {
    const currentTypes = selectedTypes;
    if (currentTypes.includes(typeId)) {
      setValue('skills', currentTypes.filter(id => id !== typeId));
    } else {
      setValue('skills', [...currentTypes, typeId]);
    }
  };

  const renderTypeCard = (type) => {
    const isSelected = selectedTypes.includes(type.id);
    
    return (
      <Grid item xs={6} sm={4} md={3} key={type.id}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SkierTypeCard
            selected={isSelected}
            onClick={() => handleTypeClick(type.id)}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Iconify
                icon={type.icon}
                sx={{
                  fontSize: 32,
                  color: isSelected ? '#000000' : type.color,
                  mb: 1,
                  transition: 'all 0.3s ease'
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: isSelected ? '#000000' : 'text.primary',
                  mb: 0.5
                }}
              >
                {type.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isSelected ? '#000000' : 'text.secondary',
                  fontSize: '0.75rem'
                }}
              >
                {type.description}
              </Typography>
            </CardContent>
          </SkierTypeCard>
        </m.div>
      </Grid>
    );
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          ¿Qué tipo de esquiador eres?
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Selecciona los tipos de esquí que practicas para que los estudiantes puedan encontrarte mejor
        </Typography>
      </Box>

      {/* Guest Favorites Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 2
          }}
        >
          ¿Qué tal estos favoritos de los estudiantes?
        </Typography>
        <Grid container spacing={2}>
          {skierTypes.map(renderTypeCard)}
        </Grid>
      </Box>

      {/* Standout Types Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 2
          }}
        >
          ¿Tienes alguna especialidad destacada?
        </Typography>
        <Grid container spacing={2}>
          {standoutTypes.map(renderTypeCard)}
        </Grid>
      </Box>



      {/* Tips Section */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ p: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Iconify 
              icon="eva:bulb-fill" 
              sx={{ 
                fontSize: 20, 
                color: '#000000', 
                mr: 2,
                mt: 0.2
              }} 
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000000', mb: 1 }}>
                Consejos para seleccionar tus tipos de esquí:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                • <strong>Selecciona todos los que practiques:</strong> Esto ayuda a los estudiantes a encontrarte<br/>
                • <strong>Incluye tu especialidad principal:</strong> Los estudiantes buscan instructores específicos<br/>
                • <strong>Puedes agregar más después:</strong> Siempre puedes actualizar tu perfil más tarde
              </Typography>
            </Box>
          </Box>
        </Box>
      </m.div>
    </m.div>
  );
} 