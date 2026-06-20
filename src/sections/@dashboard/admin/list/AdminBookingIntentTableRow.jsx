import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useDispatch } from 'src/redux/store';
import { useSelector } from 'react-redux';
import { convertBookingIntent, cancelBookingIntent, getTeachers } from 'src/redux/slices/admin';
import axios from 'src/utils/axios';

AdminBookingIntentTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onRefreshIntents: PropTypes.func,
};

export default function AdminBookingIntentTableRow({ row, onRefreshIntents }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.admin);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentOptions, setStudentOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const { id, student, price, resort, adults, children, lines = [], internalComment, paymentStatus, includesLaunch, includesEquipments } = row;
  const needsStudentForConvert = !student || student.id == null;
  const studentLabel = student ? `${student.name || ''} ${student.lastname || ''}`.trim() : '—';

  useEffect(() => {
    if (assignOpen) {
      dispatch(getTeachers(0, 'TEACHER', '', 0));
    }
  }, [assignOpen, dispatch]);

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
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(p || 0);

  const handleConvert = async () => {
    const tid = selectedTeacher?.id;
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
          needsStudentForConvert ? selectedStudent?.id : undefined
        )
      );
      setAssignOpen(false);
      setSelectedTeacher(null);
      setSelectedStudent(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAssign = () => {
    setAssignOpen(false);
    setSelectedTeacher(null);
    setSelectedStudent(null);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Typography variant="subtitle2">I-{id}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {studentLabel}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {t('adminBookings.intent.unassigned')}
          </Typography>
        </TableCell>
        <TableCell>{lines.length ? t('adminBookings.row.classesCount', { count: lines.length }) : '—'}</TableCell>
        <TableCell>—</TableCell>
        <TableCell>
          <Typography variant="body2" noWrap>
            {dateRange()}
          </Typography>
        </TableCell>
        <TableCell>{resort || '—'}</TableCell>
        <TableCell>
          {children}/{adults}
        </TableCell>
        <TableCell>{formatPrice(price)}</TableCell>
        <TableCell>
          <Typography variant="caption" noWrap sx={{ maxWidth: 160, display: 'block' }}>
            {internalComment || '—'}
          </Typography>
        </TableCell>
        <TableCell>
          {[includesLaunch && t('adminBookings.row.lunch'), includesEquipments && t('adminBookings.row.equipmentShort')].filter(Boolean).join(', ') || '—'}
        </TableCell>
        <TableCell>{paymentStatus || '—'}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button size="small" variant="contained" onClick={() => setAssignOpen(true)}>
              {t('adminBookings.intent.assignInstructor')}
            </Button>
            <Button size="small" color="error" onClick={handleCancelIntent} disabled={submitting}>
              {t('adminBookings.intent.cancel')}
            </Button>
          </Box>
        </TableCell>
      </TableRow>

      <Dialog open={assignOpen} onClose={handleCloseAssign} maxWidth="sm" fullWidth>
        <DialogTitle>{t('adminBookings.intent.assignDialogTitle')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 0.5 }}>
            <Autocomplete
              autoFocus
              options={teachers || []}
              value={selectedTeacher}
              onChange={(e, newValue) => setSelectedTeacher(newValue)}
              onInputChange={(e, newInputValue) => {
                dispatch(getTeachers(0, 'TEACHER', newInputValue, 0));
              }}
              getOptionLabel={(option) =>
                `${option?.name || ''} ${option?.lastname || ''}`.trim() || String(option?.id ?? '')
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
                      `/api/admin/filter?page=1&role=STUDENT&level=0&name=${encodeURIComponent(newInputValue || '')}`
                    );
                    setStudentOptions(Array.isArray(res.data) ? res.data : []);
                  } catch {
                    setStudentOptions([]);
                  }
                }}
                getOptionLabel={(option) =>
                  `${option?.name || ''} ${option?.lastname || ''}`.trim() || String(option?.id ?? '')
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssign}>{t('adminBookings.intent.close')}</Button>
          <LoadingButton
            loading={submitting}
            variant="contained"
            onClick={handleConvert}
            disabled={!selectedTeacher || (needsStudentForConvert && !selectedStudent?.id)}
          >
            {t('adminBookings.intent.confirm')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
