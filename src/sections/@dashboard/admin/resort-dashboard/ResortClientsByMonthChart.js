import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Box, Skeleton } from '@mui/material';
import { BaseOptionChart } from '../../../../components/chart';
import { fNumber } from '../../../../utils/formatNumber';

const MONTH_LABELS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

ResortClientsByMonthChart.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
};

export default function ResortClientsByMonthChart({ data = [], loading = false }) {
  const theme = useTheme();

  const chartData = [
    {
      name: 'Clientes',
      data: data.map((item) => item.count),
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: data.map((item) => MONTH_LABELS[item.month - 1] || item.month),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => fNumber(value),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} clientes`,
        title: {
          formatter: () => 'Clientes: ',
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
  });

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Clientes por mes
      </Typography>
      {loading ? (
        <Box sx={{ py: 6 }}>
          <Skeleton variant="rectangular" height={350} />
        </Box>
      ) : (
        <ReactApexChart type="bar" series={chartData} options={chartOptions} height={350} />
      )}
    </Card>
  );
}
