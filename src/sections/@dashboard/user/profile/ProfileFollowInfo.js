import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

ProfileFollowInfo.propTypes = {
  profile: PropTypes.shape({
    clients: PropTypes.number,
    level: PropTypes.number,
  }),
};

export default function ProfileFollowInfo({ profile }) {
  const { clients, level } = profile;

  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(clients)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Clients
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">{fNumber(level)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Nivel de Adides
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
