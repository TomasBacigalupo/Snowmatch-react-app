import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, StepConnector, Button, MenuItem, FormControl, TextField, InputLabel, Select, InputAdornment } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling, applyDiscount, calculateDiscount, updateLoggedUser, updateUserPhoneAndName } from '../../redux/slices/teachers';
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
import useAuth from 'src/hooks/useAuth';
import CompleteUserInfo from 'src/sections/@dashboard/e-commerce/checkout/CompleteUserInfo';
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
  const bookingPriceWithouDiscount = sum(events.map((event) => event.price));
  const bookingPrice = sum(events.map((event) => event.price)) - checkout.discount;
  const isComplete = activeStep === STEPS.length;
  const { total, discount, subtotal, shipping, card } = checkout;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [clientLevel, setClientLevel] = useState('');
  const { user } = useAuth();
  const isTeacher = user?.role === 'TEACHER';
  const [discountCode, setDiscountCode] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: ''
  });

  const handleUserInfoChange = (info) => {
    setUserInfo(info);
  };

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

  const onSubmitPay = () => {

    if (userInfo.name && userInfo.phone) {
      dispatch(updateUserPhoneAndName(
        userInfo.phone,
        userInfo.name
      ));
    }

    dispatch(createBooking(
      teacher.id,
      message,
      children,
      adults,
      events,
      bookingPrice,
      teacher.resorts[0]
    ));

    const phoneNumber = '+5492944263223';
    const _message = translate('contactMessage.private', {
      name: teacher.name,
      id: teacher.id,
      events: events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString(),
      children: children,
      adults: adults,
      message: message,
      discountCode: discountCode,
      total: fCurrency(bookingPrice)
    });
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(_message)}`;

    window.open(url, '_blank');
  }

  const onSubmitContact = () => {

    if (userInfo.name && userInfo.phone) {
      dispatch(updateUserPhoneAndName(
        userInfo.phone,
        userInfo.name
      ));
    }

    dispatch(createBooking(
      teacher.id,
      message,
      children,
      adults,
      events,
      bookingPrice,
      teacher.resorts[0]
    ));

    const phoneNumber = `+${teacher?.countryCode}${teacher?.cellphone}`;

    const _message = translate('contactMessage.private', {
      name: teacher.name,
      id: teacher.id,
      events: events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString(),
      children: children,
      adults: adults,
      message: message,
      discountCode: discountCode,
      total: fCurrency(bookingPrice)
    });

    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(_message)}`;

    window.open(url, '_blank');
  }

  if (loadingPayment) {
    return <LoadingScreen />
  } else {
    return (
      <Page title="Teacher: Match" sx={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <CheckoutCart />
        {!user.cellphone && <CompleteUserInfo onUserInfoChange={handleUserInfoChange} />}
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
            onApplyDiscount={(discountCode) => {
              setDiscountCode(discountCode);
              dispatch(calculateDiscount(discountCode, bookingPriceWithouDiscount));
            }}
          />
        </Box>
        <Box marginTop={2}>
          {bookingPrice === 0 && preferenceId && !createBookingError &&
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
                  const phoneNumber = '+5492944263223';
                  const _message = encodeURIComponent(
                    `Clase privada - ${teacher.name} - ${teacher.id}\nDias de clase:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nNiños: ${children}\nAdultos: ${adults}\nComentario: *${message}*\n${discountCode ? `Cupon: ${discountCode}` : ''}\n*Total: ${fCurrency(bookingPrice)}*`
                  );
                  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

                  window.open(url, '_blank');
                }}
                style={{ m: 2, color: 'white', }}
              >
                Contactar y Pagar
              </Button>
            </Box>
          }
        </Box>
        {!isTeacher && bookingPrice != 0 && <Box mx={2}>
          <Button
            onClick={onSubmitPay}
            variant='contained'
            fullWidth
            sx={{
              py: 1.5
            }}
            style={{ m: 2, color: 'white' }}
          >{translate('checkout.book')}</Button>
        </Box>}
        {bookingPrice === 0 && teacher && <Box mx={2}>
          <Button
            onClick={onSubmitContact}
            variant='contained'
            fullWidth
            sx={{
              py: 1.5
            }}
            style={{ m: 2, color: 'white' }}
          >
            {translate('checkout.bookAndContact')}
          </Button>
        </Box>}
        <CheckoutOrderComplete open={bookSuccess} teacher={teacher} />
        {bookingPrice < 0 &&
          <Box marginTop={2} marginX={1}>
            <Button onClick={onSubmit} variant='contained' fullWidth style={{ m: 2 }}> Book And Pay </Button>
          </Box>}
        {createBookingError && (
          <Box marginTop={2} marginX={3}>
            <Button variant="contained" fullWidth
              onClick={() => {
                const phoneNumber = '+5492944263223';
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
        {isTeacher && <Box mx={2}>
          <TextField
            value={client}
            fullWidth
            label='Nombre y apellido del cliente'
            sx={{ mb: 2 }}
            onChange={(event) => {
              setClient(event.target.value)
            }}
          />
          <FormControl fullWidth variant="outlined" sx={{
            mb: 2
          }}>
            <InputLabel id="cllient-level-label">Nivel del Cliente</InputLabel>
            <Select
              labelId="payment-method-label"
              value={clientLevel}
              onChange={(event) => {
                setClientLevel(event.target.value)
              }}
              label="Nivel del Cliente"
            >
              <MenuItem value="tarjeta-de-debito">Principiante</MenuItem>
              <MenuItem value="transferencia">Intermedio</MenuItem>
              <MenuItem value="efectivo">Experto</MenuItem>
            </Select>
          </FormControl>
          <TextField
            value={phone}
            fullWidth
            label='Teléfono del cliente'
            sx={{ mb: 2 }}
            onChange={(event) => {
              setPhone(event.target.value)
            }}
            helperText='Teléfono del cliente que tomará la clase'
          />
          <FormControl fullWidth variant="outlined" sx={{
            mb: 2
          }}>
            <InputLabel id="payment-method-label">Método de Pago</InputLabel>
            <Select
              labelId="payment-method-label"
              value={paymentMethod}
              onChange={(event) => {
                setPaymentMethod(event.target.value)
              }}
              label="Método de Pago"
            >
              <MenuItem value="tarjeta-de-debito">Tarjeta</MenuItem>
              <MenuItem value="transferencia">Transferencia</MenuItem>
              <MenuItem value="efectivo">Efectivo</MenuItem>
              <MenuItem value="reserva">50% Transferencias y 50% Efectivo ARS</MenuItem>
              <MenuItem value="reserva-dolares">50% Transferencias y 50% Efectivo USD</MenuItem>
              <MenuItem value="efectivo-dolares">USD</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              const phoneNumber = '+5492944263223';
              const _message = encodeURIComponent(
                `Clase Personalizada referida - ${teacher.name} ${teacher.lastname}\nDias de clase:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nCantidad de personas: ${adults}\nComentario: *${message}*\n*Total: ${fCurrency(bookingPrice)}*\nMetodo de pago: ${paymentMethod}\nNombre del Cliente: ${client}\nNivel del Cliente: ${clientLevel}\nTelefono del Cliente: ${phone}`
              );
              const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

              window.open(url, '_blank');
            }}
            variant='contained'
            fullWidth
            sx={{
              py: 1.5
            }}
          >Referír Clase</Button>
        </Box>}

      </Page>
    );
  }
}
