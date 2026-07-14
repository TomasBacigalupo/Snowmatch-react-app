import { useEffect, useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, Select, TextField, FormControl, InputLabel, MenuItem, DialogActions, DialogTitle, Button, Box, Autocomplete, Typography, IconButton, Grid, Checkbox, FormControlLabel, Chip, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { getFilteredTeachersForAdminBooking, getUserTeamMembers, searchStudentsForAdminBooking } from 'src/redux/slices/admin';
import { useSelector } from 'react-redux';
import { createAdminBooking, createAdminBookingIntent, setBookingSuccess, setIntentSuccess, createAdminBookingRentalReservation } from 'src/redux/slices/bookings';
import { fetchGroupLessonResortConfigs } from 'src/redux/slices/groupLessonResortConfig';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, parseISO, addDays } from 'date-fns';
import { NumericFormat } from 'react-number-format';
import ShopTeacherCard from 'src/sections/@dashboard/e-commerce/shop/ShopTeacherCard';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { ADMIN_BOOKING_RESORT_OPTIONS } from 'src/utils/adminBookingResortOptions';
import {
    buildRentalRenterFromClient,
    clearRentalRenterFields,
    pickTeamMemberForRental,
} from 'src/utils/adminBookingRentalPrefill';
import {
    buildRentalLinePayload,
    validateRentalFulfillment,
    validateRentalLine,
} from 'src/utils/adminGearRentalForm';
import BookingRentalFieldsSection from './BookingRentalFieldsSection';
import CreateStudentModal from './CreateStudentModal';
import AdminAgencySelect from './AdminAgencySelect';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const DEFAULT_RENTAL = {
    itemId: '',
    variantId: '',
    startDate: '',
    endDate: '',
    unitsReserved: 1,
    renterFirstName: '',
    renterLastName: '',
    renterHeightCm: '',
    renterWeightKg: '',
    renterFootLengthCm: '',
    renterSkiLevel: 'INTERMEDIATE',
    rentalFulfillment: 'PICKUP_IN_SHOP',
    rentalDestinationType: 'HOTEL_OR_CABIN',
    rentalDestinationDetail: '',
};

const DEFAULT_FORM_DATA = {
    teacher: null,
    student: null,
    dateTimes: [{ date: '', time: 'ALL_DAY', price: '' }],
    resort: 'CERRO_CATEDRAL',
    children: 0,
    adults: 0,
    comment: '',
    teacherSearch: '',
    studentSearch: '',
    bookingType: 'ASSIGNED',
    includesLaunch: false,
    includesEquipment: false,
    showPriceToTeacher: true,
    needTeacherInvoice: false,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    internalComment: '',
    groupLessonOffer: null,
    agencyId: null,
    rental: { ...DEFAULT_RENTAL },
};

const BookingModal = ({ isOpen, onClose, refreshBookings, filterTeacherId, filterStudentId, filterMonth, page, rowsPerPage, filterResort }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ ...DEFAULT_FORM_DATA });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const [teacherId, setTeacherId] = useState(null);
    const [studentId, setStudentId] = useState(null);
    const [studentOptions, setStudentOptions] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [createStudentOpen, setCreateStudentOpen] = useState(false);
    const [rentalPrefillSource, setRentalPrefillSource] = useState('');

    const { teachers } = useSelector((state) => state.admin);
    const { intentSuccess, error } = useSelector((state) => state.bookings);
    const groupLessonOffers = useSelector((state) => state.groupLessonResortConfig?.items || []);

    const resolvedStudentId = formData.student?.id ?? studentId;
    const resolvedTeacherId = formData.teacher?.id ?? teacherId;
    const isGroupLessonProduct = Boolean(formData.groupLessonOffer?.id);
    const willCreateConfirmedBooking = Boolean(resolvedStudentId && resolvedTeacherId && !isGroupLessonProduct);

    const studentAutocompleteOptions = useMemo(() => {
        const selected = formData.student;
        if (!selected?.id) return studentOptions;
        if (studentOptions.some((s) => s?.id === selected.id)) return studentOptions;
        return [selected, ...studentOptions];
    }, [formData.student, studentOptions]);

    const lessonDateBounds = useMemo(() => {
        const dates = formData.dateTimes.map((dt) => dt.date).filter(Boolean).sort();
        return {
            min: dates[0] || '',
            max: dates[dates.length - 1] || '',
        };
    }, [formData.dateTimes]);

    const offersForResort = useMemo(() => {
        const resort = formData.resort;
        if (!resort) return groupLessonOffers;
        return groupLessonOffers.filter((offer) => offer?.resort === resort);
    }, [groupLessonOffers, formData.resort]);

    const resetForm = useCallback(() => {
        setFormData({ ...DEFAULT_FORM_DATA, rental: { ...DEFAULT_RENTAL }, groupLessonOffer: null });
        setDateRange({ startDate: null, endDate: null });
        setTeacherId(null);
        setStudentId(null);
        setStudentOptions([]);
        setRentalPrefillSource('');
    }, []);

    const applyRentalFromStudent = useCallback(async (student) => {
        if (!student?.id) return;

        let teamMember = null;
        try {
            const teamMembers = await dispatch(getUserTeamMembers(student.id));
            teamMember = pickTeamMemberForRental(student, teamMembers);
        } catch {
            teamMember = null;
        }

        const renterPatch = buildRentalRenterFromClient(student, teamMember);
        setFormData((prev) => ({
            ...prev,
            rental: {
                ...prev.rental,
                ...renterPatch,
            },
        }));
        setRentalPrefillSource(
            teamMember
                ? t('adminBookings.rental.prefilledFromClientWithMember', {
                      name: `${student.name} ${student.lastname}`.trim(),
                  })
                : t('adminBookings.rental.prefilledFromClient', {
                      name: `${student.name} ${student.lastname}`.trim(),
                  })
        );
    }, [dispatch, t]);

    useEffect(() => {
        if (intentSuccess) {
            enqueueSnackbar('Reserva pendiente guardada.', { variant: 'success' });
            resetForm();
            dispatch(setIntentSuccess(false));
            onClose();
        }
    }, [intentSuccess, dispatch, enqueueSnackbar, onClose, resetForm]);

    useEffect(() => {
        if(isOpen){
            dispatch(setBookingSuccess(false));
            dispatch(setIntentSuccess(false));
            dispatch(fetchGroupLessonResortConfigs());
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
                dateTimes: dates,
                rental: {
                    ...prev.rental,
                    startDate: dates[0]?.date || prev.rental.startDate,
                    endDate: dates[dates.length - 1]?.date || prev.rental.endDate,
                },
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

    const validateRental = () => {
        const { rental } = formData;
        const lineError = validateRentalLine(rental, t);
        if (lineError) return lineError;
        return validateRentalFulfillment(rental, t);
    };

    const buildRentalPayload = () => buildRentalLinePayload(formData.rental);

    const handleSubmit = async () => {
        const totalPrice = formData.dateTimes.reduce((acc, curr) => acc + Number(curr.price), 0);
        const events = formData.dateTimes.map((dateTime) => ({
            title: formData.bookingType === 'REFERRED' ? 'Referida' : 'Asignada',
            start: dateTime.date,
            end: dateTime.date,
            lessonTime: dateTime.time,
            price: dateTime.price,
            eventType: formData.bookingType === 'REFERRED' ? 'REFERRED' : 'CLASS',
            textColor: formData.bookingType === 'REFERRED' ? '#00FF00' : '#FF0000',
        }));

        const selectedStudentId = formData.student?.id ?? studentId;
        const selectedTeacherId = formData.teacher?.id ?? teacherId;

        // Typed a name but did not pick a client from the dropdown — do not silently save an intent.
        if (!selectedStudentId && formData.studentSearch?.trim()) {
            enqueueSnackbar(
                t('adminBookings.createModal.selectClientFromList', {
                    defaultValue: 'Select a client from the list (typing a name is not enough).',
                }),
                { variant: 'warning' }
            );
            return;
        }

        // Rental reservations only attach to confirmed bookings (not group-lesson intents).
        if (formData.includesEquipment && !isGroupLessonProduct) {
            if (selectedStudentId && selectedTeacherId) {
                const rentalError = validateRental();
                if (rentalError) {
                    enqueueSnackbar(rentalError, { variant: 'warning' });
                    return;
                }
            } else {
                enqueueSnackbar(t('adminBookings.rental.requiresConfirmedBooking'), { variant: 'warning' });
                return;
            }
        }

        // Client + instructor (non-group) → confirmed booking. Anything else → pending intent.
        if (selectedStudentId && selectedTeacherId && !isGroupLessonProduct) {
            setSubmitting(true);
            try {
                const { rental } = formData;
                const created = await dispatch(
                    createAdminBooking(
                        selectedTeacherId,
                        selectedStudentId,
                        formData.comment,
                        Number(formData.children),
                        Number(formData.adults),
                        events,
                        totalPrice,
                        formData.bookingType,
                        formData.includesLaunch,
                        formData.includesEquipment,
                        formData.showPriceToTeacher,
                        formData.needTeacherInvoice,
                        formData.paymentStatus,
                        formData.paymentMethod,
                        formData.internalComment,
                        formData.resort,
                        formData.includesEquipment ? rental.rentalFulfillment : null,
                        formData.includesEquipment ? rental.rentalDestinationType : null,
                        formData.includesEquipment ? rental.rentalDestinationDetail : null,
                        null,
                        null,
                        formData.agencyId
                    )
                );

                const bookingId = created?.id;
                if (formData.includesEquipment && bookingId) {
                    try {
                        await dispatch(createAdminBookingRentalReservation(bookingId, buildRentalPayload()));
                    } catch (rentalErr) {
                        enqueueSnackbar(
                            t('adminBookings.rental.bookingCreatedRentalFailed', { id: bookingId }),
                            { variant: 'error' }
                        );
                        return;
                    }
                }

                enqueueSnackbar(
                    formData.includesEquipment
                        ? t('adminBookings.rental.bookingWithRentalSuccess')
                        : 'Booking created successfully',
                    { variant: 'success' }
                );
                resetForm();
                onClose();
            } catch (bookingErr) {
                enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
            } finally {
                setSubmitting(false);
            }
            return;
        }

        dispatch(createAdminBookingIntent(
            selectedStudentId ?? null,
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
            formData.resort,
            isGroupLessonProduct ? null : (selectedTeacherId ?? null),
            formData.groupLessonOffer?.id ?? null,
            formData.groupLessonOffer?.resort ?? null,
            formData.agencyId));
    };

    const handleGroupLessonOfferChange = (offer) => {
        // Group class products stay unassigned until an instructor is chosen on convert.
        if (offer) {
            setTeacherId(null);
        }
        setFormData((prev) => {
            const next = {
                ...prev,
                groupLessonOffer: offer,
            };
            if (offer) {
                next.teacher = null;
                next.teacherSearch = '';
            }
            if (offer?.resort) {
                next.resort = offer.resort;
            }
            if (offer?.price != null && Number.isFinite(Number(offer.price))) {
                const price = String(offer.price);
                next.dateTimes = prev.dateTimes.map((dt) => ({
                    ...dt,
                    price: dt.price || price,
                }));
            }
            if (offer?.includesGear) {
                next.includesEquipment = true;
            }
            return next;
        });
    };

    const handleRentalChange = useCallback((patch) => {
        setFormData((prev) => ({
            ...prev,
            rental: { ...prev.rental, ...patch },
        }));
    }, []);

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
        async (value) => {
            try {
                const results = await dispatch(searchStudentsForAdminBooking(value));
                setStudentOptions(Array.isArray(results) ? results : []);
            } catch {
                setStudentOptions([]);
            }
        },
        [dispatch]
    );

    const handleStudentInputChange = (event, newValue) => {
        const selected = formData.student;
        const selectedLabel = selected
            ? `${selected.name || ''} ${selected.lastname || ''}`.trim()
            : '';
        const clearingSelection = Boolean(selected && newValue !== selectedLabel);

        if (clearingSelection) {
            setStudentId(null);
        }
        setFormData((prevData) => ({
            ...prevData,
            studentSearch: newValue,
            ...(clearingSelection ? { student: null } : {}),
        }));

        const timeoutId = setTimeout(() => {
            debouncedStudentSearch(newValue);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    const handleStudentCreated = (createdStudent) => {
        const student = {
            id: createdStudent.id,
            name: createdStudent.name,
            lastname: createdStudent.lastname,
            email: createdStudent.email,
            cellphone: createdStudent.cellphone,
            studentLevel: createdStudent.studentLevel,
        };
        setStudentId(student.id);
        setStudentOptions((prev) => (prev.some((s) => s?.id === student.id) ? prev : [student, ...prev]));
        setFormData((prevData) => ({
            ...prevData,
            student,
            studentSearch: `${student.name} ${student.lastname}`.trim(),
        }));
        applyRentalFromStudent(student);
        enqueueSnackbar(t('adminBookings.createStudent.success'), { variant: 'success' });
    };

    const handleStudentChange = (newValue) => {
        setStudentId(newValue?.id ?? null);
        if (!newValue) {
            setRentalPrefillSource('');
            setFormData((prevData) => ({
                ...prevData,
                student: null,
                studentSearch: '',
                rental: clearRentalRenterFields(prevData.rental),
            }));
            return;
        }

        setFormData((prevData) => ({
            ...prevData,
            student: newValue,
            studentSearch: `${newValue.name} ${newValue.lastname}`.trim(),
        }));
        applyRentalFromStudent(newValue);
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
                <Typography variant="h6" sx={{ mb: 2 }}>Estudiante</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Opcional para una reserva pendiente (intent). Con instructor y sin estudiante se guarda pendiente con el instructor en el calendario. Con ambos se crea una reserva confirmada.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <FormControl fullWidth>
                                <Autocomplete
                                    id="student-autocomplete"
                                    options={studentAutocompleteOptions}
                                    filterOptions={(options) => options}
                                    getOptionLabel={(option) =>
                                        option ? `${option.name || ''} ${option.lastname || ''}`.trim() : ''
                                    }
                                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    value={formData.student}
                                    inputValue={formData.studentSearch}
                                    onChange={(e, newValue) => handleStudentChange(newValue)}
                                    onInputChange={(event, newValue, reason) => {
                                        if (reason === 'input' || reason === 'clear') {
                                            handleStudentInputChange(event, newValue);
                                        }
                                    }}
                                    noOptionsText={t('adminBookings.createStudent.noResults')}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={t('adminBookings.createStudent.searchLabel')}
                                            placeholder={t('adminBookings.createStudent.searchPlaceholder')}
                                        />
                                    )}
                                />
                            </FormControl>
                            <Button
                                variant="outlined"
                                onClick={() => setCreateStudentOpen(true)}
                                sx={{ minWidth: 44, px: 1, mt: 0.5 }}
                                title={t('adminBookings.createStudent.openButton')}
                            >
                                <PersonAddIcon />
                            </Button>
                        </Stack>
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
                                    groupLessonOffer:
                                        prevData.groupLessonOffer?.resort === e.target.value
                                            ? prevData.groupLessonOffer
                                            : null,
                                }))}
                            >
                                {ADMIN_BOOKING_RESORT_OPTIONS.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            options={offersForResort}
                            value={formData.groupLessonOffer}
                            onChange={(e, newValue) => handleGroupLessonOfferChange(newValue)}
                            getOptionLabel={(option) => {
                                if (!option) return '';
                                const title = option.title || option.resortDisplayName || option.resort || '';
                                const price =
                                    option.price != null
                                        ? ` · ${option.currency || 'ARS'} ${option.price}`
                                        : '';
                                return `${title}${price}`.trim();
                            }}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('adminBookings.createModal.groupLessonProduct', {
                                        defaultValue: 'Group lesson product (optional)',
                                    })}
                                    helperText={t('adminBookings.createModal.groupLessonProductHelper', {
                                        defaultValue:
                                            'Same published offers students book in the app. Links this booking to that product.',
                                    })}
                                />
                            )}
                        />
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
                        <AdminAgencySelect
                            value={formData.agencyId}
                            onChange={(agencyId) => setFormData((prevData) => ({ ...prevData, agencyId }))}
                        />
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
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                includesEquipment: checked,
                                                rental: checked
                                                    ? {
                                                        ...DEFAULT_RENTAL,
                                                        startDate: lessonDateBounds.min,
                                                        endDate: lessonDateBounds.max,
                                                    }
                                                    : { ...DEFAULT_RENTAL },
                                            }));
                                            if (checked && formData.student) {
                                                applyRentalFromStudent(formData.student);
                                            } else if (!checked) {
                                                setRentalPrefillSource('');
                                            }
                                        }}
                                    />
                                }
                                label={t('adminBookings.editModal.includesEquipment')}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.showPriceToTeacher}
                                        onChange={(e) => setFormData((prevData) => ({
                                            ...prevData,
                                            showPriceToTeacher: e.target.checked,
                                        }))}
                                    />
                                }
                                label={t('adminBookings.editModal.showPriceToTeacher')}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.needTeacherInvoice}
                                        onChange={(e) => setFormData((prevData) => ({
                                            ...prevData,
                                            needTeacherInvoice: e.target.checked,
                                        }))}
                                    />
                                }
                                label={t('adminBookings.editModal.needTeacherInvoice')}
                            />
                        </Box>
                    </Grid>
                    {formData.includesEquipment && (
                        <Grid item xs={12}>
                            <BookingRentalFieldsSection
                                rental={formData.rental}
                                onChange={handleRentalChange}
                                resort={formData.resort}
                                lessonMinDate={lessonDateBounds.min}
                                lessonMaxDate={lessonDateBounds.max}
                                prefillHint={rentalPrefillSource}
                            />
                        </Grid>
                    )}
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
                    loading={submitting}
                >
                    {willCreateConfirmedBooking ? 'Create Booking' : 'Guardar pendiente'}
                </LoadingButton>
            </DialogActions>
            <CreateStudentModal
                open={createStudentOpen}
                onClose={() => setCreateStudentOpen(false)}
                onCreated={handleStudentCreated}
                initialName={formData.studentSearch}
            />
        </Dialog>
    );
};

export default BookingModal;
