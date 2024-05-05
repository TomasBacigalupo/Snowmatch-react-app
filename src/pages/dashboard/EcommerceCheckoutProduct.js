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
import { bookingAndPay, bookingPending, changeAsignedStudents, createBooking } from 'src/redux/slices/bookings';
import CheckoutProductGuests from 'src/sections/@dashboard/e-commerce/checkout/CheckoutProductGuests';
import useAuth from 'src/hooks/useAuth';
initMercadoPago('TEST-88fbbb89-cc56-4432-a225-f27e4dab2a7c');

// ----------------------------------------------------------------------

const STEPS = ['Confirmation', 'Teacher Approve', 'Payment'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    top: 10,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 20px)',
    '& .MuiStepConnector-line': {
        borderTopWidth: 2,
        borderColor: theme.palette.divider,
    },
    '&.Mui-active, &.Mui-completed': {
        '& .MuiStepConnector-line': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

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

export default function EcommerceCheckoutProduct() {
    const { themeStretch } = useSettings();
    const dispatch = useDispatch();
    const isMountedRef = useIsMountedRef();
    const { checkout } = useSelector((state) => state.teachers);
    const { message, children, adults, bookSuccess, loadingPayment } = useSelector((state) => state.bookings);
    const { cart, billing, activeStep, events, bookingPrice } = checkout;
    const isComplete = activeStep === STEPS.length;
    const { user } = useAuth();

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
        // callback called when clicking the submit data button
        return new Promise((resolve, reject) => {
            dispatch(bookingAndPay(
                1,
                message,
                children,
                adults,
                events,
                total,
                formData
            ));
            console.log(JSON.stringify(formData));
            // fetch("/process_payment", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify(formData),
            // })
            //   .then((response) => response.json())
            //   .then((response) => {
            //     // receive payment result
            //     console.log(response);
            //     resolve();
            //   })
            //   .catch((error) => {
            //     // handle error response when trying to create payment
            //     reject();
            //   });
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
                        total={total}
                        subtotal={subtotal}
                        discount={discount}
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
                {/* <Box marginTop={2} marginX={1}>
        <Button onClick={handleBook} variant='contained' fullWidth style={{ m: 2 }}> Book </Button>
          </Box>*/}
                {bookingPrice > 0 &&
                    <Box marginTop={2} marginX={1}>
                        <Button onClick={onSubmit} variant='contained' fullWidth style={{ m: 2 }}> Book And Pay </Button>
                    </Box>}
                {/* </Container> */}
            </Page>
        );
    }
}
