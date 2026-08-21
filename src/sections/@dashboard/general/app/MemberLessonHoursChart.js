import { useEffect, useMemo } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { Box, Button, Card, CardHeader, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseOptionChart } from '../../../../components/chart';
import { useDispatch, useSelector } from '../../../../redux/store';
import { getSchoolMemberLessonStats } from '../../../../redux/slices/admin';
import { PATH_DASHBOARD } from '../../../../routes/paths';

const SCHOOL_BUSINESS_ID = 13;

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

export default function MemberLessonHoursChart() {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { memberLessonStats, isLoadingMemberLessonStats } = useSelector((state) => state.admin);

  const { from, to } = useMemo(() => {
    const range = getDefaultSeasonRange();
    return {
      from: formatDateParam(range.start),
      to: formatDateParam(range.end),
    };
  }, []);

  useEffect(() => {
    if (!from || !to) return;
    dispatch(getSchoolMemberLessonStats(from, to, SCHOOL_BUSINESS_ID));
  }, [dispatch, from, to]);

  const totals = useMemo(
    () =>
      (memberLessonStats || []).reduce(
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
    [memberLessonStats]
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
          </>
        )}
      </Box>
    </Card>
  );
}
