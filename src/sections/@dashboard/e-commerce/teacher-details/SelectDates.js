import { CalendarPicker, MobileDatePicker, PickersDay, StaticDatePicker } from "@mui/lab";
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField, Box, Typography, Paper } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { DialogAnimate } from "src/components/animate";
import useLocales from "src/hooks/useLocales";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import { styled } from '@mui/material/styles';
import { useCallback } from "react";
import { endOfDay, isBefore, isSameDay } from "date-fns";
import { ButtonBase } from '@mui/material';
import { getEventsByTeacherId } from "src/redux/slices/bookings";
import { useDispatch, useSelector } from "react-redux";


const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay' && prop !== 'isRandomDay'
})(({ theme, dayIsBetween, isFirstDay, isLastDay, isRandomDay }) => ({
    ...(dayIsBetween && {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
        },
    }),
    ...(isFirstDay && {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
    ...(isLastDay && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
    }),
    ...(isRandomDay && {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    }),
}));

export default function SelectDates({ handleClose, onSubmit }) {
    const { translate } = useLocales()
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.bookings);
    const { teacher } = useSelector(state => state.teachers)
    const [selectedDate, setSelectedDate] = useState()
    const [selectTimeModal, setSelectTimeModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [selectedDates, setDates] = useState([])
    const today = new Date()
    const tomorrow = new Date()
    useEffect(() => {
        dispatch(getEventsByTeacherId(teacher.id, date.getMonth() + 1));
    }, [dispatch, teacher])
    useEffect(() => {
        console.log({ events })
    }, [events])


    tomorrow.setDate(tomorrow.getDate() + 1)

    const renderWeekPickerDay = useCallback((date, _selectedDates, pickersDayProps) => {
        if (!date) {
            return <PickersDay {...pickersDayProps} onClick={() => console.log("clocked2")} />;
        }

        const dayIsBetween = selectedDates.length > 0 && selectedDates.find(_date => _date.getDate() === date.getDate()) !== undefined
        const isFirstDay = false
        const isLastDay = false
        const isRandomDay = true

        return (
            <CustomPickersDay
                {...pickersDayProps}
                onClick={(newValue) => {
                    setDate(newValue);

                    if (selectedDates.find(d => d.getTime() === newValue.getTime())) {
                        setDates(selectedDates.filter(d => d.getTime() !== newValue.getTime()))
                    }

                }}
                onDaySelect={(newValue) => {
                    setDate(newValue);

                    if (selectedDates.find(d => d.getTime() === newValue.getTime())) {
                        setDates(selectedDates.filter(d => d.getTime() !== newValue.getTime()))
                    } else {
                        setSelectTimeModal(true)
                        setDates([...selectedDates, newValue])
                    }

                }}
                disableMargin
                dayIsBetween={dayIsBetween}
                isFirstDay={isFirstDay}
                isLastDay={isLastDay}
                isRandomDay={isRandomDay}
            />
        );
    }, [selectedDates]);

    return (
        <React.Fragment>
            <DialogAnimate open={selectTimeModal} onClose={() => setSelectTimeModal(false)}>
                <DialogTitle>{translate("conversation.time")}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction='row' justifyContent='center' paddingTop={2}>
                        <Grid item xs={12}>
                            <Paper
                                onClick={() => {
                                    selectedDates[selectedDates.length - 1].setHours(9)
                                    setSelectTimeModal(false)
                                }}
                                sx={{
                                    p: 3,
                                    width: 1,
                                    my: 2,

                                    border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,

                                }}
                            >
                                {/* picture or icon */}
                                <Typography
                                    // color={timeSelected === 'ALL_DAY' ? 'primary' : ''}
                                    variant="h6">{translate('checkout.morningTitle')} $US 180</Typography>

                                <Typography
                                    // color={timeSelected === 'ALL_DAY' ? 'primary' : ''} 
                                    variant="subtitle2">{translate('checkout.morningDescription')}</Typography>

                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                onClick={() => {
                                    selectedDates[selectedDates.length - 1].setHours(14)
                                    setSelectTimeModal(false)
                                }}
                                sx={{
                                    p: 3,
                                    width: 1,
                                    my: 2,

                                    border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,

                                }}
                            >
                                {/* picture or icon */}
                                <Typography
                                    // color={timeSelected === 'ALL_DAY' ? 'primary' : ''}
                                    variant="h6">{translate('checkout.afternoonTitle')} $US 180
                                </Typography>

                                <Typography
                                    // color={timeSelected === 'ALL_DAY' ? 'primary' : ''} 
                                    variant="subtitle2">{translate('checkout.afternoonDescription')}
                                </Typography>

                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                onClick={() => {
                                    selectedDates[selectedDates.length - 1].setHours(8)
                                    setSelectTimeModal(false)
                                }}
                                sx={{
                                    p: 3,
                                    width: 1,
                                    my: 2,

                                    border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,

                                }}
                            >
                                {/* picture or icon */}
                                <Typography
                                    // color={timeSelected === 'ALL_DAY' ? 'primary' : ''}
                                    variant="h6">{translate('checkout.allDayTitle')} $US 300</Typography>

                                <Typography
                                    // color={timeSelected === 'ALL_DAY' ? 'primary' : ''} 
                                    variant="subtitle2">{translate('checkout.allDayDescription')}</Typography>

                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </DialogAnimate>
            <Grid container width={'100%'} height={'100%'}>
                <Grid item xs={12} width={'100%'} height={'100%'}>
                    <StaticDatePicker
                        onChange={()=>{}}
                        disabledDates={events.map(e => new Date(e.start))}
                        shouldDisableDate={(date) => events.some(e => isSameDay(date, new Date(e.start)))}
                        showToolbar={false}
                        renderDay={renderWeekPickerDay}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="'Week of' MMM d"
                        disableHighlightToday={false}
                        disablePast
                    // shouldDisableDate={(date) => isBefore(date, endOfDay(new Date()))}
                    />
                </Grid>
                <Grid item xs={12} pl={3}>
                    <Typography>{`${translate('general.total_days')}: ${selectedDates.length}`}</Typography>
                </Grid>

            </Grid>

            <DialogActions>
                <Button fullWidth variant='outlined' onClick={handleClose}>
                    {translate('general.cancel')}
                </Button>
                <Button fullWidth variant='contained' onClick={() => onSubmit(selectedDates)}>
                    {translate('general.done')}
                </Button>
            </DialogActions>
        </React.Fragment>

    )
}