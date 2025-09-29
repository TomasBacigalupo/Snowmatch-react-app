import { Controller, useForm } from 'react-hook-form';
// @mui
import { MobileDateRangePicker } from '@mui/lab';
import { Grid, Card, TextField, Typography, Box, Image, Chip } from '@mui/material';
//
import { FormProvider, RHFAutocomplete } from 'src/components/hook-form';
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
import { formatSlug } from 'src/utils/slugHelper';

// Create a flat list of all resorts for autocomplete
const getAllResorts = (apiResortOptions = null) => {
    // If API resort options are provided, use them
    if (apiResortOptions && apiResortOptions.length > 0) {
        return apiResortOptions.map((resort) => ({
            name: resort.name || resort.id,
            category: resort.category || 'Argentina'
        })).sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Fallback to hardcoded options
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
    switch (type) {
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

export default function HomeFilterTeachers({ resort, discipline, type, resortSlug, disciplineSlug, resortOptions, resortOptionsLoading, resortOptionsError }) {

    // const advancedMatching = { em: 'some@email.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
    const options = {
        autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG", // enable logs
    };

    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isTeacher, user } = useAuth()

    const { translate, currentLang } = useLocales()

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
        const currentLanguage = currentLang?.value || 'es'; // Get current language, default to 'es'

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

        // Format resort name for URL (replace spaces with hyphens and handle special characters)
        const formattedResortName = resortName.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        // Redirect to /:lng/search/:resort
        navigate(`/${currentLanguage}/search/${formattedResortName}`);

    }

    useEffect(() => {
        if (resort) {
            const resortOption = getAllResorts(resortOptions).find(r => r.name === resort);
            setValue('resort', resortOption || { name: resort, category: 'Argentina' });
        }
        setValue('category', discipline ? discipline : ["Ski", "SnowBoard"])
    }, [resort, discipline, resortOptions])

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} justifyContent='center'>
                    <Typography
                        variant="h4"
                        component='h1'
                        sx={{
                            color: '#000000',
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        {translate("landingPRO.find", {
                            resort:
                                resortSlug ? formatSlug(resortSlug) : resort,
                            discipline: disciplineSlug ? formatSlug(disciplineSlug) : translate(`landingPRO.ski&snowboard`),
                            type: type ? translate(`landingPRO.${type}`) : ""
                        })}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12} justifyContent='center'>
                    <Typography
                        variant="h5"
                        component='h2'
                        sx={{
                            color: '#000000',
                            fontSize: { xs: '1rem', md: '1.25rem' },
                            fontWeight: 400,
                            lineHeight: 1.4,
                            mb: 1
                        }}
                    >
                        {translate("landingPRO.findSubtitle", {
                            resort: resortSlug ? formatSlug(resortSlug) : resort,
                            discipline: disciplineSlug ? translate(`landingPRO.${disciplineSlug}`) : translate(`landingPRO.ski&snowboard`),
                            type: type ? translate(`landingPRO.${type}Instructor`) : ""
                        })}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Grid container spacing={1} alignItems='center'>
                        <Grid item xs={12}>
                            <RHFAutocomplete
                                name="resort"
                                label={translate("filter.resort")}
                                placeholder="Buscar resort..."
                                options={getAllResorts(resortOptions)}
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
                        <Grid item xs={12}>
                            <Controller
                                name="range"
                                control={control}
                                render={({ field }) => (
                                    <MobileDateRangePicker
                                        {...field}
                                        startText={translate("filter.checkIn")}
                                        endText={translate("filter.checkOut")}
                                        value={field.value}
                                        onChange={(newValue) => {
                                            field.onChange(newValue);
                                            if (newValue && newValue[0]) setValue('from', newValue[0]);
                                            if (newValue && newValue[1]) setValue('to', newValue[1]);
                                        }}
                                        renderInput={(startProps, endProps) => (
                                            <>
                                                <TextField
                                                    {...startProps}
                                                    fullWidth
                                                    placeholder={translate("filter.when")}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderTopRightRadius: 0,
                                                            borderBottomRightRadius: 0,
                                                            borderRightWidth: 'none',

                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: '#000000',
                                                        },
                                                    }}
                                                />
                                                <TextField
                                                    {...endProps}
                                                    fullWidth
                                                    placeholder={translate("filter.when")}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderTopLeftRadius: 0,
                                                            borderBottomLeftRadius: 0,

                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: '#000000',
                                                        },
                                                    }}
                                                />
                                            </>
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: '100%' }}>
                                        {FILTER_CATEGORY_OPTIONS.map((option) => (
                                            <Chip
                                                key={option}
                                                label={option}
                                                variant="outlined"
                                                clickable
                                                onClick={() => {
                                                    const currentValue = field.value || [];
                                                    const newValue = currentValue.includes(option)
                                                        ? currentValue.filter(item => item !== option)
                                                        : [...currentValue, option];
                                                    field.onChange(newValue);
                                                }}
                                                sx={{
                                                    flex: 1,
                                                    height: '48px',
                                                    border: (field.value || []).includes(option) ? '1px solid #000000' : '1px solid #cccccc',
                                                    borderRadius: 1,
                                                    fontWeight: 500,
                                                    color: '#000000',
                                                    backgroundColor: '#ffffff',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                        color: '#000000',
                                                    },
                                                    '& .MuiChip-label': {
                                                        width: '100%',
                                                        textAlign: 'center',
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <HoverButton fullWidth type="submit" variant="contained" size="large" >
                                {translate("landingPRO.search")}
                            </HoverButton>
                        </Grid>
                        <Grid item xs={12}>
                            <Box component="div" >
                                <Typography
                                    component="p"
                                    variant="body2"
                                    sx={{
                                        color: '#000000',
                                        fontSize: '0.875rem',
                                        fontWeight: 400,
                                        lineHeight: 1.5,
                                        textAlign: { xs: 'center', md: 'left' }
                                    }}
                                >
                                    {translate('filter.instructorDescription', { classType: type ? getClassType(type) : 'Clases privadas y grupales' })}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </FormProvider>
    );
}