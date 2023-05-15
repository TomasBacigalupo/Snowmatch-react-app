import * as Yup from 'yup';
import { useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onGotoStep, onBackStep, onNextStep, applyShipping, hireTeacher, cleanCart, setPaymentInfo, hireTeacherEvents, startPayment, completePayment, getDollarValue } from '../../../../redux/slices/teachers';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutService from './CheckoutService';
import { useState } from 'react';
import { cardPayment, getAuthToken, getCardEncryptedCard, getSplitToken, getToken } from '../../../../services/zenRise';
import CardInput from './CardInput';
import { useSnackbar } from 'notistack';
import { el } from 'date-fns/locale';
import ConfirmationDialog from './ConfirmationDialog';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  {
    value: 0,
    title: 'Standard service (Free)',
    description: 'You will deal with teachers by your own',
  },
  {
    value: 2,
    title: 'SnowMatch Support ($20,00)',
    description: 'We will help you in every step of your lesson',
  },
];

const PAYMENT_OPTIONS = [
  {
    value: 'debit_card',
    title: 'Debit/Credit Card',
    description: 'We support Mastercard, Visa, Discover and Stripe.',
    icons: [
      'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
      'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
    ],
  },
  {
    value: 'cash',
    title: 'Cash on meet',
    description: 'Pay with cash when your meet your Pro.',
    icons: [],
  },
];

const CARDS_OPTIONS = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

export default function CheckoutPayment() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)

  const { checkout, teacher } = useSelector((state) => state.teachers);

  const {zenriseClient, zenrisSecret} = teacher;


  const { total, discount, subtotal, shipping, events, card } = checkout;
  const {enqueueSnackbar} = useSnackbar();
  const [dollar, setDollar] = useState(470);
  const [confirmationDialog, setConfirmationDialog] = useState(true)
  const {user} = useAuth()

  useEffect(() => {
    dispatch(getDollarValue((dollar) => {
      if (dollar) {
        console.log({dollar})
        setDollar(dollar.rate)
      }else{
        enqueueSnackbar('Error getting dollar value', { variant: 'error' });
      }
    }))
  },[])


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

  const onSubmit = async () => {
    const encryptedCard = await getCardEncryptedCard(card);
    setLoading(true)
    try {
      dispatch(hireTeacherEvents(events, (succ) => {
        if (succ) {
          try {
            dispatch(startPayment(events, encryptedCard, (paymentData) => {
              debugger
              dispatch(setPaymentInfo(paymentData))
              dispatch(cleanCart())
              handleNextStep();
          }))

          } catch (error) {
            setLoading(false)
            enqueueSnackbar('Payment failed', { variant: 'error' })
            //pago rechazado
            //TODO: call unhire
          }

        } else {
          //TODO: avisar que no estan disponibles esos eventos que reintente buscar otras fechas
          enqueueSnackbar('Events had been booked', { variant: 'error' })
          setLoading(false)
        }
      }))
    } catch (error) {
      setLoading(false)
    }

    try {
      // OLD Request events
      // dispatch(hireTeacher(teacher.id, events, (succ)=>{
      //   setLoading(false)
      //   dispatch(cleanCart())
      //   handleNextStep();
      // }))
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* <CheckoutService onApplyShipping={handleApplyShipping} deliveryOptions={SERVICE_OPTIONS} /> */}
          {/* <CheckoutPaymentMethods cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS} /> */}
          <Card sx={{ my: 3 }}><CardInput /></Card>
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>
        <ConfirmationDialog open={confirmationDialog} onClose={()=> setConfirmationDialog(false)}/>
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
            Pagar
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
