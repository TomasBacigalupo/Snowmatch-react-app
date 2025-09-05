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

const getSkierTypes = (translate) => [
  {
    id: 'FREESTYLE',
    label: translate('skierTypes.favorites.types.FREESTYLE.label'),
    description: translate('skierTypes.favorites.types.FREESTYLE.description'),
    icon: 'mdi:ski',
    color: '#000000'
  },
  {
    id: 'RACER',
    label: translate('skierTypes.favorites.types.RACER.label'),
    description: translate('skierTypes.favorites.types.RACER.description'),
    icon: 'mdi:flag-checkered',
    color: '#000000'
  }
];

const getExtraServices = (translate) => [
  {
    id: 'RENTAL_FITTING',
    label: translate('skierTypes.extraServices.types.RENTAL_FITTING.label'),
    description: translate('skierTypes.extraServices.types.RENTAL_FITTING.description'),
    icon: 'mdi:ski-boot',
    color: '#000000'
  },
  {
    id: 'RESTAURANT_RESERVATIONS',
    label: translate('skierTypes.extraServices.types.RESTAURANT_RESERVATIONS.label'),
    description: translate('skierTypes.extraServices.types.RESTAURANT_RESERVATIONS.description'),
    icon: 'mdi:restaurant',
    color: '#000000'
  },
  {
    id: 'BABYSITTING',
    label: translate('skierTypes.extraServices.types.BABYSITTING.label'),
    description: translate('skierTypes.extraServices.types.BABYSITTING.description'),
    icon: 'mdi:baby-face',
    color: '#000000'
  },
  {
    id: 'SKI_TUNNING',
    label: translate('skierTypes.extraServices.types.SKI_TUNNING.label'),
    description: translate('skierTypes.extraServices.types.SKI_TUNNING.description'),
    icon: 'mdi:tools',
    color: '#000000'
  },
  {
    id: 'TRANSPORTATION',
    label: translate('skierTypes.extraServices.types.TRANSPORTATION.label'),
    description: translate('skierTypes.extraServices.types.TRANSPORTATION.description'),
    icon: 'mdi:car',
    color: '#000000'
  },
  {
    id: 'GROCERY_SHOPPING',
    label: translate('skierTypes.extraServices.types.GROCERY_SHOPPING.label'),
    description: translate('skierTypes.extraServices.types.GROCERY_SHOPPING.description'),
    icon: 'mdi:shopping',
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
  
  const skierTypes = getSkierTypes(translate);
  const extraServices = getExtraServices(translate);

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
          {translate('skierTypes.title')}
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
          {translate('skierTypes.subtitle')}
        </Typography>
      </Box>

      {/* Skier Types Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 2
          }}
        >
          {translate('skierTypes.favorites.title')}
        </Typography>
        <Grid container spacing={2}>
          {skierTypes.map(renderTypeCard)}
        </Grid>
      </Box>

      {/* Extra Services Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 2
          }}
        >
          {translate('skierTypes.extraServices.title')}
        </Typography>
        <Grid container spacing={2}>
          {extraServices.map(renderTypeCard)}
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
                {translate('skierTypes.tips.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                • <strong>{translate('skierTypes.tips.selectAll')}</strong><br/>
                • <strong>{translate('skierTypes.tips.includeSpecialty')}</strong><br/>
                • <strong>{translate('skierTypes.tips.addLater')}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </m.div>
    </m.div>
  );
} 