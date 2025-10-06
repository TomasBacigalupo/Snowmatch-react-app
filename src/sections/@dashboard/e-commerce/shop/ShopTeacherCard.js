import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Tooltip, Rating, useTheme, useMediaQuery } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST, PATH_PAGE } from '../../../../routes/paths';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import { useSelector } from 'src/redux/store';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { borderRadius } from '@mui/system';
import Iconify from '../../../../components/Iconify';
import useLocales from 'src/hooks/useLocales';
// ----------------------------------------------------------------------

ShopTeacherCard.propTypes = {
  teacher: PropTypes.object,
  fullBlack: PropTypes.bool,
  disabled: PropTypes.bool,
  onTeacherClick: PropTypes.func,
};

export default function ShopTeacherCard({ teacher, fullBlack = false, disabled = false, onTeacherClick }) {
  const { name, lastname, imageLink, information, email, resorts, id, eventsList, stars, level } = teacher;
  const { filters } = useSelector(state => state.teachers)
  const navigate = useNavigate();
  const [src, setSrc] = useState(imageLink)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentLang } = useLocales();

  
  const getResortToShow = () => {
    if (resorts && resorts?.length > 1) {
      if (resorts?.find(r => r === filters.resort)) {
        return filters.resort
      }
    }
    return resorts[0]
  }

  const linkTo = `/${currentLang?.value}/profile/${id}?resort=${getResortToShow()}`;


  const handleClick = () => {
      if (!disabled) {
          window.open(linkTo, '_blank');
      }
  };

  return (
    <Box onClick={handleClick} sx={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'pointer' }}>
      <Box sx={{ position: 'relative' }}>
        <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} sx={{ borderRadius: '16px' }} />
        {resorts && (
          <Label
            variant="filled"
            sx={{
              top: 16,
              right: 16,
              position: 'absolute',
              bgcolor: 'white'
            }}
          >
            {/* {getResortToShow()} */}
            Nivel {level}
          </Label>
        )}
        {eventsList && (
          <Label
            variant="filled"
            sx={{
              top: 50,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              bgcolor: '#FF5630'
            }}
          >
            {eventsList.length} <EventAvailableIcon sx={{ p: 0.5, ml: 0.5 }} />
          </Label>
        )}
      </Box>

      <Stack spacing={1} sx={{ pt: 1, }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Link to={linkTo} color="inherit" component={RouterLink} onClick={(e) => {
            if (disabled) e.preventDefault();
            if (isMobile && onTeacherClick) {
              e.preventDefault();
              onTeacherClick(teacher);
            }
          }}>
            <Typography variant="subtitle1" noWrap>
              {name}
            </Typography>
          </Link>
          {stars > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="subtitle1" component="span">
                {stars.toFixed(1)}
              </Typography>
              <Iconify icon="mdi:star" width={16} height={16} sx={{ color: 'warning.main' }} />
            </Stack>
          )}
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" sx={{ color: fullBlack ? 'black' : 'text.disabled', }}>
            {information?.length > 45 ? `${information.substring(0, 45)}...` : information}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
