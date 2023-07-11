import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Button, Rating, Divider, IconButton, Typography, DialogTitle, FormControlLabel } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
import HireForm from './HireForm';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import { DialogAnimate } from '../../../../components/animate';
import { useDispatch, useSelector } from '../../../../redux/store';

import { openContactModal, closeContactModal, openReferModal, closeReferModal } from '../../../../redux/slices/contact';
import { ReferForm } from '.';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import { getProduct, getTeacherProducts, getTeacherProductsById } from 'src/redux/slices/product';



import { useState } from 'react';
import TeacherSkills from './TeacherSkills';
import useLocales from 'src/hooks/useLocales';

import useAuth from 'src/hooks/useAuth';
import HoverButton from 'src/components/HoverButton';
import SelectDates from './SelectDates';
import { Checkbox } from '@mui/material';
import SelectRangeDates from './SelectRangeDates';
import ProductsCarousel from '../../general/app/ProductsCarousel';
import { addCart } from 'src/redux/slices/teachers';
import { fCurrency } from 'src/utils/formatNumber';
import { set } from 'lodash';



// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));



// ----------------------------------------------------------------------

TeacherDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  teacher: PropTypes.shape({
    available: PropTypes.number,
    color: PropTypes.arrayOf(PropTypes.string),
    imageLink: PropTypes.string,
    information: PropTypes.string,
    state: PropTypes.string,
    stars: PropTypes.number,
    description: PropTypes.string,
    id: PropTypes.string,
    lastname: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
    totalRating: PropTypes.number,
    totalReview: PropTypes.number,
    events: PropTypes.array,
  }),
};

export default function TeacherDetailsSummary({ cart, teacher, onAddCart, onGotoStep, ...other }) {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useAuth();

  const [view, setView] = useState('dayGridMonth');
  const [lessons, setLessons] = useState('me');
  const [selectDatesModal, setSelectDatesModal] = useState(false);
  const [flexibleTime, setFlexibleTime] = useState(false);
  const handleChange = (event, value) => {
    setLessons(value);
  };

  // manotaso de ahogado no mostramos productos
  const products = []//useSelector(state => state.product.products)



  const { isOpenReferModal, isOpenContactModal, error } = useSelector((state) => state.contact);

  const handleContact = () => {

    //dispatch(openContactModal());
  };

  const handleRefer = () => {
    dispatch(openReferModal());
  };

  const handleAddToCart = (events) => {
    dispatch()
  }

  const {
    skills,
    gender,
    id,
    imageLink,
    lastname,
    level,
    name,
    stars,
    state,
    events,
    resorts,
    school
  } = teacher;


  const alreadyProduct = cart.map((item) => item.id).includes(id);

  //const isMaxQuantity = cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    imageLink,
    state,
    lastname,
    quantity: 1, //people
    resort: resorts[0] ?? "",
    duration: "MORNING",
    maxStudents: 1,
    level: "BEGINNER",
    product: products[0]?.id ?? "",
  };

  useEffect(() => dispatch(getTeacherProductsById(id)), [id])

  const methods = useForm({
    defaultValues,
  });

  // useEffect(() => {
  //   if(products.length > 0)
  //     setValue('product', products[0]?.id ?? "")
  // }, [products])

  const handleCloseContactModal = () => {
    if (error === null)
      dispatch(closeContactModal());
  };

  const handleCloseReferModal = () => {
    if (error === null)
      dispatch(closeReferModal());
  };

  const { watch, control, setValue, handleSubmit } = methods;

  const values = watch();
  const selectedProduct = products.find((product) => Number(product.id) === Number(values.product))

  const handleSubmitRange = useCallback(
    (range) => {
      setSelectDatesModal(false)

      for (var arr = [], dt = range[0]; dt <= range[1]; dt.setDate(dt.getDate() + 1)) {
        let lessonTime = values.duration
        if (values.duration === 'HALF_DAY') {
          lessonTime = 'MORNING'
        }
        const requestEvent = {
          price: 0,
          people: values.amount,
          lessonTime: lessonTime,
          date: new Date(dt),
          resort: values.resort
        };
        dispatch(addCart({
          teacher: teacher,
          event: requestEvent
        }))
        arr.push(new Date(dt));
      }
    },
    [values],
  )

  const handleSubmitSelectedDates = useCallback((dates) => {
    setSelectDatesModal(false)
    dates.forEach((date) => {
      let lessonTime = "MORNING"
      if(new Date(date).getHours() === 14){
        lessonTime = "AFTERNOON"
      }
      if (new Date(date).getHours() === 9){
        lessonTime = "MORNING"
      }
      if (new Date(date).getHours() === 8) {
        lessonTime = "ALL_DAY"
      }
      debugger
      const requestEvent = {
        price: 0,
        people: values.amount,
        lessonTime: lessonTime,
        date: date,
        resort: values.resort ?? resorts[0]
      };
      dispatch(addCart({
        teacher: teacher,
        event: requestEvent
      }))
      onGotoStep(0);
      navigate('hire');
    })
  })

  const onSubmit = async (data) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          subtotal: data.price * data.quantity,
        });
      }
      onGotoStep(0);
      navigate(PATH_DASHBOARD.eCommerce.checkout);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart(teacher);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const button = (user, isIndependent) => {
    if (user.isAuthenticated) {
      return (
        <HoverButton
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          startIcon={<ConnectWithoutContactIcon />}
          onClick={handleRefer}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {isIndependent ? translate("conversation.refer_class") : translate("conversation.contact_pro")}
        </HoverButton>
      )

    }
    else {
      return (
        <HoverButton
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          startIcon={<ConnectWithoutContactIcon />}
          onClick={handleContact}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {translate("conversation.contact_pro")}

        </HoverButton>

      )
    }
  }
  const getProductName = (product) => {
    if (product.name === "PRIVATE_HALF_DAY")
      return translate("product.private_half_day")
    if (product.name === "PRIVATE_FULL_DAY")
      return translate("product.private_full_day")
    return product.name
  }


  return (
    <RootStyle {...other}>
      <Typography variant="h5" paragraph>
        {name + " " + lastname}
      </Typography>
      <TeacherSkills skills={skills} />
      <Divider sx={{ borderStyle: 'dashed' }} />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3, mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {translate('teacherDetails.resort')}
          </Typography>
          <RHFSelect
            name="resort"
            size="small"
            fullWidth={false}
          >
            {resorts?.map((resort) => (
              <option key={resort} value={resort}>
                {resort}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        {products?.length > 0 && 
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3, mt: 2 }}>
          <RHFSelect
            name="product"
            size="small"
            fullWidth
          >
            {products?.map((product) => (
              <option key={product.id} value={product.id}>
                {getProductName(product)}
              </option>
            ))}
          </RHFSelect>
        </Stack>
        }
        {products?.length > 0 && values.product && 
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {selectedProduct?.description}
            </Typography>
          </Stack>
        }

        {products?.length > 0 && values.product && !selectedProduct?.description && selectedProduct?.name  && 
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 3, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
              {translate(`teacherDetails.${selectedProduct?.name}`)}
            </Typography>
          </Stack>
        }

        {products?.length > 0 && <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3, mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            USD{fCurrency(selectedProduct?.price ?? 0)}
          </Typography>
        </Stack>}
        {products?.length === 0 && <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }} justifyItems='center'>
          {/* <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {translate('teacherDetails.duration')}
          </Typography> */}
          {/* <FormControlLabel label="Flexible" labelPlacement="start" control={
            <Checkbox checked={flexibleTime} onChange={(event) => setFlexibleTime(event.target.checked)} />
          } /> */}
          {/* {!flexibleTime ? (
            <RHFSelect
              size='small'
              fullWidth={false}
              name="duration">
              <option key="MORNING" value="MORNING">
                {translate('checkout.morning')}
              </option>
              <option key="AFTERNOON" value="AFTERNOON">
                {translate('checkout.afternoon')}
              </option>
              <option key="FULLDAY" value="FULL_DAY">
                {translate('checkout.allday')}
              </option>
            </RHFSelect>

          ) : (<RHFSelect
            size='small'
            fullWidth={false}
            name="duration">
            <option key="HALF_DAY" value="HALF_DAY">
              {translate('checkout.halfday')}
            </option>
            <option key="FULLDAY" value="ALL_DAY">
              {translate('checkout.allday')}
            </option>
          </RHFSelect>
          )} */}
          <Typography variant="subtitle" sx={{ mt: 0.5 }}>
            {translate('teacherDetails.howToBook', { name: teacher.name})}
          </Typography>
        </Stack>}

        {/* <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {translate('teacherDetails.people')}
          </Typography>
          <div>
            <Incrementer
              name="quantity"
              quantity={values.quantity}
              available={9}
              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
            />
            <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
              Available: {9}
            </Typography>
          </div>
        </Stack> */}

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>

          {/* {products?.length === 0 && <Button
            fullWidth
            //disabled={hasLessons}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={() => setSelectDatesModal(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button>} */}
         
          {products?.length > 0 && <Button
            component={RouterLink}
            fullWidth
            size="large"
            color="primary"
            sx={{ whiteSpace: 'nowrap' }}
            variant="contained" to={PATH_GUEST.viewTeacherProducts(id, watch("product"))}>
            {translate("conversation.select_dates")}
          </Button>}

          {products?.length === 0 && <HoverButton
            fullWidth
            size="large"
            color="primary"
            variant="contained"
            // startIcon={<ConnectWithoutContactIcon />}
            //calendar Icon
            to={PATH_GUEST.viewTeacherProducts(id, watch("product"))}
            //onClick={handleContact} //This is for contact modal
            onClick={() => setSelectDatesModal(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {translate("conversation.select_dates")}
          </HoverButton>}

          <DialogAnimate open={selectDatesModal} onClose={handleCloseContactModal}>
            <DialogTitle>{translate("conversation.select_dates")}</DialogTitle>
            {flexibleTime &&
              <SelectRangeDates
                handleClose={() => setSelectDatesModal(false)}
                onSubmit={handleSubmitRange} />
            }
            {!flexibleTime &&
              <SelectDates
                onSubmit={handleSubmitSelectedDates}
                handleClose={() => setSelectDatesModal(false)} />
            }
          </DialogAnimate>

          <DialogAnimate open={isOpenContactModal} onClose={handleCloseContactModal}>
            <DialogTitle>{translate("conversation.contact_pro")}</DialogTitle>
            <HireForm teacher={teacher} onCancel={handleCloseContactModal} />
          </DialogAnimate>

          <DialogAnimate open={isOpenReferModal} onClose={handleCloseReferModal}>
            <DialogTitle>{(!school && level >= 3 && resorts?.includes("Cerro Catedral")) ? translate("conversation.refer_class") : translate("conversation.contact_pro")}</DialogTitle>
            <ReferForm teacher={id} onCancel={handleCloseReferModal} isIndependent={(!school && level >= 3 && resorts?.includes('Cerro Catedral'))} />
          </DialogAnimate>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" disabled={quantity >= available} onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}