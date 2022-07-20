import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Chip } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// hooks
import useAuth from '../../../../hooks/useAuth';
import { map } from 'lodash';
import TeacherSkills from '../../e-commerce/teacher-details/TeacherSkills';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileAbout({ profile }) {
  const { quote, country, company, school } = profile;
  const { user } = useAuth();
  const {translate} = useLocales()

  return (
    <Card>
      <CardHeader title={translate("profile.about")} />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* <Typography variant="body2">{quote}</Typography> */}
        {/* <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Form &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {user?.country}
            </Link>
          </Typography>
        </Stack> */}

        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{user?.email}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            {translate('profile.proAt')} &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {user?.resorts?.map(r=> r+" ")}
            </Link>
          </Typography>
        </Stack>
        <Stack direction="row">
          <TeacherSkills skills={user?.skills}/>
        </Stack>
        
        <Typography variant="subtitle1">{translate("profile.information")}</Typography>
        <Typography variant="body2">{user?.information}</Typography>
        <Typography variant="subtitle1">{translate("profile.description")}</Typography>
        <Typography variant="body2">{user?.description}</Typography>
      </Stack>
    </Card>
  );
}
