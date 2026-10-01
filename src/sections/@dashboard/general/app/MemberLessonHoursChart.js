import { useEffect, useMemo, useState } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseOptionChart } from '../../../../components/chart';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getTeacherLessonStats } from '../../../../redux/slices/admin';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import {
  ADMIN_BOOKING_RESORT_FILTER_OPTIONS,
  formatAdminBookingResortLabel,
} from '../../../../utils/adminBookingResortOptions';

const DEFAULT_YEAR = 2026;
const DEFAULT_RESORT = 'CERRO_CATEDRAL';

function getSeasonRangeForYear(year) {
  return {
    start: new Date(year, 5, 1),
    end: new Date(year, 9, 31),
  };
}

function getYearOptions() {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current - 4; y <= current + 1; y += 1) {
    years.push(y);
  }
  if (!years.includes(DEFAULT_YEAR)) {
    years.push(DEFAULT_YEAR);
    years.sort((a, b) => a - b);
  }
  return years;
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

export default function MemberLessonHoursChart() {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberLessonStats, isLoadingMemberLessonStats } = useSelector((state) => state.admin);

  const [year, setYear] = useState(DEFAULT_YEAR);
  const [resort, setResort] = useState(DEFAULT_RESORT);
  const yearOptions = useMemo(() => getYearOptions(), []);

  const { from, to } = useMemo(() => {
    const range = getSeasonRangeForYear(year);
    return {
      from: formatDateParam(range.start),
      to: formatDateParam(range.end),
    };
  }, [year]);

  useEffect(() => {
    if (!from || !to) return;
    dispatch(getTeacherLessonStats(from, to, resort));
  }, [dispatch, from, to, resort]);

  const teachersWithBookings = useMemo(
    () =>
      (memberLessonStats || []).filter((row) => {
        const assigned = Number(row.assignedHours || 0);
        const required = Number(row.requiredHours || 0);
        return assigned + required > 0;
      }),
    [memberLessonStats]
  );

  const totals = useMemo(
    () =>
      teachersWithBookings.reduce(
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
    [teachersWithBookings]
  );

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
      categories: [t('generalApp.memberLessonHours.chartCategory')],
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
    {
      name: t('generalApp.memberLessonHours.assigned'),
      data: [totals.assigned],
    },
    {
      name: t('generalApp.memberLessonHours.required'),
      data: [totals.required],
    },
  ];

  return (
    <Card>
      <CardHeader
        title={t('generalApp.memberLessonHours.title')}
        subheader={t('generalApp.memberLessonHours.subtitle', {
          total: formatHours(totals.total),
          assigned: formatHours(totals.assigned),
          required: formatHours(totals.required),
        })}
        action={
          <Button
            size="small"
            onClick={() => navigate(PATH_DASHBOARD.admin.schoolMemberLessons)}
          >
            {t('generalApp.memberLessonHours.viewDetails')}
          </Button>
        }
      />
      <Box sx={{ px: 2, pb: 2 }} dir="ltr">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2, px: 1 }}
          alignItems={{ sm: 'center' }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="member-lesson-hours-year-label">
              {t('generalApp.memberLessonHours.year')}
            </InputLabel>
            <Select
              labelId="member-lesson-hours-year-label"
              label={t('generalApp.memberLessonHours.year')}
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="member-lesson-hours-resort-label">
              {t('generalApp.memberLessonHours.resort')}
            </InputLabel>
            <Select
              labelId="member-lesson-hours-resort-label"
              label={t('generalApp.memberLessonHours.resort')}
              value={resort}
              onChange={(e) => setResort(e.target.value)}
            >
              {ADMIN_BOOKING_RESORT_FILTER_OPTIONS.map((option) => (
                <MenuItem key={option.value || 'all'} value={option.value}>
                  {option.labelKey
                    ? t(option.labelKey)
                    : formatAdminBookingResortLabel(option.value, t) || option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {isLoadingMemberLessonStats ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={3} sx={{ mb: 2, px: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('generalApp.memberLessonHours.total')}
                </Typography>
                <Typography variant="h3">{formatHours(totals.total)}h</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('generalApp.memberLessonHours.assigned')}
                </Typography>
                <Typography variant="h5" sx={{ color: theme.palette.primary.main }}>
                  {formatHours(totals.assigned)}h
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('generalApp.memberLessonHours.required')}
                </Typography>
                <Typography variant="h5" sx={{ color: theme.palette.warning.main }}>
                  {formatHours(totals.required)}h
                </Typography>
              </Box>
            </Stack>
            <ReactApexChart type="bar" series={series} options={chartOptions} height={280} />

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, px: 1 }}>
              {t('generalApp.memberLessonHours.teachersTitle')}
            </Typography>
            {teachersWithBookings.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 2 }}>
                {t('generalApp.memberLessonHours.emptyTeachers')}
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('generalApp.memberLessonHours.columns.teacher')}</TableCell>
                      <TableCell align="center">{t('generalApp.memberLessonHours.columns.level')}</TableCell>
                      <TableCell align="right">{t('generalApp.memberLessonHours.columns.assigned')}</TableCell>
                      <TableCell align="right">{t('generalApp.memberLessonHours.columns.required')}</TableCell>
                      <TableCell align="right">{t('generalApp.memberLessonHours.columns.total')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachersWithBookings.map((row) => {
                      const assigned = Number(row.assignedHours || 0);
                      const required = Number(row.requiredHours || 0);
                      return (
                        <TableRow key={row.id} hover>
                          <TableCell>
                            {[row.name, row.lastName].filter(Boolean).join(' ') || row.email || '—'}
                          </TableCell>
                          <TableCell align="center">{row.level ?? '—'}</TableCell>
                          <TableCell align="right">{formatHours(assigned)}</TableCell>
                          <TableCell align="right">{formatHours(required)}</TableCell>
                          <TableCell align="right">{formatHours(assigned + required)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle2">
                          {t('generalApp.memberLessonHours.columns.total')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">{formatHours(totals.assigned)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">{formatHours(totals.required)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2">{formatHours(totals.total)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}
