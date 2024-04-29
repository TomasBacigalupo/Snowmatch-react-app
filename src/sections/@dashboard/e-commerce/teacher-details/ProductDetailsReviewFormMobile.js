import * as Yup from 'yup';
import PropTypes from 'prop-types';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Stack, Rating, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFRadioGroup, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';
import { rateTeacherByID } from 'src/redux/slices/rates';
import { useDispatch, useSelector } from 'src/redux/store';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
}));

// ----------------------------------------------------------------------

ProductDetailsReviewFormMobile.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string,
  teacherId: PropTypes.number,
  bookingId: PropTypes.number,
};

export default function ProductDetailsReviewFormMobile({ onClose, id, teacherId, bookingId, ...other }) {


  const dispatch = useDispatch()
  const {isSubmitting} = useSelector(state => state.rates)
  const {translate} = useLocales() 

  const ReviewSchema = Yup.object().shape({
    stars: Yup.mixed().required(translate("reviewForm.ratingRequired")),
    comment: Yup.string().required(translate("reviewForm.commentRequired")),
    fun: Yup.string().required(translate("reviewForm.funRequired")),
    safety: Yup.string().required(translate("reviewForm.safetyRequired"))
  });

  const defaultValues = {
    stars: 0,
    comment: '',
    fun: 0,
    safety: 0,
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    let fun, safe
    switch(data.fun){
      case "Aburrido":
        fun = 0
        break
      case "Divertido":
        fun = 1
        break
      case "Muy Divertido":
        fun = 2
        break
    }
    switch (data.safety) {
      case "No es Seguro":
        safe = 0
        break
      case "Seguro":
        safe = 1
        break
      case "Muy Seguro":
        safe = 2
        break
    }
    try {
      dispatch(rateTeacherByID(teacherId, {
        ...data,
        fun: fun,
        safe: safe,
        stars: Number(data.stars),
        bookingId: bookingId,
      }))
      onClose();
    } catch (error) {
      console.log("error")
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        {translate("reviewForm.title")}
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
              <Typography variant="body2">{translate("reviewForm.description")}</Typography>

              <Controller
                name="stars"
                control={control}
                render={({ field }) => <Rating size='large' {...field} value={Number(field.value)} />}
              />
            </Stack>
            {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
          </div>

          <RHFTextField name="comment" label={translate("reviewForm.comment")} multiline rows={3} />

          <Typography variant="body2">{translate("reviewForm.fun")}:</Typography>
          <RHFRadioGroup name='fun' options={["Aburrido", 'Divertido', "Muy Divertido"]}/>

          <Typography variant="body2">{translate("reviewForm.security")}</Typography>
          <RHFRadioGroup name='safety' options={["No es Seguro", 'Seguro', "Muy Seguro"]} />

          <Stack direction="row" justifyContent="space-between" spacing={1.5} paddingTop={5}>
            <Button color="inherit" variant="" onClick={onCancel} style={{ textDecoration: 'underline', padding: '15px' }}>
              {translate("reviewForm.cancel")}
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting} style={{ padding: '15px' }}>
              {translate("reviewForm.rate")}
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </div>
  );
}
