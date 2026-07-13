import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
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
import AdminBookingIntentTableRow from '../../sections/@dashboard/admin/list/AdminBookingIntentTableRow';
import BookingDetailsDrawer from '../../sections/@dashboard/admin/list/BookingDetailsDrawer';
import GearBookingDetailsDrawer from '../../sections/@dashboard/admin/list/GearBookingDetailsDrawer';
import {
  countTodayParticipants,
  fetchAdminBookingsForToday,
  fetchAdminBookingIntentsForToday,
} from '../../utils/adminTodayBookings';
import { fNumber } from '../../utils/formatNumber';

const SKELETON_ROWS = 10;
const SKELETON_CARDS = 5;

function getTeacherDisplayName(teacher, unassignedLabel) {
  if (!teacher) return unassignedLabel;
  const fullName = `${teacher.name || ''} ${teacher.lastname || ''}`.trim();
  return fullName || unassignedLabel;
}

function getBookingEarliestStart(booking) {
  if (!Array.isArray(booking?.eventList) || !booking.eventList.length) return Number.POSITIVE_INFINITY;
  return Math.min(...booking.eventList.map((event) => new Date(event.start).getTime()));
}

function groupBookingsByTeacher(bookings, unassignedLabel) {
  const groupsMap = new Map();

  bookings.forEach((booking) => {
    const teacher = booking?.teacher || null;
    const teacherKey = teacher?.id != null ? String(teacher.id) : 'unassigned';
    if (!groupsMap.has(teacherKey)) {
      groupsMap.set(teacherKey, {
        teacherKey,
        teacher,
        teacherName: getTeacherDisplayName(teacher, unassignedLabel),
        bookings: [],
      });
    }
    groupsMap.get(teacherKey).bookings.push(booking);
  });

  return Array.from(groupsMap.values())
    .map((group) => ({
      ...group,
      bookings: [...group.bookings].sort(
        (a, b) => getBookingEarliestStart(a) - getBookingEarliestStart(b)
      ),
    }))
    .sort((a, b) => {
      if (a.teacherKey === 'unassigned') return 1;
      if (b.teacherKey === 'unassigned') return -1;
      return a.teacherName.localeCompare(b.teacherName, undefined, { sensitivity: 'base' });
    });
}

function TodayKPICards({ loading, lessonCount, gearCount, participantCount, unassignedCount, dayLabel, t }) {
  const theme = useTheme();

  const cards = [
    {
      key: 'unassigned',
      label: t('adminToday.kpi.unassigned', { day: dayLabel }),
      value: unassignedCount,
      icon: 'eva:alert-circle-fill',
      color: theme.palette.error.main,
    },
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

function TodayBookingIntentsSection({ title, emptyMessage, loading, intents, tableHead, onRefreshIntents, t }) {
  const showSkeleton = loading;

  const renderTableSkeleton = () =>
    Array.from({ length: SKELETON_ROWS }).map((_, index) => (
      <TableRow key={`intent-skeleton-${index}`}>
        {tableHead.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            <Skeleton animation="wave" width="80%" height={24} />
          </TableCell>
        ))}
      </TableRow>
    ));

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {!loading && intents.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {emptyMessage}
          </Typography>
        )}
      </Box>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 1200 }}>
          <Table size="medium">
            <TableHeadCustom headLabel={tableHead} appendTrailingActionsLabel={false} />
            <TableBody>
              {showSkeleton
                ? renderTableSkeleton()
                : intents.map((row) => (
                    <AdminBookingIntentTableRow
                      key={row.id}
                      row={row}
                      onRefreshIntents={onRefreshIntents}
                    />
                  ))}
              {!showSkeleton && intents.length === 0 && (
                <TableNoData isNotFound={intents.length === 0} title={emptyMessage} hideImage />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
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
  onOpenDetails,
  onBookingUpdated,
  groupByTeacher = false,
  t,
}) {
  const theme = useTheme();
  const [expandedTeachers, setExpandedTeachers] = useState({});
  const showSkeleton = loading;
  const visibleTableHead = showPrices
    ? tableHead
    : tableHead.filter((headCell) => headCell.id !== 'price');
  const columnCount = visibleTableHead.length;

  const teacherGroups = useMemo(() => {
    if (!groupByTeacher) return null;
    return groupBookingsByTeacher(bookings, t('adminBookings.intent.unassigned'));
  }, [bookings, groupByTeacher, t]);

  const toggleTeacherExpanded = (teacherKey) => {
    setExpandedTeachers((prev) => ({
      ...prev,
      [teacherKey]: !prev[teacherKey],
    }));
  };

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

  const renderBookingRow = (row, { groupedChild = false } = {}) => (
    <AdminBookingTableRow
      key={row.id}
      row={row}
      isGearAdminList={isGearAdminList}
      compact
      showPrice={showPrices}
      groupedChild={groupedChild}
      onOpenDetails={onOpenDetails}
      onBookingUpdated={onBookingUpdated}
      {...rowActionProps}
      onWapp={() =>
        handleContactWapp(
          row.student?.countryCode || row.countryCode,
          row.student?.cellphone || row.cellphone,
          row.student?.name || row.name
        )
      }
    />
  );

  const renderBookingCard = (row, { groupedChild = false } = {}) => (
    <AdminBookingTableCard
      key={row.id}
      row={row}
      isGearAdminList={isGearAdminList}
      compact
      showPrice={showPrices}
      groupedChild={groupedChild}
      onOpenDetails={onOpenDetails}
      onBookingUpdated={onBookingUpdated}
      {...rowActionProps}
      onWapp={() =>
        handleContactWapp(
          row.student?.countryCode || row.countryCode,
          row.student?.cellphone || row.cellphone,
          row.student?.name || row.name
        )
      }
    />
  );

  const renderGroupedTableRows = () =>
    teacherGroups.flatMap((group) => {
      if (group.bookings.length === 1) {
        return [renderBookingRow(group.bookings[0])];
      }

      const isExpanded = Boolean(expandedTeachers[group.teacherKey]);
      const headerRow = (
        <TableRow
          key={`teacher-group-${group.teacherKey}`}
          hover
          onClick={() => toggleTeacherExpanded(group.teacherKey)}
          sx={{
            cursor: 'pointer',
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
            '& > td': {
              borderBottom: isExpanded ? 'none' : undefined,
              py: 1.5,
            },
            '&:hover': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[700],
            },
          }}
        >
          <TableCell colSpan={columnCount}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify
                icon={isExpanded ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                width={20}
                height={20}
              />
              <Typography variant="subtitle2">{group.teacherName}</Typography>
              <Chip
                size="small"
                label={t('adminToday.teacherBookingsCount', { count: group.bookings.length })}
                color="default"
                variant="filled"
              />
            </Stack>
          </TableCell>
        </TableRow>
      );

      if (!isExpanded) return [headerRow];

      return [
        headerRow,
        ...group.bookings.map((row) => renderBookingRow(row, { groupedChild: true })),
      ];
    });

  const renderGroupedCards = () =>
    teacherGroups.map((group) => {
      if (group.bookings.length === 1) {
        return renderBookingCard(group.bookings[0]);
      }

      const isExpanded = Boolean(expandedTeachers[group.teacherKey]);

      return (
        <Box key={`teacher-group-card-${group.teacherKey}`} sx={{ mb: 2 }}>
          <Card
            onClick={() => toggleTeacherExpanded(group.teacherKey)}
            sx={{
              p: 2,
              cursor: 'pointer',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[200]
                  : theme.palette.grey[800],
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify
                icon={isExpanded ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                width={20}
                height={20}
              />
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                {group.teacherName}
              </Typography>
              <Chip
                size="small"
                label={t('adminToday.teacherBookingsCount', { count: group.bookings.length })}
                color="default"
                variant="filled"
              />
            </Stack>
          </Card>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 1, pl: 1.5, borderLeft: `2px solid ${theme.palette.divider}` }}>
              {group.bookings.map((row) => renderBookingCard(row, { groupedChild: true }))}
            </Box>
          </Collapse>
        </Box>
      );
    });

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
                  : groupByTeacher
                    ? renderGroupedTableRows()
                    : bookings.map((row) => renderBookingRow(row))}
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
            : groupByTeacher
              ? renderGroupedCards()
              : bookings.map((row) => renderBookingCard(row))}
        </Box>
      </Hidden>
    </Card>
  );
}

export default function AdminToday() {
  const { themeStretch } = useSettings();
  const { isAdmin, isInitialized } = useAuth();
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsId = searchParams.get('details');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lessonBookings, setLessonBookings] = useState([]);
  const [gearBookings, setGearBookings] = useState([]);
  const [bookingIntents, setBookingIntents] = useState([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [showLessonPrices, setShowLessonPrices] = useState(true);

  const selectedDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + dayOffset);
    return date;
  }, [dayOffset]);

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString(i18n.language || 'es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        ...(Math.abs(dayOffset) >= 2 ? {} : { year: 'numeric' }),
      }),
    [selectedDate, i18n.language, dayOffset]
  );

  const dayLabel = useMemo(() => {
    if (dayOffset === 0) return t('adminToday.dayToday');
    if (dayOffset === 1) return t('adminToday.dayTomorrow');
    if (dayOffset === -1) return t('adminToday.dayYesterday');
    return selectedDate.toLocaleDateString(i18n.language || 'es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [dayOffset, selectedDate, i18n.language, t]);

  const pageHeading = useMemo(() => {
    if (dayOffset === 0) return t('adminToday.heading');
    if (dayOffset === 1) return t('adminToday.headingTomorrow');
    if (dayOffset === -1) return t('adminToday.headingYesterday');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }, [dayOffset, formattedDate, t]);

  const tableHeadIntent = useMemo(
    () => [
      { id: 'id', label: t('adminBookings.table.id'), align: 'left' },
      { id: 'student', label: t('adminBookings.table.student'), align: 'left' },
      { id: 'teacher', label: t('adminBookings.table.teacher'), align: 'left' },
      { id: 'events', label: t('adminBookings.table.classes'), align: 'left' },
      { id: 'hours', label: t('adminBookings.table.hours'), align: 'left' },
      { id: 'dates', label: t('adminBookings.table.dates'), align: 'left' },
      { id: 'resort', label: t('adminBookings.table.resort'), align: 'left' },
      { id: 'capacity', label: t('adminBookings.table.capacity'), align: 'left' },
      { id: 'price', label: t('adminBookings.table.price'), align: 'left' },
      { id: 'internalComment', label: t('adminBookings.table.internalComment'), align: 'left' },
      { id: 'includes', label: t('adminBookings.table.includes'), align: 'left' },
      { id: 'paymentStatus', label: t('adminBookings.table.paymentStatus'), align: 'left' },
      { id: 'actions', label: t('adminBookings.table.actions'), align: 'right' },
    ],
    [t]
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
      { id: 'invoiceCreated', label: t('adminBookings.table.invoiceCreated'), align: 'center' },
    ],
    [t]
  );

  const tableHeadGear = useMemo(
    () => [
      { id: 'student', label: t('adminBookings.table.student'), align: 'left' },
      { id: 'state', label: t('adminBookings.table.state'), align: 'left' },
      { id: 'price', label: t('adminBookings.table.price'), align: 'left' },
      { id: 'paymentStatus', label: t('adminBookings.table.paymentStatus'), align: 'left' },
      { id: 'invoiceCreated', label: t('adminBookings.table.invoiceCreated'), align: 'center' },
      { id: 'comments', label: t('adminBookings.table.notes'), align: 'left' },
    ],
    [t]
  );

  const selectedBooking = useMemo(() => {
    if (!detailsId) return null;
    return (
      [...lessonBookings, ...gearBookings].find(
        (booking) => String(booking.id) === String(detailsId)
      ) || null
    );
  }, [detailsId, lessonBookings, gearBookings]);

  const selectedBookingIsGear = useMemo(() => {
    if (!selectedBooking) return false;
    return gearBookings.some((booking) => String(booking.id) === String(detailsId));
  }, [selectedBooking, gearBookings, detailsId]);

  const handleOpenDetails = useCallback(
    (bookingId) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('details', String(bookingId));
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const handleCloseDetails = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('details');
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const handleBookingUpdated = useCallback((updatedBooking) => {
    if (!updatedBooking?.id) return;
    const bookingId = String(updatedBooking.id);
    setLessonBookings((prev) =>
      prev.map((booking) => (String(booking.id) === bookingId ? { ...booking, ...updatedBooking } : booking))
    );
    setGearBookings((prev) =>
      prev.map((booking) => (String(booking.id) === bookingId ? { ...booking, ...updatedBooking } : booking))
    );
  }, []);

  useEffect(() => {
    if (detailsId && !loading && !selectedBooking) {
      handleCloseDetails();
    }
  }, [detailsId, loading, selectedBooking, handleCloseDetails]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [lessonsResult, gearResult, intentsResult] = await Promise.allSettled([
      fetchAdminBookingsForToday('lesson', selectedDate),
      fetchAdminBookingsForToday('gear', selectedDate),
      fetchAdminBookingIntentsForToday(selectedDate),
    ]);

    setLessonBookings(lessonsResult.status === 'fulfilled' ? lessonsResult.value : []);
    setGearBookings(gearResult.status === 'fulfilled' ? gearResult.value : []);
    setBookingIntents(intentsResult.status === 'fulfilled' ? intentsResult.value : []);

    const failures = [lessonsResult, gearResult, intentsResult].filter(
      (result) => result.status === 'rejected'
    );
    if (failures.length) {
      const reason = failures[0].reason;
      setError(typeof reason === 'string' ? reason : reason?.message || t('adminToday.loadError'));
    }

    setLoading(false);
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
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
              <Tooltip title={t('adminToday.prevDay')}>
                <IconButton
                  onClick={() => setDayOffset((offset) => offset - 1)}
                  disabled={loading}
                  aria-label={t('adminToday.prevDay')}
                >
                  <Iconify icon="eva:arrow-back-fill" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('adminToday.nextDay')}>
                <IconButton
                  onClick={() => setDayOffset((offset) => offset + 1)}
                  disabled={loading}
                  aria-label={t('adminToday.nextDay')}
                >
                  <Iconify icon="eva:arrow-forward-fill" />
                </IconButton>
              </Tooltip>
              {dayOffset !== 0 && (
                <Button
                  variant="outlined"
                  onClick={() => setDayOffset(0)}
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
          unassignedCount={bookingIntents.length}
          dayLabel={dayLabel}
          t={t}
        />

        {(loading || bookingIntents.length > 0) && (
          <TodayBookingIntentsSection
            title={t('adminToday.intentsSection', { day: dayLabel })}
            emptyMessage={t('adminToday.intentsEmpty', { day: dayLabel })}
            loading={loading}
            intents={bookingIntents}
            tableHead={tableHeadIntent}
            onRefreshIntents={loadData}
            t={t}
          />
        )}

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
          onOpenDetails={handleOpenDetails}
          onBookingUpdated={handleBookingUpdated}
          groupByTeacher
          t={t}
        />

        <TodayBookingsSection
          title={t('adminToday.gearSection', { day: dayLabel })}
          emptyMessage={t('adminToday.gearEmpty', { day: dayLabel })}
          loading={loading}
          bookings={gearBookings}
          isGearAdminList
          tableHead={tableHeadGear}
          onOpenDetails={handleOpenDetails}
          onBookingUpdated={handleBookingUpdated}
          t={t}
        />

        {selectedBooking &&
          (selectedBookingIsGear ? (
            <GearBookingDetailsDrawer
              open
              onClose={handleCloseDetails}
              booking={selectedBooking}
              refreshBookings={loadData}
              onBookingUpdated={handleBookingUpdated}
            />
          ) : (
            <BookingDetailsDrawer
              open
              onClose={handleCloseDetails}
              booking={selectedBooking}
              refreshBookings={loadData}
              onBookingUpdated={handleBookingUpdated}
            />
          ))}
      </Container>
    </Page>
  );
}
