import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import FinancialFiltersBar from '../../sections/@dashboard/admin/financial/FinancialFiltersBar';
import FinancialKPICards from '../../sections/@dashboard/admin/financial/FinancialKPICards';
import FinancialCharts from '../../sections/@dashboard/admin/financial/FinancialCharts';
import PayoutsTable from '../../sections/@dashboard/admin/financial/PayoutsTable';
import BookingsTable from '../../sections/@dashboard/admin/financial/BookingsTable';
// utils
import {
  ADMIN_BOOKING_RESORT_FILTER_OPTIONS,
  formatAdminBookingResortLabel,
} from '../../utils/adminBookingResortOptions';

// ----------------------------------------------------------------------

const DEFAULT_FILTERS = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  resort: 'CERRO_CATEDRAL',
  instructor: '',
  bookingStatus: 'all',
  payoutStatus: 'all',
  paymentMethod: 'all',
};

const emptyFinancialData = {
  bookings: [],
  payouts: [],
  payments: [],
  kpis: {
    totalBookings: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    bookingsWithPayout: 0,
    bookingsWithoutPayout: 0,
    bookingsWithInvoice: 0,
  },
  charts: {
    revenueTimeSeries: [],
    paymentMethodBreakdown: [],
    bookingsTimeSeries: [],
  },
};

const normalizePaymentMethod = (booking) => {
  const raw = booking.bookingPaymentMethod || booking.paymentMethod || '';
  return String(raw).toUpperCase() || 'OTHER';
};

const bookingMatchesResort = (bookingResort, filterResort) => {
  if (!filterResort || filterResort === 'all') return true;
  if (!bookingResort) return false;
  if (bookingResort === filterResort) return true;
  const label = ADMIN_BOOKING_RESORT_FILTER_OPTIONS.find((o) => o.value === filterResort)?.label;
  return Boolean(label && bookingResort === label);
};

export default function AdminFinancialDashboard() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { bookings, payouts } = useSelector((state) => state.admin);
  
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [financialData, setFinancialData] = useState(emptyFinancialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadFinancialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if ((bookings && bookings.length > 0) || (payouts && payouts.length > 0)) {
      setFinancialData(processBookingsToFinancialData(bookings || [], payouts || [], filters));
    } else if (!loading) {
      setFinancialData(processBookingsToFinancialData([], payouts || [], filters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, payouts, filters]);

  const loadFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { getBookings, getAllPayouts } = await import('../../redux/slices/admin');
      const resortParam = filters.resort && filters.resort !== 'all' ? filters.resort : '';
      const stateParam =
        filters.bookingStatus && filters.bookingStatus !== 'all' ? filters.bookingStatus : null;

      await dispatch(
        getBookings(
          filters.instructor || '',
          '',
          filters.month,
          null,
          1000,
          resortParam,
          null,
          null,
          filters.year,
          stateParam
        )
      );

      await dispatch(getAllPayouts(0, 1000));
    } catch (err) {
      setError('Error loading financial data');
      console.error('Error loading financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const handleExportCSV = async () => {
    try {
      const csvContent = [
        'Booking ID,Student ID,Teacher ID,Resort,Status,Payment Status,Payment Method,Total Charged,Has Payout,Invoice URL,Created At',
        ...financialData.bookings.map(
          (booking) =>
            `${booking.bookingId},${booking.studentId},${booking.teacherId},${booking.resort},${booking.status},${booking.paymentStatus},${booking.paymentMethod},${booking.totalCharged},${booking.hasPayout},${booking.invoiceUrl || ''},${booking.createdAt}`
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `financial-data-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccessMessage('Data exported successfully');
    } catch (err) {
      setError('Error exporting data');
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setError(null);
  };

  const handleMarkAsPaid = async (payoutId) => {
    try {
      const { markPayoutAsPaid } = await import('../../redux/slices/admin');
      await dispatch(markPayoutAsPaid(payoutId));
      setSuccessMessage('Payout marked as paid successfully');
    } catch (markError) {
      setError('Error marking payout as paid');
      console.error('Error marking payout as paid:', markError);
    }
  };

  const getBookingDateString = (booking) => {
    try {
      if (!booking.eventList || !Array.isArray(booking.eventList) || booking.eventList.length === 0) {
        return null;
      }

      const earliestEvent = booking.eventList.reduce((earliest, event) => {
        if (!event.end) return earliest;
        const eventDate = new Date(event.end);
        if (Number.isNaN(eventDate.getTime())) return earliest;
        if (!earliest) return event;
        const earliestDate = new Date(earliest.end);
        return eventDate < earliestDate ? event : earliest;
      }, null);

      if (!earliestEvent?.end) return null;

      const date = new Date(earliestEvent.end);
      if (Number.isNaN(date.getTime())) return null;

      return date.toISOString().split('T')[0];
    } catch (dateError) {
      console.warn('Invalid booking eventList date:', booking.id, dateError);
      return null;
    }
  };

  const processBookingsToFinancialData = (bookingsList, payoutsList, activeFilters) => {
    if (!bookingsList || !Array.isArray(bookingsList)) {
      return emptyFinancialData;
    }

    const filteredBookings = bookingsList.filter((booking) => {
      if (!bookingMatchesResort(booking.resort, activeFilters.resort)) {
        return false;
      }

      if (
        activeFilters.instructor &&
        String(booking.teacher?.id ?? '') !== String(activeFilters.instructor)
      ) {
        return false;
      }

      if (activeFilters.bookingStatus && activeFilters.bookingStatus !== 'all') {
        const bookingStatus = String(booking.state || '').toUpperCase();
        if (bookingStatus !== activeFilters.bookingStatus) {
          return false;
        }
      }

      if (activeFilters.paymentMethod && activeFilters.paymentMethod !== 'all') {
        if (normalizePaymentMethod(booking) !== activeFilters.paymentMethod) {
          return false;
        }
      }

      return true;
    });

    const processedBookings = filteredBookings.map((booking) => ({
      id: booking.id,
      bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
      createdAt: booking.createdAt,
      studentId: booking.student?.id || 'N/A',
      teacherId: booking.teacher?.id || 'N/A',
      resort: formatAdminBookingResortLabel(booking.resort) || booking.resort || 'N/A',
      status: booking.state || 'PENDING',
      paymentStatus: booking.paymentStatus || 'PENDING',
      paymentMethod: normalizePaymentMethod(booking),
      hasPayout: booking.payouts && booking.payouts.length > 0,
      invoiceUrl: booking.teacherInvoiceUrl || null,
      totalCharged: booking.price || 0,
    }));

    const allPayouts = [];
    (payoutsList || []).forEach((payout) => {
      if (payout.bookings && payout.bookings.length > 0) {
        Array.from(payout.bookings).forEach((booking) => {
          allPayouts.push({
            id: payout.id,
            payoutId: `PT${payout.id.toString().padStart(3, '0')}`,
            bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
            teacherName: payout.user?.name || payout.user?.firstName || 'N/A',
            amount: (payout.amount || 0) / payout.bookings.length,
            currency: 'ARS',
            status: 'pending',
            scheduledAt: payout.createdAt,
            paidAt: null,
            invoiceUrl: payout.invoiceUrl || null,
          });
        });
      } else {
        allPayouts.push({
          id: payout.id,
          payoutId: `PT${payout.id.toString().padStart(3, '0')}`,
          bookingId: 'N/A',
          teacherName: payout.user?.name || payout.user?.firstName || 'N/A',
          amount: payout.amount || 0,
          currency: 'ARS',
          status: 'pending',
          scheduledAt: payout.createdAt,
          paidAt: null,
          invoiceUrl: payout.invoiceUrl || null,
        });
      }
    });

    const filteredPayouts = allPayouts.filter((payout) => {
      if (activeFilters.payoutStatus && activeFilters.payoutStatus !== 'all') {
        return activeFilters.payoutStatus === 'pending';
      }
      return true;
    });

    const payments = filteredBookings.map((booking) => ({
      id: booking.id,
      bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
      amount: booking.price || 0,
      currency: 'ARS',
      method: normalizePaymentMethod(booking),
      status: booking.paymentStatus || 'PENDING',
      createdAt: booking.createdAt,
    }));

    const kpis = {
      totalBookings: filteredBookings.length,
      totalRevenue: filteredBookings.reduce((sum, booking) => sum + (booking.price || 0), 0),
      pendingPayouts: filteredPayouts.reduce((sum, payout) => sum + payout.amount, 0),
      completedPayouts: 0,
      bookingsWithPayout: filteredPayouts.length,
      bookingsWithoutPayout: Math.max(filteredBookings.length - filteredPayouts.length, 0),
      bookingsWithInvoice: filteredBookings.filter((booking) => booking.teacherInvoiceUrl).length,
    };

    return {
      bookings: processedBookings,
      payouts: filteredPayouts,
      payments,
      kpis,
      charts: {
        revenueTimeSeries: generateRevenueTimeSeries(
          filteredBookings,
          activeFilters.month,
          activeFilters.year
        ),
        paymentMethodBreakdown: generatePaymentMethodBreakdown(payments),
        bookingsTimeSeries: generateBookingsTimeSeries(
          filteredBookings,
          activeFilters.month,
          activeFilters.year
        ),
      },
    };
  };

  const generateRevenueTimeSeries = (bookingsList, month, year) => {
    if (!month || !year) return [];

    // month is 1-12; Date(year, month, 0) = last day of that month
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayBookings = bookingsList.filter((booking) => getBookingDateString(booking) === dateStr);
      const revenue = dayBookings.reduce((sum, booking) => sum + (booking.price || 0), 0);

      days.push({
        date: dateStr,
        revenue,
        bookings: dayBookings.length,
      });
    }

    return days;
  };

  const generatePaymentMethodBreakdown = (payments) => {
    const methodMap = {
      CASH: 'Cash',
      TRANSFER: 'Transfer',
      DEBIT_CARD: 'Debit Card',
      CREDIT_CARD: 'Credit Card',
      OTHER: 'Other',
    };

    const breakdown = {};
    payments.forEach((payment) => {
      const method = methodMap[payment.method] || 'Other';
      breakdown[method] = (breakdown[method] || 0) + payment.amount;
    });

    return Object.entries(breakdown).map(([method, amount]) => ({
      method,
      amount,
    }));
  };

  const generateBookingsTimeSeries = (bookingsList, month, year) => {
    if (!month || !year) return [];

    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayBookings = bookingsList.filter((booking) => getBookingDateString(booking) === dateStr);

      days.push({
        date: dateStr,
        count: dayBookings.length,
      });
    }

    return days;
  };

  return (
    <Page title="Admin Financial Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Financial Dashboard"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Financial' },
          ]}
        />

        <Card sx={{ mb: 3, p: 3 }}>
          <FinancialFiltersBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onExportCSV={handleExportCSV}
            loading={loading}
          />
        </Card>

        <Box sx={{ mb: 3 }}>
          <FinancialKPICards kpis={financialData.kpis} loading={loading} />
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Time Series
              </Typography>
              <FinancialCharts.RevenueChart data={financialData.charts.revenueTimeSeries} />
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Methods Breakdown
              </Typography>
              <FinancialCharts.PaymentMethodChart data={financialData.charts.paymentMethodBreakdown} />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bookings Time Series
              </Typography>
              <FinancialCharts.BookingsChart data={financialData.charts.bookingsTimeSeries} />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payouts
              </Typography>
              <PayoutsTable
                payouts={financialData.payouts}
                loading={loading}
                onRefresh={loadFinancialData}
                onMarkAsPaid={handleMarkAsPaid}
              />
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bookings
              </Typography>
              <BookingsTable
                bookings={financialData.bookings}
                loading={loading}
                onRefresh={loadFinancialData}
              />
            </Card>
          </Grid>
        </Grid>

        <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}
