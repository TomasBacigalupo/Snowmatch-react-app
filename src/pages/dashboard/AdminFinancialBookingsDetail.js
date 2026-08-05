import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';
import BookingDetailsDrawer from '../../sections/@dashboard/admin/list/BookingDetailsDrawer';
import { getFinancialBookings } from '../../redux/slices/admin';
import { fCurrency } from '../../utils/formatNumber';
import { formatAdminBookingResortLabel } from '../../utils/adminBookingResortOptions';
import { getBookingCustomerLabel } from '../../utils/adminBookingParticipants';

const SCHOOL_BUSINESS_ID = 13;

const VALID_CATEGORIES = new Set(['paid', 'unpaid', 'pending_payout', 'completed_payout']);

const CATEGORY_TITLE_KEYS = {
  paid: 'adminFinancial.detail.paidTitle',
  unpaid: 'adminFinancial.detail.unpaidTitle',
  pending_payout: 'adminFinancial.detail.pendingPayoutTitle',
  completed_payout: 'adminFinancial.detail.completedPayoutTitle',
};

function formatDateRange(eventList) {
  if (!eventList?.length) return '—';
  const dates = eventList
    .map((event) => new Date(event.end || event.start))
    .filter((date) => !Number.isNaN(date.getTime()));
  if (!dates.length) return '—';
  const start = new Date(Math.min(...dates));
  const end = new Date(Math.max(...dates));
  const fmt = (date) =>
    date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getPaymentStatusColor(paymentStatus) {
  if (paymentStatus === 'PENDING') return 'warning';
  if (paymentStatus === 'UNPAID') return 'error';
  if (paymentStatus === 'PAID') return 'success';
  if (paymentStatus?.startsWith('PAID_')) return 'info';
  return 'warning';
}

export default function AdminFinancialBookingsDetail() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { category } = useParams();
  const [searchParams] = useSearchParams();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const resort = searchParams.get('resort') || '';

  const { financialBookings, isLoadingFinancialBookings } = useSelector((state) => state.admin);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  const isValidCategory = VALID_CATEGORIES.has(category);
  const showPayoutColumn = category === 'pending_payout' || category === 'completed_payout';

  const loadBookings = useCallback(() => {
    if (!isValidCategory || !from || !to) {
      return;
    }
    setError(null);
    dispatch(
      getFinancialBookings({
        from,
        to,
        resort,
        businessId: SCHOOL_BUSINESS_ID,
        category,
      })
    ).catch((err) => {
      setError(err?.message || t('adminFinancial.detail.loadError'));
    });
  }, [dispatch, from, to, resort, category, isValidCategory, t]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filterLabel = useMemo(() => {
    const parts = [];
    if (from && to) {
      parts.push(t('adminFinancial.detail.rangeLabel', { from, to }));
    }
    if (resort) {
      parts.push(formatAdminBookingResortLabel(resort, t));
    } else {
      parts.push(t('adminFinancial.allResorts'));
    }
    return parts.join(' · ');
  }, [from, to, resort, t]);

  const handleOpenBooking = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const pageTitle = isValidCategory
    ? t(CATEGORY_TITLE_KEYS[category])
    : t('adminFinancial.detail.invalidCategory');

  return (
    <Page title={pageTitle}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={pageTitle}
          links={[
            { name: t('adminFinancial.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminFinancial.admin'), href: PATH_DASHBOARD.admin.root },
            { name: t('adminFinancial.heading'), href: PATH_DASHBOARD.admin.financial },
            { name: pageTitle },
          ]}
          action={
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.admin.financial}
            >
              {t('adminFinancial.detail.backToFinancial')}
            </Button>
          }
        />

        <Stack spacing={3}>
          {!isValidCategory && (
            <Alert severity="error">{t('adminFinancial.detail.invalidCategory')}</Alert>
          )}

          {isValidCategory && (!from || !to) && (
            <Alert severity="warning">{t('adminFinancial.detail.missingFilters')}</Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {isValidCategory && from && to && (
            <>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={filterLabel} size="small" />
                <Chip
                  label={t('adminFinancial.detail.resultCount', {
                    count: financialBookings?.length || 0,
                  })}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Card>
                <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{t('adminFinancial.detail.bookingsTitle')}</Typography>
                  {isLoadingFinancialBookings && <CircularProgress size={18} />}
                </Box>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('adminFinancial.detail.colId')}</TableCell>
                        <TableCell>{t('adminFinancial.detail.colDates')}</TableCell>
                        <TableCell>{t('adminFinancial.detail.colCustomer')}</TableCell>
                        <TableCell>{t('adminFinancial.detail.colAgency')}</TableCell>
                        <TableCell>{t('adminFinancial.detail.colTeacher')}</TableCell>
                        <TableCell>{t('adminFinancial.detail.colResort')}</TableCell>
                        <TableCell>{t('adminFinancial.detail.colPayment')}</TableCell>
                        {showPayoutColumn && (
                          <TableCell>{t('adminFinancial.detail.colPayout')}</TableCell>
                        )}
                        <TableCell align="right">{t('adminFinancial.detail.colPrice')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoadingFinancialBookings && (!financialBookings || financialBookings.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={showPayoutColumn ? 9 : 8}>
                            <Typography variant="body2" color="text.secondary">
                              {t('adminFinancial.detail.loading')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : financialBookings?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={showPayoutColumn ? 9 : 8}>
                            <Typography variant="body2" color="text.secondary">
                              {t('adminFinancial.detail.empty')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        financialBookings.map((row) => {
                          const teacher = row.teacher;
                          const teacherName = teacher
                            ? `${teacher.name || ''} ${teacher.lastname || ''}`.trim()
                            : '—';
                          const paymentStatus = row.paymentStatus || 'PENDING';
                          return (
                            <TableRow
                              key={row.id}
                              hover
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleOpenBooking(row)}
                            >
                              <TableCell>#{row.id}</TableCell>
                              <TableCell>{formatDateRange(row.eventList)}</TableCell>
                              <TableCell>{getBookingCustomerLabel(row)}</TableCell>
                              <TableCell>{row.agency?.name || '—'}</TableCell>
                              <TableCell>{teacherName || '—'}</TableCell>
                              <TableCell>
                                {formatAdminBookingResortLabel(row.resort, t) || row.resort || '—'}
                              </TableCell>
                              <TableCell>
                                <Label
                                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                  color={getPaymentStatusColor(paymentStatus)}
                                >
                                  {t(`adminBookings.enums.paymentStatus.${paymentStatus}`, {
                                    defaultValue: paymentStatus,
                                  })}
                                </Label>
                              </TableCell>
                              {showPayoutColumn && (
                                <TableCell>
                                  {row.payoutDone ? (
                                    <Typography variant="body2">
                                      {fCurrency(row.payoutAmount || 0)}
                                    </Typography>
                                  ) : (
                                    <Label color="warning" variant="ghost">
                                      {t('adminFinancial.detail.payoutPending')}
                                    </Label>
                                  )}
                                </TableCell>
                              )}
                              <TableCell align="right">{fCurrency(row.price || 0)}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </>
          )}
        </Stack>

        <BookingDetailsDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          booking={selectedBooking}
          refreshBookings={loadBookings}
        />
      </Container>
    </Page>
  );
}
