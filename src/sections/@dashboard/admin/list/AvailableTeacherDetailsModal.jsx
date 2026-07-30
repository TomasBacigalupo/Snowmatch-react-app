import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Iconify from 'src/components/Iconify';
import { formatAvailabilityWindowLabel } from 'src/utils/adminTodayBookings';

function getTeacherFullName(teacher) {
  return `${teacher?.name || ''} ${teacher?.lastname || teacher?.lastName || ''}`.trim();
}

function getWhatsAppNumber(teacher) {
  const countryCode = String(teacher?.countryCode || '').replace(/\D/g, '');
  const cellphone = String(teacher?.cellphone || '').replace(/\D/g, '');
  if (!cellphone) return '';
  return `${countryCode}${cellphone}`;
}

function getSourceLabels(teacher, t) {
  const labels = [];
  if (teacher?.sources?.includes('school')) {
    labels.push(t('adminToday.sourceSchool'));
  }
  if (teacher?.sources?.includes('day')) {
    labels.push(formatAvailabilityWindowLabel(teacher, t));
  }
  return labels;
}

AvailableTeacherDetailsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  teacher: PropTypes.object,
};

export default function AvailableTeacherDetailsModal({ open, onClose, teacher }) {
  const { t } = useTranslation();
  const fullName = getTeacherFullName(teacher) || teacher?.email || '—';
  const phoneDisplay = teacher?.cellphone
    ? `${teacher?.countryCode ? `${teacher.countryCode} ` : ''}${teacher.cellphone}`.trim()
    : '';
  const whatsappNumber = getWhatsAppNumber(teacher);
  const sourceLabels = getSourceLabels(teacher, t);
  const sports = teacher?.sports || teacher?.disciplines || [];
  const languages = teacher?.languages || teacher?.speaks || [];

  const handleWhatsApp = () => {
    if (!whatsappNumber) return;
    const message = t('adminToday.teacherModal.whatsappGreeting', { name: teacher?.name || fullName });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar alt={fullName} src={teacher?.imageLink || undefined} sx={{ width: 48, height: 48 }}>
            {(teacher?.name || teacher?.email || '?').charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              {fullName}
            </Typography>
            {teacher?.id != null && (
              <Typography variant="body2" color="text.secondary">
                ID: {teacher.id}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {teacher && (
          <Stack spacing={2} sx={{ pt: 1 }}>
            {(teacher.level != null && teacher.level !== '') || teacher.role ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('adminToday.teacherModal.roleAndLevel')}
                </Typography>
                <Stack spacing={0.5}>
                  {teacher.role && (
                    <Typography variant="body2">
                      {t('adminToday.teacherModal.role', { role: teacher.role })}
                    </Typography>
                  )}
                  {teacher.level != null && teacher.level !== '' && (
                    <Typography variant="body2">
                      {t('adminToday.teacherModal.level', { level: teacher.level })}
                    </Typography>
                  )}
                </Stack>
              </Box>
            ) : null}

            {sourceLabels.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('adminToday.teacherModal.availability')}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {sourceLabels.map((label) => (
                    <Chip key={label} size="small" variant="outlined" label={label} />
                  ))}
                </Stack>
              </Box>
            )}

            {sports.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('adminToday.teacherModal.sports')}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {sports.map((sport) => (
                    <Chip key={String(sport)} size="small" label={sport} />
                  ))}
                </Stack>
              </Box>
            )}

            {languages.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('adminToday.teacherModal.languages')}
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {languages.map((language) => (
                    <Chip key={String(language)} size="small" label={language} />
                  ))}
                </Stack>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('adminToday.teacherModal.contact')}
              </Typography>
              <Stack spacing={0.5}>
                {teacher.email ? (
                  <Typography variant="body2">
                    {t('adminToday.teacherModal.email', { email: teacher.email })}
                  </Typography>
                ) : null}
                {phoneDisplay ? (
                  <Typography variant="body2">
                    {t('adminToday.teacherModal.phone', { phone: phoneDisplay })}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {t('adminToday.teacherModal.noPhone')}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          {t('adminToday.teacherModal.close')}
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={!whatsappNumber}
          onClick={handleWhatsApp}
          startIcon={<Iconify icon="logos:whatsapp-icon" />}
        >
          {t('adminToday.teacherModal.whatsapp')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
