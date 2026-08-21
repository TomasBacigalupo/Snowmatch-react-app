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
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
import {
  getBookingCustomerLabel,
  getBookingRosterClients,
  getBookingRosterStudents,
} from '../../utils/adminBookingParticipants';

const SCHOOL_BUSINESS_ID = 13;

const VALID_CATEGORIES = new Set(['paid', 'unpaid', 'pending_payout', 'completed_payout']);

const CATEGORY_TITLE_KEYS = {
  paid: 'adminFinancial.detail.paidTitle',
  unpaid: 'adminFinancial.detail.unpaidTitle',
  pending_payout: 'adminFinancial.detail.pendingPayoutTitle',
  completed_payout: 'adminFinancial.detail.completedPayoutTitle',
};

const FILTER_ALL = 'all';
const FILTER_NO_AGENCY = 'none';

function displayPersonName(person) {
  if (!person || typeof person !== 'object') return '';
  return [person.name, person.lastname].filter(Boolean).join(' ').trim() || person.email || '';
}

function getBookingAgencyId(booking) {
  const id = booking?.agency?.id ?? booking?.agencyId;
  if (id == null || id === '' || Number(id) === 0) return null;
  return String(id);
}

function getBookingClientKeys(booking) {
  const keys = [];
  const student = booking?.student;
  if (student?.id != null) {
    keys.push(`student:${student.id}`);
  }
  getBookingRosterStudents(booking).forEach((s) => {
    if (s?.id != null) keys.push(`student:${s.id}`);
  });
  getBookingRosterClients(booking).forEach((c) => {
    if (c?.id != null) keys.push(`client:${c.id}`);
  });
  return keys;
}

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
  const [agencyFilter, setAgencyFilter] = useState(FILTER_ALL);
  const [teacherFilter, setTeacherFilter] = useState(FILTER_ALL);
  const [clientFilter, setClientFilter] = useState(FILTER_ALL);

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

  useEffect(() => {
    setAgencyFilter(FILTER_ALL);
    setTeacherFilter(FILTER_ALL);
    setClientFilter(FILTER_ALL);
  }, [from, to, resort, category]);

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

  const agencyOptions = useMemo(() => {
    const byId = new Map();
    (financialBookings || []).forEach((booking) => {
      const id = getBookingAgencyId(booking);
      if (!id) return;
      if (!byId.has(id)) {
        byId.set(id, booking.agency?.name || `#${id}`);
      }
    });
    return Array.from(byId.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [financialBookings]);

  const teacherOptions = useMemo(() => {
    const byId = new Map();
    (financialBookings || []).forEach((booking) => {
      const teacher = booking?.teacher;
      if (teacher?.id == null) return;
      const value = String(teacher.id);
      if (!byId.has(value)) {
        byId.set(value, displayPersonName(teacher) || `#${value}`);
      }
    });
    return Array.from(byId.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [financialBookings]);

  const clientOptions = useMemo(() => {
    const byKey = new Map();
    const addPerson = (prefix, person) => {
      if (person?.id == null) return;
      const key = `${prefix}:${person.id}`;
      if (!byKey.has(key)) {
        byKey.set(key, displayPersonName(person) || `#${person.id}`);
      }
    };
    (financialBookings || []).forEach((booking) => {
      addPerson('student', booking?.student);
      getBookingRosterStudents(booking).forEach((s) => addPerson('student', s));
      getBookingRosterClients(booking).forEach((c) => addPerson('client', c));
    });
    return Array.from(byKey.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [financialBookings]);

  const filteredBookings = useMemo(() => {
    const rows = financialBookings || [];
    return rows.filter((booking) => {
      if (agencyFilter === FILTER_NO_AGENCY) {
        if (getBookingAgencyId(booking)) return false;
      } else if (agencyFilter !== FILTER_ALL) {
        if (getBookingAgencyId(booking) !== agencyFilter) return false;
      }

      if (teacherFilter !== FILTER_ALL) {
        if (String(booking?.teacher?.id ?? '') !== teacherFilter) return false;
      }

      if (clientFilter !== FILTER_ALL) {
        if (!getBookingClientKeys(booking).includes(clientFilter)) return false;
      }

      return true;
    });
  }, [financialBookings, agencyFilter, teacherFilter, clientFilter]);

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
                    count: filteredBookings.length,
                  })}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Card>
                <Box sx={{ px: 2.5, py: 2 }}>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6">{t('adminFinancial.detail.bookingsTitle')}</Typography>
                      {isLoadingFinancialBookings && <CircularProgress size={18} />}
                    </Box>
                    <Stack
                      spacing={2}
                      direction={{ xs: 'column', md: 'row' }}
                      sx={{ alignItems: { md: 'flex-start' } }}
                    >
                      <TextField
                        select
                        size="small"
                        label={t('adminFinancial.detail.filterAgency')}
                        value={agencyFilter}
                        onChange={(e) => setAgencyFilter(e.target.value)}
                        sx={{ minWidth: { md: 200 } }}
                      >
                        <MenuItem value={FILTER_ALL}>{t('adminFinancial.detail.filterAll')}</MenuItem>
                        <MenuItem value={FILTER_NO_AGENCY}>
                          {t('adminFinancial.detail.filterNoAgency')}
                        </MenuItem>
                        {agencyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size="small"
                        label={t('adminFinancial.detail.filterTeacher')}
                        value={teacherFilter}
                        onChange={(e) => setTeacherFilter(e.target.value)}
                        sx={{ minWidth: { md: 200 } }}
                      >
                        <MenuItem value={FILTER_ALL}>{t('adminFinancial.detail.filterAll')}</MenuItem>
                        {teacherOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        size="small"
                        label={t('adminFinancial.detail.filterClient')}
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                        sx={{ minWidth: { md: 200 } }}
                      >
                        <MenuItem value={FILTER_ALL}>{t('adminFinancial.detail.filterAll')}</MenuItem>
                        {clientOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Stack>
                  </Stack>
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
                      ) : filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={showPayoutColumn ? 9 : 8}>
                            <Typography variant="body2" color="text.secondary">
                              {t('adminFinancial.detail.emptyFiltered')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((row) => {
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
