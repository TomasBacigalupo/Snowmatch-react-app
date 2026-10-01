import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { useTheme, styled, alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  CardHeader,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { eachDayOfInterval, format, parseISO, isValid, startOfDay } from 'date-fns';
import Iconify from 'src/components/Iconify';
import { BaseOptionChart } from 'src/components/chart';
import { fNumber } from 'src/utils/formatNumber';

const LEVEL_ORDER = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
const MISSING_LEVEL = '__NONE__';
const TOP_UPCOMING_DATES = 6;

const TotalCardRoot = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(3, 2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${theme.palette.divider}`,
  bgcolor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const IconWrapper = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(7),
  height: theme.spacing(7),
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  bgcolor: theme.palette.grey[100],
}));

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: 280,
  marginTop: theme.spacing(1),
  '& .apexcharts-canvas svg': { height: 280 },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: 56,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: '224px !important',
  },
}));

function parseDay(value) {
  if (!value) return null;
  const d = typeof value === 'string' ? parseISO(value) : value;
  return isValid(d) ? d : null;
}

export function buildDateDemand(interests, limit = TOP_UPCOMING_DATES) {
  const today = startOfDay(new Date());
  const todayKey = format(today, 'yyyy-MM-dd');
  const counts = new Map();
  (interests || []).forEach((row) => {
    const from = parseDay(row.fromDate);
    const to = parseDay(row.toDate);
    if (!from || !to || from > to) return;
    eachDayOfInterval({ start: from, end: to }).forEach((day) => {
      const key = format(day, 'yyyy-MM-dd');
      if (key < todayKey) return;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count || a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function buildLevelCounts(interests) {
  const counts = Object.fromEntries([...LEVEL_ORDER, MISSING_LEVEL].map((k) => [k, 0]));
  (interests || []).forEach((row) => {
    const level = row.studentLevel;
    if (level && LEVEL_ORDER.includes(level)) counts[level] += 1;
    else counts[MISSING_LEVEL] += 1;
  });
  return counts;
}

export function buildTagCounts(interests) {
  let notContacted = 0;
  let possibleStudent = 0;
  let datesDefined = 0;
  (interests || []).forEach((row) => {
    const tags = row.tags || [];
    if (tags.includes('NOT_CONTACTED')) notContacted += 1;
    if (tags.includes('POSSIBLE_STUDENT')) possibleStudent += 1;
    if (tags.includes('DATES_DEFINED')) datesDefined += 1;
  });
  return { notContacted, possibleStudent, datesDefined };
}

export function interestMatchesStatsFilter(row, filter) {
  if (!filter?.type || filter.value == null) return true;
  if (filter.type === 'level') {
    if (filter.value === MISSING_LEVEL) return !row.studentLevel || !LEVEL_ORDER.includes(row.studentLevel);
    return row.studentLevel === filter.value;
  }
  if (filter.type === 'date') {
    const from = parseDay(row.fromDate);
    const to = parseDay(row.toDate);
    const day = parseDay(filter.value);
    if (!from || !to || !day) return false;
    return day >= from && day <= to;
  }
  if (filter.type === 'tag') {
    return (row.tags || []).includes(filter.value);
  }
  return true;
}

const TAG_FILTER_LABELS = {
  NOT_CONTACTED: 'Not contacted',
  POSSIBLE_STUDENT: 'Possible student',
  DATES_DEFINED: 'Dates defined',
};

function SummaryStatRow({ label, value, selected, onClick, tone = 'default' }) {
  const theme = useTheme();
  const isError = tone === 'error';
  const isSuccess = tone === 'success';
  const accent = isError
    ? theme.palette.error.main
    : isSuccess
      ? theme.palette.success.main
      : theme.palette.text.primary;
  const hoverBg = isError
    ? alpha(theme.palette.error.main, 0.06)
    : isSuccess
      ? alpha(theme.palette.success.main, 0.06)
      : alpha(theme.palette.grey[900], 0.04);
  const selectedBg = isError
    ? alpha(theme.palette.error.main, 0.1)
    : isSuccess
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.grey[900], 0.08);
  const selectedBorder = isError
    ? alpha(theme.palette.error.main, 0.4)
    : isSuccess
      ? alpha(theme.palette.success.main, 0.4)
      : theme.palette.grey[400];

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      sx={{
        width: '100%',
        py: 1,
        px: 1.5,
        borderRadius: 1,
        cursor: 'pointer',
        bgcolor: selected ? selectedBg : 'transparent',
        border: selected ? `1px solid ${selectedBorder}` : '1px solid transparent',
        '&:hover': { bgcolor: hoverBg },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
        <Typography
          variant="body2"
          sx={{
            color: isError || isSuccess ? accent : 'text.secondary',
            textAlign: 'left',
          }}
        >
          {label}
        </Typography>
        <Typography variant="h5" sx={{ color: accent, fontWeight: 700 }}>
          {fNumber(value)}
        </Typography>
      </Stack>
    </Box>
  );
}

SummaryStatRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  tone: PropTypes.oneOf(['default', 'error', 'success']),
};

ClinicInterestStats.propTypes = {
  interests: PropTypes.array,
  filter: PropTypes.shape({
    type: PropTypes.oneOf(['date', 'level', 'tag']),
    value: PropTypes.string,
  }),
  onFilterChange: PropTypes.func.isRequired,
};

export default function ClinicInterestStats({ interests = [], filter = null, onFilterChange }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const levelLabel = useCallback(
    (level) => {
      if (!level || level === MISSING_LEVEL) return '—';
      return t(`adminBookings.editModal.clientLevelOptions.${level}`, level);
    },
    [t]
  );

  const dateDemand = useMemo(() => buildDateDemand(interests), [interests]);
  const levelCounts = useMemo(() => buildLevelCounts(interests), [interests]);
  const tagCounts = useMemo(() => buildTagCounts(interests), [interests]);

  const levelEntries = useMemo(() => {
    const entries = LEVEL_ORDER.map((level) => ({
      key: level,
      label: levelLabel(level),
      count: levelCounts[level] || 0,
    }));
    if (levelCounts[MISSING_LEVEL] > 0) {
      entries.push({
        key: MISSING_LEVEL,
        label: levelLabel(MISSING_LEVEL),
        count: levelCounts[MISSING_LEVEL],
      });
    }
    return entries.filter((e) => e.count > 0);
  }, [levelCounts, levelLabel]);

  const toggleFilter = useCallback(
    (next) => {
      if (filter?.type === next?.type && filter?.value === next?.value) {
        onFilterChange(null);
        return;
      }
      onFilterChange(next);
    },
    [filter, onFilterChange]
  );

  const dateCategories = useMemo(
    () =>
      dateDemand.map((d) => {
        const parsed = parseDay(d.date);
        return parsed ? format(parsed, 'dd MMM') : d.date;
      }),
    [dateDemand]
  );

  const dateChartOptions = merge(BaseOptionChart(), {
    chart: {
      events: {
        click(_event, _chartContext, config) {
          const idx = config?.dataPointIndex;
          if (idx == null || idx < 0) return;
          const item = dateDemand[idx];
          if (!item) return;
          toggleFilter({ type: 'date', value: item.date });
        },
      },
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (val) => fNumber(val),
        title: { formatter: () => 'Interests' },
      },
      x: {
        formatter: (_val, opts) => {
          const item = dateDemand[opts?.dataPointIndex];
          if (!item) return '';
          const parsed = parseDay(item.date);
          return parsed ? format(parsed, 'dd MMM yyyy') : item.date;
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '55%',
        borderRadius: 2,
        distributed: false,
      },
    },
    xaxis: { categories: dateCategories },
    colors: [
      filter?.type === 'date' ? theme.palette.warning.main : theme.palette.primary.main,
    ],
  });

  const levelChartOptions = merge(BaseOptionChart(), {
    chart: {
      events: {
        dataPointSelection(_event, _chartContext, config) {
          const idx = config.dataPointIndex;
          const entry = levelEntries[idx];
          if (!entry) return;
          toggleFilter({ type: 'level', value: entry.key });
        },
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.chart.blue[0],
      theme.palette.chart.violet[0],
      theme.palette.chart.yellow[0],
      theme.palette.grey[500],
    ],
    labels: levelEntries.map((e) => e.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (val) => fNumber(val),
        title: { formatter: (name) => `${name}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            value: { formatter: (val) => fNumber(val) },
            total: {
              show: true,
              label: 'Levels',
              formatter: (w) =>
                fNumber(w.globals.seriesTotals.reduce((a, b) => a + b, 0)),
            },
          },
        },
      },
    },
  });

  const filterChipLabel = useMemo(() => {
    if (!filter) return null;
    if (filter.type === 'date') {
      const parsed = parseDay(filter.value);
      const label = parsed ? format(parsed, 'dd MMM yyyy') : filter.value;
      return `Date: ${label}`;
    }
    if (filter.type === 'level') {
      return `Level: ${levelLabel(filter.value)}`;
    }
    if (filter.type === 'tag') {
      return `Tag: ${TAG_FILTER_LABELS[filter.value] || filter.value}`;
    }
    return null;
  }, [filter, levelLabel]);

  const total = interests.length;

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <TotalCardRoot>
            <IconWrapper>
              <Iconify icon="mdi:account-multiple-outline" width={26} height={26} />
            </IconWrapper>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
              <SummaryStatRow
                label="Total interests"
                value={total}
                selected={!filter}
                onClick={() => onFilterChange(null)}
              />
              <SummaryStatRow
                label="Not contacted"
                value={tagCounts.notContacted}
                selected={filter?.type === 'tag' && filter.value === 'NOT_CONTACTED'}
                onClick={() => toggleFilter({ type: 'tag', value: 'NOT_CONTACTED' })}
                tone="error"
              />
              <SummaryStatRow
                label="Dates defined"
                value={tagCounts.datesDefined}
                selected={filter?.type === 'tag' && filter.value === 'DATES_DEFINED'}
                onClick={() => toggleFilter({ type: 'tag', value: 'DATES_DEFINED' })}
              />
              <SummaryStatRow
                label="Possible student"
                value={tagCounts.possibleStudent}
                selected={filter?.type === 'tag' && filter.value === 'POSSIBLE_STUDENT'}
                onClick={() => toggleFilter({ type: 'tag', value: 'POSSIBLE_STUDENT' })}
                tone="success"
              />
            </Stack>
          </TotalCardRoot>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Dates with most interest"
              subheader="Top 6 upcoming days"
            />
            <Box sx={{ mx: 2, pb: 2 }} dir="ltr">
              {dateDemand.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                  No upcoming date ranges yet
                </Typography>
              ) : (
                <ReactApexChart
                  type="bar"
                  series={[{ name: 'Interests', data: dateDemand.map((d) => d.count) }]}
                  options={dateChartOptions}
                  height={Math.max(220, dateDemand.length * 28 + 40)}
                />
              )}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Level" subheader="Click a slice to filter" />
            <ChartWrapperStyle dir="ltr">
              {levelEntries.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                  No level data yet
                </Typography>
              ) : (
                <ReactApexChart
                  type="donut"
                  series={levelEntries.map((e) => e.count)}
                  options={levelChartOptions}
                  height={280}
                />
              )}
            </ChartWrapperStyle>
          </Card>
        </Grid>
      </Grid>

      {filterChipLabel && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Active filter:
          </Typography>
          <Chip
            label={filterChipLabel}
            onDelete={() => onFilterChange(null)}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
      )}
    </Box>
  );
}
