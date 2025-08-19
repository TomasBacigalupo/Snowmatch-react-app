import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
// components
import { BaseOptionChart } from '../../../../components/chart';
// utils
import { fNumber, fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

// Revenue Time Series Chart
export function RevenueChart({ data = [] }) {
  const theme = useTheme();

  const chartData = [
    {
      name: 'Revenue',
      data: data.map(item => item.revenue),
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: data.map(item => item.date),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => fCurrency(value),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => fCurrency(value),
        title: {
          formatter: () => 'Revenue: ',
        },
      },
      x: {
        formatter: (value, { dataPointIndex }) => {
          const item = data[dataPointIndex];
          return `${item?.date} (${item?.bookings || 0} bookings)`;
        },
      },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
  });

  return (
    <ReactApexChart
      type="area"
      series={chartData}
      options={chartOptions}
      height={350}
    />
  );
}

// Payment Method Breakdown Chart
export function PaymentMethodChart({ data = [] }) {
  const theme = useTheme();

  const chartData = data.map(item => item.amount);
  const labels = data.map(item => item.method);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.info.main,
    ],
    labels,
    stroke: {
      colors: [theme.palette.background.paper],
    },
    fill: {
      opacity: 0.8,
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    tooltip: {
      y: {
        formatter: (value) => fCurrency(value),
        title: {
          formatter: (seriesName) => `${seriesName}: `,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => fCurrency(data.reduce((sum, item) => sum + item.amount, 0)),
            },
          },
        },
      },
    },
  });

  return (
    <ReactApexChart
      type="donut"
      series={chartData}
      options={chartOptions}
      height={350}
    />
  );
}

// Bookings Time Series Chart
export function BookingsChart({ data = [] }) {
  const theme = useTheme();

  const chartData = [
    {
      name: 'Bookings',
      data: data.map(item => item.count),
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.info.main],
    xaxis: {
      categories: data.map(item => item.date),
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
        formatter: (value) => `${value} bookings`,
        title: {
          formatter: () => 'Bookings: ',
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
    <ReactApexChart
      type="bar"
      series={chartData}
      options={chartOptions}
      height={350}
    />
  );
}

// PropTypes
RevenueChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      revenue: PropTypes.number.isRequired,
      bookings: PropTypes.number,
    })
  ),
};

PaymentMethodChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
};

BookingsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
};

// Export as object for easier imports
const FinancialCharts = {
  RevenueChart,
  PaymentMethodChart,
  BookingsChart,
};

export default FinancialCharts; 