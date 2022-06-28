import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import useAuth from 'src/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateTeacher } from 'src/redux/slices/teachers';

// ----------------------------------------------------------------------

const SOCIAL_LINKS = [
  {
    value: 'facebookLink',
    icon: <Iconify icon={'eva:facebook-fill'} width={24} height={24} />,
  },
  {
    value: 'instagramLink',
    icon: <Iconify icon={'ant-design:instagram-filled'} width={24} height={24} />,
  },
  {
    value: 'linkedinLink',
    icon: <Iconify icon={'eva:linkedin-fill'} width={24} height={24} />,
  },
  {
    value: 'twitterLink',
    icon: <Iconify icon={'eva:twitter-fill'} width={24} height={24} />,
  },
  {
    value: 'youtubeLink',
    icon: <Iconify icon={'ant-design:youtube-filled'} width={24} height={24} />,
  },
];

// ----------------------------------------------------------------------

AccountSocialLinks.propTypes = {
  myProfile: PropTypes.shape({
    facebookLink: PropTypes.string,
    instagramLink: PropTypes.string,
    linkedinLink: PropTypes.string,
    twitterLink: PropTypes.string,
    youtubeLink: PropTypes.string
  }),
};

export default function AccountSocialLinks({ myProfile }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const defaultValues = {
    fbUrl: user?.fbUrl || '',
    igUrl: user?.igUrl || '',
    twUrl: user?.twUrl || '',
    ytUrl: user?.ytUrl || ''
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data)
    const newUser = { 
      ...user,
      ...data
    }
    
    try {
      dispatch(updateTeacher(newUser))
      //TODO: react to updateTeacher response
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
    } catch (error) {
      enqueueSnackbar('error', 'Review Links');
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
            <RHFTextField
              key={"twUrl"}
            name={"twUrl"}
              InputProps={{
                startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[3].icon}</InputAdornment>,
              }}
            />
          <RHFTextField
            key={"fbUrl"}
            name={"fbUrl"}
            InputProps={{
              startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[0].icon}</InputAdornment>,
            }}
          />
          <RHFTextField
            key={"ytUrl"}
            name={"ytUrl"}
            InputProps={{
              startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[4].icon}</InputAdornment>,
            }}
          />
          <RHFTextField
            key={"igUrl"}
            name={"igUrl"}
            InputProps={{
              startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[1].icon}</InputAdornment>,
            }}
          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
