import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, StepConnector, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling, calculatePrice, calculateDiscount, updateUserPhoneAndName } from '../../redux/slices/teachers';
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
import { bookingAndPay, bookingAndPayProduct, bookingPending, changeAsignedStudents, createBooking } from 'src/redux/slices/bookings';
import CheckoutProductGuests from 'src/sections/@dashboard/e-commerce/checkout/CheckoutProductGuests';
import useAuth from 'src/hooks/useAuth';
import CheckoutProductShare from 'src/sections/@dashboard/e-commerce/checkout/CheckoutProductShare';
import { sum } from 'lodash';
import ReactPixel from 'react-facebook-pixel';
import useLocales from 'src/hooks/useLocales';
import { fCurrency } from 'src/utils/formatNumber';
import CompleteUserInfo from 'src/sections/@dashboard/e-commerce/checkout/CompleteUserInfo';

console.log(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY)
initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY, { locale: 'es-AR' });

// ----------------------------------------------------------------------

export default function EcommerceCheckoutProduct() {
    const { translate } = useLocales();

    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();
    const { checkout } = useSelector((state) => state.teachers);
    const { message, children, adults, bookSuccess, loadingPayment, onCreateBookingError } = useSelector((state) => state.bookings);
    const { product } = useSelector((state) => state.teachers);
    const { cart, billing, activeStep, events } = checkout;
    const [paymentMethod, setPaymentMethod] = useState('');
    const [client, setClient] = useState('');
    const [phone, setPhone] = useState('');

    const { user } = useAuth();
    const isTeacher = user?.role === 'TEACHER';
    const bookingPriceWithouDiscount = sum(events.map((event) => event.price));
    const bookingPrice = sum(events.map((event) => event.price)) - checkout.discount;

    const { discount, subtotal, shipping, card } = checkout;
    const total = calculatePrice(product, checkout.events.length)
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
        if (activeStep === 1) {
            dispatch(createBilling(null));
        }
    }, [dispatch, activeStep]);

    const [initialization, setInitialization] = useState({
        amount: bookingPrice,
        preferenceId: "1645436634-309d1017-108d-4648-a729-4acd4d431637",
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
            preferenceId: "1645436634-309d1017-108d-4648-a729-4acd4d431637",
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

    useEffect(() => {
        dispatch(changeAsignedStudents([
            { name: user.name, lastName: "" }
        ]));
    }, []);

    const onSubmit = async (
        { selectedPaymentMethod, formData }
    ) => {
        ReactPixel.track('BookNow', {
            content_name: "Required Class",
            content_category: 'Product',
            content_ids: [events[0]?.productId],
            content_type: 'product',
            value: total,
            currency: 'USD',
        });
        // callback called when clicking the submit data button
        return new Promise((resolve, reject) => {
            dispatch(bookingAndPayProduct(
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

    const sendWhatsAppMessage = () => {
        const phoneNumber = '‪+5492944263223‬';
        const message = encodeURIComponent(
            `dias de clase: ${events.map(e => {
                console.log({ e }); return e.date.toString() + ', ' + e.lessonTime
            }).toString()}\ncantidad de personas: ${adults}\nExperiencia:${product.name}`
        );
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

        window.open(url, '_blank');
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    };

    const onSubmitMercadoPago = () => {
        if (userInfo.name && userInfo.phone) {
            dispatch(updateUserPhoneAndName(
                userInfo.phone,
                userInfo.name
            ));
        }
        const phoneNumber = '+5492944263223';
        const _message = encodeURIComponent(
            `Experiencia: ${product.name}\nDias de clase:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nCantidad de personas: ${adults}\nComentario: *${message}*\n${discountCode ? `Cupon: ${discountCode}` : ''}\n*Total: ${fCurrency(bookingPriceWithouDiscount - discount)}*`
        );
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

        window.open(url, '_blank');
    }

    const onSubmitPix = () => {
        if (userInfo.name && userInfo.phone) {
            dispatch(updateUserPhoneAndName(
                userInfo.phone,
                userInfo.name
            ));
        }
        const phoneNumber = '+5492944263223';
        const _message = encodeURIComponent(
            `Experiência: ${product.name}\nDias de aula:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nQuantidade de pessoas: ${adults}\nComentário: *${message}*\nTotal: ${fCurrency(bookingPrice)}`
        );
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${_message}`;

        window.open(url, '_blank');
    }

    // const handleBook = () => {
    //     dispatch( (
    //         1,
    //         message,
    //         children,
    //         adults,
    //         events,
    //         total
    //     ));
    // }


    if (loadingPayment) {
        return <LoadingScreen />
    } else {
        return (
            <Page title="Teacher: Match">
                {/* <Container maxWidth={themeStretch ? false : 'lg'}> */}
                {/* <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        typography: 'subtitle2',
                        color: 'text.disabled',
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid> */}

                {/* {!isComplete ? (
          <>
            {activeStep === 0 && <CheckoutCart />}
            {activeStep === 1 && <CheckoutPayment />}
          </>
        ) : (
          <CheckoutOrderComplete open={isComplete} />
        )} */}
                <CheckoutCart />
                {!user.cellphone && <CompleteUserInfo onUserInfoChange={handleUserInfoChange} />}
                <CheckoutMessage />
                <CheckoutProductGuests />
                <Box marginTop={2}>
                    <CheckoutSummary
                        enableEdit
                        total={bookingPrice}
                        totalEvents={events.length}
                        subtotal={bookingPriceWithouDiscount}
                        discount={discount}
                        shipping={shipping}
                        onEdit={() => { }}
                        bookingPrice={bookingPriceWithouDiscount - discount}
                        onApplyDiscount={(discountCode) => {
                            setDiscountCode(discountCode);
                            dispatch(calculateDiscount(discountCode, bookingPriceWithouDiscount));
                        }}
                    />
                </Box>
                {/* <Box marginTop={2}>
                    {bookingPrice > 0 &&
                        <Payment
                            initialization={initialization}
                            customization={customization}
                            onSubmit={onSubmit}
                            onReady={onReady}
                            onError={onError}
                        />}
                </Box> */}
                <CheckoutOrderComplete open={bookSuccess} />
                {!isTeacher && <Box mx={2}>
                    <Button
                        onClick={onSubmitMercadoPago}
                        variant='contained'
                        fullWidth
                        sx={{
                            py: 1.5
                        }}
                    >Pagar con Mercado Pago</Button>
                </Box>}
                {!isTeacher &&
                    <Box mx={2} marginTop={2}>
                        <Button
                            onClick={onSubmitPix}
                            variant='outlined'
                            fullWidth
                            sx={{
                                py: 1.5
                            }}
                            >Pagar</Button>
                    </Box>
                }
                {isTeacher && <Box mx={2}>
                    <TextField
                        value={client}
                        fullWidth
                        label='Nombre del cliente'
                        sx={{ mb: 2 }}
                        onChange={(event) => {
                            setClient(event.target.value)
                        }}
                        helperText='Nombre del cliente que tomará la clase'
                    />
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
                                `Experiencia: ${product.name}\nDias de clase:${events.map(e => '\n- ' + formatDate(e.date) + ' - ' + translate(e.lessonTime)).toString()}\nCantidad de personas: ${adults}\nComentario: *${message}*\n*Total: ${fCurrency(bookingPrice)}*\nMetodo de pago: ${paymentMethod}\nNombre del Cliente: ${client}\nTelefono del Cliente: ${phone}`
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
                {/* <Box marginTop={2} marginX={1}>
        <Button onClick={handleBook} variant='contained' fullWidth style={{ m: 2 }}> Book </Button>
          </Box>*/}
                {/* {bookingPrice > 0 &&
                    <Box marginTop={2} marginX={1}>
                        <Button onClick={onSubmit} variant='contained' fullWidth style={{ m: 2 }}> Book And Pay </Button>
                    </Box>} */}
                {/* </Container> */}
            </Page>
        );
    }
}
