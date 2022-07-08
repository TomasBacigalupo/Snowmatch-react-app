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
    fbUrl: PropTypes.string,
    igUrl: PropTypes.string,
    twUrl: PropTypes.string,
    ytUrl: PropTypes.string
  }),
};

export default function AccountSocialLinks({ myProfile }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateUser } = useAuth();
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
    setError
  } = methods;

  const onSubmit = async (data) => {
    const newUser = { 
      ...user,
      ...data
    }
    
    try {
      const response = await dispatch(updateTeacher(newUser))
      if(response.messages){
          for (const entry of response.messages.entry) {
            setError(entry.key, {
              type: "server",
              message: entry.value,
            });          
          }
        }
        else{
          updateUser(newUser)
          enqueueSnackbar( 'Update success!');
        }
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
            key={"igUrl"}
            name={"igUrl"}
            placeholder="Instagram username"
            InputProps={{
              startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[1].icon} {"\u00a0\u00a0instagram.com/"}</InputAdornment>,
            }}
          />
            <RHFTextField
              key={"twUrl"}
              name={"twUrl"}
              placeholder="Twitter username"
              InputProps={{
                startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[3].icon} {"\u00a0\u00a0twitter.com/"}</InputAdornment>,
              }}
            />
          <RHFTextField
            key={"fbUrl"}
            name={"fbUrl"}
            placeholder="Facebook username"
            InputProps={{
              startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[0].icon} {"\u00a0\u00a0facebook.com/"}</InputAdornment>,
            }}
          />
          <RHFTextField
            key={"ytUrl"}
            name={"ytUrl"}
            placeholder="YouTube channel id"
            InputProps={{
              startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[4].icon} {"\u00a0\u00a0youtube.com/channel/"}</InputAdornment>,
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
