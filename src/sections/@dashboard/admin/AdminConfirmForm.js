import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm,} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Avatar, Tooltip, InputAdornment, Input, ToggleButton } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFMultipleSelect, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Image from '../../../components/Image';

import { confirmTeacher, editTeacher } from '../../../redux/slices/admin.js'
import { useDispatch, useSelector } from '../../../redux/store';

import {
  TeacherDetailsCarousel
} from '../e-commerce/teacher-details';
import useLocales from 'src/hooks/useLocales';
import Iconify from 'src/components/Iconify';
import Button from 'src/theme/overrides/Button';
import { countries, ski_resorts } from 'src/_mock';
// } from '../../sections/@dashboard/e-commerce/teacher-details';

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

const STATES = [
  { title: "AVAILABLE", code: 1 },
  { title: "UNAVAILABLE", code: 2 },
  { title: "UNDER_REVIEW", code: 3 },
  { title: "PENDING", code: 4 },
  { title: "DECLINED", code: 5 },
]

const LANGUAGES = [
  { title: "Español", category: "Languages" },
  { title: "English", category: "Languages" },
  { title: "Portugues", category: "Languages" },
  { title: "Italiano", category: "Languages" },
]

AdminConfirmForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTeacher: PropTypes.object,
};

export default function AdminConfirmForm({ isEdit, currentTeacher, documents }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const onInvalid = (errors) => console.error(errors);

  const genders = [
    { code: 'H', label: 'Male' },
    { code: 'M', label: 'Female' }]
  // todo chequear codes

  const levels = [
    { code: '0', label: '0' },
    { code: '1', label: '1' },
    { code: '2', label: '2' },
    { code: '3', label: '3' },
    { code: '4', label: '4' },
    { code: '5', label: '5' }]

  const NewTeacherSchema = Yup.object().shape({
    name: Yup.string(),
    lastname: Yup.string(),
    dni: Yup.number(),
    gender: Yup.string(),
    level: Yup.number(),
    userId: Yup.number().required('ID is required'),
    cellphone: Yup.string().required("Phone number is required"),
    email: Yup.string().required('Email is required').email(),
    countryCode: Yup.string(),
    information: Yup.string().nullable().max(100),
    description: Yup.string().nullable().max(100),
    resorts: Yup.array().of(Yup.string()),
    languages: Yup.array().of(Yup.string()),
    // birth: Yup.string(),
    state: Yup.string(),
    school: Yup.string(),
    skills: Yup.array().of(Yup.string()),
    igUrl: Yup.string(),
    fbUrl: Yup.string(),
    ytUrl: Yup.string(),
    twUrl: Yup.string(),
    disciplines: Yup.array().of(Yup.string()),
    sports: Yup.array().of(Yup.string()),
    authorized: Yup.boolean(),
    zenriseClient: Yup.string(),
    zenriseSecret: Yup.string(),
    priority: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTeacher?.name || '',
      email: currentTeacher?.email || '',
      lastname: currentTeacher?.lastname || '',
      dni: currentTeacher?.dni || '',
      level: currentTeacher?.level?.toString() || '',
      userId: currentTeacher?.id || '',
      cellphone: currentTeacher?.cellphone || '',
      countryCode: currentTeacher?.countryCode || '',
      country: currentTeacher?.country || '',
      gender: currentTeacher?.gender || '',
      information: currentTeacher?.information || '',
      description: currentTeacher?.description || '',
      resorts: currentTeacher?.resorts || [],
      speaks: currentTeacher?.speaks || [],
      // birth: currentTeacher?.birth || '',
      state: currentTeacher?.state || '',
      school: currentTeacher?.school || '',
      skills: currentTeacher?.skills || [],
      igUrl: currentTeacher?.igUrl || '',
      fbUrl: currentTeacher?.fbUrl || '',
      ytUrl: currentTeacher?.ytUrl || '',
      twUrl: currentTeacher?.twUrl || '',
      disciplines: currentTeacher?.disciplines || [],
      authorized: currentTeacher?.authorized || false,
      zenriseClient: currentTeacher?.zenriseClient || '',
      zenriseSecret: currentTeacher?.zenriseSecret || '',
      priority: currentTeacher?.priority || 0,
      sports: currentTeacher?.sports || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTeacher]
  );

  const methods = useForm({
    resolver: yupResolver(NewTeacherSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  console.log(watch());

  useEffect(() => {
    if (isEdit && currentTeacher) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTeacher]);

  const onSubmit = (data) => {
    console.log("pase")
    try {
      const response = dispatch(editTeacher(data));
      reset();
      enqueueSnackbar('Review success!');
      navigate(PATH_DASHBOARD.admin.review);
    } catch (error) {
      console.error(error);
    }
  };

  const [imageSrc, setImageSrc] = useState('');

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 0 }}>
              {console.log(currentTeacher)}
              <Image alt={'certificate'} src={`https://image.snowmatch.pro/profile/${currentTeacher?.imagekey}`} ratio="1/1" />
              <Typography variant="subtitle2" noWrap>
                {`${currentTeacher?.name} ${currentTeacher?.lastname}`}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="lastname" label="Last Name" />
              {false && <RHFTextField name="email" label="Email Address" />}

              <RHFSelect name="level" label="Level" placeholder="Level">
                {levels.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFMultipleSelect name="sports" label={translate("general.form.sports")} list={["SKI", "SNOWBOARD"]} />
              <RHFTextField name="dni" label="DNI" />
              <RHFSelect name="countryCode" label={translate("general.form.countryCode")} placeholder={translate("general.form.countryCode")} color="error" variant="filled">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.phone}>
                    {option.label} (+{option.phone})
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="cellphone" label={translate("general.form.cellphone")} color="error" variant="filled" />
              <Input name="userId" label={"id"} sx={{ display: 'none' }} />
              <RHFTextField name="email" label={translate("general.form.email")} color="error" variant="filled" />
              <RHFSelect name="gender" label={translate("general.form.gender")} placeholder={translate("general.form.gender")}>
                <option value="" />
                <option key={1} value={"M"}>
                  {translate("general.form.male")}
                </option>
                <option key={2} value={"F"}>
                  {translate("general.form.female")}
                </option>
              </RHFSelect>
              <RHFSelect name="country" label={translate("general.form.country")} placeholder={translate("general.form.country")}>
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="state" label={"state"} placeholder={"state"}>
                {STATES.map((option) => (
                  <option key={option.code} value={option.title}>
                    {option.title}
                  </option>
                ))}
              </RHFSelect>

              <RHFMultipleSelect name="disciplines" label={translate("general.form.disciplines")} list={["Ski", "SnowBoard"]} />
              <RHFMultipleSelect name="speaks" label={translate("general.form.languages")} list={["Español", "English", "Portugues", "Italiano"]} />
              <Stack sx={{ mt: 3 }}>
                <RHFSwitch
                  name="authorized"
                  label="is authorized"
                  sx={{ mb: 1, mx: 0, width: 1 }}
                />
              </Stack>
              <RHFTextField name="priority" label="Priority" />
            </Box>
            
            <Stack sx={{ mt: 3 }}>
              <RHFTextField
                key={"igUrl"}
                name={"igUrl"}
                placeholder={translate("accountSocialLinks.igUserName")}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[1].icon} {"\u00a0\u00a0instagram.com/"}</InputAdornment>,
                }}
              />
              <RHFTextField
                key={"twUrl"}
                name={"twUrl"}
                placeholder={translate("accountSocialLinks.twUserName")}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[3].icon} {"\u00a0\u00a0twitter.com/"}</InputAdornment>,
                }}
              />
              <RHFTextField
                key={"fbUrl"}
                name={"fbUrl"}
                placeholder={translate("accountSocialLinks.fbUserName")}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[0].icon} {"\u00a0\u00a0facebook.com/"}</InputAdornment>,
                }}
              />
              <RHFTextField
                key={"ytUrl"}
                name={"ytUrl"}
                placeholder={translate("accountSocialLinks.ytUserName")}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{SOCIAL_LINKS[4].icon} {"\u00a0\u00a0youtube.com/channel/"}</InputAdornment>,
                }}
              />
            </Stack>
            <Stack sx={{ mt: 3 }}>
              <RHFTextField name="school" label={translate("general.form.school")} />
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="resorts" label={translate("general.form.resorts")} freeSolo={true} grouped={true} list={ski_resorts} />
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFMultipleSelect name="skills" freeSolo={true} label={translate("general.form.skills")} list={["Ski tunning", "Baby sitter", "Car rent"]} />
            </Stack>
            <Stack sx={{ mt: 3 }}>
              <Tooltip title={translate("general.form.quickInformationHelper")}>
                <RHFTextField multiline
                  rows={2}
                  name="information"
                  label={translate("general.form.quickInformation")}
                />
              </Tooltip>
            </Stack>

            <Stack sx={{ mt: 3 }}>
              <RHFTextField multiline
                rows={4}
                name="description"
                label={translate("general.form.description")} />
            </Stack>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
