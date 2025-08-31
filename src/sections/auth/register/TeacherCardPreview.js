import PropTypes from 'prop-types';
import { Box, Typography, Stack, Rating } from '@mui/material';
import Iconify from '../../../components/Iconify';
import Label from '../../../components/Label';
import Image from '../../../components/Image';
import { useState } from 'react';

TeacherCardPreview.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default function TeacherCardPreview({ formData }) {
  const {
    photoURL,
    imageLink,
    name,
    lastname,
    sports = [],
    skills = [],
    languages = [],
    resorts = [],
    information = '',
    description = '',
    currency = 'USD',
    price2Hours = '',
    price3Hours = '',
    price6Hours = '',
    school = '',
    level = 'Intermedio',
  } = formData;

  const [src, setSrc] = useState(photoURL || imageLink);

  // Generate preview content based on available data
  const getPreviewContent = () => {
    const content = [];
    
    if (information) {
      content.push(information);
    }
    
    if (description) {
      content.push(description.substring(0, 200) + (description.length > 200 ? '...' : ''));
    }
    
    if (sports && sports.length > 0) {
      content.push(`Disciplinas: ${sports.join(', ')}`);
    }
    
    if (skills && skills.length > 0) {
      content.push(`Habilidades: ${skills.join(', ')}`);
    }
    
    if (languages && languages.length > 0) {
      content.push(`Idiomas: ${languages.join(', ')}`);
    }
    
    if (resorts && resorts.length > 0) {
      const resortNames = resorts.map(r => typeof r === 'object' ? r.name : r);
      content.push(`Resorts: ${resortNames.join(', ')}`);
    }
    
    if (school) {
      content.push(`Escuela: ${school}`);
    }
    
    return content.length > 0 ? content.join('\n\n') : 'Información del instructor aparecerá aquí...';
  };

  const getPriceDisplay = () => {
    if (price2Hours && price3Hours && price6Hours) {
      const prices = [price2Hours, price3Hours, price6Hours].map(p => parseFloat(p)).filter(p => !isNaN(p));
      if (prices.length > 0) {
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        return {
          original: avgPrice * 1.25, // Show as discounted
          current: avgPrice,
          currency: currency
        };
      }
    }
    // Fallback to any single price if available
    const singlePrice = price2Hours || price3Hours || price6Hours;
    if (singlePrice) {
      const price = parseFloat(singlePrice);
      if (!isNaN(price)) {
        return {
          original: price * 1.25,
          current: price,
          currency: currency
        };
      }
    }
    return null;
  };

  const priceInfo = getPriceDisplay();

  return (
    <Box sx={{ opacity: 1, cursor: 'default' }}>
      <Box sx={{ position: 'relative' }}>
        <Image 
          alt={name || 'Usuario'} 
          src={src} 
          ratio="1/1" 
          onError={() => setSrc('/assets/notFound.jpeg')} 
          sx={{ borderRadius: '16px' }} 
        />

        {resorts && resorts.length > 0 && (
          <Label
            variant="filled"
            sx={{
              top: 16,
              right: 16,
              position: 'absolute',
              bgcolor: 'white'
            }}
          >
            Nivel {level}
          </Label>
        )}
        
        {priceInfo && (
          <Label
            variant="filled"
            sx={{
              top: 50,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              bgcolor: '#3399FF'
            }}
          >
            ${priceInfo.current.toFixed(0)}/h
          </Label>
        )}
      </Box>

      <Stack spacing={1} sx={{ pt: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant="subtitle1" noWrap>
            {name && lastname ? `${name} ${lastname}` : 'Nombre del Instructor'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="subtitle1" component="span">
              5.0
            </Typography>
            <Iconify icon="mdi:star" width={16} height={16} sx={{ color: 'warning.main' }} />
          </Stack>
        </Box>
        
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" sx={{ color: 'text.disabled' }}>
            {information?.length > 45 ? `${information.substring(0, 45)}...` : information || 'Descripción breve del instructor...'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
} 