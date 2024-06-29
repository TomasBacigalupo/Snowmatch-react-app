import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, StepConnector, Button } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling } from '../../redux/slices/teachers';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import LoadingScreen from '../../components/LoadingScreen';

// sections
import {
  CheckoutCart,
  CheckoutOrderComplete,
  CheckoutSummary,
} from '../../sections/@dashboard/e-commerce/checkout';
import CheckoutMessage from 'src/sections/@dashboard/e-commerce/checkout/CheckoutMessage';
import CheckoutGuests from 'src/sections/@dashboard/e-commerce/checkout/CheckoutGuests';
import { Payment } from '@mercadopago/sdk-react';

import { initMercadoPago } from '@mercadopago/sdk-react';
import { bookingAndPay, bookingPending, createBooking, createPreference, onCreateBookingError } from 'src/redux/slices/bookings';
import { sum } from 'lodash';

import ReactPixel from 'react-facebook-pixel';
import { fCurrency } from 'src/utils/formatNumber';
import useLocales from 'src/hooks/useLocales';
console.log(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY)
initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY, { locale: 'es-AR' });

// ----------------------------------------------------------------------

const STEPS = ['Confirmation', 'Teacher Approve', 'Payment'];

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Iconify icon={'eva:checkmark-fill'} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

export default function EcommerceCheckoutTeacher() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const { checkout, teacher } = useSelector((state) => state.teachers);

  const { message, children, adults, bookSuccess, loadingPayment, preferenceId, createBookingError } = useSelector((state) => state.bookings);
  const { cart, billing, activeStep, events } = checkout;
  const bookingPrice = sum(events.map((event) => event.price));
  const isComplete = activeStep === STEPS.length;
  const { total, discount, subtotal, shipping, card } = checkout;
  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(events));
    }
  }, [dispatch, isMountedRef, cart]);
  useEffect(() => {
    dispatch(bookingPending());
  }, [dispatch]);
  useEffect(() => {
    dispatch(bookingPending());
    dispatch(createPreference(events[0]?.teacherId, events))
  }, [dispatch, events]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  const [initialization, setInitialization] = useState({
    amount: bookingPrice,
    preferenceId: preferenceId,
  });

  const [customization, setCustomization] = useState({
    visual: {
      // hidePaymentButton: true,
      hideFormTitle: true,

    },
    paymentMethods: {
      creditCard: "all",
      debitCard: "all",
      bankTransfer: "all",
      atm: "all",
      wallet_purchase: "all",
      maxInstallments: 2
    },
  });

  useEffect(() => {
    setInitialization({
      amount: bookingPrice,
      preferenceId: preferenceId,
    });
    console.log("pase")
    setCustomization({
      visual: {
        // hidePaymentButton: true,
        hideFormTitle: true,
      },
      paymentMethods: {
        creditCard: "all",
        debitCard: "all",
        bankTransfer: "all",
        atm: "all",
        wallet_purchase: "all",
        maxInstallments: 2
      },
    })
  }, [bookingPrice]);

  const onSubmit = async (
    { selectedPaymentMethod, formData }
  ) => {
    ReactPixel.track('BookNow', {
      content_name: "Required Class",
      content_category: 'Teacher',
      content_ids: [events[0]?.teacherId],
      content_type: 'product',
      value: total,
      currency: 'USD',
    });
    // callback called when clicking the submit data button
    return new Promise((resolve, reject) => {
      dispatch(bookingAndPay(
        events[0]?.teacherId,
        message,
        children,
        adults,
        events,
        total,
        formData
      ));
      console.log(JSON.stringify(formData));
    });
  };

  const onError = async (error) => {
    // callback called for all Brick error cases
    dispatch(onCreateBookingError())
    console.log(error);
  };

  const onReady = async () => {
    /*
      Callback called when Brick is ready.
      Here you can hide loadings from your site, for example.
    */
  };

  const handleBook = () => {
    dispatch(createBooking(
      1,
      message,
      children,
      adults,
      events,
      total
    ));
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  if (loadingPayment) {
    return <LoadingScreen />
  } else {
    return (
      <Page title="Teacher: Match">
        <CheckoutCart />
        <CheckoutMessage />
        <CheckoutGuests />
        <Box marginTop={2}>
          <CheckoutSummary
            enableEdit
            total={bookingPrice}
            totalEvents={events.length}
            subtotal={bookingPrice}
            discount={discount}
            shipping={shipping}
            onEdit={() => { }}
            bookingPrice={bookingPrice}
          />
        </Box>
        <Box marginTop={2}>
          {bookingPrice > 0 && preferenceId && !createBookingError &&
            // <Payment
            //   initialization={initialization}
            //   customization={customization}
            //   onSubmit={onSubmit}
            //   onReady={onReady}
            //   onError={onError}
            // />
            <Box marginTop={2} marginX={2} marginBottom={3}>
              <Button variant="contained" fullWidth
                sx={{
                  py: 1.5
                }}
                onClick={() => {
                  const phoneNumber = '+5492944367197';
                  const _message = encodeURIComponent(
                    `Clase privada - ${teacher.name} - ${teacher.id}\nDias de clase:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nNiños: ${children}\nAdultos: ${adults}\nComentario: *${message}*\n*Total: ${fCurrency(bookingPrice)}*`
                  );
                  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

                  window.open(url, '_blank');
                }}
                style={{ m: 2, color: 'white',}}
              >
                Contactar y Pagar
              </Button>
            </Box>
          }
        </Box>
        <Box mx={2}>
          <Button
            onClick={() => {
              const phoneNumber = '+5492944367197';
              const _message = encodeURIComponent(
                `Aula particular - ${teacher.name} - ${teacher.id}\nDias de aula:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nCrianças: ${children}\nAdultos: ${adults}\nComentário: *${message}*\n*Total: ${fCurrency(bookingPrice)}*`
              );
              const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

              window.open(url, '_blank');
            }}
            variant='contained'
            fullWidth
            sx={{
              py: 1.5
            }}
            style={{ m: 2, color: 'white', backgroundColor: '#820AD1' }}
          >Pagar com PIX</Button>
        </Box>
        <CheckoutOrderComplete open={bookSuccess} />
        {bookingPrice < 0 &&
          <Box marginTop={2} marginX={1}>
            <Button onClick={onSubmit} variant='contained' fullWidth style={{ m: 2 }}> Book And Pay </Button>
          </Box>}
        {createBookingError && (
          <Box marginTop={2} marginX={3}>
            <Button variant="contained" fullWidth
              onClick={() => {
                const phoneNumber = '+5492944367197';
                const _message = encodeURIComponent(
                  `Experiencia: Clase privada\nDias de clase:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nCantidad de personas: ${adults}\nComentario: *${message}*\n*Total: ${fCurrency(bookingPrice)}*`
                );
                const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

                window.open(url, '_blank');
              }}
            >
              Terminar mi compra por WhatsApp
            </Button>
          </Box>
        )}

        <Box marginTop={2}>
          {bookingPrice === 0 && teacher && <Button variant="contained" fullWidth onClick={() => {
            window.open(`https://wa.me/${teacher?.countryCode}${teacher?.cellphone}`, '_blank');
          }}>
            Contactar al profesor
          </Button>}
        </Box>

      </Page>
    );
  }
}
