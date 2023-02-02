import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

CheckoutSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  subtotal: PropTypes.number,
  shipping: PropTypes.number,
  onEdit: PropTypes.func,
  enableEdit: PropTypes.bool,
  onApplyDiscount: PropTypes.func,
  enableDiscount: PropTypes.bool,
};

export default function CheckoutSummary({
  total,
  totalEvents,
  onEdit,
  discount,
  subtotal,
  shipping,
  onApplyDiscount,
  enableEdit = true,
  enableDiscount = false,
}) {
  const displayShipping = shipping !== null ? 'Free' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order Summary"
        action={
          enableEdit && (
            <Button size="small" disabled={true} onClick={onEdit} startIcon={<Iconify icon={'eva:edit-fill'} />}>
              Edit
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Days
            </Typography>
            <Typography variant="subtitle2">{totalEvents}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sub Total
            </Typography>
            <Typography variant="subtitle2">{subtotal ? fCurrency(subtotal) : 'Deal with Pro'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              SM service
            </Typography>
            <Typography variant="subtitle2">Free</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Total</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1">
                {fCurrency(total)}
              </Typography>
            </Box>
          </Stack>

          {/* {enableDiscount && onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Apply
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )} */}
        </Stack>
      </CardContent>
    </Card>
  );
}
