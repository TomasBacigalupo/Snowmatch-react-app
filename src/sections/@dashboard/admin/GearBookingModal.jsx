import { useCallback, useEffect, useState } from 'react';
import {
  Autocomplete,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/redux/store';
import { getTeachers, getUserTeamMembers, editAdminBooking } from 'src/redux/slices/admin';
import {
  createAdminBookingRentalReservation,
  createAdminGearBooking,
} from 'src/redux/slices/bookings';
import { ADMIN_BOOKING_RESORT_OPTIONS } from 'src/utils/adminBookingResortOptions';
import {
  buildRentalRenterFromClient,
  clearRentalRenterFields,
  pickTeamMemberForRental,
} from 'src/utils/adminBookingRentalPrefill';
import {
  buildAdminGearBookingPayload,
  buildRentalLinePayload,
  DEFAULT_RENTAL_LINE,
  validateRentalFulfillment,
  validateRentalLine,
} from 'src/utils/adminGearRentalForm';
import BookingRentalFieldsSection from './BookingRentalFieldsSection';
import CreateStudentModal from './CreateStudentModal';

const DEFAULT_BOOKING_META = {
  resort: 'CERRO_CATEDRAL',
  paymentStatus: 'PAID',
  paymentMethod: 'CASH',
  internalComment: '',
  rentalFulfillment: 'PICKUP_IN_SHOP',
  rentalDestinationType: 'HOTEL_OR_CABIN',
  rentalDestinationDetail: '',
};

function createEmptyLine() {
  return { ...DEFAULT_RENTAL_LINE };
}

export default function GearBookingModal({ isOpen, onClose, refreshBookings, filterResort }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { teachers } = useSelector((state) => state.admin);

  const [student, setStudent] = useState(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [bookingMeta, setBookingMeta] = useState({ ...DEFAULT_BOOKING_META });
  const [lines, setLines] = useState([createEmptyLine()]);
  const [linePrefillHints, setLinePrefillHints] = useState(['']);
  const [submitting, setSubmitting] = useState(false);
  const [createStudentOpen, setCreateStudentOpen] = useState(false);

  const resetForm = useCallback(() => {
    setStudent(null);
    setStudentSearch('');
    setStudentId(null);
    setBookingMeta({
      ...DEFAULT_BOOKING_META,
      resort: filterResort || DEFAULT_BOOKING_META.resort,
    });
    setLines([createEmptyLine()]);
    setLinePrefillHints(['']);
  }, [filterResort]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    if (studentSearch) {
      dispatch(getTeachers(0, 'STUDENT', studentSearch, 0));
    }
  }, [dispatch, studentSearch]);

  const patchBookingMeta = (fields) => {
    setBookingMeta((prev) => ({ ...prev, ...fields }));
  };

  const patchLine = (index, fields) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, ...fields } : line))
    );
  };

  const applyRentalFromStudent = useCallback(
    async (selectedStudent) => {
      if (!selectedStudent?.id) return;

      let teamMember = null;
      try {
        const teamMembers = await dispatch(getUserTeamMembers(selectedStudent.id));
        teamMember = pickTeamMemberForRental(selectedStudent, teamMembers);
      } catch {
        teamMember = null;
      }

      const renterPatch = buildRentalRenterFromClient(selectedStudent, teamMember);
      const hint = teamMember
        ? t('adminBookings.rental.prefilledFromClientWithMember', {
            name: `${selectedStudent.name} ${selectedStudent.lastname}`.trim(),
          })
        : t('adminBookings.rental.prefilledFromClient', {
            name: `${selectedStudent.name} ${selectedStudent.lastname}`.trim(),
          });

      setLines((prev) => [{ ...prev[0], ...renterPatch }, ...prev.slice(1)]);
      setLinePrefillHints((prev) => [hint, ...prev.slice(1)]);
    },
    [dispatch, t]
  );

  const handleStudentChange = (newValue) => {
    setStudent(newValue);
    setStudentId(newValue?.id ?? null);
    if (!newValue) {
      setStudentSearch('');
      setLines([createEmptyLine()]);
      setLinePrefillHints(['']);
      return;
    }
    setStudentSearch(`${newValue.name} ${newValue.lastname}`.trim());
    applyRentalFromStudent(newValue);
  };

  const handleStudentCreated = (createdStudent) => {
    const nextStudent = {
      id: createdStudent.id,
      name: createdStudent.name,
      lastname: createdStudent.lastname,
      email: createdStudent.email,
      cellphone: createdStudent.cellphone,
      studentLevel: createdStudent.studentLevel,
    };
    setStudent(nextStudent);
    setStudentId(nextStudent.id);
    setStudentSearch(`${nextStudent.name} ${nextStudent.lastname}`.trim());
    applyRentalFromStudent(nextStudent);
    enqueueSnackbar(t('adminBookings.createStudent.success'), { variant: 'success' });
  };

  const handleAddLine = () => {
    setLines((prev) => [...prev, createEmptyLine()]);
    setLinePrefillHints((prev) => [...prev, '']);
  };

  const handleRemoveLine = (index) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
    setLinePrefillHints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResortChange = (resort) => {
    patchBookingMeta({ resort });
    setLines((prev) =>
      prev.map((line) => ({
        ...clearRentalRenterFields(line),
        itemId: '',
        variantId: '',
      }))
    );
    setLinePrefillHints((prev) => prev.map(() => ''));
    if (student) {
      applyRentalFromStudent(student);
    }
  };

  const handleSubmit = async () => {
    if (!studentId) {
      enqueueSnackbar(t('adminBookings.gearCreate.validationStudent'), { variant: 'warning' });
      return;
    }

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
      const created = await dispatch(
        createAdminGearBooking(
          buildAdminGearBookingPayload(studentId, lines[0], bookingMeta)
        )
      );
      const bookingId = created?.bookingId;

      if (!bookingId) {
        throw new Error('Missing bookingId');
      }

      for (let i = 1; i < lines.length; i += 1) {
        try {
          await dispatch(createAdminBookingRentalReservation(bookingId, buildRentalLinePayload(lines[i])));
        } catch {
          enqueueSnackbar(t('adminBookings.gearCreatePartialFailure', { id: bookingId }), {
            variant: 'error',
          });
          refreshBookings?.();
          return;
        }
      }

      await dispatch(
        editAdminBooking(bookingId, {
          paymentStatus: bookingMeta.paymentStatus,
          internalComment: bookingMeta.internalComment?.trim() || undefined,
          bookingPaymentMethod: bookingMeta.paymentMethod,
        })
      );

      enqueueSnackbar(t('adminBookings.gearCreateSuccess'), { variant: 'success' });
      resetForm();
      onClose();
      refreshBookings?.();
    } catch {
      enqueueSnackbar(t('adminBookings.gearCreate.error'), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{t('adminBookings.newGearBooking')}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('adminBookings.createStudent.searchLabel')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <Autocomplete
                  sx={{ flex: 1 }}
                  options={teachers}
                  filterOptions={(options) => options}
                  getOptionLabel={(option) => `${option.name} ${option.lastname}`.trim()}
                  value={student}
                  inputValue={studentSearch}
                  onChange={(e, newValue) => handleStudentChange(newValue)}
                  onInputChange={(event, newValue, reason) => {
                    if (reason === 'input') {
                      setStudentSearch(newValue);
                    }
                  }}
                  noOptionsText={t('adminBookings.createStudent.noResults')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label={t('adminBookings.createStudent.searchLabel')}
                      placeholder={t('adminBookings.createStudent.searchPlaceholder')}
                    />
                  )}
                />
                <Button
                  variant="outlined"
                  onClick={() => setCreateStudentOpen(true)}
                  sx={{ minWidth: 44, px: 1, mt: 0.5 }}
                  title={t('adminBookings.createStudent.openButton')}
                >
                  <PersonAddIcon />
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="gear-resort-label">{t('adminBookings.table.resort')}</InputLabel>
                <Select
                  labelId="gear-resort-label"
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
                <InputLabel id="gear-payment-status-label">
                  {t('adminBookings.table.paymentStatus')}
                </InputLabel>
                <Select
                  labelId="gear-payment-status-label"
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
                <InputLabel id="gear-payment-method-label">
                  {t('adminBookings.gearCreate.paymentMethod')}
                </InputLabel>
                <Select
                  labelId="gear-payment-method-label"
                  label={t('adminBookings.gearCreate.paymentMethod')}
                  value={bookingMeta.paymentMethod}
                  onChange={(e) => patchBookingMeta({ paymentMethod: e.target.value })}
                >
                  <MenuItem value="CASH">{t('adminBookings.gearCreate.paymentCash')}</MenuItem>
                  <MenuItem value="WIRE_TRANSFER">
                    {t('adminBookings.gearCreate.paymentWireTransfer')}
                  </MenuItem>
                </Select>
              </FormControl>
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
                      <InputLabel id="gear-fulfillment-label">
                        {t('adminBookings.rental.delivery')}
                      </InputLabel>
                      <Select
                        labelId="gear-fulfillment-label"
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
                          <InputLabel id="gear-dest-type-label">
                            {t('adminBookings.rental.destinationType')}
                          </InputLabel>
                          <Select
                            labelId="gear-dest-type-label"
                            label={t('adminBookings.rental.destinationType')}
                            value={bookingMeta.rentalDestinationType}
                            onChange={(e) =>
                              patchBookingMeta({ rentalDestinationType: e.target.value })
                            }
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
                          onChange={(e) =>
                            patchBookingMeta({ rentalDestinationDetail: e.target.value })
                          }
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {lines.map((line, index) => (
            <Box key={`gear-line-${index}`} sx={{ position: 'relative', mt: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="subtitle2">
                  {t('adminBookings.gearCreate.lineLabel', { n: index + 1 })}
                </Typography>
                {lines.length > 1 && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveLine(index)}
                    aria-label={t('adminBookings.gearCreate.removeRentalLine')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <BookingRentalFieldsSection
                rental={line}
                onChange={(fields) => patchLine(index, fields)}
                resort={bookingMeta.resort}
                prefillHint={linePrefillHints[index]}
                hideFulfillment
                gearOnly
                sectionTitle={t('adminBookings.gearCreate.lineLabel', { n: index + 1 })}
              />
            </Box>
          ))}

          <Button variant="outlined" onClick={handleAddLine} sx={{ mt: 2 }}>
            {t('adminBookings.gearCreate.addRentalLine')}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('adminBookings.intent.cancel')}</Button>
          <LoadingButton variant="contained" loading={submitting} onClick={handleSubmit}>
            {t('adminBookings.newGearBooking')}
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <CreateStudentModal
        open={createStudentOpen}
        onClose={() => setCreateStudentOpen(false)}
        onCreated={handleStudentCreated}
        initialName={studentSearch}
      />
    </>
  );
}
