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
import useLocales from 'src/hooks/useLocales';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getDollarValue } from 'src/redux/slices/teachers';

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
  bookingPrice: PropTypes.number,
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
  bookingPrice
}) {
  const {translate} = useLocales()
  const displayShipping = shipping !== null ? 'Free' : '-';
  const dispatch = useDispatch()
  const [dollarValue, setDollarValue] = useState(470)
  // useEffect(() => {
  //   dispatch(getDollarValue((dollar) => { setDollarValue(Number(dollar.venta))}))
  // },[])

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={translate('checkout.summary')}
      />

      <CardContent>
        {subtotal >0 && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('checkout.days')}
            </Typography>
            <Typography variant="subtitle2">{totalEvents}</Typography>
          </Stack>
          

          
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total: {/* {translate('checkout.subtotal')} */}
            </Typography>
            <Typography variant="subtitle2">{subtotal ? fCurrency(subtotal) : translate('checkout.deal_with_pro')}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Pago al inicio de clase
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subtotal-bookingPrice)}</Typography>
          </Stack>

          {/* <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Reserva
            </Typography>
            <Typography variant="subtitle2">{bookingPrice ? `${fCurrency(bookingPrice)}` : 'free' }</Typography>
          </Stack> */}

          

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">
              {translate('checkout.total')}
              </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1">
                {subtotal ? fCurrency(subtotal): 'free'}
              </Typography>
            </Box>
          </Stack>

          {enableDiscount && onApplyDiscount && (
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
          )}
        </Stack>
        )}
        {!subtotal && (
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {translate('checkout.days')}
              </Typography>
              <Typography variant="subtitle2">{totalEvents}</Typography>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
