import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Stack, TextField, Typography } from '@mui/material';
import {
  LEVEL_HOUR_PRICE_PRESETS,
} from '../../../../utils/teacherHourPricePresets';

function formatArs(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

FinancialHourRatesBar.propTypes = {
  assignedHourPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  referredHourPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onAssignedChange: PropTypes.func.isRequired,
  onReferredChange: PropTypes.func.isRequired,
};

export default function FinancialHourRatesBar({
  assignedHourPrice,
  referredHourPrice,
  onAssignedChange,
  onReferredChange,
}) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t('adminFinancial.paymentSettingsTitle')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('adminFinancial.paymentSettingsHint')}
      </Typography>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {t('adminPayouts.levelPricePresets')}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {LEVEL_HOUR_PRICE_PRESETS.map((preset) => {
            const selected =
              String(assignedHourPrice) === String(preset.assigned) &&
              String(referredHourPrice) === String(preset.referred);
            return (
              <Chip
                key={String(preset.level)}
                clickable
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                label={t('adminPayouts.levelPricePresetChip', {
                  level: preset.level,
                  assigned: formatArs(preset.assigned),
                  referred: formatArs(preset.referred),
                })}
                onClick={() => {
                  onAssignedChange(String(preset.assigned));
                  onReferredChange(String(preset.referred));
                }}
              />
            );
          })}
        </Stack>
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          size="small"
          type="number"
          label={t('adminPayouts.assignedHourPriceLabel')}
          value={assignedHourPrice}
          onChange={(e) => onAssignedChange(e.target.value)}
          inputProps={{ min: 0, step: 500 }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          size="small"
          type="number"
          label={t('adminPayouts.referredHourPriceLabel')}
          value={referredHourPrice}
          onChange={(e) => onReferredChange(e.target.value)}
          inputProps={{ min: 0, step: 500 }}
          sx={{ minWidth: 200 }}
        />
      </Stack>
    </Stack>
  );
}
