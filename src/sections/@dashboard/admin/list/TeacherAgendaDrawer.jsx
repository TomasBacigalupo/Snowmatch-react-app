import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/Iconify';
import TeacherAgendaCalendar from './TeacherAgendaCalendar';

TeacherAgendaDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  teacher: PropTypes.object,
};

export default function TeacherAgendaDrawer({ open, onClose, teacher }) {
  const { t } = useTranslation();

  if (!teacher) return null;

  const teacherName = [teacher.name, teacher.lastName].filter(Boolean).join(' ');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: {
          paddingTop: 'env(safe-area-inset-top)',
          width: { xs: '100%', sm: 480, md: 640 },
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {t('adminSchoolMemberLessons.drawer.subtitle')}
            </Typography>
            <Typography variant="h6">{teacherName}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {teacher.level != null && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={t('adminSchoolMemberLessons.drawer.level', { level: teacher.level })}
                />
              )}
              {teacher.email && (
                <Chip size="small" variant="outlined" label={teacher.email} />
              )}
            </Stack>
          </Box>
          <IconButton onClick={onClose} edge="end">
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <TeacherAgendaCalendar teacherId={teacher.id} active={open} />
        </Box>
      </Box>
    </Drawer>
  );
}
