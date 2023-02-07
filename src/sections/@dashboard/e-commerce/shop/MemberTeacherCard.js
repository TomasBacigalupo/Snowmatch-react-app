import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink, Router, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, DialogTitle, DialogActions, Button } from '@mui/material';
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
import { dispatch } from 'src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { DialogAnimate } from 'src/components/animate';
import { closeFireModal, fireTeacher, openFireModal, selectTeacher } from 'src/redux/slices/business';
import { openModal } from 'src/redux/slices/calendar';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

MemberTeacherCard.propTypes = {
  teacher: PropTypes.object,
};

export default function MemberTeacherCard({ teacher }) {
  const { name, lastname, imageLink, stars, level, information, email, state, resorts, id } = teacher || {};
  const theme = useTheme();
  const { translate } = useLocales();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [src, setSrc] = useState(imageLink)

  const { isAuthenticated } = useAuth()
  const linkTo = isAuthenticated ? PATH_DASHBOARD.eCommerce.viewTeacher(id) : PATH_GUEST.viewTeacher(id);

  const { error, selectedTeacher, isOpenFireModal} = useSelector((state) => state.business);

  const handleOpenFireModal = () => {
    dispatch(openFireModal());
    dispatch(selectTeacher(teacher))
  };


  return (
    <>{teacher == undefined ? <SkeletonProductItem /> :
      <Card>
        <Box sx={{ position: 'relative' }}>
          <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} onClick={() => navigate(linkTo)} />
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
              color="error"
              variant="contained"
              endIcon={<Iconify icon={'material-symbols:person-off'} width={20} height={20} />}
              onClick={handleOpenFireModal}
              sx={{ whiteSpace: 'nowrap' }}
            >
              {translate("business.fire")}
            </HoverButton>


          </Stack>

        </Stack>

        
      </Card>}</>
  );
}
