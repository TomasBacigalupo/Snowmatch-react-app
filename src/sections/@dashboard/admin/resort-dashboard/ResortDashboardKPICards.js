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
import Iconify from '../../../../components/Iconify';
import { fNumber } from '../../../../utils/formatNumber';

const KPI_CARDS = [
  {
    title: 'Reservas totales',
    icon: 'eva:file-text-fill',
    color: 'primary',
    key: 'totalBookings',
    tooltip: 'Reservas de clases en el centro en el año seleccionado',
  },
  {
    title: 'Consultas abiertas',
    icon: 'eva:message-circle-fill',
    color: 'warning',
    key: 'totalInquiries',
    tooltip: 'Solicitudes de reserva abiertas en el año seleccionado',
  },
  {
    title: 'Profesores',
    icon: 'eva:people-fill',
    color: 'info',
    key: 'totalTeachers',
    tooltip: 'Profesores autorizados asignados al centro',
  },
];

ResortDashboardKPICards.propTypes = {
  kpis: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

export default function ResortDashboardKPICards({ kpis, loading = false }) {
  const theme = useTheme();

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
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
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
                  sx={{ width: 20, height: 20, color: getCardColor(card.color) }}
                />
                {card.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{ color: getCardColor(card.color), fontWeight: 'bold' }}
              >
                {loading ? <Skeleton width={60} /> : fNumber(kpis[card.key] ?? 0)}
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
                sx={{ width: 30, height: 30, color: getCardColor(card.color) }}
              />
            </Box>
          </Card>
        </Tooltip>
      ))}
    </Stack>
  );
}
