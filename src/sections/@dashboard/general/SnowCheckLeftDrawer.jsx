import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { Close as CloseIcon, CheckCircle, Person, Group, Search } from '@mui/icons-material';
import useLocales from 'src/hooks/useLocales';
import { useDispatch, useSelector } from 'src/redux/store';
import { getBookings } from 'src/redux/slices/bookings';
import { getAttendanceUsers, loadMoreAttendanceUsers, clearAttendanceUsers } from 'src/redux/slices/teachers';
import { LoadingButton } from '@mui/lab';

const SnowCheckLeftDrawer = ({ open, onClose }) => {
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);
  const { 
    attendanceUsers = [], 
    attendanceUsersLoading = false, 
    attendanceUsersPagination = { page: 0, size: 5, total: 0, hasMore: false }
  } = useSelector((state) => state.teachers);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (open) {
      // Fetch today's group bookings
      const today = new Date().toISOString().split('T')[0];
      dispatch(getBookings('ACCEPTED'));
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (selectedBooking) {
      // Initialize attendance list with assigned students
      const students = selectedBooking.assignedStudents || [];
      setAttendanceList(students.map(student => ({
        ...student,
        present: false,
        notes: ''
      })));
      
      // Fetch attendance users for this booking
      const bookingDate = new Date(selectedBooking.eventList?.[0]?.start);
      const resort = selectedBooking.resort;
      dispatch(getAttendanceUsers(bookingDate, resort, '', 0, 5));
      setCurrentPage(0);
    }
  }, [selectedBooking, dispatch]);

  const todayBookings = bookings//.filter(booking => booking.eventList?.[0]?.start.split('T')[0] === new Date().toISOString().split('T')[0]);

  const filteredBookings = todayBookings.filter(booking =>
    booking.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.student?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.resort?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter students based on search term
  const filteredStudents = attendanceUsers.filter(student =>
    student.name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
  };

  const handleStudentSelect = (student) => {
    // Check if student is already in attendance list
    const existingStudent = attendanceList.find(s => s.id === student.id);
    if (!existingStudent) {
      setAttendanceList(prev => [...prev, {
        ...student,
        present: true,
        notes: ''
      }]);
    }
    setStudentSearchTerm('');
  };

  const handleSearchStudents = (searchTerm) => {
    setStudentSearchTerm(searchTerm);
    if (selectedBooking) {
      const bookingDate = new Date(selectedBooking.eventList?.[0]?.start);
      const resort = selectedBooking.resort;
      dispatch(getAttendanceUsers(bookingDate, resort, searchTerm, 0, 5));
      setCurrentPage(0);
    }
  };

  const handleLoadMoreStudents = () => {
    if (selectedBooking && attendanceUsersPagination.hasMore) {
      const nextPage = currentPage + 1;
      const bookingDate = new Date(selectedBooking.eventList?.[0]?.start);
      const resort = selectedBooking.resort;
      dispatch(loadMoreAttendanceUsers(bookingDate, resort, studentSearchTerm, nextPage, 5));
      setCurrentPage(nextPage);
    }
  };

  const handleAttendanceChange = (studentId, present) => {
    setAttendanceList(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, present } 
          : student
      )
    );
  };

  const handleNotesChange = (studentId, notes) => {
    setAttendanceList(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, notes } 
          : student
      )
    );
  };

  const removeStudentFromAttendance = (studentId) => {
    setAttendanceList(prev => prev.filter(student => student.id !== studentId));
  };

  const handleSubmitAttendance = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit attendance
      console.log('Submitting attendance:', {
        bookingId: selectedBooking.id,
        attendance: attendanceList
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message and close drawer
      onClose();
      setSelectedBooking(null);
      setAttendanceList([]);
      dispatch(clearAttendanceUsers());
    } catch (error) {
      console.error('Error submitting attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {selectedBooking && (
              <IconButton
                size="small"
                onClick={() => setSelectedBooking(null)}
                sx={{ minWidth: 'auto' }}
              >
                ←
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedBooking 
                ? translate('dashboard.snowCheck.markAttendance') 
                : translate('dashboard.snowCheck.title')
              }
            </Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {!selectedBooking ? (
          /* Booking Selection View */
          <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {translate('dashboard.snowCheck.selectBooking')}
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder={translate('dashboard.snowCheck.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            {filteredBookings.length === 0 ? (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Stack spacing={1}>
                  <Group sx={{ fontSize: 48, color: 'text.disabled' }} />
                  <Typography variant="body2" color="text.secondary">
                    {translate('dashboard.snowCheck.noBookings')}
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <List sx={{ flex: 1, overflow: 'auto' }}>
                {filteredBookings.map((booking) => (
                  <ListItem
                    key={booking.id}
                    button
                    onClick={() => handleBookingSelect(booking)}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.50'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${booking.student?.name} ${booking.student?.lastname}`}
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="body2" color="text.secondary">
                            {booking.resort}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(booking.eventList?.[0]?.start)} - {formatTime(booking.eventList?.[0]?.start)}
                          </Typography>
                          <Chip 
                            label={translate('dashboard.snowCheck.groupClass')} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ) : (
          /* Attendance View */
          <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              {selectedBooking.student?.name} {selectedBooking.student?.lastname}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {selectedBooking.resort} - {formatDate(selectedBooking.eventList?.[0]?.start)}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              {translate('dashboard.snowCheck.markAttendance')}
            </Typography>

            {/* Student Search */}
            <Autocomplete
              options={filteredStudents.filter(student => 
                !attendanceList.find(att => att.id === student.id)
              )}
              getOptionLabel={(option) => `${option.name} ${option.lastName}`}
              value={null}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleStudentSelect(newValue);
                }
              }}
              inputValue={studentSearchTerm}
              onInputChange={(event, newInputValue) => {
                handleSearchStudents(newInputValue);
              }}
              loading={attendanceUsersLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={translate('dashboard.snowCheck.searchStudents')}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Search sx={{ color: 'text.disabled', mr: 1 }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <ListItem {...props}>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${option.name} ${option.lastName}`}
                  />
                </ListItem>
              )}
              ListboxProps={{
                onScroll: (event) => {
                  const listboxNode = event.currentTarget;
                  if (
                    listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight &&
                    attendanceUsersPagination.hasMore &&
                    !attendanceUsersLoading
                  ) {
                    handleLoadMoreStudents();
                  }
                },
              }}
              sx={{ mb: 2 }}
            />

            {/* Attendance List */}
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
              {translate('dashboard.snowCheck.attendanceList')} ({attendanceList.length})
            </Typography>

            <List sx={{ flex: 1, overflow: 'auto' }}>
              {attendanceList.map((student, index) => (
                <ListItem key={student.id || index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${student.name} ${student.lastName}`}
                    secondary={
                      <TextField
                        fullWidth
                        size="small"
                        placeholder={translate('dashboard.snowCheck.notesPlaceholder')}
                        value={student.notes}
                        onChange={(e) => handleNotesChange(student.id || index, e.target.value)}
                        sx={{ mt: 1 }}
                      />
                    }
                  />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={student.present ? "contained" : "outlined"}
                      color={student.present ? "success" : "primary"}
                      size="small"
                      startIcon={student.present ? <CheckCircle /> : null}
                      onClick={() => handleAttendanceChange(student.id || index, !student.present)}
                      sx={{ minWidth: 'auto' }}
                    >
                      {student.present ? translate('dashboard.snowCheck.present') : translate('dashboard.snowCheck.absent')}
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => removeStudentFromAttendance(student.id || index)}
                      sx={{ color: 'error.main' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <LoadingButton
              fullWidth
              variant="contained"
              loading={isSubmitting}
              onClick={handleSubmitAttendance}
              disabled={attendanceList.length === 0}
            >
              {translate('dashboard.snowCheck.submitAttendance')}
            </LoadingButton>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default SnowCheckLeftDrawer; 