import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Tooltip, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { updateTeacher, changeProfilePicture } from '../../../../redux/slices/teachers';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { countries, ski_resorts } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar, RHFMultipleSelect } from '../../../../components/hook-form';
import axios from '../../../../utils/axios';
import { useMediaQuery } from 'react-responsive';
import useLocales from 'src/hooks/useLocales';
import { getBusiness, updateBusiness } from '../../../../redux/slices/business';
import EmptyContent from '../../../../components/EmptyContent';
import Iconify from 'src/components/Iconify';

const LANGUAGES = [
    { title: "Español", category: "Languages" },
    { title: "English", category: "Languages" },
    { title: "Portugues", category: "Languages" },
    { title: "Italiano", category: "Languages" },
]

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

export default function AccountGeneral() {
    const { enqueueSnackbar } = useSnackbar();

    const { user, updateUser, refreshUser } = useAuth();
    const dispatch = useDispatch();
    const { business } = useSelector((state) => { return state });
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const imageSize = isMobile ? 10 : 39;
    const { translate } = useLocales()

    const UpdateUserSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email(),
        // photoURL: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
        cellphone: Yup.string().required("Phone number is required"),
        country: Yup.string(),
        information: Yup.string().nullable().max(100),
        description: Yup.string().nullable().max(250),
        resorts: Yup.array().of(Yup.string()),
        languages: Yup.array().of(Yup.string()),
        id: Yup.number(),
        igUrl: Yup.string().nullable().max(100),
        twUrl: Yup.string().nullable().max(100),
        ytUrl: Yup.string().nullable().max(100),
        fbUrl: Yup.string().nullable().max(100),
    });

    useEffect(() => {
        dispatch(getBusiness(user?.administeredBusiness?.id))
    }, [user]);

    useEffect(() => {
        reset(defaultValues)
    }, [business])

    const defaultValues = {
        name: business?.business?.name || '',
        email: business?.business?.email || '',
        // photoURL: business?.business?.imageLink || '',
        cellphone: business?.business?.cellphone || '',
        country: business?.business?.country || '',
        information: business?.business?.information || '',
        description: business?.business?.description || '',
        resorts: business?.business?.resorts || [],
        languages: business?.business?.languages || [],
        id: business?.business?.id || '',
        igUrl: business?.business?.igUrl || '',
        twUrl: business?.business?.twUrl || '',
        ytUrl: business?.business?.ytUrl || '',
        fbUrl: business?.business?.fbUrl || '',
        
    };

    const methods = useForm({
        resolver: yupResolver(UpdateUserSchema),
        defaultValues,
    });

    const {
        getValues,
        setValue,
        handleSubmit,
        reset,
        formState: { isSubmitting },
        setError,
    } = methods;

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const onSubmit = async (data) => {
        const value = {
            ...data
        }
        dispatch(updateBusiness(value));
    };

    useEffect(() => {
        if (business?.success != null) {
            enqueueSnackbar("Succesful edit");
        }
    }, [business]);

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            if (file) {
                setValue(
                    'photoURL',
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
            }
        },
        [setValue]
    );


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {business?.name ? <Typography
                variant="caption"
                sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                }}
            >loading information...</Typography> : <Grid container spacing={3}>
                {/* <Grid item xs={12} md={4}>
                    <Card sx={{ py: imageSize, textAlign: 'center' }}>
                        <RHFUploadAvatar
                            name="photoURL"
                            accept="image/*"
                            maxSize={16000000}
                            onDrop={handleDrop}
                            helperText={
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 2,
                                        mx: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                    }}
                                >
                                    Allowed *.jpeg, *.jpg, *.png, *.gif
                                    <br /> max size of {fData(16000000)}
                                </Typography>
                            }
                        />

                    </Card>
                </Grid> */}

                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                rowGap: 3,
                                columnGap: 2,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            <RHFTextField name="name" label={translate("general.form.name")} disabled={business?.business?.name != ''} />
                            <RHFTextField name="cellphone" label={translate("general.form.cellphone")} disabled={business?.business?.cellphone != undefined} />

                            <RHFTextField name="email" label={translate("general.form.email")} disabled />
                            <RHFSelect name="country" label={translate("general.form.country")} placeholder={translate("general.form.country")}>
                                <option value='' />
                                {countries.map((option) => (
                                    <option key={option.code} value={option.label}>
                                        {option.label}
                                    </option>
                                ))}
                            </RHFSelect>
                        </Box>

                        <Stack sx={{ mt: 3 }}>
                            <RHFMultipleSelect name="languages" label={translate("general.form.languages")} freeSolo={true} grouped={true} list={LANGUAGES} />
                        </Stack>

                        <Stack sx={{ mt: 3 }}>
                            <RHFMultipleSelect name="resorts" label={translate("general.form.resorts")} freeSolo={true} grouped={true} list={ski_resorts} />
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

                        <Stack spacing={3} sx={{ mt: 3 }} alignItems="flex-end">
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

                        <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }}>
                                {translate("general.form.saveChanges")}
                            </LoadingButton>
                        </Stack>

                    </Card>
                </Grid>
            </Grid>}
        </FormProvider>
    );
}
