import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack, Box } from '@mui/material';
// utils
import { fCurrency, fPercent } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import BaseOptionChart from '../../../../components/chart/BaseOptionChart';
import PropTypes from 'prop-types';
import useLocales from 'src/hooks/useLocales';
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: '12px',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.customShadows.z8,
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

const TrendIndicator = styled(Box)(({ theme, positive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '6px',
  backgroundColor: positive ? theme.palette.success.lighter : theme.palette.error.lighter,
  color: positive ? theme.palette.success.dark : theme.palette.error.dark,
  fontSize: '0.875rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

const EmptyState = styled(Stack)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

const TOTAL = 18765;
const PERCENT = 2.6;
const CHART_DATA = [{ data: [111, 136, 76, 108, 74, 54, 57, 84] }];

// BookingTotalIncomes.PropTypes = {
//   total: PropTypes.number,
//   percent: PropTypes.number,
//   chartData: PropTypes.arrayOf(PropTypes.number)
// };

export default function BookingTotalIncomes({ total, percent, chartData }) {
  const { translate } = useLocales();
  
  if (!total || total === 0) {
    return (
      <RootStyle>
        <EmptyState spacing={2}>
          <Iconify
            icon="mdi:snowflake"
            width={48}
            height={48}
            sx={{ color: 'primary.main' }}
          />
          <Typography variant="h6">
            {translate('generalApp.noBookingsYet')}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 300,
              mx: 'auto'
            }}
          >
            {translate('generalApp.referSkierMessage')}
          </Typography>
          <Box
            component="button"
            sx={{
              mt: 2,
              border: 'none',
              cursor: 'pointer',
              borderRadius: '8px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              py: 1.5,
              px: 3,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              transition: 'background-color 0.2s',
            }}
            onClick={() => {
              // Aquí puedes agregar la navegación a la página de referidos
              // navigate('/refer') o similar
            }}
          >
            {translate('generalApp.referSkierButton')}
          </Box>
        </EmptyState>
      </RootStyle>
    );
  }

  const chartOptions = merge(BaseOptionChart(), {
    chart: { 
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    stroke: { 
      width: 2,
      curve: 'smooth',
    },
    legend: { show: false },
    grid: { show: false },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fCurrency(seriesName),
        title: { formatter: () => '' },
      },
    },
    fill: { 
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    colors: [theme => theme.palette.primary.main],
  });

  return (
    <RootStyle>
      <Stack spacing={2}>
        <StatLabel>{translate('generalApp.totalIncome')}</StatLabel>
        
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <StatValue>{fCurrency(total)}</StatValue>
          
          <Stack alignItems="flex-end">
            <TrendIndicator positive={percent >= 0}>
              <Iconify
                icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'}
                width={16}
                height={16}
                sx={{ mr: 0.5 }}
              />
              {percent > 0 && '+'}
              {fPercent(percent)}
            </TrendIndicator>
            
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {translate('generalApp.thanLastMonth')}
            </Typography>
          </Stack>
        </Stack>

        <Box sx={{ mt: 2, mx: -3, mb: -3 }}>
          <ReactApexChart
            type="area"
            series={chartData}
            options={chartOptions}
            height={120}
          />
        </Box>
      </Stack>
    </RootStyle>
  );
}

BookingTotalIncomes.propTypes = {
  total: PropTypes.number,
  percent: PropTypes.number,
  chartData: PropTypes.array,
};
