import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Stack, TextField, Typography } from '@mui/material';
import { LEVEL_HOUR_PRICE_PRESETS } from '../../../../utils/teacherHourPricePresets';

TeacherLevelHourRatesBar.propTypes = {
  levelPrices: PropTypes.object.isRequired,
  onLevelPriceChange: PropTypes.func.isRequired,
};

export default function TeacherLevelHourRatesBar({ levelPrices, onLevelPriceChange }) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{t('adminFinancial.paymentSettingsTitle')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {t('adminBookings.summary.levelPaymentSettingsHint')}
      </Typography>
      <Stack spacing={1.5}>
        {LEVEL_HOUR_PRICE_PRESETS.map((preset) => {
          const key = String(preset.level);
          const prices = levelPrices?.[key] || {};
          return (
            <Stack
              key={key}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Typography variant="subtitle2" sx={{ minWidth: 56 }}>
                {t('adminBookings.summary.levelLabel', { level: preset.level })}
              </Typography>
              <TextField
                size="small"
                type="number"
                label={t('adminPayouts.assignedHourPriceLabel')}
                value={prices.assigned ?? ''}
                onChange={(e) => onLevelPriceChange(key, 'assigned', e.target.value)}
                inputProps={{ min: 0, step: 500 }}
                sx={{ minWidth: 200 }}
              />
              <TextField
                size="small"
                type="number"
                label={t('adminPayouts.referredHourPriceLabel')}
                value={prices.referred ?? ''}
                onChange={(e) => onLevelPriceChange(key, 'referred', e.target.value)}
                inputProps={{ min: 0, step: 500 }}
                sx={{ minWidth: 200 }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
