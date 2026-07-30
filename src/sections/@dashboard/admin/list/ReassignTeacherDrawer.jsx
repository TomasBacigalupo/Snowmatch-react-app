import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton,
  Button,
  FormControl,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Iconify from '../../../../components/Iconify';
import {
  getTeachers,
  reassignBookingTeacher,
  splitReassignBookingTeacher,
} from '../../../../redux/slices/admin';

const CURRENCY_OPTIONS = ['ARS', 'USD', 'BRL'];

function roundMoney(value) {
  if (value == null || Number.isNaN(Number(value))) return '';
  return (Math.round(Number(value) * 100) / 100).toFixed(2);
}

function proRateAmount(totalAmount, selectedCount, totalCount) {
  if (totalAmount == null || Number.isNaN(Number(totalAmount)) || !totalCount) {
    return '';
  }
  return roundMoney((Number(totalAmount) * selectedCount) / totalCount);
}

/** Remaining side so both sides always sum to the original booking amount. */
function remainingFromOriginal(originalAmount, splitAmount) {
  if (originalAmount == null || Number.isNaN(Number(originalAmount))) {
    return '';
  }
  if (splitAmount === '' || splitAmount == null || Number.isNaN(Number(splitAmount))) {
    return '';
  }
  return roundMoney(Number(originalAmount) - Number(splitAmount));
}

function formatSessionLabel(event) {
  const start = event?.start ? String(event.start) : '';
  const datePart = start.slice(0, 10);
  let timePart = '';
  if (start.includes('T')) {
    const end = event?.end ? String(event.end) : '';
    const startTime = start.slice(11, 16);
    const endTime = end.includes('T') ? end.slice(11, 16) : '';
    timePart = endTime ? `${startTime}–${endTime}` : startTime;
  }
  return [datePart, timePart].filter(Boolean).join(' · ') || `Evento #${event?.id ?? '—'}`;
}

function parseOptionalAmount(value) {
  if (value === '' || value == null) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

ReassignTeacherDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default function ReassignTeacherDrawer({ open, onClose, booking, onSuccess }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { teachers } = useSelector((state) => state.admin);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [newBookingPrice, setNewBookingPrice] = useState('');
  const [newBookingCurrency, setNewBookingCurrency] = useState('ARS');
  const [newSuggestedPayoutAmount, setNewSuggestedPayoutAmount] = useState('');
  const [newSuggestedPayoutCurrency, setNewSuggestedPayoutCurrency] = useState('');
  const [remainingBookingPrice, setRemainingBookingPrice] = useState('');
  const [remainingBookingCurrency, setRemainingBookingCurrency] = useState('ARS');
  const [remainingSuggestedPayoutAmount, setRemainingSuggestedPayoutAmount] = useState('');
  const [remainingSuggestedPayoutCurrency, setRemainingSuggestedPayoutCurrency] = useState('');

  const currentTeacherId = booking?.teacher?.id;
  const currentTeacherLabel = [booking?.teacher?.name, booking?.teacher?.lastname]
    .filter(Boolean)
    .join(' ') || '—';

  const sessions = useMemo(
    () => (booking?.eventList || []).filter((event) => event?.id != null),
    [booking?.eventList]
  );
  const isMultiDay = sessions.length >= 2;
  const allSelected = isMultiDay && selectedEventIds.length === sessions.length && sessions.length > 0;
  const isPartialSplit = isMultiDay && selectedEventIds.length > 0 && !allSelected;

  useEffect(() => {
    if (!open) {
      return;
    }
    dispatch(getTeachers(0, 'TEACHER', '', 0));
    setSelectedTeacher(null);
    setSelectedEventIds([]);

    const currency = booking?.currency || 'ARS';
    const payoutCurrency = booking?.suggestedTeacherPayoutCurrency || '';
    setNewBookingCurrency(currency);
    setRemainingBookingCurrency(currency);
    setNewSuggestedPayoutCurrency(payoutCurrency);
    setRemainingSuggestedPayoutCurrency(payoutCurrency);
    setNewBookingPrice('');
    setRemainingBookingPrice('');
    setNewSuggestedPayoutAmount('');
    setRemainingSuggestedPayoutAmount('');
  }, [open, dispatch, booking?.id, booking?.currency, booking?.suggestedTeacherPayoutCurrency]);

  // Prefill money when day selection changes (multi-day only)
  useEffect(() => {
    if (!open || !isMultiDay) {
      return;
    }
    if (!selectedEventIds.length) {
      setNewBookingPrice('');
      setRemainingBookingPrice('');
      setNewSuggestedPayoutAmount('');
      setRemainingSuggestedPayoutAmount('');
      return;
    }

    const selectedCount = selectedEventIds.length;
    const totalDays = sessions.length;
    const bookingPrice = booking?.price;
    const suggested = booking?.suggestedTeacherPayoutAmount;

    if (allSelected) {
      setNewBookingPrice(roundMoney(bookingPrice) || '');
      setRemainingBookingPrice('');
      setNewSuggestedPayoutAmount(
        suggested != null && !Number.isNaN(Number(suggested)) ? roundMoney(suggested) : ''
      );
      setRemainingSuggestedPayoutAmount('');
      return;
    }

    // Always split from booking.price so both sides sum to the original total
    // (per-event prices can diverge from booking.price and inflate the total).
    const splitPrice = proRateAmount(bookingPrice, selectedCount, totalDays);
    setNewBookingPrice(splitPrice);
    setRemainingBookingPrice(remainingFromOriginal(bookingPrice, splitPrice));

    if (suggested != null && !Number.isNaN(Number(suggested))) {
      const splitSuggested = proRateAmount(suggested, selectedCount, totalDays);
      setNewSuggestedPayoutAmount(splitSuggested);
      setRemainingSuggestedPayoutAmount(remainingFromOriginal(suggested, splitSuggested));
    } else {
      setNewSuggestedPayoutAmount('');
      setRemainingSuggestedPayoutAmount('');
    }
  }, [
    open,
    isMultiDay,
    selectedEventIds,
    sessions,
    allSelected,
    booking?.price,
    booking?.suggestedTeacherPayoutAmount,
  ]);

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const handleToggleEvent = (eventId) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSelectAllDays = () => {
    setSelectedEventIds(sessions.map((s) => s.id));
  };

  const handleClearDays = () => {
    setSelectedEventIds([]);
  };

  // Keep remaining = original booking price - new booking price while editing.
  const handleNewBookingPriceChange = (value) => {
    setNewBookingPrice(value);
    if (isPartialSplit) {
      setRemainingBookingPrice(remainingFromOriginal(booking?.price, value));
    }
  };

  const handleNewSuggestedPayoutChange = (value) => {
    setNewSuggestedPayoutAmount(value);
    if (isPartialSplit && booking?.suggestedTeacherPayoutAmount != null) {
      setRemainingSuggestedPayoutAmount(
        remainingFromOriginal(booking.suggestedTeacherPayoutAmount, value)
      );
    }
  };

  const canSubmit = (() => {
    if (!selectedTeacher?.id || !booking?.id) return false;
    if (!isMultiDay) return true;
    if (!selectedEventIds.length) return false;
    if (allSelected) {
      return newBookingPrice !== '' && !Number.isNaN(Number(newBookingPrice)) && !!newBookingCurrency;
    }
    return (
      newBookingPrice !== '' &&
      !Number.isNaN(Number(newBookingPrice)) &&
      !!newBookingCurrency &&
      remainingBookingPrice !== '' &&
      !Number.isNaN(Number(remainingBookingPrice)) &&
      !!remainingBookingCurrency
    );
  })();

  const handleConfirm = async () => {
    if (!selectedTeacher?.id || !booking?.id) {
      return;
    }
    if (selectedTeacher.id === currentTeacherId) {
      enqueueSnackbar('Seleccioná un instructor distinto al actual', { variant: 'warning' });
      return;
    }
    if (isMultiDay && !selectedEventIds.length) {
      enqueueSnackbar('Seleccioná al menos un día para reasignar', { variant: 'warning' });
      return;
    }

    setSubmitting(true);
    try {
      if (!isMultiDay) {
        const updated = await dispatch(reassignBookingTeacher(booking.id, selectedTeacher.id));
        enqueueSnackbar('Instructor reasignado correctamente', { variant: 'success' });
        if (onSuccess) {
          onSuccess({ originalBooking: updated });
        }
        onClose();
        return;
      }

      if (allSelected) {
        const updated = await dispatch(
          reassignBookingTeacher(booking.id, selectedTeacher.id, {
            price: newBookingPrice,
            currency: newBookingCurrency,
            suggestedTeacherPayoutAmount: newSuggestedPayoutAmount,
            suggestedTeacherPayoutCurrency: newSuggestedPayoutCurrency || null,
          })
        );
        enqueueSnackbar('Instructor reasignado correctamente', { variant: 'success' });
        if (onSuccess) {
          onSuccess({ originalBooking: updated });
        }
        onClose();
        return;
      }

      const payload = {
        teacherId: selectedTeacher.id,
        eventIds: selectedEventIds,
        newBookingPrice: Number(newBookingPrice),
        newBookingCurrency,
        remainingBookingPrice: Number(remainingBookingPrice),
        remainingBookingCurrency,
        newSuggestedTeacherPayoutAmount: parseOptionalAmount(newSuggestedPayoutAmount),
        newSuggestedTeacherPayoutCurrency: newSuggestedPayoutCurrency || null,
        remainingSuggestedTeacherPayoutAmount: parseOptionalAmount(remainingSuggestedPayoutAmount),
        remainingSuggestedTeacherPayoutCurrency: remainingSuggestedPayoutCurrency || null,
      };

      const result = await dispatch(splitReassignBookingTeacher(booking.id, payload));
      const newId = result?.newBooking?.id;
      enqueueSnackbar(
        newId
          ? `Días reasignados. Nueva reserva #${newId} creada.`
          : 'Días reasignados correctamente',
        { variant: 'success' }
      );
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        'No se pudo reasignar el instructor';
      enqueueSnackbar(typeof message === 'string' ? message : 'No se pudo reasignar el instructor', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderCurrencySelect = (label, value, onChange, allowUnset = false) => (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitting}
      >
        {allowUnset && (
          <MenuItem value="">
            <em>Sin definir</em>
          </MenuItem>
        )}
        {CURRENCY_OPTIONS.map((code) => (
          <MenuItem key={code} value={code}>
            {code}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderMoneyGroup = ({
    title,
    helper,
    price,
    setPrice,
    currency,
    setCurrency,
    payoutAmount,
    setPayoutAmount,
    payoutCurrency,
    setPayoutCurrency,
  }) => (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {helper && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          {helper}
        </Typography>
      )}
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            label="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={submitting}
            inputProps={{ min: 0, step: 0.01 }}
          />
          {renderCurrencySelect('Moneda', currency, setCurrency)}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            label="Payout sugerido"
            type="number"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            disabled={submitting}
            inputProps={{ min: 0, step: 0.01 }}
          />
          {renderCurrencySelect('Moneda payout', payoutCurrency, setPayoutCurrency, true)}
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      anchor="right"
      PaperProps={{
        sx: {
          paddingTop: 'env(safe-area-inset-top)',
          width: { xs: '100%', sm: 480 },
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Reasignar instructor</Typography>
          <IconButton onClick={handleClose} disabled={submitting}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2.5} sx={{ flexGrow: 1, overflow: 'auto', pb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Reserva
            </Typography>
            <Typography variant="body1">#{booking?.id ?? '—'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Instructor actual
            </Typography>
            <Typography variant="body1">{currentTeacherLabel}</Typography>
            {currentTeacherId && (
              <Typography variant="body2" color="text.secondary">
                ID: {currentTeacherId}
              </Typography>
            )}
          </Box>

          {isMultiDay && (
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Días a reasignar</Typography>
                <Stack direction="row" spacing={1}>
                  <Link
                    component="button"
                    type="button"
                    variant="caption"
                    onClick={handleSelectAllDays}
                    disabled={submitting || allSelected}
                  >
                    Todos
                  </Link>
                  <Link
                    component="button"
                    type="button"
                    variant="caption"
                    onClick={handleClearDays}
                    disabled={submitting || !selectedEventIds.length}
                  >
                    Ninguno
                  </Link>
                </Stack>
              </Stack>
              {sessions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay días disponibles en esta reserva.
                </Typography>
              ) : (
                <FormGroup>
                  {sessions.map((session) => (
                    <FormControlLabel
                      key={session.id}
                      control={
                        <Checkbox
                          checked={selectedEventIds.includes(session.id)}
                          onChange={() => handleToggleEvent(session.id)}
                          disabled={submitting}
                        />
                      }
                      label={formatSessionLabel(session)}
                    />
                  ))}
                </FormGroup>
              )}
              {selectedEventIds.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  Seleccioná uno o más días. Si elegís todos, se reasigna la reserva completa.
                </Typography>
              )}
              {isPartialSplit && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Los días seleccionados pasarán a una nueva reserva con el nuevo instructor.
                </Typography>
              )}
            </Box>
          )}

          <FormControl fullWidth>
            <Autocomplete
              autoFocus={!isMultiDay}
              options={(teachers || []).filter((t) => t?.id !== currentTeacherId)}
              value={selectedTeacher}
              onChange={(e, newValue) => setSelectedTeacher(newValue)}
              onInputChange={(e, newInputValue) => {
                dispatch(getTeachers(0, 'TEACHER', newInputValue, 0));
              }}
              getOptionLabel={(option) =>
                `${option?.name || ''} ${option?.lastname || ''}`.trim() || String(option?.id ?? '')
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              disabled={submitting}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nuevo instructor"
                  placeholder="Buscar por nombre o apellido"
                  helperText="Escribí para filtrar instructores por nombre o apellido."
                />
              )}
            />
          </FormControl>

          {isMultiDay && allSelected && (
            renderMoneyGroup({
              title: 'Precio y payout',
              helper: 'Se actualizan en la misma reserva al reasignar todos los días.',
              price: newBookingPrice,
              setPrice: setNewBookingPrice,
              currency: newBookingCurrency,
              setCurrency: setNewBookingCurrency,
              payoutAmount: newSuggestedPayoutAmount,
              setPayoutAmount: setNewSuggestedPayoutAmount,
              payoutCurrency: newSuggestedPayoutCurrency,
              setPayoutCurrency: setNewSuggestedPayoutCurrency,
            })
          )}

          {isPartialSplit && (
            <>
              {renderMoneyGroup({
                title: 'Nueva reserva (días seleccionados)',
                helper: `${selectedEventIds.length} día(s) · nuevo instructor`,
                price: newBookingPrice,
                setPrice: handleNewBookingPriceChange,
                currency: newBookingCurrency,
                setCurrency: setNewBookingCurrency,
                payoutAmount: newSuggestedPayoutAmount,
                setPayoutAmount: handleNewSuggestedPayoutChange,
                payoutCurrency: newSuggestedPayoutCurrency,
                setPayoutCurrency: setNewSuggestedPayoutCurrency,
              })}
              <Divider />
              {renderMoneyGroup({
                title: 'Reserva original (días restantes)',
                helper: `${sessions.length - selectedEventIds.length} día(s) · instructor actual`,
                price: remainingBookingPrice,
                setPrice: setRemainingBookingPrice,
                currency: remainingBookingCurrency,
                setCurrency: setRemainingBookingCurrency,
                payoutAmount: remainingSuggestedPayoutAmount,
                setPayoutAmount: setRemainingSuggestedPayoutAmount,
                payoutCurrency: remainingSuggestedPayoutCurrency,
                setPayoutCurrency: setRemainingSuggestedPayoutCurrency,
              })}
            </>
          )}
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <LoadingButton
            loading={submitting}
            variant="contained"
            onClick={handleConfirm}
            disabled={!canSubmit}
          >
            Confirmar reasignación
          </LoadingButton>
        </Stack>
      </Box>
    </Drawer>
  );
}
