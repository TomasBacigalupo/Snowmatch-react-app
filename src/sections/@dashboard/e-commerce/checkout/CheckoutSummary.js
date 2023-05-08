import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Card,
  Stack,
  // Button,
  Divider,
  // TextField,
  CardHeader,
  Typography,
  CardContent,
  // InputAdornment,
} from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import useLocales from 'src/hooks/useLocales';

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
  const {translate} = useLocales()
  const displayShipping = shipping !== null ? 'Free' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={translate('checkout.summary')}
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('checkout.days')}
            </Typography>
            <Typography variant="subtitle2">{totalEvents}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('checkout.subtotal')}
            </Typography>
            <Typography variant="subtitle2">{subtotal ? fCurrency(subtotal) : translate('checkout.deal_with_pro')}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Discount
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('checkout.sm_service')}
            </Typography>
            <Typography variant="subtitle2">{translate('checkout.free')}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">{translate('checkout.total')}</Typography>
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
