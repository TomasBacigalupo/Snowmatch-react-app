import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography, DialogTitle, Tooltip } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
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

import { openContactModal, closeContactModal, openReferModal, closeReferModal} from '../../../../redux/slices/contact';
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
  const {translate} = useLocales();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const user = useAuth();

  const [view, setView] = useState('dayGridMonth');


  const { isOpenReferModal, isOpenContactModal, error } = useSelector((state) => state.contact);

  const handleContact = () => {
    dispatch(openContactModal());
  };

  const handleRefer = () => {
    console.log(user)
    dispatch(openReferModal());
  };
  
  const {
    birth,
    cellphone,
    description,
    skills,    
    email,   
    gender,
    id,
    imageLink,
    information,
    lastname,
    level,
    liked,
    likes,
    name,
    role,
    stars,
    state,
    username,
    events,
    igUrl,
    ytUrl,
    fbUrl,
    twUrl,
    resorts,
    school
  } = teacher.teacher;

  const rates = teacher.rates;

  const alreadyProduct = cart.map((item) => item.id).includes(id);

  //const isMaxQuantity = cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    name,
    imageLink,
    state,
    lastname,
    //color: colors[0],
    //size: sizes[4],
    //quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const handleCloseContactModal = () => {
    if(error === null)
      dispatch(closeContactModal());
  };
  const handleCloseReferModal = () => {
    if(error === null)
      dispatch(closeReferModal());
  };


  const { watch, control, setValue, handleSubmit } = methods;

  const values = watch();

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
      onAddCart(teacher.teacher);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const button = (user, isIndependent) =>{
    console.log(user)
    if(user.isAuthenticated){
      return (
              <Button
                fullWidth
                size="large"
                color="primary"
                variant="contained"
            startIcon={<ConnectWithoutContactIcon/>}
                onClick={handleRefer}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {isIndependent?translate("conversation.refer_class"):translate("conversation.contact_pro")}              
                </Button>
)

    }
    else{
      return(
              <Button
                fullWidth
                size="large"
                color="primary"
                variant="contained"
          startIcon={<ConnectWithoutContactIcon />}
                onClick={handleContact}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {translate("conversation.contact_pro")}

              </Button>
  
)
    }
  }

  return (
    <RootStyle {...other}>
        {state !== 'AVAILABLE' && (
            <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={state !== 'AVAILABLE' ? 'success' : 'error'}
            sx={{ textTransform: 'uppercase' }}
            >
            { sentenceCase(state || '')}
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
        )}

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

        {/* <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
            {priceSale && fCurrency(priceSale)}
          </Box>
          &nbsp;{fCurrency(price)}
        </Typography> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <TeacherSkills skills={skills} />


        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {translate('teacherDetails.information')}
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ mt: 0.5 }} paragraph>
            {information}
        </Typography>


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

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {translate('teacherDetails.description')}
          </Typography>


          {/* <div>
            <Incrementer
              name="quantity"
              quantity={values.quantity}
              available={available}
              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
            />
            <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
              Available: {available}
            </Typography>
          </div> */}
        </Stack>
        <Typography variant="body1" sx={{ mt: 0.5 }} paragraph>
            {description}
        </Typography>


        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
        <Typography variant="body1" sx={{ mt: 0.5 }} paragraph>

          
        </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>



          {button(user, !school &&level>=3 && resorts?.includes("Cerro Catedral"))}

        <DialogAnimate open={isOpenContactModal} onClose={handleCloseContactModal}>
          <DialogTitle>{translate("conversation.contact_pro")}</DialogTitle>
          <ContactForm teacher={id} onCancel={handleCloseContactModal} />
        </DialogAnimate>

        <DialogAnimate open={isOpenReferModal} onClose={handleCloseReferModal}>
          <DialogTitle>{(!school && level>=3 && resorts?.includes("Cerro Catedral"))?translate("conversation.refer_class"):translate("conversation.contact_pro")}</DialogTitle>
          <ReferForm teacher={id} onCancel={handleCloseReferModal} isIndependent={(!school &&level>=3 && resorts?.includes('Cerro Catedral'))} />
        </DialogAnimate>

        </Stack>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <SocialsButton initialColor links={{"igUrl":igUrl,"twUrl":twUrl,"fbUrl":fbUrl,"ytUrl":ytUrl,}}/>
        </Stack>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

