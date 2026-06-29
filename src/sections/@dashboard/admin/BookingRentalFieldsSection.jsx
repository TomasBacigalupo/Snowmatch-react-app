import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';
import { useDispatch, useSelector } from 'src/redux/store';
import { getRentalItems } from 'src/redux/slices/rental';

const SKI_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const DATE_LOCALES = {
  es,
  en: enUS,
  pt: ptBR,
};

function getDateLocale(language) {
  const lang = language?.slice(0, 2) || 'es';
  return DATE_LOCALES[lang] || es;
}

function toDate(value) {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}

BookingRentalFieldsSection.propTypes = {
  rental: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  resort: PropTypes.string.isRequired,
  lessonMinDate: PropTypes.string,
  lessonMaxDate: PropTypes.string,
  prefillHint: PropTypes.string,
  hideFulfillment: PropTypes.bool,
  gearOnly: PropTypes.bool,
  sectionTitle: PropTypes.string,
};

export default function BookingRentalFieldsSection({
  rental,
  onChange,
  resort,
  lessonMinDate,
  lessonMaxDate,
  prefillHint,
  hideFulfillment = false,
  gearOnly = false,
  sectionTitle,
}) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.rental);
  const dateLocale = useMemo(() => getDateLocale(i18n.language), [i18n.language]);

  const rentalStart = toDate(rental.startDate);
  const rentalEnd = toDate(rental.endDate);
  const lessonMin = toDate(lessonMinDate);
  const lessonMax = toDate(lessonMaxDate);

  const rentalDayCount = useMemo(() => {
    if (!rentalStart || !rentalEnd) return null;
    return differenceInCalendarDays(rentalEnd, rentalStart) + 1;
  }, [rentalStart, rentalEnd]);

  const differsFromLessonDates =
    Boolean(lessonMinDate && lessonMaxDate) &&
    (rental.startDate !== lessonMinDate || rental.endDate !== lessonMaxDate);

  useEffect(() => {
    if (resort) {
      dispatch(getRentalItems({ resortId: resort, status: 'ACTIVE', size: 100 }));
    }
  }, [dispatch, resort]);

  useEffect(() => {
    if (lessonMinDate && lessonMaxDate && (!rental.startDate || !rental.endDate)) {
      onChange({ startDate: lessonMinDate, endDate: lessonMaxDate });
    }
  }, [lessonMinDate, lessonMaxDate, rental.startDate, rental.endDate, onChange]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === rental.itemId),
    [items, rental.itemId]
  );

  const variants = selectedItem?.variants ?? [];

  const patch = (fields) => onChange(fields);

  const handleDateRangeChange = ([start, end]) => {
    patch({
      startDate: start ? format(start, 'yyyy-MM-dd') : '',
      endDate: end ? format(end, 'yyyy-MM-dd') : '',
    });
  };

  const dateRangeHelper = useMemo(() => {
    if (rentalDayCount != null) {
      return t('adminBookings.rental.dateRangeDays', { count: rentalDayCount });
    }
    if (lessonMinDate && lessonMaxDate) {
      return t('adminBookings.rental.dateRangeBounds', {
        min: lessonMinDate,
        max: lessonMaxDate,
      });
    }
    if (gearOnly) {
      return t('adminBookings.rental.dateRangeStandaloneHint');
    }
    return t('adminBookings.rental.dateRangeHint');
  }, [rentalDayCount, lessonMinDate, lessonMaxDate, gearOnly, t]);

  return (
    <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ mb: prefillHint ? 0.5 : 2 }}>
        {sectionTitle || t('adminBookings.rental.createSectionTitle')}
      </Typography>
      {prefillHint && (
        <Typography variant="caption" color="primary.main" sx={{ display: 'block', mb: 2 }}>
          {prefillHint}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="rental-item-label">{t('adminBookings.rental.tableItem')}</InputLabel>
            <Select
              labelId="rental-item-label"
              label={t('adminBookings.rental.tableItem')}
              value={rental.itemId || ''}
              onChange={(e) =>
                patch({
                  itemId: e.target.value,
                  variantId: '',
                })
              }
              disabled={isLoading}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                  {item.category ? ` (${item.category})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {variants.length > 0 && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="rental-variant-label">{t('adminBookings.rental.variant')}</InputLabel>
              <Select
                labelId="rental-variant-label"
                label={t('adminBookings.rental.variant')}
                value={rental.variantId || ''}
                onChange={(e) => patch({ variantId: e.target.value })}
              >
                <MenuItem value="">{t('adminBookings.rental.noVariant')}</MenuItem>
                {variants.map((variant) => (
                  <MenuItem key={variant.id} value={variant.id}>
                    {variant.summary || variant.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} md={8}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={dateLocale}>
            <Stack spacing={1}>
              <DateRangePicker
                localeText={{
                  start: t('adminBookings.rental.startDate'),
                  end: t('adminBookings.rental.endDate'),
                }}
                value={[rentalStart, rentalEnd]}
                onChange={handleDateRangeChange}
                minDate={lessonMin || undefined}
                maxDate={lessonMax || undefined}
                calendars={1}
                slotProps={{
                  textField: { fullWidth: true, required: true },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {dateRangeHelper}
              </Typography>
              {differsFromLessonDates && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('adminBookings.rental.syncLessonDates')}
                  onClick={() => patch({ startDate: lessonMinDate, endDate: lessonMaxDate })}
                  sx={{ alignSelf: 'flex-start' }}
                />
              )}
            </Stack>
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            required
            type="number"
            label={t('adminBookings.rental.units')}
            value={rental.unitsReserved}
            inputProps={{ min: 1 }}
            onChange={(e) => patch({ unitsReserved: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('adminBookings.rental.renterSection')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('adminBookings.rental.renterFirstName')}
            value={rental.renterFirstName || ''}
            onChange={(e) => patch({ renterFirstName: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('adminBookings.rental.renterLastName')}
            value={rental.renterLastName || ''}
            onChange={(e) => patch({ renterLastName: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            required
            type="number"
            label={t('adminBookings.rental.tableHeight')}
            value={rental.renterHeightCm}
            inputProps={{ min: 80, max: 260 }}
            onChange={(e) => patch({ renterHeightCm: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            required
            type="number"
            label={t('adminBookings.rental.tableWeight')}
            value={rental.renterWeightKg}
            inputProps={{ min: 20, max: 250 }}
            onChange={(e) => patch({ renterWeightKg: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            required
            type="number"
            label={t('adminBookings.rental.tableFoot')}
            value={rental.renterFootLengthCm}
            inputProps={{ min: 15, max: 35 }}
            onChange={(e) => patch({ renterFootLengthCm: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth required>
            <InputLabel id="rental-ski-level-label">{t('adminBookings.rental.tableLevel')}</InputLabel>
            <Select
              labelId="rental-ski-level-label"
              label={t('adminBookings.rental.tableLevel')}
              value={rental.renterSkiLevel || 'INTERMEDIATE'}
              onChange={(e) => patch({ renterSkiLevel: e.target.value })}
            >
              {SKI_LEVELS.map((level) => (
                <MenuItem key={level} value={level}>
                  {t(`adminBookings.rental.skiLevel.${level}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {!hideFulfillment && (
          <>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="rental-fulfillment-label">{t('adminBookings.rental.delivery')}</InputLabel>
                <Select
                  labelId="rental-fulfillment-label"
                  label={t('adminBookings.rental.delivery')}
                  value={rental.rentalFulfillment || 'PICKUP_IN_SHOP'}
                  onChange={(e) => patch({ rentalFulfillment: e.target.value })}
                >
                  <MenuItem value="PICKUP_IN_SHOP">{t('adminBookings.rental.deliveryPickupInShop')}</MenuItem>
                  <MenuItem value="SHIP_TO_HOTEL_OR_HOME">
                    {t('adminBookings.rental.deliveryShipToHotel')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {rental.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="rental-dest-type-label">
                      {t('adminBookings.rental.destinationType')}
                    </InputLabel>
                    <Select
                      labelId="rental-dest-type-label"
                      label={t('adminBookings.rental.destinationType')}
                      value={rental.rentalDestinationType || 'HOTEL_OR_CABIN'}
                      onChange={(e) => patch({ rentalDestinationType: e.target.value })}
                    >
                      <MenuItem value="HOTEL_OR_CABIN">{t('adminBookings.rental.destinationHotel')}</MenuItem>
                      <MenuItem value="HOME_ADDRESS">{t('adminBookings.rental.destinationHome')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label={t('adminBookings.rental.addressHotel')}
                    value={rental.rentalDestinationDetail || ''}
                    onChange={(e) => patch({ rentalDestinationDetail: e.target.value })}
                  />
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </Box>
  );
}
