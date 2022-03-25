import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography } from '@mui/material';
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
  }),
};

export default function TeacherDetailsSummary({ cart, teacher, onAddCart, onGotoStep, ...other }) {
  const theme = useTheme();

  const navigate = useNavigate();
  console.log("teacherHPÑA", teacher)

  
  const {
    birth,
    cellphone,
    description,    
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
      onAddCart({
        ...values,
        subtotal: values.price * values.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {/* <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={inventoryType === 'in_stock' ? 'success' : 'error'}
          sx={{ textTransform: 'uppercase' }}
        >
          {sentenceCase(inventoryType || '')}
        </Label> */}

        <Typography
          variant="overline"
          sx={{
            mt: 2,
            mb: 1,
            display: 'block',
            color: state !== 'AVAILABLE' ? 'error.main' : 'info.main',
          }}
        >
          {state}
        </Typography>

        <Typography variant="h5" paragraph>
          {name + " " + lastname}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Rating value={stars} precision={0.1} readOnly />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ({fShortenNumber(rates.length)}
            reviews)
          </Typography>
        </Stack>

        {/* <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
            {priceSale && fCurrency(priceSale)}
          </Box>
          &nbsp;{fCurrency(price)}
        </Typography> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Information
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
            Description
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

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button
            fullWidth
            // disabled={isMaxQuantity}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add to Cart
          </Button>

          <Button fullWidth size="large" type="submit" variant="contained">
            Buy Now
          </Button>
        </Stack>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <SocialsButton initialColor />
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
