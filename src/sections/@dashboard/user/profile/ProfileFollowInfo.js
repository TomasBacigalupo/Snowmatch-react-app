import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
import { useDispatch, useSelector } from 'src/redux/store';
import { useContext, useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import { getClients } from 'src/redux/slices/clients';
import { getTotalClients } from 'src/redux/slices/teachers';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

ProfileFollowInfo.propTypes = {
  profile: PropTypes.shape({
    clients: PropTypes.number,
    level: PropTypes.number,
  }),
};

export default function ProfileFollowInfo({ profile }) {
  const {user} = useAuth()
  const { totalClients } = useSelector((state) => state.teachers);
  const {translate} = useLocales()
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(getTotalClients())
  }, [])
  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(totalClients)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate("profile.clients")}
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(user.level) > 0 ? fNumber(user.level): translate("profile.underReview")}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate("profile.level")}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
