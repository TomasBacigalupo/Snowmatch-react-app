import { PickersDay, StaticDatePicker, StaticDateRangePicker } from "@mui/lab";
import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField, Box, Typography, Paper } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { DialogAnimate } from "src/components/animate";
import useLocales from "src/hooks/useLocales";
import { styled } from '@mui/material/styles';
import { isSameDay } from "date-fns";
import { getEventsByTeacherId } from "src/redux/slices/bookings";
import { useDispatch, useSelector } from "react-redux";
import { calculatePrice, calculateRequestedPrice } from "src/redux/slices/teachers";
import { fCurrency } from "src/utils/formatNumber";
import './SelectDates.css';


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

export default function SelectDates({ handleClose, onSubmit, isRange, product }) {
    const { translate } = useLocales()
    const dispatch = useDispatch();
    const { events } = useSelector(state => state.bookings);
    const { teacher } = useSelector(state => state.teachers);
    const { from, to } = useSelector(state => state.teachers.filters);
    const [selectTimeModal, setSelectTimeModal] = useState(false)
    const [date, setDate] = useState(new Date())
    const [selectedDates, setDates] = useState([])
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const hasPrice = teacher?.level >= 3 && teacher?.resorts?.find(resort => resort === 'Cerro Catedral');
    const [range, setRange] = useState([from, to]);
    const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24));

    useEffect(() => {
        dispatch(getEventsByTeacherId(teacher?.id, date.getMonth() + 1));
    }, [dispatch, teacher])

    const renderWeekPickerDay = useCallback((date, _selectedDates, pickersDayProps) => {
        if (!date) {
            return <PickersDay {...pickersDayProps} onClick={() => console.log("clicked2")} />;
        }

        const dayIsBetween = selectedDates.length > 0 && selectedDates.find(_date => isSameDay(_date, date)) !== undefined;
        const isFirstDay = false;
        const isLastDay = false;
        const isRandomDay = true;

        return (
            <CustomPickersDay
                {...pickersDayProps}
                onClick={(newValue) => {
                    setDate(newValue);

                    if (selectedDates.find(d => isSameDay(d, newValue))) {
                        setDates(selectedDates.filter(d => !isSameDay(d, newValue)));
                    }

                }}
                onDaySelect={(newValue) => {
                    setDate(newValue);

                    if (selectedDates.find(d => isSameDay(d, newValue))) {
                        setDates(selectedDates.filter(d => !isSameDay(d, newValue)));
                    } else {
                        setSelectTimeModal(true);
                        setDates([...selectedDates, newValue]);
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

    const handleChangeRange = (newRange) => {
        const selectedDates = [];

        const start = newRange[0];
        const end = newRange[1];

        const dateList = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            dateList.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        dateList.forEach((date) => {
            selectedDates.push(date);
        });

        if (selectedDates.length > 0) {
            setSelectTimeModal(true);
        }

        setDates(selectedDates);
    }

    const morningSelected = () => {
        if (!isRange) {
            selectedDates[selectedDates.length - 1].setHours(9);
        } else {
            selectedDates.map(date => date.setHours(9));
        }
        setSelectTimeModal(false);
    }
    const afternoonSelected = () => {
        if (!isRange) {
            selectedDates[selectedDates.length - 1].setHours(14);
        } else {
            selectedDates.map(date => date.setHours(14));
        }
        setSelectTimeModal(false);
    }
    const allDaySelected = () => {
        if (!isRange) {
            selectedDates[selectedDates.length - 1].setHours(8);
        } else {
            selectedDates.map(date => date.setHours(8));
        }
        setSelectTimeModal(false);
    }

    return (
        <React.Fragment>
            <DialogAnimate open={selectTimeModal} onClose={() => setSelectTimeModal(false)}>
                <DialogTitle>{translate("conversation.time")}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction='row' justifyContent='center' paddingTop={2}>
                        <Grid item xs={12}>
                            <Paper
                                onClick={morningSelected}
                                sx={{
                                    p: 3,
                                    width: 1,
                                    my: 2,
                                    border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                                }}
                            >
                                <Typography
                                    variant="h6">
                                    {translate('checkout.morningTitle')} {product ? `${fCurrency(calculatePrice(product, 1, 'MORNING'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'MORNING'))}
                                </Typography>
                                <Typography
                                    variant="subtitle2">
                                    {translate('checkout.morningDescription')}
                                </Typography>
                                {false && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle" sx={{ textAlign: 'end', flex: '1 1 auto' }}>
                                        {product ? `${fCurrency(calculatePrice(product, selectedDates.length, 'MORNING') * selectedDates.length)} total` : (hasPrice && '$US 180')}
                                    </Typography>
                                </Box>}
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                onClick={afternoonSelected}
                                sx={{
                                    p: 3,
                                    width: 1,
                                    my: 2,
                                    border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                                }}
                            >
                                <Typography
                                    variant="h6">{translate('checkout.afternoonTitle')} {product ? `${fCurrency(calculatePrice(product, 1, 'AFTERNOON'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'AFTERNOON'))}
                                </Typography>
                                <Typography
                                    variant="subtitle2">{translate('checkout.afternoonDescription')}
                                </Typography>
                                {false && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle" sx={{ textAlign: 'end', flex: '1 1 auto' }}>
                                        {product ? `${fCurrency(calculatePrice(product, selectedDates.length, 'AFTERNOON') * selectedDates.length)} total` : hasPrice && '$US 180'}
                                    </Typography>
                                </Box>}
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                onClick={allDaySelected}
                                sx={{
                                    p: 3,
                                    width: 1,
                                    my: 2,
                                    border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                                }}
                            >
                                <Typography
                                    variant="h6">
                                    {translate('checkout.allDayTitle')}
                                    {product ? ` ${fCurrency(calculatePrice(product, 1, 'FULL_DAY'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'FULL_DAY'))}
                                </Typography>
                                <Typography
                                    variant="subtitle2">
                                    {translate('checkout.allDayDescription')}
                                </Typography>
                                {false && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle" sx={{ textAlign: 'end', flex: '1 1 auto' }}>
                                        {product ? `${fCurrency(calculatePrice(product, selectedDates.length, 'FULL_DAY') * selectedDates.length)} total` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'FULL_DAY'))}
                                    </Typography>
                                </Box>}
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </DialogAnimate>
            <Grid container width={'100%'} height={'100%'}>
                <Grid id='custom-calendar' item xs={12} width={'100%'} height={'100%'}>
                    {!isRange && <StaticDatePicker
                        onChange={() => { }}
                        disabledDates={events.map(e => new Date(e.start))}
                        shouldDisableDate={(date) => events.some(e => isSameDay(date, new Date(e.start)))}
                        showToolbar={false}
                        renderDay={renderWeekPickerDay}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="'Week of' MMM d"
                        disablePast
                        //prevent to highlight the current day
                        value={null}
                    />}
                    {isRange && <StaticDateRangePicker
                        onChange={handleChangeRange}
                        shouldDisableDate={(date) => !events.some(e => isSameDay(date, new Date(e.start)))}
                        showToolbar={false}
                        value={range}
                        defaultValue={range}
                        disablePast={true}
                    />}
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
