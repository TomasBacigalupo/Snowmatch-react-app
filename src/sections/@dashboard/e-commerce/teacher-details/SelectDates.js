import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { Button, DialogActions, DialogContent, DialogTitle, Grid, Box, Typography, Paper, Drawer, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        if (!teacher?.id) return;
        dispatch(getEventsByTeacherId(teacher.id, date.getMonth() + 1));
    }, [dispatch, teacher?.id, date]);

    // MUI X v7 removed renderDay; multi-select is implemented via slots.day.
    const multiSelectDaySlot = useMemo(() => {
        const MultiSelectPickersDay = React.forwardRef((props, ref) => {
            const { day, selected: _calendarSelected, onDaySelect: _calendarOnDaySelect, ...pickersDayProps } = props;
            const dayIsBetween =
                selectedDates.length > 0 &&
                selectedDates.some((d) => isSameDay(d, day));

            return (
                <CustomPickersDay
                    ref={ref}
                    {...pickersDayProps}
                    day={day}
                    selected={dayIsBetween}
                    onDaySelect={(clickedDay) => {
                        setDate(clickedDay);
                        if (selectedDates.some((d) => isSameDay(d, clickedDay))) {
                            setDates(selectedDates.filter((d) => !isSameDay(d, clickedDay)));
                        } else {
                            setSelectTimeModal(true);
                            setDates([...selectedDates, clickedDay]);
                        }
                    }}
                    disableMargin
                    dayIsBetween={dayIsBetween}
                    isFirstDay={false}
                    isLastDay={false}
                    isRandomDay
                />
            );
        });
        MultiSelectPickersDay.displayName = "MultiSelectPickersDay";
        return MultiSelectPickersDay;
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

    const morning2hsSelected = () => {
        if (!isRange) {
            selectedDates[selectedDates.length - 1].setHours(10);
        } else {
            selectedDates.map(date => date.setHours(10));
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

    const afternoon2hsSelected = () => {
        if (!isRange) {
            selectedDates[selectedDates.length - 1].setHours(15);
        } else {
            selectedDates.map(date => date.setHours(15));
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

    const TimeSelectionContent = () => (
        <>
            <DialogTitle>{translate("conversation.time")}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} direction='row' justifyContent='center' paddingTop={2}>
                    <Grid item xs={12}>
                        <Paper
                            onClick={morningSelected}
                            sx={{
                                p: 3,
                                width: 1,
                                border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                            }}
                        >
                            <Typography
                                variant="h6">
                                {translate('checkout.morningTitle')} (3hs) {product ? `${fCurrency(calculatePrice(product, 1, 'MORNING'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'MORNING'))}
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
                            onClick={morning2hsSelected}
                            sx={{
                                p: 3,
                                width: 1,
                                border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                            }}
                        >
                            <Typography
                                variant="h6">
                                {translate('checkout.morning2hsTitle')} {product ? `${fCurrency(calculatePrice(product, 1, 'MORNING_2HS'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'MORNING_2HS'))}
                            </Typography>
                            <Typography
                                variant="subtitle2">
                                {translate('checkout.morning2hsDescription')}
                            </Typography>
                            {false && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle" sx={{ textAlign: 'end', flex: '1 1 auto' }}>
                                    {product ? `${fCurrency(calculatePrice(product, selectedDates.length, 'MORNING_2HS') * selectedDates.length)} total` : (hasPrice && '$US 180')}
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
                                border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                            }}
                        >
                            <Typography
                                variant="h6">{translate('checkout.afternoonTitle')} (3hs) {product ? `${fCurrency(calculatePrice(product, 1, 'AFTERNOON'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'AFTERNOON'))}
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
                            onClick={afternoon2hsSelected}
                            sx={{
                                p: 3,
                                width: 1,
                                border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                            }}
                        >
                            <Typography
                                variant="h6">{translate('checkout.afternoon2hsTitle')} {product ? `${fCurrency(calculatePrice(product, 1, 'AFTERNOON_2HS'))}` : hasPrice && fCurrency(calculateRequestedPrice(teacher, totalDays, 'AFTERNOON_2HS'))}
                            </Typography>
                            <Typography
                                variant="subtitle2">{translate('checkout.afternoonDescription')}
                            </Typography>
                            {false && <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle" sx={{ textAlign: 'end', flex: '1 1 auto' }}>
                                    {product ? `${fCurrency(calculatePrice(product, selectedDates.length, 'AFTERNOON_2HS') * selectedDates.length)} total` : hasPrice && '$US 180'}
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
                                border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
                            }}
                        >
                            <Typography
                                variant="h6">
                                {translate('checkout.allDayTitle')} (6hs) {` `}
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
        </>
    );

    return (
        <React.Fragment>
            {isMobile ? (
                <Drawer
                    anchor="bottom"
                    open={selectTimeModal}
                    onClose={() => setSelectTimeModal(false)}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            maxHeight: '80vh',
                            paddingBottom: 'env(safe-area-inset-bottom)'
                        }
                    }}
                >
                    <TimeSelectionContent />
                </Drawer>
            ) : (
                <DialogAnimate open={selectTimeModal} onClose={() => setSelectTimeModal(false)}>
                    <TimeSelectionContent />
                </DialogAnimate>
            )}
            <Box
                sx={{
                    overflow: 'visible',
                    px: { xs: 1, sm: 2 },
                    py: 1,
                    maxHeight: { xs: 'min(85dvh, 640px)', sm: '72vh' },
                    overflowY: 'auto',
                    width: '100%',
                }}
            >
                <Grid container width="100%" sx={{ minHeight: 0 }}>
                    <Grid id="custom-calendar" item xs={12} width="100%" sx={{ minHeight: 0 }}>
                        {!isRange && (
                            <StaticDatePicker
                                value={null}
                                onChange={() => {}}
                                shouldDisableDate={(d) =>
                                    events.some((e) => isSameDay(d, new Date(e.start)))
                                }
                                disablePast
                                onMonthChange={(month) => setDate(month)}
                                slots={{ day: multiSelectDaySlot }}
                                slotProps={{
                                    toolbar: { hidden: true },
                                }}
                                sx={{
                                    width: '100%',
                                    maxWidth: '100%',
                                    '& .MuiPickersLayout-root': { overflow: 'visible' },
                                }}
                            />
                        )}
                        {isRange && (
                            <StaticDateRangePicker
                                onChange={handleChangeRange}
                                shouldDisableDate={(d) =>
                                    !events.some((e) => isSameDay(d, new Date(e.start)))
                                }
                                slotProps={{ toolbar: { hidden: true } }}
                                value={range}
                                disablePast
                            />
                        )}
                    </Grid>
                </Grid>
            </Box>
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
