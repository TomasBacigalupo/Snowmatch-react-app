import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import AdminAgencySelect from './AdminAgencySelect';
import {
  AGENCY_BOOKING_PRODUCTS,
  BAUTISMO_MAX_PERSONS,
  buildAgencyBookingInternalComment,
  getAgencyBookingPrice,
  getAgencyBookingProduct,
} from 'src/utils/agencyBookingProducts';

const STEPS = ['agency', 'dateTime', 'product'];

AgencyBookingStepperModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default function AgencyBookingStepperModal({ open, onClose, onApply }) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { agencies } = useSelector((state) => state.agency);

  const [activeStep, setActiveStep] = useState(0);
  const [agencyId, setAgencyId] = useState(null);
  const [date, setDate] = useState(null);
  const [lessonTime, setLessonTime] = useState('MORNING_2_HS');
  const [productId, setProductId] = useState(AGENCY_BOOKING_PRODUCTS[0].id);
  const [bautismoPersons, setBautismoPersons] = useState(1);

  const product = useMemo(() => getAgencyBookingProduct(productId), [productId]);
  const pricing = useMemo(
    () => getAgencyBookingPrice(product, bautismoPersons),
    [product, bautismoPersons]
  );

  const agencyName = useMemo(() => {
    const rows = Array.isArray(agencies) ? agencies : [];
    return rows.find((a) => Number(a.id) === Number(agencyId))?.name || '';
  }, [agencies, agencyId]);

  const resetState = () => {
    setActiveStep(0);
    setAgencyId(null);
    setDate(null);
    setLessonTime('MORNING_2_HS');
    setProductId(AGENCY_BOOKING_PRODUCTS[0].id);
    setBautismoPersons(1);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateStep = (step) => {
    if (step === 0) {
      if (!agencyId) {
        enqueueSnackbar(t('adminBookings.agencyBooking.validation.agency'), { variant: 'warning' });
        return false;
      }
      return true;
    }
    if (step === 1) {
      if (!date) {
        enqueueSnackbar(t('adminBookings.agencyBooking.validation.date'), { variant: 'warning' });
        return false;
      }
      if (lessonTime !== 'MORNING_2_HS' && lessonTime !== 'AFTERNOON_2_HS') {
        enqueueSnackbar(t('adminBookings.agencyBooking.validation.lessonTime'), { variant: 'warning' });
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!product) {
        enqueueSnackbar(t('adminBookings.agencyBooking.validation.product'), { variant: 'warning' });
        return false;
      }
      if (product.fixedPersons == null) {
        const n = Number(bautismoPersons);
        if (!Number.isFinite(n) || n < 1 || n > BAUTISMO_MAX_PERSONS) {
          enqueueSnackbar(
            t('adminBookings.agencyBooking.validation.persons', { max: BAUTISMO_MAX_PERSONS }),
            { variant: 'warning' }
          );
          return false;
        }
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const productLabel = t(product.labelKey);
    const { persons, listTotal, gearTotal, agencyPrice } = pricing;

    const internalComment = buildAgencyBookingInternalComment({
      agencyName,
      productLabel,
      persons,
      date: dateStr,
      lessonTime,
      listTotal,
      gearTotal,
      agencyPrice,
    });

    onApply({
      agencyId,
      agencyName,
      productId: product.id,
      productLabel,
      date: dateStr,
      lessonTime,
      persons,
      listTotal,
      gearTotal,
      agencyPrice,
      internalComment,
    });
    resetState();
    onClose();
  };

  const formatMoney = (value) =>
    Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('adminBookings.agencyBooking.title')}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 3 }}>
          {STEPS.map((stepKey) => (
            <Step key={stepKey}>
              <StepLabel>{t(`adminBookings.agencyBooking.steps.${stepKey}`)}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ pt: 1 }}>
            <AdminAgencySelect value={agencyId} onChange={setAgencyId} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {t('adminBookings.agencyBooking.agencyRequiredHint')}
            </Typography>
          </Box>
        )}

        {activeStep === 1 && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <DatePicker
                label={t('adminBookings.agencyBooking.date')}
                value={date}
                onChange={(next) => setDate(next)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <FormControl fullWidth>
                <InputLabel id="agency-lesson-time-label">
                  {t('adminBookings.agencyBooking.lessonTime')}
                </InputLabel>
                <Select
                  labelId="agency-lesson-time-label"
                  label={t('adminBookings.agencyBooking.lessonTime')}
                  value={lessonTime}
                  onChange={(e) => setLessonTime(e.target.value)}
                >
                  <MenuItem value="MORNING_2_HS">
                    {t('adminBookings.agencyBooking.morning2hs')}
                  </MenuItem>
                  <MenuItem value="AFTERNOON_2_HS">
                    {t('adminBookings.agencyBooking.afternoon2hs')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </LocalizationProvider>
        )}

        {activeStep === 2 && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControl component="fieldset">
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('adminBookings.agencyBooking.selectProduct')}
              </Typography>
              <RadioGroup
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                {AGENCY_BOOKING_PRODUCTS.map((item) => (
                  <FormControlLabel
                    key={item.id}
                    value={item.id}
                    control={<Radio />}
                    label={t(item.labelKey)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {product?.fixedPersons == null && (
              <TextField
                type="number"
                fullWidth
                label={t('adminBookings.agencyBooking.persons')}
                value={bautismoPersons}
                onChange={(e) => setBautismoPersons(e.target.value)}
                inputProps={{ min: 1, max: BAUTISMO_MAX_PERSONS, step: 1 }}
                helperText={t('adminBookings.agencyBooking.personsHelper', {
                  max: BAUTISMO_MAX_PERSONS,
                })}
              />
            )}

            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.neutral',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {t('adminBookings.agencyBooking.pricePreview')}
              </Typography>
              <Typography variant="body2">
                {t('adminBookings.agencyBooking.previewPersons', { count: pricing.persons })}
              </Typography>
              <Typography variant="body2">
                {t('adminBookings.agencyBooking.previewList', {
                  amount: formatMoney(pricing.listTotal),
                })}
              </Typography>
              <Typography variant="body2">
                {t('adminBookings.agencyBooking.previewGear', {
                  amount: formatMoney(pricing.gearTotal),
                })}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
                {t('adminBookings.agencyBooking.previewAgency', {
                  amount: formatMoney(pricing.agencyPrice),
                })}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{t('adminBookings.agencyBooking.cancel')}</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>{t('adminBookings.agencyBooking.back')}</Button>
        )}
        {activeStep < STEPS.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            {t('adminBookings.agencyBooking.next')}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleComplete}>
            {t('adminBookings.agencyBooking.complete')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
