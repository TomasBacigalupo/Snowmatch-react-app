import { useEffect, useState } from 'react';
import { Dialog, DialogContent, Select, TextField, FormControl, InputLabel, MenuItem, DialogActions, DialogTitle, Button, Box, Autocomplete, Typography } from '@mui/material';
import { useDispatch } from 'src/redux/store';
import { getTeachers } from 'src/redux/slices/admin';
import { useSelector } from 'react-redux';
import { createAdminBooking } from 'src/redux/slices/bookings';

const BookingModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        teacher: null,
        student: null,
        dateTimes: [{ date: '', time: '', price: '' }],
        resort: 'Cerro Catedral',
        children: 0,
        adults: 0,
        comment: ''
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
            dateTimes: [...prevData.dateTimes, { date: '', time: '', price: '' }],
        }));
    };
   

    const handleSubmit = () => {
        const totalPrice = formData.dateTimes.reduce((acc, curr) => acc + Number(curr.price), 0);
        const events = formData.dateTimes.map((dateTime) => ({
            title: 'Asignada',
            start: dateTime.date,
            end: dateTime.date,
            lessonTime: dateTime.time,
            price: dateTime.price,
            type: 'CLASS',
            textColor: '#FF0000'
        }));

        console.log({
            teacherId: teacherId,
            studentId: studentId,
            dateTimes: formData.dateTimes,
            price: totalPrice,
            resort: formData.resort,
            children: Number(formData.children),
            adults: Number(formData.adults),
            eventList: events
        });

        dispatch(createAdminBooking(
            teacherId,
            studentId,
            formData.comment,
            Number(formData.children),
            Number(formData.adults),
            events,
            totalPrice));

        setFormData({
            teacher: null,
            student: null,
            dateTimes: [{ date: '', time: '', price: '' }],
            resort: 'Cerro Catedral',
            children: 0,
            adults: 0,
        });
        onClose();
    };

    const handleTeacherInputChange = (event, newValue) => {
        dispatch(getTeachers(0, "TEACHER", newValue, 0));
    };

    const handleStudentInputChange = (event, newValue) => {
        dispatch(getTeachers(0, "STUDENT", newValue, 0));
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Create Booking</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <Typography>Teacher</Typography>
                    <Autocomplete
                        id="teacher-autocomplete"
                        options={teachers}
                        getOptionLabel={(option) => `${option.name} ${option.lastname}`}
                        value={formData.teacher}
                        onChange={(e, newValue) => {
                            setTeacherId(newValue.id);
                            setFormData((prevData) => ({
                                ...prevData,
                                teacher: newValue || null,
                            }));
                        }}
                        onInputChange={handleTeacherInputChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <Typography>Student</Typography>
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
                <FormControl fullWidth margin="normal">
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
                <TextField
                    fullWidth
                    margin="normal"
                    label="Comment"
                    name="comment"
                    value={formData.comment}
                    onChange={(e) => handleFormChange(e)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Number of Children"
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={(e) => handleFormChange(e)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Number of Adults"
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={(e) => handleFormChange(e)}
                />
                {/* Display date-time-price pairs */}
                {formData.dateTimes.map((dateTime, index) => (
                    <Box key={index} display="flex" alignItems="center">
                        <TextField
                            fullWidth
                            margin="normal"
                            label={`Date ${index + 1}`}
                            type="date"
                            name="date"
                            value={dateTime.date}
                            onChange={(e) => handleFormChange(e, index)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControl fullWidth margin="normal" sx={{ ml: 2 }}>
                            <InputLabel id={`time-label-${index}`}>Time</InputLabel>
                            <Select
                                labelId={`time-label-${index}`}
                                name="time"
                                value={dateTime.time}
                                onChange={(e) => handleFormChange(e, index)}
                            >
                                <MenuItem value="MORNING">Morning</MenuItem>
                                <MenuItem value="AFTERNOON">Afternoon</MenuItem>
                                <MenuItem value="ALL_DAY">All Day</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Price"
                            type="number"
                            name="price"
                            value={dateTime.price}
                            onChange={(e) => handleFormChange(e, index)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ ml: 2 }}
                        />
                    </Box>
                ))}
                <Button onClick={handleAddDateTime} variant="outlined" color="primary">
                    Add Date & Time
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">Create Booking</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingModal;
