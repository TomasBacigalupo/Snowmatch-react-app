import { Controller, useForm } from 'react-hook-form';
// @mui
import { Grid, Card, TextField, Typography, Box, Image } from '@mui/material';
//
import { FormProvider, RHFMultiCheckbox, RHFSelect } from 'src/components/hook-form';
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
import ReactPixel from 'react-facebook-pixel';
import { searchTeachers } from 'src/services/facebook';
import { PATH_DASHBOARD } from 'src/routes/paths';


export default function HomeFilterTeachersBariloche() {

    // const advancedMatching = { em: 'some@email.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
    const options = {
        autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
        debug: process.env.REACT_APP_FACEBOOK_PIXEL_ID === "DEBUG", // enable logs
    };

    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID, {}, options);

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
        resort: 'Cerro Catedral',
        range: defaultRange,
        from: defaultRange[0],
        to: defaultRange[1],
        gender: [],
        category: ["Ski"],
        language: [],
        discipline: []
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

    const onSubmitSchools = () => {
        try {
            dispatch(filterTeachers({
                ...values,
                from: values.range[0],
                to: values.range[1]
            }))
            if (isTeacher) {
                navigate('/dashboard/e-commerce/shop/school')
            } else {
                navigate('/match')
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmitIndependent = () => {
        try {
            dispatch(filterTeachers({
                ...values,
                from: values.range[0],
                to: values.range[1]
            }))
            if (isTeacher) {
                navigate('/dashboard/e-commerce/shop/independent')
            } else {
                navigate('/match/independent')
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = () => {
        searchTeachers({
            ...values,
            from: values.range[0],
            to: values.range[1]
        })
        dispatch(filterTeachers({
            ...values,
            from: values.range[0],
            to: values.range[1]
        }))

        if (values.resort === "Cerro Catedral") {
            if (isTeacher) {
                navigate('/dashboard/e-commerce/independent?resort=Cerro Catedral')
            } else {
                navigate(PATH_DASHBOARD.eCommerce.matchIndependant)
            }

        } else {
            if (isTeacher) {
                navigate(`/dashboard/e-commerce/shop/school?resort=${values.resort}`)
            } else {
                navigate(`/match/school?resort=${values.resort}`)
            }

        }

    }

    useEffect(() => {
        ReactPixel.pageView(); // For tracking page view
    })

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>


                <Grid container spacing={2} justifyContent='center' alignItems='center'>
                    <Grid item xs={5}>
                        <HoverButton type="submit" variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
                            {translate("landingPRO.search")}
                        </HoverButton>
                    </Grid>
                </Grid>

            </FormProvider>
        </>
    );
}