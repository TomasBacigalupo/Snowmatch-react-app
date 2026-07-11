import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useSelector } from '../../../redux/store';
import useAuth from '../../../hooks/useAuth';
import Scrollbar from '../../../components/Scrollbar';
import AdminBookingTableCard from './list/AdminBookingTableCard';
import BookingDetailsDrawer from './list/BookingDetailsDrawer';
import GearBookingDetailsDrawer from './list/GearBookingDetailsDrawer';
import {
  fetchBookingsBetweenParticipants,
  participantDisplayName,
  resolveTeacherStudentParticipants,
} from '../../../utils/adminUserChatBookings';

// ----------------------------------------------------------------------

AdminUserChatBookingsPanel.propTypes = {
  conversationId: PropTypes.string,
};

export default function AdminUserChatBookingsPanel({ conversationId }) {
  const { t } = useTranslation();
  const { isResortAdmin } = useAuth();
  const participants = useSelector((state) => state.chat.participants);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { teacher, student } = resolveTeacherStudentParticipants(participants);
  const participantIds = useMemo(
    () => participants.map((p) => p.id).filter(Boolean),
    [participants]
  );

  const loadBookings = useCallback(async () => {
    if (participantIds.length < 2) {
      setBookings([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchBookingsBetweenParticipants(participantIds, { resortAdmin: isResortAdmin });
      setBookings(rows);
    } catch (error) {
      console.error(error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [isResortAdmin, participantIds]);

  useEffect(() => {
    loadBookings();
  }, [conversationId, loadBookings]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const isGearBooking = selectedBooking?.type === 'GEAR_ONLY';

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography variant="h6">{t('adminUserChats.bookings.title')}</Typography>
          {participantIds.length >= 2 && (
            <Stack spacing={0.5} sx={{ mt: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                {t('adminUserChats.bookings.instructor')}:{' '}
                <Typography component="span" variant="body2" color="text.primary">
                  {participantDisplayName(teacher)}
                </Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('adminUserChats.bookings.student')}:{' '}
                <Typography component="span" variant="body2" color="text.primary">
                  {participantDisplayName(student)}
                </Typography>
              </Typography>
            </Stack>
          )}
        </Box>

        <Divider />

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <Scrollbar sx={{ height: '100%', maxHeight: { xs: 280, md: 'calc(100dvh - 280px)' } }}>
            <Box sx={{ p: 2 }}>
              {loading && (
                <Stack spacing={1.5}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={120} />
                  ))}
                </Stack>
              )}

              {!loading && participantIds.length < 2 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {t('adminUserChats.bookings.participantsLoading')}
                </Typography>
              )}

              {!loading && participantIds.length >= 2 && bookings.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  {t('adminUserChats.bookings.empty')}
                </Typography>
              )}

              {!loading &&
                bookings.map((booking) => (
                  <Box
                    key={booking.id}
                    onClick={() => handleBookingClick(booking)}
                    sx={{ cursor: 'pointer', '&:hover': { opacity: 0.92 } }}
                  >
                    <AdminBookingTableCard row={booking} compact />
                  </Box>
                ))}
            </Box>
          </Scrollbar>
        </Box>
      </Card>

      {selectedBooking &&
        (isGearBooking ? (
          <GearBookingDetailsDrawer
            open={drawerOpen}
            onClose={handleDrawerClose}
            booking={selectedBooking}
            refreshBookings={loadBookings}
          />
        ) : (
          <BookingDetailsDrawer
            open={drawerOpen}
            onClose={handleDrawerClose}
            booking={selectedBooking}
            refreshBookings={loadBookings}
          />
        ))}
    </>
  );
}
