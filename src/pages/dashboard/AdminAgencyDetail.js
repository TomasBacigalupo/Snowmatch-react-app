import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';
import useSettings from '../../hooks/useSettings';
import { PATH_DASHBOARD } from '../../routes/paths';
import { getAgency, clearAgency, clearAgenciesError } from '../../redux/slices/agency';
import { getBookings } from '../../redux/slices/admin';
import AdminBookingTableCard from '../../sections/@dashboard/admin/list/AdminBookingTableCard';
import AgencyPaymentPDF from '../../sections/@dashboard/admin/agency/AgencyPaymentPDF';
import BookingDetailsDrawer from '../../sections/@dashboard/admin/list/BookingDetailsDrawer';
import GearBookingDetailsDrawer from '../../sections/@dashboard/admin/list/GearBookingDetailsDrawer';
import { fCurrency, fNumber } from '../../utils/formatNumber';
import { formatAdminBookingResortLabel } from '../../utils/adminBookingResortOptions';
import { getBookingCustomerLabel } from '../../utils/adminBookingParticipants';

function getPaymentStatusColor(paymentStatus) {
  if (paymentStatus === 'PENDING') return 'warning';
  if (paymentStatus === 'UNPAID') return 'error';
  if (paymentStatus === 'PAID') return 'success';
  if (paymentStatus?.startsWith('PAID_')) return 'info';
  return 'error';
}

const MONTH_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
];

const STATE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'ACCEPTED', label: 'Aceptadas' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'DECLINED', label: 'Rechazadas' },
];

function getBookingYear(booking) {
  const events = booking?.eventList;
  if (!Array.isArray(events) || events.length === 0) return null;
  const withDate = events.find((e) => e?.end || e?.start);
  if (!withDate) return null;
  const d = new Date(withDate.end || withDate.start);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
}

function getBookingMonth(booking) {
  const events = booking?.eventList;
  if (!Array.isArray(events) || events.length === 0) return null;
  const withDate = events.find((e) => e?.end || e?.start);
  if (!withDate) return null;
  const d = new Date(withDate.end || withDate.start);
  return Number.isNaN(d.getTime()) ? null : d.getMonth() + 1;
}

function formatDateRange(eventList) {
  if (!eventList?.length) return '—';
  const dates = eventList
    .map((e) => new Date(e.end || e.start))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (!dates.length) return '—';
  const start = new Date(Math.min(...dates));
  const end = new Date(Math.max(...dates));
  const fmt = (d) =>
    d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatBookingAmount(amount, currency = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount || 0);
}

function sumBookingsByCurrency(bookings) {
  const totals = {};
  bookings.forEach((booking) => {
    const currency = booking.currency || 'ARS';
    totals[currency] = (totals[currency] || 0) + (Number(booking.price) || 0);
  });
  return Object.entries(totals);
}

function buildAgencyPaymentFilename(agencyName) {
  const safeName = (agencyName || 'agencia')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const date = new Date().toISOString().slice(0, 10);
  return `cobro-agencia-${safeName}-${date}.pdf`;
}

function KpiCard({ title, value, icon, color }) {
  const theme = useTheme();
  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: theme.palette[color]?.lighter || theme.palette.grey[200],
            color: theme.palette[color]?.main || theme.palette.text.primary,
          }}
        >
          <Iconify icon={icon} width={24} height={24} />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default function AdminAgencyDetail() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const agencyId = Number(id);

  const { agency, agencyLoading, agenciesError } = useSelector((s) => s.agency);
  const { bookings, isLoadingBookings } = useSelector((s) => s.admin);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [state, setState] = useState('all');
  const [bookingKind, setBookingKind] = useState('lesson');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);

  const loadBookings = useCallback(() => {
    if (!agencyId) return;
    dispatch(
      getBookings(
        undefined,
        undefined,
        month || undefined,
        0,
        100000,
        undefined,
        undefined,
        bookingKind,
        month ? year : undefined,
        state === 'all' ? undefined : state,
        agencyId
      )
    );
  }, [dispatch, agencyId, month, year, state, bookingKind]);

  useEffect(() => {
    if (!agencyId) return undefined;
    dispatch(getAgency(agencyId));
    return () => {
      dispatch(clearAgency());
    };
  }, [dispatch, agencyId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    setSelectedBookingIds([]);
  }, [agencyId, month, year, state, bookingKind]);

  useEffect(() => {
    if (agenciesError) {
      dispatch(clearAgenciesError());
    }
  }, [agenciesError, dispatch]);

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years = new Set([current, current - 1, current - 2]);
    (bookings || []).forEach((b) => {
      const y = getBookingYear(b);
      if (y) years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    let rows = Array.isArray(bookings) ? bookings : [];
    // When month is set, backend already filters by year+month. When not, filter year client-side.
    if (!month && year) {
      rows = rows.filter((b) => {
        const y = getBookingYear(b);
        return y == null || y === year;
      });
    }
    return rows;
  }, [bookings, month, year]);

  const analytics = useMemo(() => {
    const byState = { ACCEPTED: 0, PENDING: 0, DECLINED: 0 };
    const byResort = {};
    const byMonth = {};
    let totalRevenue = 0;

    filteredBookings.forEach((b) => {
      const st = (b.state || '').toUpperCase();
      if (byState[st] != null) byState[st] += 1;
      const resort = b.resort || 'Sin centro';
      byResort[resort] = (byResort[resort] || 0) + 1;
      const m = getBookingMonth(b);
      if (m) byMonth[m] = (byMonth[m] || 0) + 1;
      if (st === 'ACCEPTED' || st === 'PENDING') {
        totalRevenue += Number(b.price) || 0;
      }
    });

    return {
      total: filteredBookings.length,
      totalRevenue,
      byState,
      byResort: Object.entries(byResort).sort((a, b) => b[1] - a[1]),
      byMonth,
    };
  }, [filteredBookings]);

  const selectedBookings = useMemo(
    () => filteredBookings.filter((booking) => selectedBookingIds.includes(booking.id)),
    [filteredBookings, selectedBookingIds]
  );

  const selectedTotals = useMemo(
    () => sumBookingsByCurrency(selectedBookings),
    [selectedBookings]
  );

  const toggleBooking = (bookingId, e) => {
    e?.stopPropagation?.();
    setSelectedBookingIds((prev) =>
      prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId]
    );
  };

  const toggleAll = (e) => {
    e?.stopPropagation?.();
    if (selectedBookingIds.length === filteredBookings.length) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(filteredBookings.map((booking) => booking.id));
    }
  };

  const handleOpenBooking = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBooking(null);
  };

  const agencyName = agency?.name || (agencyLoading ? '…' : 'Agencia');

  return (
    <Page title={`${agencyName} | Agencia`}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={agencyName}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Agencias', href: PATH_DASHBOARD.admin.agencies },
            { name: agencyName },
          ]}
          action={
            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              onClick={() => navigate(PATH_DASHBOARD.admin.agencies)}
            >
              Volver
            </Button>
          }
        />

        {agencyLoading && !agency ? (
          <Stack spacing={2}>
            <Skeleton variant="rounded" height={88} />
            <Skeleton variant="rounded" height={120} />
          </Stack>
        ) : !agency ? (
          <Card sx={{ p: 3 }}>
            <Typography color="text.secondary">No se encontró la agencia.</Typography>
            <Button sx={{ mt: 2 }} onClick={() => navigate(PATH_DASHBOARD.admin.agencies)}>
              Volver a agencias
            </Button>
          </Card>
        ) : (
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
              >
                <Box>
                  <Typography variant="h5">{agency.name}</Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
                    {agency.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {agency.phone}
                      </Typography>
                    )}
                    {agency.email && (
                      <Typography variant="body2" color="text.secondary">
                        {agency.email}
                      </Typography>
                    )}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Año</InputLabel>
                    <Select
                      label="Año"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                    >
                      {yearOptions.map((y) => (
                        <MenuItem key={y} value={y}>
                          {y}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Mes</InputLabel>
                    <Select
                      label="Mes"
                      value={month}
                      onChange={(e) => setMonth(e.target.value === '' ? '' : Number(e.target.value))}
                    >
                      {MONTH_OPTIONS.map((o) => (
                        <MenuItem key={String(o.value)} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select label="Estado" value={state} onChange={(e) => setState(e.target.value)}>
                      {STATE_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select
                      label="Tipo"
                      value={bookingKind}
                      onChange={(e) => setBookingKind(e.target.value)}
                    >
                      <MenuItem value="lesson">Clases</MenuItem>
                      <MenuItem value="gear">Equipos</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </Card>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Reservas"
                  value={isLoadingBookings ? '…' : fNumber(analytics.total)}
                  icon="eva:file-text-fill"
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Ingresos (acept. + pend.)"
                  value={isLoadingBookings ? '…' : fCurrency(analytics.totalRevenue)}
                  icon="eva:trending-up-fill"
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Aceptadas"
                  value={isLoadingBookings ? '…' : fNumber(analytics.byState.ACCEPTED)}
                  icon="eva:checkmark-circle-2-fill"
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Pendientes"
                  value={isLoadingBookings ? '…' : fNumber(analytics.byState.PENDING)}
                  icon="eva:clock-fill"
                  color="warning"
                />
              </Grid>
            </Grid>

            {(analytics.byResort.length > 0 || Object.keys(analytics.byMonth).length > 0) && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2.5, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                      Por centro
                    </Typography>
                    {analytics.byResort.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Sin datos
                      </Typography>
                    ) : (
                      <Stack spacing={1}>
                        {analytics.byResort.map(([resort, count]) => (
                          <Stack
                            key={resort}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2">
                              {formatAdminBookingResortLabel(resort) || resort}
                            </Typography>
                            <Chip size="small" label={count} />
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2.5, height: '100%' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                      Por mes ({year})
                    </Typography>
                    <Stack spacing={1}>
                      {MONTH_OPTIONS.filter((o) => o.value !== '' && (analytics.byMonth[o.value] || 0) > 0)
                        .map((o) => {
                          const count = analytics.byMonth[o.value] || 0;
                          return (
                            <Stack
                              key={o.value}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="body2">{o.label}</Typography>
                              <Chip size="small" label={count} />
                            </Stack>
                          );
                        })}
                      {Object.keys(analytics.byMonth).length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Sin datos de fechas
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            )}

            <Card>
              <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h6">Reservas</Typography>
                {isLoadingBookings && <CircularProgress size={18} />}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                  {filteredBookings.length} resultado{filteredBookings.length === 1 ? '' : 's'}
                </Typography>
              </Box>

              {selectedBookingIds.length > 0 && (
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                    bgcolor: 'action.selected',
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2">
                    {t('adminAgencyDetail.selectedCount', { count: selectedBookingIds.length })}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedTotals.map(([currency, total]) => (
                      <Chip
                        key={currency}
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={`${t('adminAgencyDetail.selectedTotal')}: ${formatBookingAmount(total, currency)}`}
                      />
                    ))}
                  </Stack>
                  <Box sx={{ ml: { sm: 'auto' } }}>
                    <PDFDownloadLink
                      key={`agency-payment-pdf-${selectedBookingIds.join('-')}`}
                      document={
                        <AgencyPaymentPDF agency={agency} bookings={selectedBookings} issueDate={new Date()} />
                      }
                      fileName={buildAgencyPaymentFilename(agency.name)}
                      style={{ textDecoration: 'none' }}
                    >
                      {({ loading }) => (
                        <Button
                          variant="contained"
                          size="small"
                          disabled={loading || selectedBookings.length === 0}
                          startIcon={
                            loading ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <Iconify icon="eva:download-fill" />
                            )
                          }
                        >
                          {t('adminAgencyDetail.downloadPdf')}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  </Box>
                </Box>
              )}

              {/* Desktop table */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={
                              selectedBookingIds.length > 0 &&
                              selectedBookingIds.length < filteredBookings.length
                            }
                            checked={
                              filteredBookings.length > 0 &&
                              selectedBookingIds.length === filteredBookings.length
                            }
                            onChange={toggleAll}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Fechas</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Centro</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Pago</TableCell>
                        <TableCell align="right">Precio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoadingBookings && filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9}>
                            <Typography variant="body2" color="text.secondary">
                              Cargando reservas…
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9}>
                            <Typography variant="body2" color="text.secondary">
                              No hay reservas para esta agencia con los filtros seleccionados.
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
                              <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={selectedBookingIds.includes(row.id)}
                                  onChange={(e) => toggleBooking(row.id, e)}
                                />
                              </TableCell>
                              <TableCell>#{row.id}</TableCell>
                              <TableCell>{formatDateRange(row.eventList)}</TableCell>
                              <TableCell>{getBookingCustomerLabel(row)}</TableCell>
                              <TableCell>{teacherName || '—'}</TableCell>
                              <TableCell>
                                {formatAdminBookingResortLabel(row.resort) || row.resort || '—'}
                              </TableCell>
                              <TableCell>
                                <Label
                                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                  color={
                                    (row.state || '').toUpperCase() === 'ACCEPTED'
                                      ? 'success'
                                      : (row.state || '').toUpperCase() === 'PENDING'
                                        ? 'warning'
                                        : 'error'
                                  }
                                >
                                  {row.state || '—'}
                                </Label>
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
                              <TableCell align="right">
                                {formatBookingAmount(row.price, row.currency || 'ARS')}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile cards */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
                {isLoadingBookings && filteredBookings.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Cargando reservas…
                  </Typography>
                ) : filteredBookings.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No hay reservas para esta agencia con los filtros seleccionados.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {filteredBookings.map((booking) => (
                      <Box
                        key={booking.id}
                        onClick={() => handleOpenBooking(booking)}
                        sx={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          '&:hover': { opacity: 0.92 },
                        }}
                      >
                        <Checkbox
                          checked={selectedBookingIds.includes(booking.id)}
                          onChange={(e) => toggleBooking(booking.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ mt: 0.5 }}
                        />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <AdminBookingTableCard row={booking} compact />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Card>
          </Stack>
        )}

        {selectedBooking &&
          (selectedBooking.type === 'GEAR_ONLY' ? (
            <GearBookingDetailsDrawer
              open={drawerOpen}
              onClose={handleCloseDrawer}
              booking={selectedBooking}
              refreshBookings={loadBookings}
            />
          ) : (
            <BookingDetailsDrawer
              open={drawerOpen}
              onClose={handleCloseDrawer}
              booking={selectedBooking}
              refreshBookings={loadBookings}
            />
          ))}
      </Container>
    </Page>
  );
}
