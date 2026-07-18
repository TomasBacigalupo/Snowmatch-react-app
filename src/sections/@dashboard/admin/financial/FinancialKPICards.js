import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { Card, Stack, Typography, Box, Skeleton, Tooltip } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { fCurrency } from '../../../../utils/formatNumber';

const KPI_CARDS = [
  {
    titleKey: 'adminFinancial.kpiPaidBookings',
    tooltipKey: 'adminFinancial.kpiPaidBookingsTooltip',
    icon: 'eva:trending-up-fill',
    color: 'success',
    key: 'paidBookingsTotal',
  },
  {
    titleKey: 'adminFinancial.kpiCompletedPayouts',
    tooltipKey: 'adminFinancial.kpiCompletedPayoutsTooltip',
    icon: 'eva:checkmark-circle-fill',
    color: 'info',
    key: 'completedPayoutsTotal',
  },
  {
    titleKey: 'adminFinancial.kpiPendingPayouts',
    tooltipKey: 'adminFinancial.kpiPendingPayoutsTooltip',
    icon: 'eva:clock-fill',
    color: 'warning',
    key: 'pendingPayoutsTotal',
  },
];

FinancialKPICards.propTypes = {
  kpis: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

export default function FinancialKPICards({ kpis, loading = false }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const getCardColor = (color) => {
    const colorMap = {
      primary: theme.palette.primary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      info: theme.palette.info.main,
    };
    return colorMap[color] || theme.palette.primary.main;
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
      {KPI_CARDS.map((card) => (
        <Tooltip key={card.key} title={t(card.tooltipKey)} arrow>
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
                {t(card.titleKey)}
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: getCardColor(card.color), fontWeight: 'bold' }}
              >
                {loading ? <Skeleton width={80} /> : fCurrency(kpis[card.key] || 0)}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: `${getCardColor(card.color)}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon={card.icon}
                sx={{ width: 28, height: 28, color: getCardColor(card.color) }}
              />
            </Box>
          </Card>
        </Tooltip>
      ))}
    </Stack>
  );
}
