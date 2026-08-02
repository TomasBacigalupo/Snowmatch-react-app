import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Card, Stack, Typography, Box, Skeleton, Tooltip } from '@mui/material';
import Iconify from '../../../../components/Iconify';
import { fCurrency } from '../../../../utils/formatNumber';

const KPI_CARDS = [
  {
    category: 'paid',
    titleKey: 'adminFinancial.kpiPaidBookings',
    tooltipKey: 'adminFinancial.kpiPaidBookingsTooltip',
    countKey: 'paidBookingsCount',
    icon: 'eva:trending-up-fill',
    color: 'success',
    key: 'paidBookingsTotal',
  },
  {
    category: 'unpaid',
    titleKey: 'adminFinancial.kpiUnpaidBookings',
    tooltipKey: 'adminFinancial.kpiUnpaidBookingsTooltip',
    countKey: 'unpaidBookingsCount',
    icon: 'eva:alert-circle-fill',
    color: 'error',
    key: 'unpaidBookingsTotal',
  },
  {
    category: 'pending_payout',
    titleKey: 'adminFinancial.kpiPendingPayouts',
    tooltipKey: 'adminFinancial.kpiPendingPayoutsTooltip',
    countKey: 'pendingPayoutsCount',
    icon: 'eva:clock-fill',
    color: 'warning',
    key: 'pendingPayoutsTotal',
  },
  {
    category: 'completed_payout',
    titleKey: 'adminFinancial.kpiCompletedPayouts',
    tooltipKey: 'adminFinancial.kpiCompletedPayoutsTooltip',
    countKey: 'completedPayoutsCount',
    icon: 'eva:checkmark-circle-fill',
    color: 'info',
    key: 'completedPayoutsTotal',
  },
];

FinancialKPICards.propTypes = {
  kpis: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  filterQuery: PropTypes.string,
  getDetailPath: PropTypes.func,
};

export default function FinancialKPICards({
  kpis,
  loading = false,
  filterQuery = '',
  getDetailPath,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const getCardColor = (color) => {
    const colorMap = {
      primary: theme.palette.primary.main,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      info: theme.palette.info.main,
      error: theme.palette.error.main,
    };
    return colorMap[color] || theme.palette.primary.main;
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flexWrap: 'wrap' }}>
      {KPI_CARDS.map((card) => {
        const count = kpis[card.countKey];
        const detailPath = getDetailPath?.(card.category);
        const cardSx = {
          p: 3,
          minWidth: { xs: '100%', sm: 200 },
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: detailPath ? 'pointer' : 'default',
          textDecoration: 'none',
          color: 'inherit',
          transition: theme.transitions.create(['box-shadow', 'transform']),
          '&:hover': detailPath
            ? {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              }
            : undefined,
        };

        const cardContent = (
          <>
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
              {!loading && count != null && (
                <Typography variant="caption" color="text.secondary">
                  {t('adminFinancial.kpiCountLabel', { count })}
                </Typography>
              )}
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
          </>
        );

        return (
          <Tooltip key={card.key} title={t(card.tooltipKey)} arrow>
            {detailPath ? (
              <Card
                component={RouterLink}
                to={filterQuery ? `${detailPath}?${filterQuery}` : detailPath}
                sx={cardSx}
              >
                {cardContent}
              </Card>
            ) : (
              <Card sx={cardSx}>{cardContent}</Card>
            )}
          </Tooltip>
        );
      })}
    </Stack>
  );
}
