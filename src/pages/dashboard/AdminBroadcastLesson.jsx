import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../../components/Page';
import { useDispatch, useSelector } from '../../redux/store';
import { broadcastLesson, getTeachersAdmin, clearSuccessMessage } from '../../redux/slices/admin';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function AdminBroadcastLesson() {
  const dispatch = useDispatch();
  const { teachers, isLoading, error, successMessage } = useSelector((s) => s.admin);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [textColor, setTextColor] = useState('#4CAF50');
  const [resort, setResort] = useState('Cerro Catedral');
  const [price, setPrice] = useState('0');
  const [currency, setCurrency] = useState('ARS');
  const [maxStudents, setMaxStudents] = useState('');
  const [startStr, setStartStr] = useState('');
  const [endStr, setEndStr] = useState('');
  const [selected, setSelected] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [instructorSearch, setInstructorSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      // POST body must be a JSON array (empty = no date windows). Backend lists by resort + name only.
      dispatch(getTeachersAdmin(instructorSearch.trim(), 0, [], resort, 200));
    }, 400);
    return () => clearTimeout(id);
  }, [dispatch, resort, instructorSearch]);

  const toggle = (id) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const handleSubmit = async () => {
    const teacherIds = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => Number(k));
    if (teacherIds.length === 0) {
      // eslint-disable-next-line no-alert
      window.alert('Select at least one instructor');
      return;
    }
    if (!title || title.trim().length < 3) {
      // eslint-disable-next-line no-alert
      window.alert('Title must be at least 3 characters');
      return;
    }
    const body = {
      title: title.trim(),
      description: description?.trim() || '',
      textColor,
      start: startStr.trim(),
      end: endStr.trim(),
      type: 'App Class',
      price: Number(price),
      currency,
      maxStudents: maxStudents ? Number(maxStudents) : null,
      resort,
      payed: false,
      teacherIds,
    };
    setSubmitting(true);
    try {
      await dispatch(broadcastLesson(body));
    } catch (e) {
      /* hasError in slice */
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => dispatch(clearSuccessMessage()), 8000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [successMessage, dispatch]);

  const errText =
    error == null
      ? ''
      : typeof error === 'string'
      ? error
      : error?.message || error?.error || JSON.stringify(error);

  const eventId = successMessage && typeof successMessage === 'object' ? successMessage.id : null;

  return (
    <Page title="Broadcast lesson">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Broadcast lesson"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Broadcast lesson' },
          ]}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create an unassigned lesson and notify selected instructors. The first instructor to open the app and claim it
          is assigned (like a ride request).
        </Typography>

        {errText ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errText}
          </Alert>
        ) : null}
        {eventId != null ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Lesson created and pushes sent. Event id: {eventId}
          </Alert>
        ) : null}

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lesson details
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
            <TextField label="Text color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
            <TextField
              label="Resort"
              value={resort}
              onChange={(e) => setResort(e.target.value)}
              fullWidth
              helperText="Used to load instructors list; adjust and wait for reload"
            />
            <TextField
              label="Start (yyyy-MM-dd HH:mm:ss)"
              value={startStr}
              onChange={(e) => setStartStr(e.target.value)}
              fullWidth
              placeholder="2026-04-10 10:00:00"
            />
            <TextField
              label="End (yyyy-MM-dd HH:mm:ss)"
              value={endStr}
              onChange={(e) => setEndStr(e.target.value)}
              fullWidth
              placeholder="2026-04-10 12:00:00"
            />
            <TextField label="Price" value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
            <TextField
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              helperText="ARS, USD, EUR, ..."
            />
            <TextField label="Max students" value={maxStudents} onChange={(e) => setMaxStudents(e.target.value)} type="number" />

            <Divider />
            <Typography variant="h6">Instructors</Typography>
            <TextField
              label="Search instructors by name"
              value={instructorSearch}
              onChange={(e) => setInstructorSearch(e.target.value)}
              fullWidth
              placeholder="First or last name"
              helperText="Server filters first/last name; list updates after a short pause"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isLoading ? <CircularProgress size={24} /> : null}
              <Typography variant="body2">{teachers?.length || 0} loaded</Typography>
            </Box>
            <FormGroup>
              {(teachers || []).map((t) => (
                <FormControlLabel
                  key={t.id}
                  control={<Checkbox checked={!!selected[t.id]} onChange={() => toggle(t.id)} />}
                  label={`${t.name || ''} ${t.lastname || ''} (id ${t.id})`}
                />
              ))}
            </FormGroup>

            <LoadingButton
              variant="contained"
              size="large"
              loading={submitting}
              onClick={handleSubmit}
            >
              Broadcast lesson &amp; send pushes
            </LoadingButton>
          </Stack>
        </Card>
      </Container>
    </Page>
  );
}
