import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, Select, TextField, FormControl, InputLabel, MenuItem, DialogActions, DialogTitle, Button, Box, Autocomplete, Typography, IconButton, Grid, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { getTeachers, getFilteredTeachersForAdminBooking, createBookingSuccess, clearSuccessMessage } from 'src/redux/slices/admin';
import { useSelector } from 'react-redux';
import { createAdminBooking, setBookingSuccess } from 'src/redux/slices/bookings';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO, addDays, isWithinInterval } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import ShopTeacherCard from 'src/sections/@dashboard/e-commerce/shop/ShopTeacherCard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSnackbar } from 'notistack';

const BookingModal = ({ isOpen, onClose, refreshBookings, filterTeacherId, filterStudentId, filterMonth, page, rowsPerPage, filterResort }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        teacher: null,
        student: null,
        dateTimes: [{ date: '', time: 'ALL_DAY', price: '' }],
        resort: 'Cerro Catedral',
        children: 0,
        adults: 0,
        comment: '',
        teacherSearch: '',
        studentSearch: '',
        bookingType: 'ASSIGNED',
        includesLaunch: false,
        includesEquipment: false,
        paymentStatus: 'PAID',
        paymentMethod: 'CASH',
        internalComment: ''
    });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const [teacherId, setTeacherId] = useState(null);
    const [studentId, setStudentId] = useState(null);

    const { teachers, successMessage } = useSelector((state) => state.admin);
    const { bookSuccess, isLoading, error } = useSelector((state) => state.bookings);

    console.log('Current state:', { bookSuccess, teacherId, isOpen });

    useEffect(() => {
        // Only call getTeachers when studentSearch changes, not when student is selected
        if (formData.studentSearch) {
            dispatch(getTeachers(1, "STUDENT", formData.studentSearch, 0))
        }
    }, [formData.studentSearch])

    // Handle booking creation success
    useEffect(() => {
        console.log('useEffect bookSuccess triggered:', { bookSuccess, teacherId });
        if (bookSuccess && teacherId) {
            console.log('Closing modal due to successful booking');
            enqueueSnackbar('Booking created successfully', { variant: 'success' }); 
            
            // Reset form and close modal
            setFormData({
                teacher: null,
                student: null,
                dateTimes: [{ date: '', time: 'ALL_DAY', price: '' }],
                resort: 'Cerro Catedral',
                children: 0,
                adults: 0,
                teacherSearch: '',
                studentSearch: '',
                bookingType: 'ASSIGNED',
                includesLaunch: false,
                includesEquipment: false,
                paymentStatus: 'PAID',
                paymentMethod: 'CASH',
                internalComment: ''
            });

            setDateRange({ startDate: null, endDate: null });
            setTeacherId(null);
            setStudentId(null);

            onClose();
        }
    }, [bookSuccess, teacherId, dispatch, enqueueSnackbar, onClose]);

    useEffect(() => {
        if(isOpen){
            dispatch(setBookingSuccess(false))
        }
    },[isOpen, dispatch])

    // Handle booking creation error
    useEffect(() => {
        if (error) {
            enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
        }
    }, [error, enqueueSnackbar]);

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
            formData.paymentMethod,
            formData.internalComment,
            formData.resort));
    };

    const handleTeacherInputChange = (event, newValue) => {
        dispatch(
            getFilteredTeachersForAdminBooking({
                nameSearch: newValue,
                resort: formData.resort,
                dateTimes: formData.dateTimes,
            })
        );
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
        <Dialog 
            open={isOpen} 
            onClose={(event, reason) => {
                console.log('Dialog onClose called with reason:', reason);
                onClose();
            }} 
            maxWidth="md" 
            fullWidth
        >
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
                                localeText={{ start: 'Start Date', end: 'End Date' }}
                                value={[dateRange.startDate, dateRange.endDate]}
                                onChange={(newValue) => {
                                    handleDateRangeChange(newValue[0], newValue[1]);
                                }}
                                slotProps={{ textField: { fullWidth: true } }}
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
                                <MenuItem value="Portillo">Portillo</MenuItem>
                                <MenuItem value="La Parva">La Parva</MenuItem>
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
                        <FormControl fullWidth>
                            <InputLabel id="payment-method-label">Método de Pago</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                id="payment-method-select"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData((prevData) => ({
                                    ...prevData,
                                    paymentMethod: e.target.value,
                                }))}
                            >
                                <MenuItem value="CASH">Efectivo</MenuItem>
                                <MenuItem value="TRANSFER">Transferencia</MenuItem>
                                <MenuItem value="DEBIT_CARD">Tarjeta de Débito</MenuItem>
                                <MenuItem value="CREDIT_CARD">Tarjeta de Crédito</MenuItem>
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
                                slotProps={{ textField: { fullWidth: true } }}
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
                                <MenuItem value="MORNING_2_HS">Morning (2hs)</MenuItem>
                                <MenuItem value="AFTERNOON">Afternoon</MenuItem>
                                <MenuItem value="AFTERNOON_2_HS">Afternoon (2hs)</MenuItem>
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, mb: 2 }}>
                    <Typography variant="h6">Teacher</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                            label="Grupal" 
                            onClick={() => {
                                console.log('Grupal chip clicked, setting teacherId to 1117');
                                setTeacherId(1117);
                                setFormData((prevData) => ({
                                    ...prevData,
                                    teacher: { id: 1117, name: 'Grupal', lastname: '' } || null,
                                }));
                            }}
                            color={teacherId === 1117 ? "primary" : "default"}
                            variant={teacherId === 1117 ? "filled" : "outlined"}
                        />
                        <Chip 
                            label="Escuelita" 
                            onClick={() => {
                                console.log('Escuelita chip clicked, setting teacherId to 1118');
                                setTeacherId(1118);
                                setFormData((prevData) => ({
                                    ...prevData,
                                    teacher: { id: 1118, name: 'Escuelita', lastname: '' } || null,
                                }));
                            }}
                            color={teacherId === 1118 ? "primary" : "default"}
                            variant={teacherId === 1118 ? "filled" : "outlined"}
                        />
                    </Box>
                </Box>
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
                                console.log('Teacher clicked:', teacher.id, 'Shift key:', e.shiftKey);
                                if (e.shiftKey) {
                                    const linkTo = PATH_DASHBOARD.eCommerce.viewTeacher(teacher.id);
                                    window.open(linkTo, '_blank');
                                } else {
                                    console.log('Setting teacherId to:', teacher.id);
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
                <LoadingButton 
                    onClick={handleSubmit} 
                    variant="contained" 
                    loading={isLoading}
                >
                    Create Booking
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

export default BookingModal;
