import { Controller, useForm } from 'react-hook-form';
// @mui
import { MobileDateRangePicker } from '@mui/lab';
import { Grid, Card, TextField, Typography, Box, Image } from '@mui/material';
//
import { FormProvider, RHFMultiCheckbox, RHFAutocomplete } from 'src/components/hook-form';
import { FILTER_CATEGORY_OPTIONS, FILTER_RESORT_OPTIONS } from '../@dashboard/e-commerce/shop/ShopFilterSidebar';
import { useDispatch } from 'react-redux';
import { filterTeachers } from 'src/redux/slices/teachers';
import { useNavigate } from 'react-router';
import Iconify from 'src/components/Iconify';
import useLocales from 'src/hooks/useLocales';
import HoverButton from 'src/components/HoverButton';
import useAuth from 'src/hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { searchTeachers } from 'src/services/facebook';
import { PATH_DASHBOARD } from 'src/routes/paths';

// Create a flat list of all resorts for autocomplete
const getAllResorts = () => {
    const allResorts = [];
    FILTER_RESORT_OPTIONS.forEach((country) => {
        country.resorts.forEach((resort) => {
            allResorts.push({
                name: resort,
                category: country.category
            });
        });
    });
    return allResorts.sort((a, b) => a.name.localeCompare(b.name));
};

const getClassType = (type) => {
    switch(type) {
        case 'privada':
            return 'Clase Privada';
        case 'grupal':
            return 'Clase Grupal';
        case 'nenes':
            return 'Clase para Niños';
        case 'adolescentes':
            return 'Clase para Adolescentes';
        case 'menores':
            return 'Clase para Menores';
        case 'juveniles':
            return 'Clase para Juveniles';
        default:
            return 'Clase';
    }
}

export default function HomeFilterTeachers({ resort, discipline, type, resortSlug, disciplineSlug }) {

    // const advancedMatching = { em: 'some@email.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
    const options = {
        autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG", // enable logs
    };

    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isTeacher, user } = useAuth()

    const { translate } = useLocales()

    const defaultRange = [
        new Date(),
        new Date(new Date().setDate(new Date().getDate() + 7)),
    ]

    const defaultValues = {
        resort: resort ? { name: resort, category: 'Argentina' } : { name: 'Cerro Catedral', category: 'Argentina' },
        range: defaultRange,
        from: defaultRange[0],
        to: defaultRange[1],
        gender: [],
        category: discipline ? discipline : ["Ski", "SnowBoard"],
        language: []
    };

    const methods = useForm({
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = methods;

    const values = watch();

    const onSubmit = () => {
        const resortName = values.resort?.name || values.resort;
        
        searchTeachers({
            ...values,
            resort: resortName,
            from: values.range[0],
            to: values.range[1]
        })
        dispatch(filterTeachers({
            ...values,
            resort: resortName,
            from: values.range[0],
            to: values.range[1]
        }))

        if (resortName === "Cerro Catedral") {
            if (isTeacher) {
                navigate('/dashboard/e-commerce/independent?resort=Cerro Catedral')
            } else {
                navigate(PATH_DASHBOARD.eCommerce.matchIndependant)
            }

        } else {
            if (isTeacher) {
                navigate(`/dashboard/e-commerce/shop/school?resort=${resortName}`)
            } else {
                navigate(`/match/school?resort=${resortName}`)
            }

        }

    }

    useEffect(() => {
        if (resort) {
            const resortOption = getAllResorts().find(r => r.name === resort);
            setValue('resort', resortOption || { name: resort, category: 'Argentina' });
        }
        setValue('category', discipline ? discipline : ["Ski", "SnowBoard"])
    }, [resort, discipline])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} justifyContent='center'>
                    <Typography variant="h3" component='h1' sx={{ color: theme.typography.color, }}>
                        {translate("landingPRO.find", { resort: 
                            resortSlug ? translate(`landingPRO.${resortSlug}`) : resort, 
                            discipline: disciplineSlug ? translate(`landingPRO.${disciplineSlug}`) : translate(`landingPRO.ski&snowboard`),  
                            type: type ? translate(`landingPRO.${type}`) : "" })}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12} justifyContent='center'>
                    <Typography variant="h5" component='h2' sx={{ color: theme.typography.body2, }}>
                        {translate("landingPRO.findSubtitle", { 
                            resort: resortSlug ? translate(`landingPRO.${resortSlug}`) : resort, 
                            discipline: disciplineSlug ? translate(`landingPRO.${disciplineSlug}`) : translate(`landingPRO.ski&snowboard`), 
                            type: type ? translate(`landingPRO.${type}Instructor`) : "" })}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item xs={12}>
                            <RHFAutocomplete
                                name="resort"
                                label={translate("filter.resort")}
                                placeholder="Buscar resort..."
                                options={getAllResorts()}
                                getOptionLabel={(option) => option.name}
                                groupBy={(option) => option.category}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                filterOptions={(options, { inputValue }) => {
                                    const filtered = options.filter((option) =>
                                        option.name.toLowerCase().includes(inputValue.toLowerCase())
                                    );
                                    return filtered;
                                }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <RHFMultiCheckbox name="category" options={FILTER_CATEGORY_OPTIONS} sx={{ width: 1 }} />
                        </Grid>
                        <Grid item xs={7}>
                            <HoverButton fullWidth type="submit" variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
                                {translate("landingPRO.search")}
                            </HoverButton>
                        </Grid>
                    </Grid>
                    <Box component="div" sx={{ mb: 3 }}>
                        <Typography
                            component="p"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                textAlign: { xs: 'center', md: 'left' }
                            }}
                        >
                            • Instructores certificados · {type ? getClassType(type) : 'Clases privadas y grupales'} · Reserva online en 1 minuto
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </FormProvider>
    );
}