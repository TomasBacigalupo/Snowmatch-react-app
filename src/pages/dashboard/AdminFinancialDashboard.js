import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
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
// redux
import { getFinancialData, exportFinancialData } from '../../redux/slices/admin';

// ----------------------------------------------------------------------

export default function AdminFinancialDashboard() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { bookings, payouts } = useSelector((state) => state.admin);
  
  // State for filters
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1, // Current month (1-12)
    resort: 'Cerro Catedral',
    instructor: '',
    bookingStatus: 'all',
    payoutStatus: 'all',
    paymentMethod: 'all',
  });

  // State for data
  const [financialData, setFinancialData] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load data when filters change
  useEffect(() => {
    loadFinancialData();
  }, [filters]);

  // Update financial data when bookings or payouts change in Redux
  useEffect(() => {
    if ((bookings && bookings.length > 0) || (payouts && payouts.length > 0)) {
      const processedData = processBookingsToFinancialData(bookings || [], payouts || [], filters);
      setFinancialData(processedData);
    }
  }, [bookings, payouts, filters]);

  const loadFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use real API call to get bookings data
      const { getBookings, getAllPayouts } = await import('../../redux/slices/admin');
      
      // Get bookings with filters (no page parameter)
      await dispatch(getBookings(
        filters.instructor || '', // teacherId
        '', // studentId (empty for all)
        filters.month, // month
        null, // page (null to avoid sending page parameter)
        1000, // size
        filters.resort || '', // resort
        null // day (null to avoid sending day parameter)
      ));
      
      // Get all payouts
      await dispatch(getAllPayouts(0, 1000));
      
      // Process bookings to create financial data
      const processedData = processBookingsToFinancialData(bookings || [], payouts || [], filters);
      setFinancialData(processedData);
      
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
    setFilters({
      month: new Date().getMonth() + 1, // Current month
      resort: 'CERRO_CATEDRAL',
      instructor: '',
      bookingStatus: 'all',
      payoutStatus: 'all',
      paymentMethod: 'all',
    });
  };

  const handleExportCSV = async () => {
    try {
      // Create CSV export with real data
      const csvContent = [
        'Booking ID,Student ID,Teacher ID,Resort,Status,Payment Status,Payment Method,Total Charged,Has Payout,Invoice URL,Created At',
        ...financialData.bookings.map(booking => 
          `${booking.bookingId},${booking.studentId},${booking.teacherId},${booking.resort},${booking.status},${booking.paymentStatus},${booking.paymentMethod},${booking.totalCharged},${booking.hasPayout},${booking.invoiceUrl || ''},${booking.createdAt}`
        ).join('\n')
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
    } catch (error) {
      setError('Error marking payout as paid');
      console.error('Error marking payout as paid:', error);
    }
  };

  // Helper function to safely get date string from booking using eventList
  const getBookingDateString = (booking) => {
    try {
      if (!booking.eventList || !Array.isArray(booking.eventList) || booking.eventList.length === 0) {
        console.log('No eventList for booking:', booking.id);
        return null;
      }
      
      // Find the earliest event.end date
      const earliestEvent = booking.eventList.reduce((earliest, event) => {
        if (!event.end) return earliest;
        const eventDate = new Date(event.end);
        if (isNaN(eventDate.getTime())) return earliest;
        
        if (!earliest) return event;
        
        const earliestDate = new Date(earliest.end);
        return eventDate < earliestDate ? event : earliest;
      }, null);
      
      if (!earliestEvent || !earliestEvent.end) {
        console.log('No valid event.end for booking:', booking.id);
        return null;
      }
      
      const date = new Date(earliestEvent.end);
      if (isNaN(date.getTime())) {
        console.log('Invalid event.end date for booking:', booking.id, earliestEvent.end);
        return null;
      }
      
      const dateStr = date.toISOString().split('T')[0];
      console.log('Booking date string from eventList:', booking.id, dateStr);
      return dateStr;
    } catch (error) {
      console.warn('Invalid booking eventList date:', booking.id, error);
      return null;
    }
  };

  // Function to process real bookings data to financial dashboard format
  const processBookingsToFinancialData = (bookings, payouts, filters) => {
    if (!bookings || !Array.isArray(bookings)) {
      return {
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
    }

    // Filter bookings based on filters
    let filteredBookings = bookings.filter(booking => {
      // Month filter - bookings are already filtered by month from API
      // Additional client-side filtering can be added here if needed

      // Resort filter
      if (filters.resort && filters.resort !== 'all' && booking.resort !== filters.resort) {
        return false;
      }

      // Instructor filter
      if (filters.instructor && booking.teacher?.id !== filters.instructor) {
        return false;
      }

      // Booking status filter
      if (filters.bookingStatus && filters.bookingStatus !== 'all') {
        const bookingStatus = booking.state?.toLowerCase() || 'pending';
        if (bookingStatus !== filters.bookingStatus) {
          return false;
        }
      }

      return true;
    });

    // Process bookings for table
    const processedBookings = filteredBookings.map(booking => ({
      id: booking.id,
      bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
      createdAt: booking.createdAt,
      studentId: booking.student?.id || 'N/A',
      teacherId: booking.teacher?.id || 'N/A',
      resort: booking.resort || 'N/A',
      status: booking.state?.toLowerCase() || 'pending',
      paymentStatus: booking.paymentStatus?.toLowerCase() || 'pending',
      paymentMethod: booking.paymentMethod?.toLowerCase() || 'other',
      hasPayout: booking.payouts && booking.payouts.length > 0,
      invoiceUrl: booking.teacherInvoiceUrl || null,
      totalCharged: booking.price || 0,
    }));

        // Process payouts from real API data
    const allPayouts = [];
    (payouts || []).forEach(payout => {
      if (payout.bookings && payout.bookings.length > 0) {
        // Create one payout entry for each booking in the set
        Array.from(payout.bookings).forEach(booking => {
          allPayouts.push({
            id: payout.id,
            payoutId: `PT${payout.id.toString().padStart(3, '0')}`,
            bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
            teacherName: payout.user?.name || payout.user?.firstName || 'N/A',
            amount: (payout.amount || 0) / payout.bookings.length, // Split amount among bookings
            currency: 'ARS', // Default currency
            status: 'pending', // Default status since it's not in the DTO
            scheduledAt: payout.createdAt,
            paidAt: null, // Not in the DTO, assuming pending
            invoiceUrl: payout.invoiceUrl || null,
          });
        });
      } else {
        // If no bookings, create a single payout entry
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

    // Filter payouts based on payout status filter
    // Note: PayOutDto doesn't have status field, so all payouts are considered pending
    const filteredPayouts = allPayouts.filter(payout => {
      if (filters.payoutStatus && filters.payoutStatus !== 'all') {
        // Since PayOutDto doesn't have status, we'll show all payouts as pending
        return filters.payoutStatus === 'pending';
      }
      return true;
    });

    // Process payments
    const payments = filteredBookings.map(booking => ({
      id: booking.id,
      bookingId: `BK${booking.id.toString().padStart(3, '0')}`,
      amount: booking.price || 0,
      currency: 'ARS',
      method: booking.paymentMethod?.toLowerCase() || 'other',
      status: booking.paymentStatus?.toLowerCase() || 'pending',
      createdAt: booking.createdAt,
    }));

    // Calculate KPIs
    const kpis = {
      totalBookings: filteredBookings.length,
      totalRevenue: filteredBookings.reduce((sum, booking) => {
        return sum + (booking.price || 0);
      }, 0),
      pendingPayouts: filteredPayouts
        .reduce((sum, payout) => sum + payout.amount, 0), // All payouts are pending
      completedPayouts: 0, // No completed payouts since PayOutDto doesn't have status
      bookingsWithPayout: filteredPayouts.length,
      bookingsWithoutPayout: filteredBookings.length - filteredPayouts.length,
      bookingsWithInvoice: filteredBookings.filter(booking => 
        booking.teacherInvoiceUrl
      ).length,
    };

    // Generate chart data
    console.log('Generating charts with:', {
      filteredBookings: filteredBookings.length,
      payments: payments.length,
      month: filters.month
    });
    
    const revenueTimeSeries = generateRevenueTimeSeries(filteredBookings, filters.month);
    const paymentMethodBreakdown = generatePaymentMethodBreakdown(payments);
    const bookingsTimeSeries = generateBookingsTimeSeries(filteredBookings, filters.month);
    
    console.log('Generated chart data:', {
      revenueTimeSeries: revenueTimeSeries.length,
      paymentMethodBreakdown: paymentMethodBreakdown.length,
      bookingsTimeSeries: bookingsTimeSeries.length
    });

    return {
      bookings: processedBookings,
      payouts: filteredPayouts,
      payments,
      kpis,
      charts: {
        revenueTimeSeries,
        paymentMethodBreakdown,
        bookingsTimeSeries,
      },
    };
  };

  // Helper functions for chart data generation
  const generateRevenueTimeSeries = (bookings, month) => {
    console.log('generateRevenueTimeSeries called with:', { bookings: bookings.length, month });
    if (!month) return [];

    const currentYear = new Date().getFullYear();
    // month is 1-12, but Date constructor expects 0-11, so subtract 1
    const daysInMonth = new Date(currentYear, month - 1, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayBookings = bookings.filter(booking => {
        const bookingDate = getBookingDateString(booking);
        return bookingDate === dateStr;
      });

      const revenue = dayBookings.reduce((sum, booking) => {
        return sum + (booking.price || 0);
      }, 0);

      days.push({
        date: dateStr,
        revenue,
        bookings: dayBookings.length,
      });
    }

    console.log('Revenue time series generated:', days.length, 'days');
    return days;
  };

  const generatePaymentMethodBreakdown = (payments) => {
    const methodMap = {
      stripe: 'Stripe',
      cash: 'Cash',
      transfer: 'Transfer',
      other: 'Other',
    };

    const breakdown = {};
    payments.forEach(payment => {
      const method = methodMap[payment.method] || 'Other';
      breakdown[method] = (breakdown[method] || 0) + payment.amount;
    });

    return Object.entries(breakdown).map(([method, amount]) => ({
      method,
      amount,
    }));
  };

  const generateBookingsTimeSeries = (bookings, month) => {
    console.log('generateBookingsTimeSeries called with:', { bookings: bookings.length, month });
    if (!month) return [];

    const currentYear = new Date().getFullYear();
    // month is 1-12, but Date constructor expects 0-11, so subtract 1
    const daysInMonth = new Date(currentYear, month - 1, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayBookings = bookings.filter(booking => {
        const bookingDate = getBookingDateString(booking);
        return bookingDate === dateStr;
      });

      days.push({
        date: dateStr,
        count: dayBookings.length,
      });
    }

    console.log('Bookings time series generated:', days.length, 'days');
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

        {/* Filters Bar */}
        <Card sx={{ mb: 3, p: 3 }}>
          <FinancialFiltersBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onExportCSV={handleExportCSV}
            loading={loading}
          />
        </Card>

        {/* KPI Cards */}
        <Box sx={{ mb: 3 }}>
          <FinancialKPICards kpis={financialData.kpis} loading={loading} />
        </Box>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Revenue Time Series
              </Typography>
              {console.log('Rendering RevenueChart with data:', financialData.charts.revenueTimeSeries)}
              <FinancialCharts.RevenueChart data={financialData.charts.revenueTimeSeries} />
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Payment Methods Breakdown
              </Typography>
              {console.log('Rendering PaymentMethodChart with data:', financialData.charts.paymentMethodBreakdown)}
              <FinancialCharts.PaymentMethodChart data={financialData.charts.paymentMethodBreakdown} />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Bookings Time Series
              </Typography>
              {console.log('Rendering BookingsChart with data:', financialData.charts.bookingsTimeSeries)}
              <FinancialCharts.BookingsChart data={financialData.charts.bookingsTimeSeries} />
            </Card>
          </Grid>
        </Grid>

        {/* Tables */}
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

        {/* Snackbars for notifications */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
} 