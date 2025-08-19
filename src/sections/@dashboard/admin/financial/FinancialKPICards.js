import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Stack,
  Typography,
  Box,
  Skeleton,
  Tooltip,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// utils
import { fNumber, fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const KPI_CARDS = [
  {
    title: 'Total Reservas',
    icon: 'eva:file-text-fill',
    color: 'primary',
    key: 'totalBookings',
    format: 'number',
    tooltip: 'Total number of bookings in the selected period',
  },
  {
    title: 'Ingresos Cobrados',
    icon: 'eva:trending-up-fill',
    color: 'success',
    key: 'totalRevenue',
    format: 'currency',
    tooltip: 'Total revenue collected from successful payments',
  },
  {
    title: 'Pagos Pendientes',
    icon: 'eva:clock-fill',
    color: 'warning',
    key: 'pendingPayouts',
    format: 'currency',
    tooltip: 'Total amount pending to be paid to instructors',
  },
  {
    title: 'Payouts Realizados',
    icon: 'eva:checkmark-circle-fill',
    color: 'info',
    key: 'completedPayouts',
    format: 'currency',
    tooltip: 'Total amount already paid to instructors',
  },
  {
    title: 'Con Payout',
    icon: 'eva:people-fill',
    color: 'success',
    key: 'bookingsWithPayout',
    format: 'number',
    tooltip: 'Number of bookings that have associated payouts',
  },
  {
    title: 'Sin Payout',
    icon: 'eva:person-fill',
    color: 'warning',
    key: 'bookingsWithoutPayout',
    format: 'number',
    tooltip: 'Number of bookings without associated payouts',
  },
  {
    title: 'Con Factura',
    icon: 'eva:file-add-fill',
    color: 'secondary',
    key: 'bookingsWithInvoice',
    format: 'number',
    tooltip: 'Number of bookings with teacher invoices uploaded',
  },
];

FinancialKPICards.propTypes = {
  kpis: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

export default function FinancialKPICards({ kpis, loading = false }) {
  const theme = useTheme();

  const formatValue = (value, format) => {
    if (loading) return <Skeleton width={60} />;
    
    if (format === 'currency') {
      return fCurrency(value);
    }
    return fNumber(value);
  };

  const getCardColor = (color) => {
    const colorMap = {
      primary: theme.palette.primary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
      info: theme.palette.info.main,
      secondary: theme.palette.secondary.main,
    };
    return colorMap[color] || theme.palette.primary.main;
  };

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={3}
      sx={{ flexWrap: 'wrap' }}
    >
      {KPI_CARDS.map((card) => (
        <Tooltip key={card.key} title={card.tooltip} arrow>
          <Card
            sx={{
              p: 3,
              minWidth: { xs: '100%', sm: 200 },
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.customShadows?.z20,
              },
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Iconify
                  icon={card.icon}
                  sx={{
                    width: 20,
                    height: 20,
                    color: getCardColor(card.color),
                  }}
                />
                {card.title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  color: getCardColor(card.color),
                  fontWeight: 'bold',
                }}
              >
                {formatValue(kpis[card.key], card.format)}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: `${getCardColor(card.color)}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon={card.icon}
                sx={{
                  width: 30,
                  height: 30,
                  color: getCardColor(card.color),
                }}
              />
            </Box>
          </Card>
        </Tooltip>
      ))}
    </Stack>
  );
} 