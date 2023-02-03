import React from 'react'
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, Modal, DialogTitle } from '@mui/material';
import { LoadingButton, MobileDatePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../../redux/store';
import { contactTeacher } from '../../../../redux/slices/contact';
// components
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';

import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch, RHFSelect } from '../../../../components/hook-form';
import { useEffect, useState } from 'react';

import { countries } from '../../../../_mock';
import useLocales from 'src/hooks/useLocales';
import { useSelector } from 'react-redux';
import AuthGuard from 'src/guards/AuthGuard';
import { addCart, hireTeacher } from 'src/redux/slices/teachers';
import { useNavigate } from 'react-router';
import { setRequestedRoute } from 'src/redux/slices/config';


const HireForm = ({ teacher, onCancel}) => {
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useLocales();
    const { contactForm } = useSelector((state) => state.contact);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    useEffect(()=>{
        dispatch(setRequestedRoute(`/match/teacher/${teacher.id}/hire`))
    },[])
    
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const dispatch = useDispatch();

    const ContactSchema = Yup.object().shape({
        level: Yup.string().required(),
        activity: Yup.string().required(),
        amount: Yup.number().required(),
        duration: Yup.string().required(),
        resort: Yup.string().required()
    });


    const methods = useForm({
        resolver: yupResolver(ContactSchema),
        defaultValues: {
            activity: teacher.disciplines[0],
            resort: teacher?.resorts[0],
        }
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
        setError
    } = methods;

    const onSubmit = async (data) => {
        try {
            const requestEvent = {
                price: 0,
                people: data.amount,
                lessonTime: data.duration,
                date: data.classDate,
                resort: data.resort
            };
            console.log({teacher})
            dispatch(addCart({
                teacher: teacher, 
                event: requestEvent
            }))
            handleClose()
            navigate('hire')
        } catch (error) {
            console.error(error);
        }
    };




    return (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3} sx={{ p: 3 }}>
                    <RHFSelect name='resort' label={'Resort'}>
                    {teacher.resorts.map(resort => <option key={resort} value={resort}>
                        {resort}
                    </option>)}
                    </RHFSelect>
                    <RHFSelect name="level" label={translate("school.clients.form.level")} placeholder={translate("school.clients.form.level")}>
                        <option value="" />
                        <option key="BEGINNER" value="BEGINNER">
                            {translate("school.clients.form.BEGINNER")}
                        </option>
                        <option key="INTERMEDIATE" value="INTERMEDIATE">
                            {translate("school.clients.form.INTERMEDIATE")}
                        </option>
                        <option key="ADVANCED" value="ADVANCED">
                            {translate("school.clients.form.ADVANCED")}
                        </option>
                        <option key="EXPERT" value="EXPERT">
                            {translate("school.clients.form.EXPERT")}
                        </option>
                    </RHFSelect>

                    <RHFSelect name="activity" label={translate("conversation.activity")} placeholder={translate("conversation.activity")}>
                        <option value="" />
                    {teacher.disciplines.map(opt => <option key={opt} value={opt}>
                        {opt}
                    </option>)}
                    </RHFSelect>

                    <RHFTextField name="amount" label={translate("conversation.amount")} />

                    <RHFSelect name="duration" label={translate("conversation.duration")} placeholder={translate("conversation.duration")}>
                        <option value="" />
                        <option key="MORNING" value="MORNING">
                            {translate('checkout.morning')}
                        </option>
                        <option key="AFTERNOON" value="AFTERNOON">
                        {translate('checkout.afternoon')}
                        </option>
                        <option key="FULLDAY" value="ALLDAY">
                        {translate('checkout.allday')}
                        </option>
                    </RHFSelect>

                    <Controller
                        name="classDate"
                        control={control}
                        render={({ field }) => (
                            <MobileDatePicker
                                {...field}
                                label={translate("conversation.classdate")}
                                inputFormat="dd/MM/yyyy"
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        )}
                    />


                </Stack>

                <DialogActions>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button variant="outlined" color="inherit" onClick={onCancel}>
                        {translate("conversation.cancel")}
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ':hover': { color: '#3399FF' } }}>
                        {translate("checkout.book_lesson")}
                    </LoadingButton>
                </DialogActions>

                <DialogAnimate open={open} onClose={handleClose}>
                    <DialogTitle>{translate("conversation.validation_required")}</DialogTitle>

                    <Box spacing={3} sx={{ p: 3 }}>
                        <p id="validation-modal-description">
                            {translate("conversation.validation_required_body")}
                        </p>
                        <Button onClick={handleClose}>{translate("conversation.close")}</Button>
                    </Box>
                </DialogAnimate>


            </FormProvider>
    );
}

export default HireForm;