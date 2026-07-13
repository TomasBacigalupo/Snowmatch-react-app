import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '../../components/Iconify';
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

// Accent color per instructor level (used for chips, row accents and tints).
function getLevelColor(level, theme) {
  switch (Number(level)) {
    case 1:
      return theme.palette.info.light;
    case 2:
      return theme.palette.primary.main;
    case 3:
      return theme.palette.success.main;
    case 4:
      return theme.palette.warning.main;
    case 5:
      return theme.palette.error.main;
    default:
      return theme.palette.grey[500];
  }
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
  const [levelFilter, setLevelFilter] = useState([]);
  const [personSearch, setPersonSearch] = useState('');
  const theme = useTheme();

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

  const availableLevels = useMemo(() => {
    const levels = new Set();
    (memberLessonStats || []).forEach((row) => {
      if (row.level != null) levels.add(Number(row.level));
    });
    return [...levels].sort((a, b) => a - b);
  }, [memberLessonStats]);

  const filteredStats = useMemo(() => {
    const term = personSearch.trim().toLowerCase();
    return (memberLessonStats || []).filter((row) => {
      if (levelFilter.length && !levelFilter.includes(Number(row.level))) return false;
      if (term) {
        const haystack = `${row.name || ''} ${row.lastName || ''} ${row.email || ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [memberLessonStats, levelFilter, personSearch]);

  const totals = useMemo(
    () =>
      filteredStats.reduce(
        (acc, row) => {
          const assigned = Number(row.assignedHours || 0);
          const required = Number(row.requiredHours || 0);
          return {
            assigned: acc.assigned + assigned,
            required: acc.required + required,
            total: acc.total + assigned + required,
          };
        },
        { assigned: 0, required: 0, total: 0 }
      ),
    [filteredStats]
  );

  const toggleLevel = (level) => {
    setLevelFilter((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

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
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading={t('adminSchoolMemberLessons.heading')}
          links={[
            { name: t('adminSchoolMemberLessons.breadcrumbDashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminSchoolMemberLessons.breadcrumbAdmin'), href: PATH_DASHBOARD.admin.root },
            { name: t('adminSchoolMemberLessons.breadcrumbPage') },
          ]}
        />

        <Stack spacing={3}>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
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

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {t('adminSchoolMemberLessons.firstHalf')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
              </Stack>

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {t('adminSchoolMemberLessons.secondHalf')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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

            <Divider sx={{ my: 3 }} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                {t('adminSchoolMemberLessons.filters.title')}
              </Typography>

              <TextField
                size="small"
                value={personSearch}
                onChange={(e) => setPersonSearch(e.target.value)}
                placeholder={t('adminSchoolMemberLessons.filters.search')}
                sx={{ maxWidth: 360 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  {t('adminSchoolMemberLessons.filters.level')}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={t('adminSchoolMemberLessons.filters.allLevels')}
                    color={levelFilter.length === 0 ? 'primary' : 'default'}
                    variant={levelFilter.length === 0 ? 'filled' : 'outlined'}
                    onClick={() => setLevelFilter([])}
                    clickable
                  />
                  {availableLevels.map((level) => {
                    const active = levelFilter.includes(level);
                    const color = getLevelColor(level, theme);
                    return (
                      <Chip
                        key={`level-${level}`}
                        label={level}
                        variant={active ? 'filled' : 'outlined'}
                        onClick={() => toggleLevel(level)}
                        clickable
                        sx={
                          active
                            ? {
                                bgcolor: color,
                                color: theme.palette.common.white,
                                '&:hover': { bgcolor: color },
                              }
                            : undefined
                        }
                      />
                    );
                  })}
                </Stack>
              </Stack>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={8} lg={9}>
              <Card>
                {isLoadingMemberLessonStats ? (
              <Stack alignItems="center" sx={{ py: 6 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{
                      '& .MuiTableCell-head': {
                        bgcolor: 'background.paper',
                        color: 'text.secondary',
                        borderBottom: (th) => `1px solid ${th.palette.divider}`,
                      },
                    }}
                  >
                    <TableRow>
                      <TableCell>{t('adminSchoolMemberLessons.columns.name')}</TableCell>
                      <TableCell>{t('adminSchoolMemberLessons.columns.email')}</TableCell>
                      <TableCell align="right">{t('adminSchoolMemberLessons.columns.level')}</TableCell>
                      <TableCell align="center">{t('adminSchoolMemberLessons.columns.assignedHours')}</TableCell>
                      <TableCell align="center">{t('adminSchoolMemberLessons.columns.requiredHours')}</TableCell>
                      <TableCell align="center">{t('adminSchoolMemberLessons.columns.total')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStats.map((row) => {
                      const accent = getLevelColor(row.level, theme);
                      const rowTotal =
                        Number(row.assignedHours || 0) + Number(row.requiredHours || 0);
                      return (
                        <TableRow
                          key={row.id}
                          hover
                          onClick={() => handleRowClick(row)}
                          sx={{
                            cursor: 'pointer',
                            '& td:first-of-type': {
                              borderLeft: `3px solid ${accent}`,
                            },
                            bgcolor: alpha(accent, 0.06),
                          }}
                        >
                          <TableCell>
                            {[row.name, row.lastName].filter(Boolean).join(' ')}
                          </TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell align="right">
                            {row.level != null ? (
                              <Chip
                                label={row.level}
                                size="small"
                                sx={{
                                  bgcolor: accent,
                                  color: theme.palette.common.white,
                                  fontWeight: 600,
                                }}
                              />
                            ) : (
                              '—'
                            )}
                          </TableCell>
                          <TableCell align="center">{formatHours(row.assignedHours)}</TableCell>
                          <TableCell align="center">{formatHours(row.requiredHours)}</TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2">{formatHours(rowTotal)}</Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!filteredStats.length && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            {t('adminSchoolMemberLessons.empty')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {filteredStats.length > 0 && (
                    <TableFooter>
                      <TableRow sx={{ '& td': { borderTop: (th) => `2px solid ${th.palette.divider}` } }}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {t('adminSchoolMemberLessons.totalRow')}
                          </Typography>
                        </TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell align="center">
                          <Typography variant="subtitle2">{formatHours(totals.assigned)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2">{formatHours(totals.required)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle1">{formatHours(totals.total)}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </TableContainer>
            )}
              </Card>
            </Grid>
          </Grid>

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
