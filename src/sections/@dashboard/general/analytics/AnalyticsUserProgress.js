import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import { BaseOptionChart } from '../../../../components/chart';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
}));

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: 'data', data: [80, 50, 30, 89] },
];

const CHART_DATA_EMPTY = [
  { name: 'data', data: [0, 0, 0, 0] },
];

export default function AnalyticsUserProgress() {

  const { user } = useAuth();
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 2 },
    fill: { opacity: 0.48 },
    legend: { floating: true, horizontalAlign: 'center' },
    xaxis: {
      categories: ['Carving', 'Bumps', 'Corto', 'FreeStyle'],
      labels: {
        style: {
          colors: [
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
            theme.palette.text.secondary,
          ],
        },
      },
    },
  });

  return (
    <Box>
        <ReactApexChart type="radar" series={user ? CHART_DATA : CHART_DATA_EMPTY } options={chartOptions} height={250} />
    </Box>
  );
}
