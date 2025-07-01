import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, Select, TextField, FormControl, InputLabel, MenuItem, DialogActions, DialogTitle, Button, Box, Autocomplete, Typography, IconButton, Grid, Checkbox, FormControlLabel } from '@mui/material';
import { useDispatch } from 'src/redux/store';
import { getTeachers, getTeachersAdmin } from 'src/redux/slices/admin';
import { useSelector } from 'react-redux';
import { createAdminBooking } from 'src/redux/slices/bookings';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO, addDays, isWithinInterval } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import ShopTeacherCard from 'src/sections/@dashboard/e-commerce/shop/ShopTeacherCard';
import { PATH_DASHBOARD } from 'src/routes/paths';

const BookingModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        teacher: null,
        student: null,
        dateTimes: [{ date: '', time: 'ALL_DAY', price: '' }],
        resort: 'Cerro Catedral',
        children: 0,
        adults: 0,
        comment: '',
        teacherSearch: '',
        bookingType: 'ASSIGNED',
        includesLaunch: false,
        includesEquipment: false,
        paymentStatus: 'PAID',
        internalComment: ''
    });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const [teacherId, setTeacherId] = useState(null);
    const [studentId, setStudentId] = useState(null);

    const { teachers } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getTeachers(1, "TEACHER", formData.teacher, 0))
    }, [formData.teacher])

    useEffect(() => {
        dispatch(getTeachers(1, "STUDENT", formData.student, 0))
    }, [formData.student])

    const handleFormChange = (event, index) => {
        const { name, value } = event.target;
        if (name === 'children' || name === 'adults') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } if (name === 'comment'){
            setFormData((prevData) => ({
                ...prevData,
                comment: value,
            }));
        }else {
            const updatedDateTimes = [...formData.dateTimes];
            updatedDateTimes[index][name] = value;
            setFormData((prevData) => ({
                ...prevData,
                dateTimes: updatedDateTimes,
            }));
        }
    };

    const handleAddDateTime = () => {
        setFormData((prevData) => ({
            ...prevData,
            dateTimes: [...prevData.dateTimes, { date: '', time: 'ALL_DAY', price: '' }],
        }));
    };

    const handleDateRangeChange = (startDate, endDate) => {
        setDateRange({ startDate, endDate });
        
        if (startDate && endDate) {
            const dates = [];
            let currentDate = startDate;
            
            while (currentDate <= endDate) {
                dates.push({
                    date: format(currentDate, 'yyyy-MM-dd'),
                    time: 'ALL_DAY',
                    price: ''
                });
                currentDate = addDays(currentDate, 1);
            }
            
            setFormData(prev => ({
                ...prev,
                dateTimes: dates
            }));
        }
    };

    const handlePriceChange = (value, index) => {
        const updatedDateTimes = [...formData.dateTimes];
        updatedDateTimes[index].price = value;
        setFormData(prev => ({
            ...prev,
            dateTimes: updatedDateTimes
        }));
    };

    const handleTimeChange = (value, index) => {
        const updatedDateTimes = [...formData.dateTimes];
        updatedDateTimes[index].time = value;
        setFormData(prev => ({
            ...prev,
            dateTimes: updatedDateTimes
        }));
    };

    const handleRemoveDate = (index) => {
        const updatedDateTimes = formData.dateTimes.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            dateTimes: updatedDateTimes
        }));
    };

    const handleSubmit = () => {
        const totalPrice = formData.dateTimes.reduce((acc, curr) => acc + Number(curr.price), 0);
        const events = formData.dateTimes.map((dateTime) => ({
            title: formData.bookingType === 'REFERRED' ? 'Referida' : 'Asignada',
            start: dateTime.date,
            end: dateTime.date,
            lessonTime: dateTime.time,
            price: dateTime.price,
            eventType: formData.bookingType === 'REFERRED' ? 'REFERRED' : 'CLASS',
            textColor: formData.bookingType === 'REFERRED' ? '#00FF00' : '#FF0000' 
        }));

        console.log({
            teacherId: teacherId,
            studentId: studentId,
            dateTimes: formData.dateTimes,
            price: totalPrice,
            resort: formData.resort,
            children: Number(formData.children),
            adults: Number(formData.adults),
            eventList: events,
            bookingType: formData.bookingType
        });

        dispatch(createAdminBooking(
            teacherId,
            studentId,
            formData.comment,
            Number(formData.children),
            Number(formData.adults),
            events,
            totalPrice,
            formData.bookingType,
            formData.includesLaunch,
            formData.includesEquipment,
            formData.paymentStatus,
            formData.internalComment));

        setFormData({
            teacher: null,
            student: null,
            dateTimes: [{ date: '', time: 'ALL_DAY', price: '' }],
            resort: 'Cerro Catedral',
            children: 0,
            adults: 0,
            teacherSearch: '',
            bookingType: 'ASIGNADO',
            includesLaunch: false,
            includesEquipment: false,
            paymentStatus: 'PAID',
            internalComment: ''
        });
        onClose();
    };

    const handleTeacherInputChange = (event, newValue) => {
        // dispatch(getTeachers(0, "TEACHER", newValue, 0));
        const filters = formData.dateTimes.map((dateTime) => ({
            from: `${dateTime.date}T05:00:00`,
            to: `${dateTime.date}T20:00:00`,
            time: dateTime.time,
        }));
        dispatch(getTeachersAdmin(newValue, 0, filters, formData.resort));
    };

    const debouncedStudentSearch = useCallback(
        (value) => {
            dispatch(getTeachers(0, "STUDENT", value, 0));
        },
        [dispatch]
    );

    const handleStudentInputChange = (event, newValue) => {
        // Update the form data immediately for UI responsiveness
        setFormData((prevData) => ({
            ...prevData,
            studentSearch: newValue,
        }));
        
        // Debounce the API call
        const timeoutId = setTimeout(() => {
            debouncedStudentSearch(newValue);
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Student</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <Autocomplete
                                id="student-autocomplete"
                                options={teachers}
                                getOptionLabel={(option) => `${option.name} ${option.lastname}`}
                                value={formData.student}
                                onChange={(e, newValue) => {
                                    setStudentId(newValue.id);
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        student: newValue || null,
                                    }));
                                }}
                                onInputChange={handleStudentInputChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateRangePicker
                                startText="Start Date"
                                endText="End Date"
                                value={[dateRange.startDate, dateRange.endDate]}
                                onChange={(newValue) => {
                                    handleDateRangeChange(newValue[0], newValue[1]);
                                }}
                                renderInput={(startProps, endProps) => (
                                    <>
                                        <TextField {...startProps} />
                                        <Box sx={{ mx: 2 }}> to </Box>
                                        <TextField {...endProps} />
                                    </>
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Comment"
                    name="comment"
                    value={formData.comment}
                    onChange={(e) => handleFormChange(e)}
                    multiline
                    rows={2}
                />

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="resort-label">Resort</InputLabel>
                            <Select
                                labelId="resort-label"
                                id="resort-select"
                                value={formData.resort}
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    resort: e.target.value,
                                }))}
                            >
                                <MenuItem value="Cerro Catedral">Cerro Catedral</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="booking-type-label">Tipo de Reserva</InputLabel>
                            <Select
                                labelId="booking-type-label"
                                id="booking-type-select"
                                value={formData.bookingType}
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    bookingType: e.target.value,
                                }))}
                            >
                                <MenuItem value="ASSIGNED">Asignado</MenuItem>
                                <MenuItem value="REFERRED">Referida</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="payment-status-label">Estado de Pago</InputLabel>
                            <Select
                                labelId="payment-status-label"
                                id="payment-status-select"
                                value={formData.paymentStatus}
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    paymentStatus: e.target.value,
                                }))}
                            >
                                <MenuItem value="PAID">Pagado</MenuItem>
                                <MenuItem value="UNPAID">No Pagado</MenuItem>
                                <MenuItem value="PAID_10">10% Pagado</MenuItem>
                                <MenuItem value="PAID_20">20% Pagado</MenuItem>
                                <MenuItem value="PAID_30">30% Pagado</MenuItem>
                                <MenuItem value="PAID_40">40% Pagado</MenuItem>
                                <MenuItem value="PAID_50">50% Pagado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.includesLaunch}
                                        onChange={(e) => setFormData((prevData) => ({
                                            ...prevData,
                                            includesLaunch: e.target.checked,
                                        }))}
                                    />
                                }
                                label="Incluye Almuerzo"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.includesEquipment}
                                        onChange={(e) => setFormData((prevData) => ({
                                            ...prevData,
                                            includesEquipment: e.target.checked,
                                        }))}
                                    />
                                }
                                label="Incluye Equipo"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton 
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    children: Math.max(0, prev.children - 1)
                                }))}
                                color="primary"
                            >
                                -
                            </IconButton>
                            <TextField
                                sx={{ width: '100px' }}
                                label="Niños"
                                type="number"
                                name="children"
                                value={formData.children}
                                onChange={(e) => handleFormChange(e)}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                            <IconButton 
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    children: prev.children + 1
                                }))}
                                color="primary"
                            >
                                +
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton 
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    adults: Math.max(0, prev.adults - 1)
                                }))}
                                color="primary"
                            >
                                -
                            </IconButton>
                            <TextField
                                sx={{ width: '100px' }}
                                label="Adultos"
                                type="number"
                                name="adults"
                                value={formData.adults}
                                onChange={(e) => handleFormChange(e)}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />
                            <IconButton 
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    adults: prev.adults + 1
                                }))}
                                color="primary"
                            >
                                +
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Internal Comment"
                    name="internalComment"
                    value={formData.internalComment}
                    onChange={(e) => setFormData((prevData) => ({
                        ...prevData,
                        internalComment: e.target.value,
                    }))}
                    multiline
                    rows={2}
                    inputProps={{ maxLength: 255 }}
                    helperText={`${formData.internalComment.length}/255 characters`}
                />

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Selected Dates</Typography>
                {formData.dateTimes.map((dateTime, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label={`Date ${index + 1}`}
                                value={dateTime.date ? parseISO(dateTime.date) : null}
                                onChange={(newValue) => {
                                    const updatedDateTimes = [...formData.dateTimes];
                                    updatedDateTimes[index].date = newValue ? format(newValue, 'yyyy-MM-dd') : '';
                                    setFormData(prev => ({
                                        ...prev,
                                        dateTimes: updatedDateTimes
                                    }));
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth>
                            <InputLabel id={`time-label-${index}`}>Time</InputLabel>
                            <Select
                                labelId={`time-label-${index}`}
                                value={dateTime.time}
                                onChange={(e) => handleTimeChange(e.target.value, index)}
                                label="Time"
                            >
                                <MenuItem value="MORNING">Morning</MenuItem>
                                <MenuItem value="MORNING_2HS">Morning (2hs)</MenuItem>
                                <MenuItem value="AFTERNOON">Afternoon</MenuItem>
                                <MenuItem value="AFTERNOON_2HS">Afternoon (2hs)</MenuItem>
                                <MenuItem value="ALL_DAY">All Day</MenuItem>
                            </Select>
                        </FormControl>
                        <NumericFormat
                            fullWidth
                            customInput={TextField}
                            label="Price"
                            value={dateTime.price}
                            onValueChange={(values) => handlePriceChange(values.value, index)}
                            thousandSeparator=","
                            decimalSeparator="."
                            prefix="$"
                            decimalScale={2}
                            fixedDecimalScale
                        />
                        <IconButton 
                            onClick={() => handleRemoveDate(index)}
                            color="error"
                            sx={{ ml: 1 }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Teacher</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Search Teacher"
                        value={formData.teacherSearch || ''}
                        onChange={(e) => {
                            setFormData((prevData) => ({
                                ...prevData,
                                teacherSearch: e.target.value,
                            }));
                            handleTeacherInputChange(e, e.target.value);
                        }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={() => handleTeacherInputChange(null, formData.teacherSearch)}
                        sx={{ minWidth: '100px' }}
                    >
                        Search
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                        },
                        maxHeight: '400px',
                        overflowY: 'auto',
                        mb: 3
                    }}
                >
                    {teachers.map((teacher) => (
                        <Box 
                            key={teacher.id} 
                            onClick={(e) => {
                                if (e.shiftKey) {
                                    const linkTo = PATH_DASHBOARD.eCommerce.viewTeacher(teacher.id);
                                    window.open(linkTo, '_blank');
                                } else {
                                    setTeacherId(teacher.id);
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        teacher: teacher || null,
                                    }));
                                }
                            }}
                            sx={{ 
                                cursor: 'pointer',
                                border: formData.teacher?.id === teacher.id ? '2px solid #2065D1' : 'none',
                                borderRadius: '16px',
                                p: 1,
                                '&:hover': {
                                    border: '2px solid #2065D1',
                                    opacity: 0.8
                                }
                            }}
                        >
                            <ShopTeacherCard 
                                teacher={teacher} 
                                disabled={true}
                            />
                            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
                                {formData.teacher?.id === teacher.id ? 'Selected' : 'Click to select, Shift+Click to view profile'}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Create Booking</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingModal;
