import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Tooltip, Rating } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import { useSelector } from 'src/redux/store';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { borderRadius } from '@mui/system';
// ----------------------------------------------------------------------

ShopTeacherCard.propTypes = {
  teacher: PropTypes.object,
};

export default function ShopTeacherCard({ teacher }) {
  const { name, lastname, imageLink, information, email, resorts, id, eventsList, stars, level } = teacher;
  const { filters } = useSelector(state => state.teachers)
  const navigate = useNavigate();
  const [src, setSrc] = useState(imageLink)

  const { isTeacher } = useAuth()
  const linkTo = isTeacher ? PATH_DASHBOARD.eCommerce.viewTeacher(id) : PATH_GUEST.viewTeacher(id);

  const getResortToShow = () => {
    if (resorts && resorts?.length > 1) {
      if (resorts?.find(r => r === filters.resort)) {
        return filters.resort
      }
    }
    return resorts[0]
  }

  return (
    <Box onClick={() => navigate(linkTo)}>
      <Box sx={{ position: 'relative' }}>
        {resorts && (
          <Label
            variant="filled"
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              bgcolor: '#99FFFF'
            }}
          >
            {/* {getResortToShow()} */}
            {level}
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
        <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} sx={{ borderRadius: '16px' }} />
      </Box>

      <Stack spacing={1} sx={{ pt: 1, px: 1 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Link to={linkTo} color="inherit" component={RouterLink}>
            <Typography variant="subtitle1" noWrap>
              {name}
            </Typography>
          </Link>
          <Rating readOnly value={stars} precision={0.5} />
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" sx={{ color: 'text.disabled', }}>
            {information}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
