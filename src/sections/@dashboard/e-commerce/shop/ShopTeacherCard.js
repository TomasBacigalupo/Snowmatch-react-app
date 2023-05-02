import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Tooltip } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import { useSelector } from 'src/redux/store';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
// ----------------------------------------------------------------------

ShopTeacherCard.propTypes = {
  teacher: PropTypes.object,
};

export default function ShopTeacherCard({ teacher }) {
  const { name, lastname, imageLink, information, email, resorts, id, events } = teacher;
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
    <Card onClick={() => navigate(linkTo)}>
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
            {getResortToShow()}
          </Label>
        )}
        {resorts && (
          <Label
            variant="filled"
            sx={{
              top: 16,
              right: 320,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              bgcolor: '#FF5630'
            }}
          >
            3 <EventAvailableIcon sx={{ p: 0.5, ml: 0.5 }} />
          </Label>
        )}
        <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name + " " + lastname}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="span" sx={{ color: 'text.disabled', }}>
            {information}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
