import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/redux/store';
import { editAdminBooking } from 'src/redux/slices/admin';
import {
  createAdminBookingRentalReservation,
  updateAdminBookingRentalReservation,
} from 'src/redux/slices/bookings';
import { ADMIN_BOOKING_RESORT_OPTIONS } from 'src/utils/adminBookingResortOptions';
import {
  buildGearBookingMetaFromBooking,
  buildRentalLinePayload,
  createEmptyRentalLine,
  estimateLinesTotal,
  getLessonDateBoundsFromBooking,
  rentalLineFromApiSummary,
  validateRentalFulfillment,
  validateRentalLine,
} from 'src/utils/adminGearRentalForm';
import BookingRentalFieldsSection from '../BookingRentalFieldsSection';
import axios from 'src/utils/axios';

GearBookingEditModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  onSave: PropTypes.func,
};

export default function GearBookingEditModal({ open, onClose, booking, onSave }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { items } = useSelector((state) => state.rental);

  const [bookingMeta, setBookingMeta] = useState(buildGearBookingMetaFromBooking(booking));
  const [lines, setLines] = useState([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isGearOnly = booking?.type === 'GEAR_ONLY';
  const lessonDateBounds = useMemo(() => getLessonDateBoundsFromBooking(booking), [booking]);
  const estimatedTotal = useMemo(() => estimateLinesTotal(lines, items), [lines, items]);

  const resetFromBooking = useCallback(async () => {
    if (!booking?.id) return;
    setBookingMeta(buildGearBookingMetaFromBooking(booking));
    setLoadingLines(true);
    try {
      const res = await axios.get(`/api/rental/admin/reservations/booking/${booking.id}`);
      const apiLines = Array.isArray(res.data) ? res.data : [];
      setLines(apiLines.length > 0 ? apiLines.map(rentalLineFromApiSummary) : [createEmptyRentalLine()]);
    } catch {
      setLines([createEmptyRentalLine()]);
      enqueueSnackbar(t('adminBookings.gearEdit.loadLinesError'), { variant: 'warning' });
    } finally {
      setLoadingLines(false);
    }
  }, [booking, enqueueSnackbar, t]);

  useEffect(() => {
    if (open && booking?.id) {
      resetFromBooking();
    }
  }, [open, booking?.id, resetFromBooking]);

  const patchBookingMeta = (fields) => {
    setBookingMeta((prev) => ({ ...prev, ...fields }));
  };

  const patchLine = (index, fields) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...fields } : line)));
  };

  const handleAddLine = () => {
    setLines((prev) => [...prev, createEmptyRentalLine()]);
  };

  const handleRemoveLine = (index) => {
    const line = lines[index];
    if (line?.id) {
      enqueueSnackbar(t('adminBookings.gearEdit.cannotRemoveExistingLine'), { variant: 'warning' });
      return;
    }
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResortChange = (resort) => {
    patchBookingMeta({ resort });
    setLines((prev) =>
      prev.map((line) => ({
        ...line,
        itemId: '',
        variantId: '',
      }))
    );
  };

  const handleSubmit = async () => {
    const fulfillmentError = validateRentalFulfillment(bookingMeta, t);
    if (fulfillmentError) {
      enqueueSnackbar(fulfillmentError, { variant: 'warning' });
      return;
    }

    for (let i = 0; i < lines.length; i += 1) {
      const lineError = validateRentalLine(lines[i], t);
      if (lineError) {
        enqueueSnackbar(
          lines.length > 1
            ? `${t('adminBookings.gearCreate.lineLabel', { n: i + 1 })}: ${lineError}`
            : lineError,
          { variant: 'warning' }
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      for (const line of lines) {
        const payload = buildRentalLinePayload(line);
        if (line.id) {
          await dispatch(updateAdminBookingRentalReservation(line.id, payload));
        } else {
          await dispatch(createAdminBookingRentalReservation(booking.id, payload));
        }
      }

      const bookingPayload = {
        paymentStatus: bookingMeta.paymentStatus,
        bookingPaymentMethod: bookingMeta.paymentMethod,
        internalComment: bookingMeta.internalComment?.trim() || undefined,
        userComment: bookingMeta.userComment?.trim() || undefined,
        state: bookingMeta.state,
        resort: bookingMeta.resort,
        rentalFulfillment: bookingMeta.rentalFulfillment,
      };
      if (!isGearOnly && bookingMeta.price != null && bookingMeta.price !== '') {
        bookingPayload.price = Number(bookingMeta.price);
      } else if (isGearOnly && bookingMeta.price != null && bookingMeta.price !== '') {
        const manualPrice = Number(bookingMeta.price);
        const calculatedPrice = estimatedTotal > 0 ? estimatedTotal : manualPrice;
        if (Math.abs(manualPrice - calculatedPrice) > 0.01) {
          bookingPayload.price = manualPrice;
        }
      }
      if (bookingMeta.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME') {
        bookingPayload.rentalDestinationType = bookingMeta.rentalDestinationType;
        bookingPayload.rentalDestinationDetail = bookingMeta.rentalDestinationDetail?.trim();
      }

      await dispatch(editAdminBooking(booking.id, bookingPayload));

      enqueueSnackbar(t('adminBookings.gearEdit.success'), { variant: 'success' });
      onSave?.({ ...booking, ...bookingPayload });
      onClose();
    } catch {
      enqueueSnackbar(t('adminBookings.gearEdit.error'), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value || 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('adminBookings.gearEdit.title', { id: booking?.id })}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="gear-edit-resort-label">{t('adminBookings.table.resort')}</InputLabel>
              <Select
                labelId="gear-edit-resort-label"
                label={t('adminBookings.table.resort')}
                value={bookingMeta.resort}
                onChange={(e) => handleResortChange(e.target.value)}
              >
                {ADMIN_BOOKING_RESORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="gear-edit-state-label">{t('adminBookings.editModal.state')}</InputLabel>
              <Select
                labelId="gear-edit-state-label"
                label={t('adminBookings.editModal.state')}
                value={bookingMeta.state}
                onChange={(e) => patchBookingMeta({ state: e.target.value })}
              >
                <MenuItem value="PENDING">{t('adminBookings.editModal.stateOptions.PENDING')}</MenuItem>
                <MenuItem value="ACCEPTED">{t('adminBookings.editModal.stateOptions.ACCEPTED')}</MenuItem>
                <MenuItem value="DECLINED">{t('adminBookings.editModal.stateOptions.DECLINED')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="gear-edit-payment-status-label">
                {t('adminBookings.table.paymentStatus')}
              </InputLabel>
              <Select
                labelId="gear-edit-payment-status-label"
                label={t('adminBookings.table.paymentStatus')}
                value={bookingMeta.paymentStatus}
                onChange={(e) => patchBookingMeta({ paymentStatus: e.target.value })}
              >
                <MenuItem value="PAID">{t('adminBookings.enums.paymentStatus.PAID')}</MenuItem>
                <MenuItem value="UNPAID">{t('adminBookings.enums.paymentStatus.UNPAID')}</MenuItem>
                <MenuItem value="PAID_10">10%</MenuItem>
                <MenuItem value="PAID_20">20%</MenuItem>
                <MenuItem value="PAID_30">30%</MenuItem>
                <MenuItem value="PAID_40">40%</MenuItem>
                <MenuItem value="PAID_50">50%</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="gear-edit-payment-method-label">
                {t('adminBookings.gearCreate.paymentMethod')}
              </InputLabel>
              <Select
                labelId="gear-edit-payment-method-label"
                label={t('adminBookings.gearCreate.paymentMethod')}
                value={bookingMeta.paymentMethod}
                onChange={(e) => patchBookingMeta({ paymentMethod: e.target.value })}
              >
                <MenuItem value="CASH">{t('adminBookings.gearCreate.paymentCash')}</MenuItem>
                <MenuItem value="WIRE_TRANSFER">
                  {t('adminBookings.gearCreate.paymentWireTransfer')}
                </MenuItem>
                <MenuItem value="TRANSFER">{t('adminBookings.editModal.paymentMethodOptions.TRANSFER')}</MenuItem>
                <MenuItem value="DEBIT_CARD">{t('adminBookings.editModal.paymentMethodOptions.DEBIT_CARD')}</MenuItem>
                <MenuItem value="CREDIT_CARD">{t('adminBookings.editModal.paymentMethodOptions.CREDIT_CARD')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t('adminBookings.editModal.price')}
              value={bookingMeta.price}
              onChange={(e) => patchBookingMeta({ price: e.target.value })}
              helperText={
                isGearOnly && estimatedTotal > 0
                  ? t('adminBookings.gearEdit.calculatedTotal', { total: formatPrice(estimatedTotal) })
                  : undefined
              }
              InputProps={{
                startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                inputProps: { min: 0, step: 0.01 },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label={t('adminBookings.editModal.clientComment')}
              value={bookingMeta.userComment}
              onChange={(e) => patchBookingMeta({ userComment: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label={t('adminBookings.table.internalComment')}
              value={bookingMeta.internalComment}
              onChange={(e) => patchBookingMeta({ internalComment: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t('adminBookings.rental.delivery')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="gear-edit-fulfillment-label">
                      {t('adminBookings.rental.delivery')}
                    </InputLabel>
                    <Select
                      labelId="gear-edit-fulfillment-label"
                      label={t('adminBookings.rental.delivery')}
                      value={bookingMeta.rentalFulfillment}
                      onChange={(e) => patchBookingMeta({ rentalFulfillment: e.target.value })}
                    >
                      <MenuItem value="PICKUP_IN_SHOP">
                        {t('adminBookings.rental.deliveryPickupInShop')}
                      </MenuItem>
                      <MenuItem value="SHIP_TO_HOTEL_OR_HOME">
                        {t('adminBookings.rental.deliveryShipToHotel')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {bookingMeta.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME' && (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel id="gear-edit-dest-type-label">
                          {t('adminBookings.rental.destinationType')}
                        </InputLabel>
                        <Select
                          labelId="gear-edit-dest-type-label"
                          label={t('adminBookings.rental.destinationType')}
                          value={bookingMeta.rentalDestinationType}
                          onChange={(e) => patchBookingMeta({ rentalDestinationType: e.target.value })}
                        >
                          <MenuItem value="HOTEL_OR_CABIN">
                            {t('adminBookings.rental.destinationHotel')}
                          </MenuItem>
                          <MenuItem value="HOME_ADDRESS">
                            {t('adminBookings.rental.destinationHome')}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label={t('adminBookings.rental.addressHotel')}
                        value={bookingMeta.rentalDestinationDetail}
                        onChange={(e) => patchBookingMeta({ rentalDestinationDetail: e.target.value })}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6">{t('adminBookings.gearEdit.linesTitle')}</Typography>
              <Button size="small" onClick={handleAddLine}>
                {t('adminBookings.gearEdit.addLine')}
              </Button>
            </Stack>
            {loadingLines ? (
              <Typography variant="body2" color="text.secondary">
                {t('adminBookings.rental.loadingLines')}
              </Typography>
            ) : (
              lines.map((line, index) => (
                <Box key={line.id || `new-${index}`} sx={{ position: 'relative', mb: 1 }}>
                  {lines.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveLine(index)}
                      sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
                      aria-label={t('adminBookings.gearEdit.removeLine')}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  <BookingRentalFieldsSection
                    rental={line}
                    onChange={(fields) => patchLine(index, fields)}
                    resort={bookingMeta.resort}
                    lessonMinDate={lessonDateBounds.min}
                    lessonMaxDate={lessonDateBounds.max}
                    hideFulfillment
                    gearOnly={isGearOnly}
                    sectionTitle={t('adminBookings.gearCreate.lineLabel', { n: index + 1 })}
                  />
                </Box>
              ))
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('adminBookings.deleteDialog.cancel')}</Button>
        <LoadingButton variant="contained" loading={submitting} onClick={handleSubmit}>
          {t('adminBookings.editModal.saveChanges')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
