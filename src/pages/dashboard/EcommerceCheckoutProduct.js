import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, StepConnector, Button } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling, calculatePrice } from '../../redux/slices/teachers';
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
initMercadoPago('TEST-88fbbb89-cc56-4432-a225-f27e4dab2a7c', { locale: 'es-AR' });

// ----------------------------------------------------------------------

export default function EcommerceCheckoutProduct() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();
    const { checkout } = useSelector((state) => state.teachers);
    const { message, children, adults, bookSuccess, loadingPayment, onCreateBookingError } = useSelector((state) => state.bookings);
    const { product } = useSelector((state) => state.teachers);
    const { cart, billing, activeStep, events } = checkout;
    
    const { user } = useAuth();
    const bookingPrice = sum(events.map((event) => event.price));

    const { discount, subtotal, shipping, card } = checkout;
    const total = calculatePrice(product, checkout.events.length)
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
        const phoneNumber = '+5492944367197';
        const message = encodeURIComponent(
            `dias de clase: ${events.map( e => {
                console.log({e}); return e.date.toString() + ', ' + e.lessonTime}).toString()}\ncantidad de personas: ${adults}\nExperiencia:${product.name}`
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
                <CheckoutMessage />
                <CheckoutProductGuests />
                <Box marginTop={2}>
                    <CheckoutSummary
                        enableEdit
                        total={bookingPrice}
                        totalEvents={events.length}
                        subtotal={bookingPrice}
                        discount={0}
                        shipping={shipping}
                        onEdit={() => { }}
                        bookingPrice={bookingPrice}
                    />
                </Box>
                <Box marginTop={2}>
                    {bookingPrice > 0 &&
                        <Payment
                            initialization={initialization}
                            customization={customization}
                            onSubmit={onSubmit}
                            onReady={onReady}
                            onError={onError}
                        />}
                </Box>
                <CheckoutOrderComplete open={bookSuccess} />
                <Box mx={2}>
                    <Button
                        onClick={() => {
                            const phoneNumber = '+5492944367197';
                            const message = encodeURIComponent(
                                `dias de clase: ${events.map( e => {
                                    console.log({e}); return e.date.toString() + ', ' + e.lessonTime}).toString()}\ncantidad de personas: ${adults}\nExperiencia:${product.name}`
                            );
                            const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
                    
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
