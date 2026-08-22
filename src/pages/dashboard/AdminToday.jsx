import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarDays, startOfDay } from 'date-fns';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Container,
  InputAdornment,
  LinearProgress,
  Skeleton,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
import { useDispatch, useSelector } from '../../redux/store';
import { getAdminBusinessMembers } from '../../redux/slices/business';
import { getTeacher } from '../../redux/slices/admin';
import AdminBookingTableRow from '../../sections/@dashboard/admin/list/AdminBookingTableRow';
import AdminBookingTableCard from '../../sections/@dashboard/admin/list/AdminBookingTableCard';
import AdminBookingIntentTableRow from '../../sections/@dashboard/admin/list/AdminBookingIntentTableRow';
import BookingDetailsDrawer from '../../sections/@dashboard/admin/list/BookingDetailsDrawer';
import GearBookingDetailsDrawer from '../../sections/@dashboard/admin/list/GearBookingDetailsDrawer';
import AvailableTeacherDetailsModal from '../../sections/@dashboard/admin/list/AvailableTeacherDetailsModal';
import TeacherDetailsDrawer from '../../sections/@dashboard/admin/list/TeacherDetailsDrawer';
import BookingModal from '../../sections/@dashboard/admin/BookingModal';
import GearBookingModal from '../../sections/@dashboard/admin/GearBookingModal';
import {
  calcAdminTodayGanancias,
  calcAdminTodayGananciasByTeacher,
  consolidateGananciasInArs,
  consolidateTeacherGananciasInArs,
  countTodayParticipants,
  DEFAULT_USD_TO_ARS_RATE,
  fetchAdminBookingsForToday,
  fetchAdminBookingIntentsForToday,
  fetchTeachersAvailableOnDay,
  filterAvailableSchoolMembers,
  formatAvailabilityWindowLabel,
  fetchMemberEventsForDay,
  getDayEventChips,
  mergeAvailableTeachers,
} from '../../utils/adminTodayBookings';
import { fNumber } from '../../utils/formatNumber';

const SKELETON_ROWS = 10;
const SKELETON_CARDS = 5;
const SCHOOL_BUSINESS_ID = 13;
const AVAILABLE_TEACHER_SKELETONS = 6;
const AVAILABLE_TEACHERS_PREVIEW_COUNT = 12;
const AVAILABLE_TEACHERS_SEARCH_THRESHOLD = 8;

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

function getAvailableTeacherLabel(member) {
  const fullName = `${member?.name || ''} ${member?.lastname || member?.lastName || ''}`.trim();
  if (!fullName) return member?.email || '—';
  if (member?.level != null && member.level !== '') return `${fullName} · L${member.level}`;
  return fullName;
}

function getAvailableTeacherSourceLabels(member, t) {
  const labels = [];
  if (member?.sources?.includes('school')) {
    labels.push({ key: 'school', label: t('adminToday.sourceSchool') });
  }
  if (member?.sources?.includes('day')) {
    labels.push({ key: 'day', label: formatAvailabilityWindowLabel(member, t) });
  }
  return labels;
}

function AvailableTeacherChip({ member, selectedDate, t, onOpen }) {
  const isSchoolMember = member?.sources?.includes('school');
  const [blocksLoading, setBlocksLoading] = useState(isSchoolMember);
  const [dayEventChips, setDayEventChips] = useState([]);

  useEffect(() => {
    if (!isSchoolMember || member?.id == null || !selectedDate) {
      setBlocksLoading(false);
      setDayEventChips([]);
      return undefined;
    }

    let cancelled = false;
    setBlocksLoading(true);
    setDayEventChips([]);

    (async () => {
      try {
        const events = await fetchMemberEventsForDay(member.id, selectedDate);
        if (cancelled) return;
        setDayEventChips(getDayEventChips(events, t));
      } catch {
        if (!cancelled) setDayEventChips([]);
      } finally {
        if (!cancelled) setBlocksLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSchoolMember, member?.id, selectedDate, t]);

  const sourceLabels = getAvailableTeacherSourceLabels(member, t);

  return (
    <Chip
      clickable
      onClick={() => onOpen(member)}
      avatar={
        <Avatar alt={getAvailableTeacherLabel(member)} src={member.imageLink || undefined}>
          {(member.name || member.email || '?').charAt(0).toUpperCase()}
        </Avatar>
      }
      label={
        <Box sx={{ py: 0.25 }}>
          <Typography variant="body2" component="span" sx={{ display: 'block' }}>
            {getAvailableTeacherLabel(member)}
          </Typography>
          {(sourceLabels.length > 0 || blocksLoading || dayEventChips.length > 0) && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.25 }}>
              {sourceLabels.map(({ key, label }) => (
                <Chip
                  key={`${member.id}-${key}-${label}`}
                  size="small"
                  variant="outlined"
                  color={key === 'school' ? 'info' : 'default'}
                  label={label}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              ))}
              {blocksLoading && (
                <Skeleton
                  variant="rounded"
                  width={56}
                  height={20}
                  sx={{ borderRadius: 1 }}
                />
              )}
              {!blocksLoading &&
                dayEventChips.map(({ key, label, color }) => (
                  <Chip
                    key={`${member.id}-${key}`}
                    size="small"
                    variant="outlined"
                    color={color === 'warning' ? 'warning' : 'default'}
                    label={label}
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                ))}
            </Stack>
          )}
        </Box>
      }
      variant="outlined"
      sx={{
        maxWidth: '100%',
        height: 'auto',
        py: 0.5,
        alignItems: 'flex-start',
        cursor: 'pointer',
      }}
    />
  );
}

function TodayAvailableTeachersSection({
  loading,
  members,
  availableTeachers,
  dayAvailableError,
  dayLabel,
  selectedDate,
  t,
}) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [fullTeacher, setFullTeacher] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    setSearchQuery('');
    setShowAll(false);
    setSelectedTeacher(null);
    setFullTeacher(null);
  }, [dayLabel]);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setShowAll(false);
  }, []);

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const handleOpenTeacher = useCallback((teacher) => {
    setSelectedTeacher(teacher);
  }, []);

  const handleCloseTeacher = useCallback(() => {
    setSelectedTeacher(null);
  }, []);

  const handleViewFullDetails = useCallback(async (teacher) => {
    if (!teacher?.id) return;
    setDetailsLoading(true);
    try {
      const detailed = await dispatch(getTeacher(teacher.id));
      setFullTeacher(detailed || teacher);
      setSelectedTeacher(null);
    } finally {
      setDetailsLoading(false);
    }
  }, [dispatch]);

  const handleCloseFullTeacher = useCallback(() => {
    setFullTeacher(null);
  }, []);

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return availableTeachers;
    return availableTeachers.filter((teacher) =>
      getAvailableTeacherLabel(teacher).toLowerCase().includes(query)
    );
  }, [availableTeachers, searchQuery]);

  const visibleTeachers = useMemo(
    () =>
      showAll
        ? filteredTeachers
        : filteredTeachers.slice(0, AVAILABLE_TEACHERS_PREVIEW_COUNT),
    [filteredTeachers, showAll]
  );

  const hasHiddenTeachers =
    !showAll && filteredTeachers.length > AVAILABLE_TEACHERS_PREVIEW_COUNT;

  const emptyMessage =
    members.length === 0
      ? t('adminToday.availableTeachersNoneMembers')
      : t('adminToday.availableTeachersEmpty', { day: dayLabel });

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          {t('adminToday.availableTeachersSection', { day: dayLabel })}
        </Typography>
        {!loading && (
          <Chip
            size="small"
            color="success"
            variant="outlined"
            label={t('adminToday.availableTeachersCount', { count: availableTeachers.length })}
          />
        )}
      </Stack>

      {dayAvailableError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {dayAvailableError}
        </Alert>
      )}

      {!loading && availableTeachers.length > AVAILABLE_TEACHERS_SEARCH_THRESHOLD && (
        <TextField
          fullWidth
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t('adminToday.availableTeachersSearchPlaceholder')}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={20} />
              </InputAdornment>
            ),
          }}
        />
      )}

      {loading ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {Array.from({ length: AVAILABLE_TEACHER_SKELETONS }).map((_, index) => (
            <Skeleton
              key={`available-teacher-skeleton-${index}`}
              variant="rounded"
              width={140}
              height={32}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      ) : availableTeachers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      ) : filteredTeachers.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('adminToday.availableTeachersSearchEmpty')}
        </Typography>
      ) : (
        <>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {visibleTeachers.map((member) => (
              <AvailableTeacherChip
                key={member.id}
                member={member}
                selectedDate={selectedDate}
                t={t}
                onOpen={handleOpenTeacher}
              />
            ))}
          </Stack>

          {hasHiddenTeachers && (
            <Button variant="text" size="small" onClick={handleToggleShowAll} sx={{ mt: 1.5 }}>
              {t('adminToday.availableTeachersShowAll', { count: filteredTeachers.length })}
            </Button>
          )}

          {showAll && filteredTeachers.length > AVAILABLE_TEACHERS_PREVIEW_COUNT && (
            <Button variant="text" size="small" onClick={handleToggleShowAll} sx={{ mt: 1.5 }}>
              {t('adminToday.availableTeachersShowLess')}
            </Button>
          )}
        </>
      )}

      <AvailableTeacherDetailsModal
        open={Boolean(selectedTeacher)}
        onClose={handleCloseTeacher}
        teacher={selectedTeacher}
        onViewDetails={handleViewFullDetails}
        detailsLoading={detailsLoading}
        selectedDate={selectedDate}
      />

      <TeacherDetailsDrawer
        open={Boolean(fullTeacher)}
        onClose={handleCloseFullTeacher}
        teacher={fullTeacher}
      />
    </Card>
  );
}

function formatGananciasAmount(value, currency = 'ARS') {
  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value || 0);
  } catch {
    return `${currency} ${Math.round(value || 0)}`;
  }
}

function TodayGananciasSection({
  loading,
  gananciasByCurrency,
  teacherGanancias,
  usdToArsRate,
  onUsdToArsRateChange,
  dayLabel,
  t,
}) {
  const theme = useTheme();
  const rows = gananciasByCurrency?.length
    ? gananciasByCurrency
    : [{ currency: 'ARS', dayGross: 0, dayTeacher: 0, dayTax: 0, net: 0 }];

  const hasUsd = rows.some((row) => row.currency === 'USD');
  const consolidatedArs = useMemo(
    () => consolidateGananciasInArs(rows, usdToArsRate),
    [rows, usdToArsRate]
  );

  const teacherBreakdown = useMemo(
    () => consolidateTeacherGananciasInArs(teacherGanancias?.byTeacher, usdToArsRate),
    [teacherGanancias, usdToArsRate]
  );

  const { byTeacher: teacherRows, totals: teacherTotals, maxEarnings } = teacherBreakdown;
  const marginPct =
    teacherTotals.payin > 0 ? (teacherTotals.earnings / teacherTotals.payin) * 100 : 0;

  const summaryCards = [
    {
      key: 'payin',
      label: t('adminToday.ganancias.totalPayin'),
      value: formatGananciasAmount(teacherTotals.payin, 'ARS'),
      icon: 'eva:credit-card-fill',
      color: theme.palette.success.main,
    },
    {
      key: 'payout',
      label: t('adminToday.ganancias.totalPayout'),
      value: formatGananciasAmount(teacherTotals.payout, 'ARS'),
      icon: 'eva:person-fill',
      color: theme.palette.error.main,
    },
    {
      key: 'earnings',
      label: t('adminToday.ganancias.grossProfit'),
      value: formatGananciasAmount(teacherTotals.earnings, 'ARS'),
      icon: 'eva:trending-up-fill',
      color: theme.palette.info.main,
    },
    {
      key: 'margin',
      label: t('adminToday.ganancias.marginOnPayin'),
      value: `${marginPct.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`,
      icon: 'eva:pie-chart-fill',
      color: theme.palette.secondary.main,
    },
  ];

  const renderAmountCell = (value, currency, emphasize = false) => {
    if (loading) {
      return <Skeleton width={80} sx={{ ml: 'auto' }} />;
    }
    const formatted = formatGananciasAmount(value, currency);
    if (emphasize) {
      return (
        <Typography variant="subtitle2" color="success.main">
          {formatted}
        </Typography>
      );
    }
    return formatted;
  };

  const renderRow = (
    row,
    { emphasizeNet = false, boldLabel = false, label, formatCurrency = row.currency } = {}
  ) => (
    <TableRow key={label || row.currency}>
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: boldLabel ? 700 : 500 }}>
          {label || row.currency}
        </Typography>
      </TableCell>
      <TableCell align="right">{renderAmountCell(row.dayGross, formatCurrency)}</TableCell>
      <TableCell align="right">{renderAmountCell(row.dayTeacher, formatCurrency)}</TableCell>
      <TableCell align="right">{renderAmountCell(row.dayTax, formatCurrency)}</TableCell>
      <TableCell align="right">{renderAmountCell(row.net, formatCurrency, emphasizeNet)}</TableCell>
    </TableRow>
  );

  const renderPayinCell = (row) => {
    if (loading) {
      return <Skeleton width={100} sx={{ mx: 'auto' }} />;
    }
    return (
      <Stack spacing={0.25} alignItems="center">
        <Typography variant="body2">{formatGananciasAmount(row.payin, 'ARS')}</Typography>
        {row.payinPartsArs?.length > 1 && (
          <Typography variant="caption" color="text.secondary">
            (
            {row.payinPartsArs.map((part) => formatGananciasAmount(part, 'ARS')).join(' + ')}
            )
          </Typography>
        )}
      </Stack>
    );
  };

  const renderEarningsCell = (row) => {
    if (loading) {
      return <Skeleton width={120} sx={{ mx: 'auto' }} />;
    }
    const barValue = maxEarnings > 0 ? Math.max(0, (row.earnings / maxEarnings) * 100) : 0;
    return (
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-end">
        <Typography variant="subtitle2" color="success.main" sx={{ whiteSpace: 'nowrap' }}>
          {formatGananciasAmount(row.earnings, 'ARS')}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={barValue}
          sx={{
            width: 72,
            height: 8,
            borderRadius: 1,
            bgcolor: 'success.lighter',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
              bgcolor: 'success.main',
            },
          }}
        />
      </Stack>
    );
  };

  return (
    <Card sx={{ mt: 3, mb: 3, p: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          {t('adminToday.ganancias.title', { day: dayLabel })}
        </Typography>
        <TextField
          label={t('adminToday.ganancias.usdRate')}
          type="number"
          size="small"
          value={usdToArsRate}
          onChange={(event) => onUsdToArsRateChange(event.target.value)}
          inputProps={{ min: 0, step: 1 }}
          sx={{ width: { xs: '100%', sm: 220 } }}
        />
      </Stack>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminToday.ganancias.currency')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.total')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.teacher')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.tax')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.net')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => renderRow(row))}
            {hasUsd &&
              renderRow(consolidatedArs, {
                emphasizeNet: true,
                boldLabel: true,
                label: t('adminToday.ganancias.consolidatedArs'),
                formatCurrency: 'ARS',
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
        {t('adminToday.ganancias.teacherDetailTitle')}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
        {summaryCards.map((card) => (
          <Card
            key={card.key}
            variant="outlined"
            sx={{
              p: 2.5,
              minWidth: { xs: '100%', sm: 180 },
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.4 }}
              >
                {card.label}
              </Typography>
              <Typography variant="h5" sx={{ color: card.color, fontWeight: 'bold' }} noWrap>
                {loading ? <Skeleton width={90} /> : card.value}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 48,
                height: 48,
                ml: 1,
                flexShrink: 0,
                borderRadius: '50%',
                backgroundColor: `${card.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon={card.icon} sx={{ width: 24, height: 24, color: card.color }} />
            </Box>
          </Card>
        ))}
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminToday.ganancias.colTeacher')}</TableCell>
              <TableCell align="center">{t('adminToday.ganancias.colPayin')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.colPayout')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.colEarnings')}</TableCell>
              <TableCell align="right">{t('adminToday.ganancias.colLessons')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`teacher-ganancias-skeleton-${index}`}>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton width={80} sx={{ mx: 'auto' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={80} sx={{ ml: 'auto' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={120} sx={{ ml: 'auto' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={32} sx={{ ml: 'auto' }} />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && teacherRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    {t('adminToday.ganancias.teacherDetailEmpty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              teacherRows.map((row) => (
                <TableRow key={row.teacherKey} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{row.teacherName}</Typography>
                  </TableCell>
                  <TableCell align="center">{renderPayinCell(row)}</TableCell>
                  <TableCell align="right">{formatGananciasAmount(row.payout, 'ARS')}</TableCell>
                  <TableCell align="right">{renderEarningsCell(row)}</TableCell>
                  <TableCell align="right">{row.lessonCount}</TableCell>
                </TableRow>
              ))}
            {!loading && teacherRows.length > 0 && (
              <TableRow
                sx={{
                  bgcolor: (muiTheme) =>
                    muiTheme.palette.mode === 'light' ? 'primary.lighter' : 'action.selected',
                  '& td': { fontWeight: 700 },
                }}
              >
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {t('adminToday.ganancias.totalRow')}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {formatGananciasAmount(teacherTotals.payin, 'ARS')}
                </TableCell>
                <TableCell align="right">
                  {formatGananciasAmount(teacherTotals.payout, 'ARS')}
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700 }}>
                    {formatGananciasAmount(teacherTotals.earnings, 'ARS')}
                  </Typography>
                </TableCell>
                <TableCell align="right">{teacherTotals.lessonCount}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

function TodayKPICards({
  loading,
  lessonCount,
  gearCount,
  participantCount,
  unassignedCount,
  dayLabel,
  t,
}) {
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
  createButtonLabel,
  onCreateBooking,
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} flexWrap="wrap" useFlexGap>
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
          {createButtonLabel && onCreateBooking && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={onCreateBooking}
            >
              {createButtonLabel}
            </Button>
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
  const dispatch = useDispatch();
  const schoolMembers = useSelector((state) => state.business.members) || [];
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsId = searchParams.get('details');
  const showGanancias = searchParams.get('ganancias') === 'true';

  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(true);
  const [dayAvailableLoading, setDayAvailableLoading] = useState(true);
  const [dayAvailableError, setDayAvailableError] = useState(null);
  const [dayAvailableTeachers, setDayAvailableTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [lessonBookings, setLessonBookings] = useState([]);
  const [gearBookings, setGearBookings] = useState([]);
  const [bookingIntents, setBookingIntents] = useState([]);
  const [dayOffset, setDayOffset] = useState(0);
  const [showLessonPrices, setShowLessonPrices] = useState(true);
  const [usdToArsRate, setUsdToArsRate] = useState(String(DEFAULT_USD_TO_ARS_RATE));
  const [isLessonCreateOpen, setIsLessonCreateOpen] = useState(false);
  const [isGearCreateOpen, setIsGearCreateOpen] = useState(false);

  const selectedDate = useMemo(() => {
    const date = startOfDay(new Date());
    date.setDate(date.getDate() + dayOffset);
    return date;
  }, [dayOffset]);

  const handleSelectedDateChange = useCallback((newValue) => {
    if (!newValue || Number.isNaN(newValue.getTime())) return;
    setDayOffset(differenceInCalendarDays(startOfDay(newValue), startOfDay(new Date())));
  }, []);

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
    setMembersLoading(true);
    setDayAvailableLoading(true);
    setDayAvailableError(null);
    setError(null);

    const membersPromise = Promise.resolve(dispatch(getAdminBusinessMembers(SCHOOL_BUSINESS_ID))).finally(() => {
      setMembersLoading(false);
    });

    const dayAvailablePromise = fetchTeachersAvailableOnDay(selectedDate)
      .then((teachers) => {
        setDayAvailableTeachers(teachers);
      })
      .catch((reason) => {
        setDayAvailableTeachers([]);
        setDayAvailableError(
          typeof reason === 'string'
            ? reason
            : reason?.message || t('adminToday.availableTeachersLoadError')
        );
      })
      .finally(() => {
        setDayAvailableLoading(false);
      });

    const [lessonsResult, gearResult, intentsResult] = await Promise.allSettled([
      fetchAdminBookingsForToday('lesson', selectedDate),
      fetchAdminBookingsForToday('gear', selectedDate),
      fetchAdminBookingIntentsForToday(selectedDate),
      membersPromise,
      dayAvailablePromise,
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
  }, [dispatch, selectedDate, t]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, loadData]);

  const schoolAvailableMembers = useMemo(
    () => filterAvailableSchoolMembers(schoolMembers, lessonBookings),
    [schoolMembers, lessonBookings]
  );

const participantCount = countTodayParticipants(lessonBookings, gearBookings);

  const ganancias = useMemo(
    () => (showGanancias ? calcAdminTodayGanancias(lessonBookings, gearBookings) : null),
    [showGanancias, lessonBookings, gearBookings]
  );

  const teacherGanancias = useMemo(
    () =>
      showGanancias
        ? calcAdminTodayGananciasByTeacher(lessonBookings, gearBookings, {
            unassignedLabel: t('adminBookings.intent.unassigned'),
          })
        : null,
    [showGanancias, lessonBookings, gearBookings, t]
  );

  const availableTeachers = useMemo(
    () => mergeAvailableTeachers(schoolAvailableMembers, dayAvailableTeachers),
    [schoolAvailableMembers, dayAvailableTeachers]
  );

  if (!isInitialized) {
    return <LoadingScreen isDashboard />;
  }

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('adminToday.selectDate')}
                  value={selectedDate}
                  onChange={handleSelectedDateChange}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: { xs: 160, sm: 180 } },
                    },
                  }}
                />
              </LocalizationProvider>
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

        <TodayAvailableTeachersSection
          loading={loading || membersLoading || dayAvailableLoading}
          members={schoolMembers}
          availableTeachers={availableTeachers}
          dayAvailableError={dayAvailableError}
          dayLabel={dayLabel}
          selectedDate={selectedDate}
          t={t}
        />

        <TodayKPICards
          loading={loading}
          lessonCount={lessonBookings.length}
          gearCount={gearBookings.length}
          participantCount={participantCount}
          unassignedCount={bookingIntents.length}
          dayLabel={dayLabel}
          t={t}
        />

        {showGanancias && (
          <TodayGananciasSection
            loading={loading}
            gananciasByCurrency={ganancias?.byCurrency}
            teacherGanancias={teacherGanancias}
            usdToArsRate={usdToArsRate}
            onUsdToArsRateChange={setUsdToArsRate}
            dayLabel={dayLabel}
            t={t}
          />
        )}

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
          createButtonLabel={t('adminBookings.newBooking')}
          onCreateBooking={() => setIsLessonCreateOpen(true)}
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
          createButtonLabel={t('adminBookings.newGearBooking')}
          onCreateBooking={() => setIsGearCreateOpen(true)}
          t={t}
        />

        <BookingModal
          isOpen={isLessonCreateOpen}
          onClose={() => {
            setIsLessonCreateOpen(false);
            loadData();
          }}
        />

        <GearBookingModal
          isOpen={isGearCreateOpen}
          onClose={() => setIsGearCreateOpen(false)}
          refreshBookings={loadData}
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
