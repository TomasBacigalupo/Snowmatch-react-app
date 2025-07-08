import sum from 'lodash/sum';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Grid, Card, Button, CardHeader, Typography, Box, DialogTitle, Hidden } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const { translate } = useLocales()
  const [isOpenContactModal, setIsOpenContactModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  const { checkout, teacher } = useSelector((state) => state.teachers);

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
  return (
    <Grid container spacing={3} sx={{ mt: {md: 0} }}>
      <Grid item xs={12}>
        <Card sx={{ mb: 1, borderRadius: '0px' }}>
          {!isEmptyCart ? (
            <Scrollbar>
              <CheckoutTeacherList
                teacher={cart}
                events={events}
                onDelete={handleDeleteCart}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            </Scrollbar>
          ) : (
            <EmptyContent
              title="Cart is empty"
              description="Look like you have no items in your shopping cart."
              img="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_empty_cart.svg"
            />
          )}
          {/* <Box padding={1} display='flex' flexDirection='row' justifyContent='flex-end'>
            <Button onClick={()=>dispatch(openAddEventModal())}
              variant='outlined'
            >
              Add Lesson
            </Button>
          </Box> */}

          <DialogAnimate open={isOpenAddEventModal} onClose={handleCloseContactModal}>
            <DialogTitle>{translate("conversation.contact_pro")}</DialogTitle>
            <AddEventForm onCancel={() => { dispatch(closeAddEventModal()) }} />
          </DialogAnimate>
        </Card>
      </Grid>
      {/* <Hidden smDown>

        <Grid item xs={12} md={4}>
          <CheckoutSummary
            enableDiscount
            totalEvents={events.length}
            total={total}
            discount={discount}
            subtotal={subtotal}
            onApplyDiscount={handleApplyDiscount}
          />
          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={events.length === 0 || loading}
            onClick={handleNextStep}
            loading={loading}
          >
            Reservar Ahora1
          </Button>
        </Grid>
      </Hidden> */}
    </Grid>
  );
}
