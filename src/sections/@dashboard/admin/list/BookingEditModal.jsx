import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { editAdminBooking } from 'src/redux/slices/admin';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

const RESORT_OPTIONS = [
  {
    category: 'Argentina',
    resorts: [
      'Caviahue',
      'Cerro Bayo',
      'Cerro Castor',
      'Cerro Catedral',
      'Chapelco',
      'La Hoya',
      'Las Leñas',
      'Las Pendientes',
      'Perito Moreno',
      'Lago Hermoso',
      'Buenos Aires',
    ],
  },
  { category: 'Chile', resorts: ['Portillo'] },
];

const PAYMENT_STATUS_VALUES = ['PAID', 'PAID_10', 'PAID_20', 'PAID_30', 'PAID_40', 'PAID_50', 'UNPAID'];
const PAYMENT_METHOD_VALUES = ['CASH', 'TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD'];
const STATE_VALUES = ['PENDING', 'ACCEPTED', 'DECLINED'];
const TYPE_VALUES = ['ASSIGNED', 'REFERRED'];

BookingEditModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  onSave: PropTypes.func,
};

export default function BookingEditModal({ open, onClose, booking, onSave }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [userCommentLength, setUserCommentLength] = useState(booking?.userComment?.length || 0);
  const [internalCommentLength, setInternalCommentLength] = useState(
    booking?.internalComment?.length || 0
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedBooking = {
      id: booking.id,
      userComment: formData.get('userComment'),
      internalComment: formData.get('internalComment'),
      paymentStatus: formData.get('paymentStatus'),
      bookingPaymentMethod: formData.get('bookingPaymentMethod'),
      adults: parseInt(formData.get('adults'), 10) || 0,
      children: parseInt(formData.get('children'), 10) || 0,
      price: parseFloat(formData.get('price')) || 0,
      includesLaunch: formData.get('includesLaunch') === 'on',
      includesEquipments: formData.get('includesEquipments') === 'on',
      showPriceToTeacher: formData.get('showPriceToTeacher') === 'on',
      state: formData.get('state'),
      type: formData.get('type'),
      resort: formData.get('resort'),
      teacherId: formData.get('teacherId'),
      studentId: formData.get('studentId'),
    };

    dispatch(editAdminBooking(booking.id, updatedBooking));
    enqueueSnackbar(t('adminBookings.editModal.updateSuccess'), { variant: 'success' });
    onSave({
      ...booking,
      userComment: formData.get('userComment'),
      internalComment: formData.get('internalComment'),
      studentId: formData.get('studentId'),
      teacherId: formData.get('teacherId'),
      paymentStatus: formData.get('paymentStatus'),
      bookingPaymentMethod: formData.get('bookingPaymentMethod'),
      adults: parseInt(formData.get('adults'), 10),
      children: parseInt(formData.get('children'), 10),
      includesEquipments: formData.get('includesEquipments') === 'true',
      includesLaunch: formData.get('includesLaunch') === 'true',
      showPriceToTeacher: formData.get('showPriceToTeacher') === 'on',
      price: parseFloat(formData.get('price')),
      state: formData.get('state'),
      type: formData.get('type'),
      resort: formData.get('resort'),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('adminBookings.editModal.title', { id: booking?.id })}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.clientComment')}
                name="userComment"
                defaultValue={booking?.userComment}
                multiline
                rows={2}
                inputProps={{ maxLength: 255 }}
                onChange={(e) => setUserCommentLength(e.target.value.length)}
                helperText={t('adminBookings.editModal.charCount', { count: userCommentLength })}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.internalComment')}
                name="internalComment"
                defaultValue={booking?.internalComment}
                multiline
                rows={2}
                inputProps={{ maxLength: 255 }}
                onChange={(e) => setInternalCommentLength(e.target.value.length)}
                helperText={t('adminBookings.editModal.charCount', { count: internalCommentLength })}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.studentId')}
                name="studentId"
                defaultValue={booking?.student?.id}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.teacherId')}
                name="teacherId"
                defaultValue={booking?.teacher?.id}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.paymentStatus')}</InputLabel>
                <Select
                  name="paymentStatus"
                  label={t('adminBookings.editModal.paymentStatus')}
                  defaultValue={booking?.paymentStatus || 'UNPAID'}
                >
                  {PAYMENT_STATUS_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.paymentStatusOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.paymentMethod')}</InputLabel>
                <Select
                  name="bookingPaymentMethod"
                  label={t('adminBookings.editModal.paymentMethod')}
                  defaultValue={booking?.bookingPaymentMethod || ''}
                >
                  {PAYMENT_METHOD_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.paymentMethodOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.state')}</InputLabel>
                <Select
                  name="state"
                  label={t('adminBookings.editModal.state')}
                  defaultValue={booking?.state || 'PENDING'}
                >
                  {STATE_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.stateOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.bookingType')}</InputLabel>
                <Select
                  name="type"
                  label={t('adminBookings.editModal.bookingType')}
                  defaultValue={booking?.type || 'ASSIGNED'}
                >
                  {TYPE_VALUES.map((value) => (
                    <MenuItem key={value} value={value}>
                      {t(`adminBookings.editModal.typeOptions.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>{t('adminBookings.editModal.resort')}</InputLabel>
                <Select
                  name="resort"
                  label={t('adminBookings.editModal.resort')}
                  defaultValue={booking?.resort || ''}
                >
                  {RESORT_OPTIONS.map((country) => [
                    <MenuItem
                      key={`${country.category}-header`}
                      disabled
                      sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}
                    >
                      {country.category}
                    </MenuItem>,
                    ...country.resorts.sort().map((resort) => (
                      <MenuItem key={resort} value={resort} sx={{ pl: 3 }}>
                        {resort}
                      </MenuItem>
                    )),
                  ]).flat()}
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.adultsCount')}
                name="adults"
                type="number"
                defaultValue={booking?.adults}
                InputProps={{ inputProps: { min: 0 } }}
              />

              <TextField
                fullWidth
                label={t('adminBookings.editModal.childrenCount')}
                name="children"
                type="number"
                defaultValue={booking?.children}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <TextField
                fullWidth
                label={t('adminBookings.editModal.price')}
                name="price"
                type="number"
                defaultValue={booking?.price}
                InputProps={{
                  startAdornment: <span style={{ marginRight: 8 }}>$</span>,
                  inputProps: {
                    min: 0,
                    step: 0.01,
                    style: { textAlign: 'right' },
                  },
                }}
                sx={{
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    display: 'none',
                  },
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                }}
              />

              <Stack
                spacing={2}
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ width: '100%', alignItems: { xs: 'flex-start', sm: 'center' } }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      name="includesEquipments"
                      defaultChecked={booking?.includesEquipments}
                    />
                  }
                  label={t('adminBookings.editModal.includesEquipment')}
                />

                <FormControlLabel
                  control={
                    <Switch name="includesLaunch" defaultChecked={booking?.includesLaunch} />
                  }
                  label={t('adminBookings.editModal.includesLunch')}
                />

                <FormControlLabel
                  control={
                    <Switch
                      name="showPriceToTeacher"
                      defaultChecked={booking?.showPriceToTeacher ?? true}
                    />
                  }
                  label={t('adminBookings.editModal.showPriceToTeacher')}
                />
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('adminBookings.deleteDialog.cancel')}</Button>
          <Button type="submit" variant="contained">
            {t('adminBookings.editModal.saveChanges')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
