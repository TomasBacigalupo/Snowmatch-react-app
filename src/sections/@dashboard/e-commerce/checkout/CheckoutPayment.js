import * as Yup from 'yup';
import { useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button, Card, Hidden } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping, cleanCart, setPaymentInfo, hireTeacherEvents, getDollarValue } from '../../../../redux/slices/teachers';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import { useState } from 'react';
import { getCardEncryptedCard } from '../../../../services/zenRise';
import CardInput from './CardInput';
import { useSnackbar } from 'notistack';
import ConfirmationDialog from './ConfirmationDialog';
import useLocales from 'src/hooks/useLocales';
import { Payment } from '@mercadopago/sdk-react';

import { initMercadoPago } from '@mercadopago/sdk-react';
initMercadoPago('TEST-88fbbb89-cc56-4432-a225-f27e4dab2a7c', { locale: 'es-AR' });

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
  const dispatch = useDispatch();
  const { translate } = useLocales()

  const [loading, setLoading] = useState(false)

  const { checkout, teacher } = useSelector((state) => state.teachers);



  const { total, discount, subtotal, shipping, events, card } = checkout;
  const { enqueueSnackbar } = useSnackbar();
  const [dollar, setDollar] = useState(470);
  const [confirmationDialog, setConfirmationDialog] = useState(true)

  useEffect(() => {
    dispatch(getDollarValue((dollar) => {
      if (dollar) {
        setDollar(dollar.rate)
      } else {
        enqueueSnackbar('Error getting dollar value', { variant: 'error' });
      }
    }))
  }, [])


  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  const handleApplyShipping = (value) => {
    dispatch(applyShipping(value));
  };

  const PaymentSchema = Yup.object().shape({

  });

  const defaultValues = {
    delivery: shipping,
    payment: '',
  };

  const methods = useForm({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
  } = methods;

  const onSubmit2 = async () => {
    try {
      const encryptedCard = await getCardEncryptedCard(card);
      console.log("me2", { encryptedCard });
      setLoading(true)
      try {
        dispatch(hireTeacherEvents(events, encryptedCard, card, (response) => {
          if (response.status === 200) {
            dispatch(setPaymentInfo(response.data))
            dispatch(cleanCart())
            handleNextStep();
          } else {
            //TODO: avisar que no estan disponibles esos eventos que reintente buscar otras fechas
            enqueueSnackbar(translate('error.hire'), { variant: 'error' })
            setLoading(false)
          }
        }))
      } catch (error) {
        setLoading(false)
      }
    } catch (error) {
      if (error?.response?.data?.error_type === 'invalid_request_error') {
        error?.response?.data?.validation_errors?.forEach((error) => {
          enqueueSnackbar(translate("error." + error.param), { variant: 'error' })
        })
      }
    }
  };

const initialization = {
  amount: 100,
  preferenceId: "1645436634-942c5c47-d997-4122-8327-5b4ed0b471b7",
 };
 const customization = {
  paymentMethods: {
    ticket: "all",
    creditCard: "all",
    debitCard: "all",
    mercadoPago: "all",
  },
 };
 const onSubmit = async (
  { selectedPaymentMethod, formData }
 ) => {
  // callback called when clicking the submit data button
  return new Promise((resolve, reject) => {
    fetch("/process_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        // receive payment result
        resolve();
      })
      .catch((error) => {
        // handle error response when trying to create payment
        reject();
      });
  });
 };
 const onError = async (error) => {
  // callback called for all Brick error cases
  console.log(error);
 };
 const onReady = async () => {
  /*
    Callback called when Brick is ready.
    Here you can hide loadings from your site, for example.
  */
 };
 

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={8}>
          {/* <CheckoutService onApplyShipping={handleApplyShipping} deliveryOptions={SERVICE_OPTIONS} /> */}
          {/* <CheckoutPaymentMethods cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS} /> */}
          {/* <Card sx={{ my: 3 }}><CardInput /></Card> */}
          <Payment
            initialization={initialization}
            customization={customization}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
          />
          <Hidden smDown>
            <Button
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            >
              {translate("checkout.back")}
            </Button>
          </Hidden>

        </Grid>
        <ConfirmationDialog open={confirmationDialog} onClose={() => setConfirmationDialog(false)} />
        <Grid item xs={12} md={4}>
          {/* <CheckoutBillingInfo onBackStep={handleBackStep} /> */}

          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            {translate("checkout.pay")}
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
