import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography, DialogTitle, Tooltip, ToggleButtonGroup, ToggleButton, FormControlLabel } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import HireForm from './HireForm';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import { DialogAnimate } from '../../../../components/animate';
import { useDispatch, useSelector } from '../../../../redux/store';

import { openContactModal, closeContactModal, openReferModal, closeReferModal } from '../../../../redux/slices/contact';
import { ContactForm, ReferForm } from '.';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import { CalendarStyle } from '../../calendar';

import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

import { useState } from 'react';
import TeacherSkills from './TeacherSkills';
import useLocales from 'src/hooks/useLocales';

import useAuth from 'src/hooks/useAuth';
import HoverButton from 'src/components/HoverButton';
import SelectDates from './SelectDates';
import { Checkbox } from '@mui/material';
import SelectRangeDates from './SelectRangeDates';
import ProductsCarousel from '../../general/app/ProductsCarousel';
import { set } from 'lodash';
import { addCart } from 'src/redux/slices/teachers';



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
  const [flexibleTime, setFlexibleTime] = useState(true);
  const products = [{title: ""}]
  const handleChange = (event, value) => {
    setLessons(value);
  };

  const { isOpenReferModal, isOpenContactModal, error } = useSelector((state) => state.contact);

  const handleContact = () => {
    dispatch(openContactModal());
  };

  const handleRefer = () => {
    console.log(user)
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
    resort: "",
    duration:"MORNING",
    people: 1,
    level: "BEGINNER"
  };

  const methods = useForm({
    defaultValues,
  });

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

  const handleSubmitRange = useCallback(
    (range) => {
      setSelectDatesModal(false)

      for (var arr = [], dt = range[0]; dt <= range[1]; dt.setDate(dt.getDate() + 1)) {
        let lessonTime = values.duration
        if(values.duration === 'HALF_DAY'){
          lessonTime='MORNING'
        }
        const requestEvent = {
          price: 9000,
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
    console.log(user)
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

  return (
    <RootStyle {...other}>
      {/* {state !== 'AVAILABLE' && (
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={state !== 'AVAILABLE' ? 'success' : 'error'}
          sx={{ textTransform: 'uppercase' }}
        >
          {sentenceCase(state || '')}
        </Label>
      )}

      {state === 'AVAILABLE' && (
        <Typography
          variant="overline"
          sx={{
            mt: 2,
            mb: 1,
            display: 'block',
            color: state !== 'AVAILABLE' ? 'error.main' : 'success.main',
          }}
        >
          {translate('general.' + state)}
        </Typography>
      )} */}

      <Typography variant="h5" paragraph>
        {name + " " + lastname}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Rating value={stars} precision={0.1} readOnly />
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ({fShortenNumber(rates.length)}
          {' '}reviews)
          </Typography> */}
      </Stack>
      <TeacherSkills skills={skills} />
      {/* <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
            {priceSale && fCurrency(priceSale)}
          </Box>
          &nbsp;{fCurrency(price)}
        </Typography> */}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ProductsCarousel/>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

        {/* <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Size
          </Typography>

          <RHFSelect
            name="size"
            size="small"
            fullWidth={false}
            FormHelperTextProps={{
              sx: { textAlign: 'right', margin: 0, mt: 1 },
            }}
            helperText={
              <Link underline="always" color="text.secondary">
                Size Chart
              </Link>
            }
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </RHFSelect>
        </Stack> */}

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

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {translate('teacherDetails.level')}
          </Typography>
          <RHFSelect
            size='small'
            fullWidth={false}
            name="level"
            placeholder={translate("school.clients.form.level")}>
            <option value="" />
            <option key="BEGINNER" value="BEGINNER">
              {translate("school.clients.form.BEGINNER")}
            </option>
            <option key="INTERMEDIATE" value="INTERMEDIATE">
              {translate("school.clients.form.INTERMEDIATE")}
            </option>
            <option key="ADVANCED" value="ADVANCED">
              {translate("school.clients.form.ADVANCED")}
            </option>
            <option key="EXPERT" value="EXPERT">
              {translate("school.clients.form.EXPERT")}
            </option>
          </RHFSelect>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }} justifyItems='center'>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {translate('teacherDetails.duration')}
          </Typography>
          <FormControlLabel label="Flexible" labelPlacement="start" control={
            <Checkbox checked={flexibleTime} onChange={(event) => setFlexibleTime(event.target.checked)} />
          }/>
          {!flexibleTime ? (
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
              <option key="FULLDAY" value="ALL_DAY">
                {translate('checkout.allday')}
              </option>
            </RHFSelect>
        
        ): (<RHFSelect
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
        )}
        </Stack>
          

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
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
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>

          <Button
            fullWidth
            //disabled={hasLessons}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={()=>setSelectDatesModal(true)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button>

          <HoverButton
            fullWidth
            size="large"
            color="primary"
            variant="contained"
            startIcon={<ConnectWithoutContactIcon />}
            onClick={handleContact}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {translate("conversation.match_pro")}
          </HoverButton>

          <DialogAnimate open={selectDatesModal} onClose={handleCloseContactModal}>
            <DialogTitle>{translate("conversation.select_dates")}</DialogTitle>
            {flexibleTime ? <SelectRangeDates handleClose={() => setSelectDatesModal(false)} onSubmit={handleSubmitRange} /> : <SelectDates handleClose={() => setSelectDatesModal(false)} />}
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