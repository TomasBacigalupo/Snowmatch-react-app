import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Skeleton,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Page from '../../components/Page';
import LoadingScreen from '../../components/LoadingScreen';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import Hidden from '../../components/LegacyHidden';
import { TableHeadCustom, TableNoData } from '../../components/table';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../routes/paths';
import AdminBookingTableRow from '../../sections/@dashboard/admin/list/AdminBookingTableRow';
import AdminBookingTableCard from '../../sections/@dashboard/admin/list/AdminBookingTableCard';
import {
  countTodayParticipants,
  fetchAdminBookingsForToday,
} from '../../utils/adminTodayBookings';
import { fNumber } from '../../utils/formatNumber';

const SKELETON_ROWS = 10;
const SKELETON_CARDS = 5;

function TodayKPICards({ loading, lessonCount, gearCount, participantCount, dayLabel, t }) {
  const theme = useTheme();

  const cards = [
    {
      key: 'lessons',
      label: t('adminToday.kpi.lessons', { day: dayLabel }),
      value: lessonCount,
      icon: 'eva:book-open-fill',
      color: theme.palette.primary.main,
    },
    {
      key: 'gear',
      label: t('adminToday.kpi.gear', { day: dayLabel }),
      value: gearCount,
      icon: 'eva:shopping-bag-fill',
      color: theme.palette.warning.main,
    },
    {
      key: 'participants',
      label: t('adminToday.kpi.participants'),
      value: participantCount,
      icon: 'eva:people-fill',
      color: theme.palette.info.main,
    },
  ];

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
      {cards.map((card) => (
        <Card
          key={card.key}
          sx={{
            p: 3,
            minWidth: { xs: '100%', sm: 200 },
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {card.label}
            </Typography>
            <Typography variant="h4" sx={{ color: card.color, fontWeight: 'bold' }}>
              {loading ? <Skeleton width={60} /> : fNumber(card.value)}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: `${card.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={card.icon} sx={{ width: 28, height: 28, color: card.color }} />
          </Box>
        </Card>
      ))}
    </Stack>
  );
}

function TodayBookingsSection({
  title,
  emptyMessage,
  loading,
  bookings,
  isGearAdminList,
  tableHead,
  showPrices = true,
  showPriceToggle = false,
  onToggleShowPrices,
  t,
}) {
  const showSkeleton = loading;
  const visibleTableHead = showPrices
    ? tableHead
    : tableHead.filter((headCell) => headCell.id !== 'price');

  const renderTableSkeleton = () =>
    Array.from({ length: SKELETON_ROWS }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {visibleTableHead.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            <Skeleton animation="wave" width="80%" height={24} />
          </TableCell>
        ))}
      </TableRow>
    ));

  const renderCardSkeleton = () =>
    Array.from({ length: SKELETON_CARDS }).map((_, index) => (
      <Card key={`card-skeleton-${index}`} sx={{ p: 2, mb: 2 }}>
        <Skeleton animation="wave" variant="text" width="60%" />
        <Skeleton animation="wave" variant="text" width="40%" />
        <Skeleton animation="wave" variant="text" width="80%" />
      </Card>
    ));

  const noop = () => {};

  const handleContactWapp = (countryCode, cellphone, name) => {
    window.open(
      `https://wa.me/${countryCode}${cellphone}?text=${encodeURIComponent(t('adminBookings.whatsappGreeting', { name }))}`,
      '_blank'
    );
  };

  const rowActionProps = {
    onEditRow: noop,
    onConfirmRow: noop,
    onDeclineRow: noop,
    onDeleteRow: noop,
    onEvents: noop,
  };

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="h6">{title}</Typography>
          {showPriceToggle && (
            <Tooltip
              title={
                showPrices ? t('adminToday.hidePrices') : t('adminToday.showPrices')
              }
            >
              <IconButton size="small" onClick={onToggleShowPrices} aria-label={t('adminToday.togglePrices')}>
                <Iconify
                  icon={showPrices ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                  width={20}
                  height={20}
                />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        {!loading && bookings.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {emptyMessage}
          </Typography>
        )}
      </Box>

      <Hidden smDown>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 640 }}>
            <Table size="medium">
              <TableHeadCustom headLabel={visibleTableHead} appendTrailingActionsLabel={false} />
              <TableBody>
                {showSkeleton
                  ? renderTableSkeleton()
                  : bookings.map((row) => (
                      <AdminBookingTableRow
                        key={row.id}
                        row={row}
                        isGearAdminList={isGearAdminList}
                        compact
                        showPrice={showPrices}
                        {...rowActionProps}
                        onWapp={() =>
                          handleContactWapp(
                            row.student?.countryCode || row.countryCode,
                            row.student?.cellphone || row.cellphone,
                            row.student?.name || row.name
                          )
                        }
                      />
                    ))}
                {!showSkeleton && bookings.length === 0 && (
                  <TableNoData isNotFound={bookings.length === 0} title={emptyMessage} hideImage />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Hidden>

      <Hidden smUp>
        <Box sx={{ px: 2, pb: 2 }}>
          {showSkeleton
            ? renderCardSkeleton()
            : bookings.map((row) => (
                <AdminBookingTableCard
                  key={row.id}
                  row={row}
                  isGearAdminList={isGearAdminList}
                  compact
                  showPrice={showPrices}
                  {...rowActionProps}
                  onWapp={() =>
                    handleContactWapp(
                      row.student?.countryCode || row.countryCode,
                      row.student?.cellphone || row.cellphone,
                      row.student?.name || row.name
                    )
                  }
                />
              ))}
        </Box>
      </Hidden>
    </Card>
  );
}

export default function AdminToday() {
  const { themeStretch } = useSettings();
  const { isAdmin, isInitialized } = useAuth();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessonBookings, setLessonBookings] = useState([]);
  const [gearBookings, setGearBookings] = useState([]);
  const [viewDay, setViewDay] = useState('today');
  const [showLessonPrices, setShowLessonPrices] = useState(true);

  const selectedDate = useMemo(() => {
    const date = new Date();
    if (viewDay === 'tomorrow') {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }, [viewDay]);

  const dayLabel = viewDay === 'tomorrow' ? t('adminToday.dayTomorrow') : t('adminToday.dayToday');

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString(i18n.language || 'es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [selectedDate, i18n.language]
  );

  const tableHead = useMemo(
    () => [
      { id: 'student', label: t('adminBookings.table.student'), align: 'left' },
      { id: 'teacher', label: t('adminBookings.table.teacher'), align: 'left' },
      { id: 'hours', label: t('adminBookings.table.hours'), align: 'left' },
      { id: 'dates', label: t('adminBookings.table.dates'), align: 'left' },
      { id: 'price', label: t('adminBookings.table.price'), align: 'left' },
      { id: 'internalComment', label: t('adminBookings.table.internalComment'), align: 'left' },
      { id: 'paymentStatus', label: t('adminBookings.table.paymentStatus'), align: 'left' },
    ],
    [t]
  );

  const tableHeadGear = useMemo(
    () => [
      { id: 'student', label: t('adminBookings.table.student'), align: 'left' },
      { id: 'state', label: t('adminBookings.table.state'), align: 'left' },
      { id: 'price', label: t('adminBookings.table.price'), align: 'left' },
      { id: 'paymentStatus', label: t('adminBookings.table.paymentStatus'), align: 'left' },
      { id: 'comments', label: t('adminBookings.table.notes'), align: 'left' },
    ],
    [t]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [lessons, gear] = await Promise.all([
        fetchAdminBookingsForToday('lesson', selectedDate),
        fetchAdminBookingsForToday('gear', selectedDate),
      ]);
      setLessonBookings(lessons);
      setGearBookings(gear);
    } catch (err) {
      setError(err?.message || t('adminToday.loadError'));
      setLessonBookings([]);
      setGearBookings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, t]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  if (!isInitialized) {
    return <LoadingScreen isDashboard />;
  }

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  const participantCount = countTodayParticipants(lessonBookings, gearBookings);
  const pageHeading =
    viewDay === 'tomorrow' ? t('adminToday.headingTomorrow') : t('adminToday.heading');

  return (
    <Page title={pageHeading}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={pageHeading}
          links={[
            { name: t('adminToday.breadcrumbDashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminToday.breadcrumbAdmin'), href: PATH_DASHBOARD.admin.root },
            { name: pageHeading },
          ]}
          action={
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {viewDay === 'today' ? (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:arrow-forward-fill" />}
                  onClick={() => setViewDay('tomorrow')}
                  disabled={loading}
                >
                  {t('adminToday.viewTomorrow')}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                  onClick={() => setViewDay('today')}
                  disabled={loading}
                >
                  {t('adminToday.viewToday')}
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<Iconify icon="eva:refresh-fill" />}
                onClick={loadData}
                disabled={loading}
              >
                {t('adminToday.refresh')}
              </Button>
            </Stack>
          }
        />

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          {t('adminToday.subtitle', { date: formattedDate })}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TodayKPICards
          loading={loading}
          lessonCount={lessonBookings.length}
          gearCount={gearBookings.length}
          participantCount={participantCount}
          dayLabel={dayLabel}
          t={t}
        />

        <TodayBookingsSection
          title={t('adminToday.lessonsSection', { day: dayLabel })}
          emptyMessage={t('adminToday.lessonsEmpty', { day: dayLabel })}
          loading={loading}
          bookings={lessonBookings}
          isGearAdminList={false}
          tableHead={tableHead}
          showPrices={showLessonPrices}
          showPriceToggle
          onToggleShowPrices={() => setShowLessonPrices((prev) => !prev)}
          t={t}
        />

        <TodayBookingsSection
          title={t('adminToday.gearSection', { day: dayLabel })}
          emptyMessage={t('adminToday.gearEmpty', { day: dayLabel })}
          loading={loading}
          bookings={gearBookings}
          isGearAdminList
          tableHead={tableHeadGear}
          t={t}
        />
      </Container>
    </Page>
  );
}
