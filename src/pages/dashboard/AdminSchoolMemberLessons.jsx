import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardHeader,
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
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { BaseOptionChart } from '../../components/chart';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useDispatch, useSelector } from '../../redux/store';
import { getSchoolMemberLessonStats } from '../../redux/slices/admin';
import TeacherAgendaDrawer from '../../sections/@dashboard/admin/list/TeacherAgendaDrawer';

const SCHOOL_BUSINESS_ID = 13;
const SEASON_MONTHS = [5, 6, 7, 8, 9]; // Jun–Oct

function getDefaultSeasonRange() {
  const now = new Date();
  const year = now.getFullYear();
  const seasonStart = new Date(year, 5, 1);
  const seasonEnd = new Date(year, 9, 31);

  if (now < seasonStart) {
    return {
      start: new Date(year - 1, 5, 1),
      end: new Date(year - 1, 9, 31),
    };
  }

  return { start: seasonStart, end: seasonEnd };
}

function formatDateParam(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatHours(hours) {
  return Number(hours || 0).toFixed(1);
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getHalfMonthRange(year, month, half) {
  if (half === 'first') {
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month, 15),
    };
  }
  const lastDay = new Date(year, month + 1, 0).getDate();
  return {
    start: new Date(year, month, 16),
    end: new Date(year, month, lastDay),
  };
}

function LessonTotalsChart({ assigned, required, labels }) {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    chart: { toolbar: { show: false } },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    plotOptions: {
      bar: {
        columnWidth: '45%',
        borderRadius: 4,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [labels.total],
    },
    yaxis: {
      labels: {
        formatter: (value) => formatHours(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${formatHours(value)} h`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  });

  const series = [
    { name: labels.assigned, data: [Number(assigned) || 0] },
    { name: labels.required, data: [Number(required) || 0] },
  ];

  return <ReactApexChart type="bar" series={series} options={chartOptions} height={280} />;
}

export default function AdminSchoolMemberLessons() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const { memberLessonStats, isLoadingMemberLessonStats, error } = useSelector((state) => state.admin);

  const defaultRange = useMemo(() => getDefaultSeasonRange(), []);
  const seasonYear = defaultRange.start.getFullYear();
  const [dateRange, setDateRange] = useState([defaultRange.start, defaultRange.end]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const from = formatDateParam(dateRange[0]);
  const to = formatDateParam(dateRange[1]);

  const monthLabels = useMemo(
    () => [
      t('adminSchoolMemberLessons.months.jun'),
      t('adminSchoolMemberLessons.months.jul'),
      t('adminSchoolMemberLessons.months.aug'),
      t('adminSchoolMemberLessons.months.sep'),
      t('adminSchoolMemberLessons.months.oct'),
    ],
    [t]
  );

  const totals = useMemo(() => {
    const stats = memberLessonStats || [];
    return stats.reduce(
      (acc, row) => ({
        assigned: acc.assigned + Number(row.assignedHours || 0),
        required: acc.required + Number(row.requiredHours || 0),
      }),
      { assigned: 0, required: 0 }
    );
  }, [memberLessonStats]);

  useEffect(() => {
    if (!isAdmin || !from || !to) return;
    dispatch(getSchoolMemberLessonStats(from, to, SCHOOL_BUSINESS_ID));
  }, [dispatch, from, isAdmin, to]);

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  const handleRowClick = (row) => {
    setSelectedTeacher(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTeacher(null);
  };

  const selectHalfMonth = (month, half) => {
    const { start, end } = getHalfMonthRange(seasonYear, month, half);
    setDateRange([start, end]);
  };

  const selectFullSeason = () => {
    setDateRange([defaultRange.start, defaultRange.end]);
  };

  const isHalfMonthSelected = (month, half) => {
    const { start, end } = getHalfMonthRange(seasonYear, month, half);
    return isSameDay(dateRange[0], start) && isSameDay(dateRange[1], end);
  };

  const isFullSeasonSelected =
    isSameDay(dateRange[0], defaultRange.start) && isSameDay(dateRange[1], defaultRange.end);

  return (
    <Page title={t('adminSchoolMemberLessons.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('adminSchoolMemberLessons.heading')}
          links={[
            { name: t('adminSchoolMemberLessons.breadcrumbDashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminSchoolMemberLessons.breadcrumbAdmin'), href: PATH_DASHBOARD.admin.root },
            { name: t('adminSchoolMemberLessons.breadcrumbPage') },
          ]}
        />

        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              {t('adminSchoolMemberLessons.dateRangeHint')}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                localeText={{
                  start: t('adminSchoolMemberLessons.startDate'),
                  end: t('adminSchoolMemberLessons.endDate'),
                }}
                value={dateRange}
                onChange={(newValue) => setDateRange(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <Stack spacing={1.5} sx={{ mt: 3 }}>
              <Typography variant="subtitle2">
                {t('adminSchoolMemberLessons.quickFilters')}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
                  {t('adminSchoolMemberLessons.firstHalf')}
                </Typography>
                {SEASON_MONTHS.map((month, index) => (
                  <Chip
                    key={`first-${month}`}
                    label={monthLabels[index]}
                    color={isHalfMonthSelected(month, 'first') ? 'primary' : 'default'}
                    variant={isHalfMonthSelected(month, 'first') ? 'filled' : 'outlined'}
                    onClick={() => selectHalfMonth(month, 'first')}
                    clickable
                  />
                ))}
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
                  {t('adminSchoolMemberLessons.secondHalf')}
                </Typography>
                {SEASON_MONTHS.map((month, index) => (
                  <Chip
                    key={`second-${month}`}
                    label={monthLabels[index]}
                    color={isHalfMonthSelected(month, 'second') ? 'primary' : 'default'}
                    variant={isHalfMonthSelected(month, 'second') ? 'filled' : 'outlined'}
                    onClick={() => selectHalfMonth(month, 'second')}
                    clickable
                  />
                ))}
              </Stack>

              <Box>
                <Chip
                  label={t('adminSchoolMemberLessons.fullSeason')}
                  color={isFullSeasonSelected ? 'primary' : 'default'}
                  variant={isFullSeasonSelected ? 'filled' : 'outlined'}
                  onClick={selectFullSeason}
                  clickable
                />
              </Box>
            </Stack>
          </Card>

          <Card>
            <CardHeader
              title={t('adminSchoolMemberLessons.chartTitle')}
              subheader={t('adminSchoolMemberLessons.chartSubtitle', {
                assigned: formatHours(totals.assigned),
                required: formatHours(totals.required),
              })}
            />
            <Box sx={{ px: 2, pb: 2 }} dir="ltr">
              {isLoadingMemberLessonStats ? (
                <Stack alignItems="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </Stack>
              ) : (
                <LessonTotalsChart
                  assigned={totals.assigned}
                  required={totals.required}
                  labels={{
                    total: t('adminSchoolMemberLessons.chartCategory'),
                    assigned: t('adminSchoolMemberLessons.columns.assignedHours'),
                    required: t('adminSchoolMemberLessons.columns.requiredHours'),
                  }}
                />
              )}
            </Box>
          </Card>

          <Card>
            {isLoadingMemberLessonStats ? (
              <Stack alignItems="center" sx={{ py: 6 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('adminSchoolMemberLessons.columns.name')}</TableCell>
                      <TableCell>{t('adminSchoolMemberLessons.columns.email')}</TableCell>
                      <TableCell align="right">{t('adminSchoolMemberLessons.columns.level')}</TableCell>
                      <TableCell align="right">{t('adminSchoolMemberLessons.columns.assignedHours')}</TableCell>
                      <TableCell align="right">{t('adminSchoolMemberLessons.columns.requiredHours')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(memberLessonStats || []).map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        onClick={() => handleRowClick(row)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          {[row.name, row.lastName].filter(Boolean).join(' ')}
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell align="right">{row.level ?? '—'}</TableCell>
                        <TableCell align="right">{formatHours(row.assignedHours)}</TableCell>
                        <TableCell align="right">{formatHours(row.requiredHours)}</TableCell>
                      </TableRow>
                    ))}
                    {!memberLessonStats?.length && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            {t('adminSchoolMemberLessons.empty')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>

          {error && (
            <Alert severity="error">
              {String(error?.message || error)}
            </Alert>
          )}
        </Stack>

        <TeacherAgendaDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          teacher={selectedTeacher}
        />
      </Container>
    </Page>
  );
}
