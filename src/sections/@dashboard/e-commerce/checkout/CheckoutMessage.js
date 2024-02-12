import sum from 'lodash/sum';
import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Grid, Card, Button, CardHeader, Typography, Box, DialogTitle, TextField } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import {
    applyDiscount,
    increaseQuantity,
    decreaseQuantity,
} from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import EmptyContent from '../../../../components/EmptyContent';
import { DialogAnimate } from 'src/components/animate';
import AddEventForm from './AddEventForm';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutTeacherList from './CheckoutTeacherList';
import useLocales from 'src/hooks/useLocales';
import { closeAddEventModal, openAddEventModal, deleteCart, onNextStep, hireTeacher } from 'src/redux/slices/teachers';
import { CheckCircle } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import ReactPixel from 'react-facebook-pixel';
import { changeMessage } from 'src/redux/slices/bookings';
import debounce from 'lodash/debounce';


// ----------------------------------------------------------------------

export default function CheckoutMessage() {
    const { translate } = useLocales()
    const [isOpenContactModal, setIsOpenContactModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const { checkout, teacher } = useSelector((state) => state.teachers);
    const { message } = useSelector((state) => state.bookings);

    const { cart, total, discount, subtotal, isOpenAddEventModal, events } = checkout;

    const totalItems = sum(cart.map((item) => 1));

    const isEmptyCart = cart.length === 0;

    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const handleDeleteCart = (eventIdx) => {
        dispatch(deleteCart(eventIdx));
    };

    const handleNextStep = () => {
        ReactPixel.track('BookNow', {
            content_name: teacher.name,
            content_category: 'Teacher',
            content_ids: [teacher.id],
            content_type: 'product',
            value: total,
            currency: 'USD',
        });
        if (events && events[0]?.price === 0) {
            setLoading(true)
            dispatch(hireTeacher(teacher.id, events, () => {
                setLoading(false)

                enqueueSnackbar(translate('checkout.free_event_hired'), { variant: 'success' });
                navigate('/match/lessons', { replace: true });
                dispatch(deleteCart(0))
            }))
        } else {
            dispatch(onNextStep());
        }
    };

    const handleIncreaseQuantity = (productId) => {
        dispatch(increaseQuantity(productId));
    };

    const handleDecreaseQuantity = (productId) => {
        dispatch(decreaseQuantity(productId));
    };

    const handleApplyDiscount = (value) => {
        dispatch(applyDiscount(value));
    };

    const handleCloseContactModal = () => {
        dispatch(closeAddEventModal())
    }
    const debouncedChangeMessage = useCallback(
        debounce((value) => dispatch(changeMessage(value)), 3000),
        [dispatch]
    );
    const handleChangeMessage = (e) => {
        debouncedChangeMessage(e.target.value)
    }
    return (
        <Card sx={{ p: 3, mb: 1, borderRadius: '0px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        {translate('checkout.message')}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 3 }} >
                        {translate('checkout.message_description')}
                    </Typography>
                    <TextField onChange={handleChangeMessage} placeholder={translate('checkout.message_placeholder')} multiline minRows={3} rows={3} fullWidth inputProps={{ maxLength: 255 }} />
                    <Typography variant="body2" sx={{ mt: 1, px: 1 }}>
                        {`${message?.length ?? 0}/255`}
                    </Typography>
                </Grid>

            </Grid>
        </Card>
    );
}