import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
  TableRow,
  TableCell,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Autocomplete,
  FormControl,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { convertBookingIntent, cancelBookingIntent, getTeachers } from 'src/redux/slices/admin';
import axios from 'src/utils/axios';
import Label from '../../../../components/Label';
import BookingDetailsDrawer from './BookingDetailsDrawer';
import { normalizeBookingIntent } from 'src/utils/normalizeBookingIntent';
import { formatAdminBookingResortLabel } from '../../../../utils/adminBookingResortOptions';
import { getBookingCustomerLabel, isGroupLessonBooking, getGroupLessonOfferLabel } from '../../../../utils/adminBookingParticipants';

AdminBookingIntentTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onRefreshIntents: PropTypes.func,
};

function localDateKey(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatEventSlotLabel(event) {
  if (!event) return '';
  const start = event.start ? new Date(event.start) : null;
  const end = event.end ? new Date(event.end) : null;
  const datePart = start
    ? start.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';
  const timePart =
    start && end
      ? `${start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}–${end.toLocaleTimeString('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      : '';
  const title = event.title || event.type || 'Event';
  const roster =
    event.maxStudents != null
      ? ` · max ${event.maxStudents}`
      : '';
  return `#${event.id} ${title} · ${datePart} ${timePart}${roster}`.trim();
}

export default function AdminBookingIntentTableRow({ row, onRefreshIntents }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.admin);
  /** 'teacher' | 'student' | null */
  const [assignMode, setAssignMode] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTargetEvent, setSelectedTargetEvent] = useState(null);
  const [teacherEventOptions, setTeacherEventOptions] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [studentOptions, setStudentOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    id,
    student,
    teacher,
    price,
    resort,
    adults,
    children,
    lines = [],
    internalComment,
    paymentStatus,
    includesLaunch,
    includesEquipments,
  } = row;
  const isGroupLesson = isGroupLessonBooking(row);
  const groupOfferLabel = getGroupLessonOfferLabel(row);
  const hasTeacher = teacher?.id != null;
  const needsStudentForConvert = !student || student.id == null;
  const needsAssignStudentOnly = hasTeacher && needsStudentForConvert;
  const customerLabel = getBookingCustomerLabel(row);
  const studentId = student?.id;
  const teacherLabel = teacher
    ? `${teacher.name || ''} ${teacher.lastname || ''}`.trim() || t('adminBookings.intent.unassigned')
    : t('adminBookings.intent.unassigned');
  const assignOpen = assignMode != null;
  const isAssignStudentMode = assignMode === 'student';

  useEffect(() => {
    if (assignMode === 'teacher') {
      dispatch(getTeachers(0, 'TEACHER', '', 0));
    }
  }, [assignMode, dispatch]);

  useEffect(() => {
    if (!assignOpen || !needsStudentForConvert) {
      setStudentOptions([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get('/api/admin/filter?page=1&role=STUDENT&level=0&name=');
        if (!cancelled) {
          setStudentOptions(Array.isArray(res.data) ? res.data : []);
        }
      } catch {
        if (!cancelled) setStudentOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assignOpen, needsStudentForConvert]);

  const teacherIdForEvents = isAssignStudentMode ? teacher?.id : selectedTeacher?.id;

  useEffect(() => {
    if (!assignOpen || teacherIdForEvents == null) {
      setTeacherEventOptions([]);
      setSelectedTargetEvent(null);
      return undefined;
    }
    let cancelled = false;
    const months = new Set();
    const intentDays = new Set();
    (lines || []).forEach((line) => {
      const d = new Date(line.startAt || line.endAt);
      if (Number.isNaN(d.getTime())) return;
      months.add(d.getMonth() + 1);
      const dayKey = localDateKey(d);
      if (dayKey) intentDays.add(dayKey);
    });
    if (months.size === 0) {
      months.add(new Date().getMonth() + 1);
    }
    (async () => {
      setLoadingEvents(true);
      try {
        const results = await Promise.all(
          Array.from(months).map((month) =>
            axios.get(`/api/events/byUser/${teacherIdForEvents}?page=1&size=300&month=${month}`)
          )
        );
        if (cancelled) return;
        const byId = new Map();
        results.forEach((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          list.forEach((ev) => {
            if (ev?.id == null) return;
            if (ev.eventType === 'DOFF') return;
            if (intentDays.size > 0) {
              const evDay = localDateKey(ev.start);
              if (!evDay || !intentDays.has(evDay)) return;
            }
            byId.set(ev.id, ev);
          });
        });
        const sorted = Array.from(byId.values()).sort((a, b) => {
          const aStart = a.start ? new Date(a.start).getTime() : 0;
          const bStart = b.start ? new Date(b.start).getTime() : 0;
          return aStart - bStart;
        });
        setTeacherEventOptions(sorted);
      } catch {
        if (!cancelled) setTeacherEventOptions([]);
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [assignOpen, teacherIdForEvents, lines]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const dateRange = () => {
    if (!lines.length) return '—';
    const dates = lines.map((l) => new Date(l.endAt || l.startAt));
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getHours = () => {
    if (!lines.length) return '—';

    let totalHours = 0;
    lines.forEach((line) => {
      const start = new Date(line.startAt);
      const end = new Date(line.endAt || line.startAt);
      const durationInHours = (end - start) / (1000 * 60 * 60);
      if (durationInHours === 4) {
        totalHours += 3;
      } else if (durationInHours > 5) {
        totalHours += 6;
      } else {
        totalHours += durationInHours;
      }
    });

    return t('adminBookings.row.hoursCount', { count: Math.round(totalHours) });
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p || 0);

  const getResortLabel = (resortValue) => {
    if (resortValue === 'CERRO_CATEDRAL') return 'Catedral';
    return formatAdminBookingResortLabel(resortValue, t);
  };

  const truncateComment = (comment, maxLength = 20) => {
    if (!comment) return '—';
    if (comment.length <= maxLength) return comment;
    return `${comment.slice(0, maxLength)}…`;
  };

  const handleConvert = async () => {
    const tid = isAssignStudentMode ? teacher?.id : selectedTeacher?.id;
    if (!tid) {
      return;
    }
    if (needsStudentForConvert && !selectedStudent?.id) {
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(
        convertBookingIntent(
          id,
          tid,
          async () => {
            if (onRefreshIntents) await onRefreshIntents();
          },
          needsStudentForConvert ? selectedStudent?.id : undefined,
          selectedTargetEvent?.id
        )
      );
      setAssignMode(null);
      setSelectedTeacher(null);
      setSelectedStudent(null);
      setSelectedTargetEvent(null);
      setOpenDrawer(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAssign = () => {
    setAssignMode(null);
    setSelectedTeacher(null);
    setSelectedStudent(null);
    setSelectedTargetEvent(null);
  };

  const handleCancelIntent = async () => {
    if (!window.confirm(t('adminBookings.intent.cancelConfirm'))) return;
    setSubmitting(true);
    try {
      await dispatch(
        cancelBookingIntent(id, async () => {
          if (onRefreshIntents) await onRefreshIntents();
        })
      );
      setOpenDrawer(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRowClick = (event) => {
    if (event.target.closest('button') || event.target.closest('.MuiButton-root')) {
      return;
    }
    setOpenDrawer(true);
  };

  const handleRefresh = () => {
    if (onRefreshIntents) onRefreshIntents();
  };

  const normalizedBooking = normalizeBookingIntent(row);

  const confirmDisabled = isAssignStudentMode
    ? !selectedStudent?.id
    : !selectedTeacher || (needsStudentForConvert && !selectedStudent?.id);

  return (
    <>
      <TableRow
        hover
        onClick={handleRowClick}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            I-{id}
          </Typography>
          {isGroupLesson && (
            <Typography variant="caption" color="primary.main" display="block">
              {t('adminBookings.intent.groupLessonBadge')}
              {groupOfferLabel ? ` · ${groupOfferLabel}` : ''}
            </Typography>
          )}
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            {customerLabel}
          </Typography>
          {studentId != null && (
            <Typography variant="caption" color="text.secondary">
              ID: {studentId}
            </Typography>
          )}
        </TableCell>

        <TableCell align="left">
          <Typography
            variant="subtitle2"
            noWrap
            color={hasTeacher ? 'text.primary' : 'text.secondary'}
          >
            {teacherLabel}
          </Typography>
          {hasTeacher && teacher?.id != null && (
            <Typography variant="caption" color="text.secondary">
              ID: {teacher.id}
            </Typography>
          )}
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{lines.length || 0}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{getHours()}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{dateRange()}</Typography>
        </TableCell>

        <TableCell align="left">{getResortLabel(resort || row.groupLessonResort)}</TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">
            {t('adminBookings.row.adultsCount', { count: adults || 0 })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('adminBookings.row.childrenCount', { count: children || 0 })}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2" color="primary.main">
            {formatPrice(price)}
          </Typography>
        </TableCell>

        <TableCell align="left">
          {internalComment && internalComment.length > 20 ? (
            <Tooltip title={internalComment} arrow>
              <Typography variant="body2" noWrap sx={{ cursor: 'help' }}>
                {truncateComment(internalComment)}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2" noWrap>
              {truncateComment(internalComment)}
            </Typography>
          )}
        </TableCell>

        <TableCell align="left">
          <Typography variant="body2">
            {includesLaunch ? t('adminBookings.row.withLunch') : t('adminBookings.row.withoutLunch')}
            {includesEquipments
              ? ` ${t('adminBookings.row.withEquipment')}`
              : ` ${t('adminBookings.row.withoutEquipment')}`}
          </Typography>
        </TableCell>

        <TableCell align="left">
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (paymentStatus === 'PENDING' && 'warning') ||
              (paymentStatus === 'PAID' && 'success') ||
              'error'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {paymentStatus || 'PENDING'}
          </Label>
        </TableCell>

        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {needsAssignStudentOnly ? (
              <Button size="small" variant="contained" onClick={() => setAssignMode('student')}>
                {t('adminBookings.intent.assignStudent')}
              </Button>
            ) : (
              <Button size="small" variant="contained" onClick={() => setAssignMode('teacher')}>
                {t('adminBookings.intent.assignInstructor')}
              </Button>
            )}
            <Button size="small" color="error" onClick={handleCancelIntent} disabled={submitting}>
              {t('adminBookings.intent.cancel')}
            </Button>
          </Box>
        </TableCell>
      </TableRow>

      <BookingDetailsDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        booking={normalizedBooking}
        rawIntent={row}
        isIntent
        refreshBookings={handleRefresh}
        onAssignStudent={needsAssignStudentOnly ? () => setAssignMode('student') : undefined}
      />

      <Dialog open={assignOpen} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isAssignStudentMode
            ? t('adminBookings.intent.assignStudentDialogTitle')
            : t('adminBookings.intent.assignDialogTitle')}
        </DialogTitle>
        <DialogContent>
          {isAssignStudentMode ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                {teacherLabel}
                {teacher?.id != null ? ` · ID: ${teacher.id}` : ''}
              </Typography>
              <FormControl fullWidth>
                <Autocomplete
                  autoFocus
                  options={studentOptions}
                  value={selectedStudent}
                  onChange={(e, newValue) => setSelectedStudent(newValue)}
                  onInputChange={async (e, newInputValue) => {
                    try {
                      const res = await axios.get(
                        `/api/admin/filter?page=1&role=STUDENT&level=0&name=${encodeURIComponent(
                          newInputValue || ''
                        )}`
                      );
                      setStudentOptions(Array.isArray(res.data) ? res.data : []);
                    } catch {
                      setStudentOptions([]);
                    }
                  }}
                  getOptionLabel={(option) =>
                    `${option?.name || ''} ${option?.lastname || ''}`.trim() ||
                    String(option?.id ?? '')
                  }
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label={t('adminBookings.intent.studentRequired')}
                      placeholder={t('adminBookings.intent.studentPlaceholder')}
                      helperText={t('adminBookings.intent.studentAssignHelper')}
                    />
                  )}
                />
              </FormControl>
              {teacherIdForEvents != null ? (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Autocomplete
                    options={teacherEventOptions}
                    loading={loadingEvents}
                    value={selectedTargetEvent}
                    onChange={(e, newValue) => setSelectedTargetEvent(newValue)}
                    getOptionLabel={(option) => formatEventSlotLabel(option)}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        label={t('adminBookings.intent.groupSlot')}
                        placeholder={t('adminBookings.intent.groupSlotPlaceholder')}
                        helperText={t('adminBookings.intent.groupSlotHelper')}
                      />
                    )}
                  />
                </FormControl>
              ) : null}
            </>
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 0.5 }}>
                <Autocomplete
                  autoFocus
                  options={teachers || []}
                  value={selectedTeacher}
                  onChange={(e, newValue) => {
                    setSelectedTeacher(newValue);
                    setSelectedTargetEvent(null);
                  }}
                  onInputChange={(e, newInputValue) => {
                    dispatch(getTeachers(0, 'TEACHER', newInputValue, 0));
                  }}
                  getOptionLabel={(option) =>
                    `${option?.name || ''} ${option?.lastname || ''}`.trim() ||
                    String(option?.id ?? '')
                  }
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label={t('adminBookings.intent.instructor')}
                      placeholder={t('adminBookings.intent.instructorPlaceholder')}
                      helperText={t('adminBookings.intent.instructorHelper')}
                    />
                  )}
                />
              </FormControl>
              {needsStudentForConvert ? (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Autocomplete
                    options={studentOptions}
                    value={selectedStudent}
                    onChange={(e, newValue) => setSelectedStudent(newValue)}
                    onInputChange={async (e, newInputValue) => {
                      try {
                        const res = await axios.get(
                          `/api/admin/filter?page=1&role=STUDENT&level=0&name=${encodeURIComponent(
                            newInputValue || ''
                          )}`
                        );
                        setStudentOptions(Array.isArray(res.data) ? res.data : []);
                      } catch {
                        setStudentOptions([]);
                      }
                    }}
                    getOptionLabel={(option) =>
                      `${option?.name || ''} ${option?.lastname || ''}`.trim() ||
                      String(option?.id ?? '')
                    }
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        label={t('adminBookings.intent.studentRequired')}
                        placeholder={t('adminBookings.intent.studentPlaceholder')}
                        helperText={t('adminBookings.intent.studentHelper')}
                      />
                    )}
                  />
                </FormControl>
              ) : null}
              {teacherIdForEvents != null ? (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Autocomplete
                    options={teacherEventOptions}
                    loading={loadingEvents}
                    value={selectedTargetEvent}
                    onChange={(e, newValue) => setSelectedTargetEvent(newValue)}
                    getOptionLabel={(option) => formatEventSlotLabel(option)}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="dense"
                        label={t('adminBookings.intent.groupSlot')}
                        placeholder={t('adminBookings.intent.groupSlotPlaceholder')}
                        helperText={t('adminBookings.intent.groupSlotHelper')}
                      />
                    )}
                  />
                </FormControl>
              ) : null}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssign}>{t('adminBookings.intent.close')}</Button>
          <LoadingButton
            loading={submitting}
            variant="contained"
            onClick={handleConvert}
            disabled={confirmDisabled}
          >
            {t('adminBookings.intent.confirm')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
