import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, Router, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';
import useAuth from 'src/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { SkeletonProductItem } from 'src/components/skeleton';
import HoverButton from 'src/components/HoverButton';
import useLocales from 'src/hooks/useLocales';
import Iconify from 'src/components/Iconify';
import { useDispatch } from 'react-redux';
import { openHireModal, selectTeacher } from 'src/redux/slices/business';

// ----------------------------------------------------------------------

PendingTeacherCard.propTypes = {
  teacher: PropTypes.object,
};

export default function PendingTeacherCard({ teacher }) {
  const { name, lastname, imageLink, stars, level, information, email, state, resorts } = teacher || {} ;
  const theme = useTheme();
  const {translate} = useLocales();

  const navigate = useNavigate();
  const [src, setSrc] = useState(imageLink)

  const { isAuthenticated } = useAuth()
  const linkTo = isAuthenticated ? PATH_DASHBOARD.eCommerce.viewTeacher(email) : PATH_GUEST.viewTeacher(email);
  const dispatch = useDispatch();
  
  const handleOpenHireModal = () => {
    dispatch(openHireModal());
    dispatch(selectTeacher(teacher))
  };


  return (
    <>{teacher==undefined ? <SkeletonProductItem/>  :
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
              {resorts[0]}
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
            {/* <ColorPreview colors={colors} /> */}
            <Typography component="span" sx={{ color: 'text.disabled', }}>
              {information}
            </Typography>


          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
          <HoverButton
                fullWidth
                size="large"
                color="primary"
                variant="contained"
                endIcon={<Iconify icon={'material-symbols:person-add'} width={20} height={20} />}
                onClick={handleOpenHireModal}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {translate("business.hire")}              
                </HoverButton>


          </Stack>
          
        </Stack>
      </Card>}</>
  );
}
