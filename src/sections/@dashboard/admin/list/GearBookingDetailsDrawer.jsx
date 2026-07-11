import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
  IconButton,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import GearBookingEditModal from './GearBookingEditModal';
import BookingRentalFulfillmentSection from './BookingRentalFulfillmentSection';
import { formatAdminBookingResortLabel } from 'src/utils/adminBookingResortOptions';

const GEAR_DETAILS_LINK_BASE = 'https://snowmatch.pro/es/gear-details';

GearBookingDetailsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  booking: PropTypes.object,
  refreshBookings: PropTypes.func,
  onBookingUpdated: PropTypes.func,
};

export default function GearBookingDetailsDrawer({
  open,
  onClose,
  booking,
  refreshBookings,
  onBookingUpdated,
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [linesRefreshKey, setLinesRefreshKey] = useState(0);
  const isLessonWithGear = booking?.type && booking.type !== 'GEAR_ONLY';

  const clientName =
    [booking?.student?.name, booking?.student?.lastname].filter(Boolean).join(' ').trim() ||
    [booking?.name, booking?.lastname].filter(Boolean).join(' ').trim() ||
    '';
  const countryCode = booking?.student?.countryCode ?? booking?.countryCode ?? '';
  const rawPhone = booking?.student?.cellphone ?? booking?.cellphone ?? '';
  const phoneDisplay = rawPhone ? `${countryCode ? `${countryCode} ` : ''}${rawPhone}`.trim() : '';

  const gearDetailsLink = booking?.id ? `${GEAR_DETAILS_LINK_BASE}/${booking.id}` : '';

  const openWhatsApp = () => {
    if (!rawPhone) return;
    const waNumber = `${countryCode}${rawPhone}`.replace(/\D/g, '');
    if (!waNumber) return;
    const message = `Hola ${clientName || 'cliente'}, te contacto desde SnowMatch sobre la reserva #${booking?.id}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyGearDetailsLink = async () => {
    if (!gearDetailsLink) return;
    try {
      await navigator.clipboard.writeText(gearDetailsLink);
      enqueueSnackbar(t('adminBookings.rental.copyGearDetailsLinkSuccess'), { variant: 'success' });
    } catch {
      enqueueSnackbar(t('adminBookings.rental.copyGearDetailsLinkError'), { variant: 'error' });
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  const handleEditSave = (updatedBooking) => {
    setEditModalOpen(false);
    setLinesRefreshKey((k) => k + 1);
    if (onBookingUpdated && updatedBooking) {
      onBookingUpdated({ ...booking, ...updatedBooking });
    }
    if (refreshBookings) {
      refreshBookings();
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        PaperProps={{
          sx: {
            paddingTop: 'env(safe-area-inset-top)',
            width: { xs: '100%', sm: 600, md: 800 },
            '& .MuiDrawer-paper': {
              width: { xs: '100%', sm: 600, md: 800 },
              boxSizing: 'border-box',
            },
          },
        }}
        BackdropProps={{
          onClick: onClose,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5">
                {isLessonWithGear
                  ? t('adminBookings.rental.drawerLessonWithGearTitle', { id: booking?.id })
                  : t('adminBookings.rental.drawerGearTitle', { id: booking?.id })}
              </Typography>
              {isLessonWithGear && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('adminBookings.rental.lessonBookingCaption', { id: booking?.id })}
                </Typography>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => setEditModalOpen(true)}>
                <Iconify icon="eva:edit-fill" />
              </IconButton>
              <IconButton onClick={onClose}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (booking?.state === 'DECLINED' && 'error') ||
                    (booking?.state === 'PENDING' && 'warning') ||
                    'success'
                  }
                  sx={{ px: 2, py: 1 }}
                >
                  {booking?.state}
                </Label>
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (booking?.paymentStatus === 'PENDING' && 'warning') ||
                    (booking?.paymentStatus === 'PAID' && 'success') ||
                    'error'
                  }
                  sx={{ px: 2, py: 1 }}
                >
                  {booking?.paymentStatus || 'PENDING'}
                </Label>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="eva:copy-fill" />}
                onClick={copyGearDetailsLink}
                disabled={!booking?.id}
              >
                {t('adminBookings.rental.copyGearDetailsLink')}
              </Button>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'stretch' }}
              useFlexGap
              sx={{ flexWrap: 'wrap' }}
            >
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  maxWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: { xs: 'flex-start', sm: 'stretch' },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:last-child': { pb: 2 },
                  }}
                >
                  <Stack spacing={1.5} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {clientName || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {phoneDisplay || 'Sin teléfono'}
                    </Typography>
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      color="success"
                      startIcon={<Iconify icon="logos:whatsapp-icon" />}
                      onClick={openWhatsApp}
                      disabled={!rawPhone}
                      sx={{ mt: 'auto' }}
                    >
                      WhatsApp
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  maxWidth: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: { xs: 'flex-start', sm: 'stretch' },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:last-child': { pb: 2 },
                  }}
                >
                  <Stack spacing={1.5} sx={{ flex: 1 }}>
                    <Box>
                      <Typography variant="body1">
                        {formatAdminBookingResortLabel(booking?.resort)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
                        {formatPrice(booking?.price)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                        Método de pago
                      </Typography>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={
                          (booking?.bookingPaymentMethod === 'CASH' && 'default') ||
                          (booking?.bookingPaymentMethod === 'TRANSFER' && 'info') ||
                          (booking?.bookingPaymentMethod === 'WIRE_TRANSFER' && 'info') ||
                          (booking?.bookingPaymentMethod === 'DEBIT_CARD' && 'secondary') ||
                          (booking?.bookingPaymentMethod === 'CREDIT_CARD' && 'primary') ||
                          'default'
                        }
                        sx={{ px: 2, py: 0.75 }}
                      >
                        {booking?.bookingPaymentMethod || 'PENDIENTE'}
                      </Label>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            <BookingRentalFulfillmentSection
              booking={booking}
              open={open}
              fetchForGearAdmin
              linesRefreshKey={linesRefreshKey}
              onEditLine={() => setEditModalOpen(true)}
            />
          </Stack>
        </Box>
      </Drawer>

      <GearBookingEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        booking={booking}
        onSave={handleEditSave}
      />
    </>
  );
}
