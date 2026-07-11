import { Chip, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import useLocales from 'src/hooks/useLocales';

const normalizePeople = (people) => {
  if (Array.isArray(people)) return people.filter(Boolean);
  if (people && typeof people === 'object') return Object.values(people).filter(Boolean);
  return [];
};

const personLabel = (person) => {
  if (!person) return '';
  return [person.name, person.lastname].filter(Boolean).join(' ');
};

AdminEventInfo.propTypes = {
  event: PropTypes.object,
};

export default function AdminEventInfo({ event }) {
  const { translate } = useLocales();
  const clients = normalizePeople(event?.clients);
  const students = normalizePeople(event?.students);
  const ownerLabel = [event?.owner?.name, event?.owner?.lastname].filter(Boolean).join(' ');

  return (
    <Stack spacing={1.5}>
      {(ownerLabel || event?.resort) && (
        <Stack spacing={0.5}>
          {ownerLabel && (
            <Typography variant="body2">
              <strong>{translate('calendar.form.teacher')}:</strong> {ownerLabel}
            </Typography>
          )}
          {event?.resort && (
            <Typography variant="body2">
              <strong>Resort:</strong> {event.resort}
            </Typography>
          )}
        </Stack>
      )}

      {clients.length > 0 && (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary">
            {translate('calendar.form.client')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {clients.map((client) => (
              <Chip
                key={`admin-event-client-${client.id}`}
                size="small"
                variant="outlined"
                label={personLabel(client) || client.email || client.id}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {students.length > 0 && (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary">
            {translate('calendar.form.assignedStudents')}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {students.map((student) => (
              <Chip
                key={`admin-event-student-${student.id}`}
                size="small"
                variant="outlined"
                label={personLabel(student) || student.email || student.id}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
