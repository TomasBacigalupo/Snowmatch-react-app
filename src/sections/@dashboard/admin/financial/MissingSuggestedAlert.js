import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';

MissingSuggestedAlert.propTypes = {
  count: PropTypes.number,
  bookings: PropTypes.array,
};

export default function MissingSuggestedAlert({ count = 0, bookings = [] }) {
  const { t } = useTranslation();

  if (!count) {
    return null;
  }

  const preview = (bookings || []).slice(0, 5);

  return (
    <Alert
      severity="warning"
      action={
        <Button
          color="warning"
          size="small"
          component={RouterLink}
          to={PATH_DASHBOARD.admin.payouts}
        >
          {t('adminFinancial.missingSuggestedAction')}
        </Button>
      }
    >
      <AlertTitle>{t('adminFinancial.missingSuggestedTitle', { count })}</AlertTitle>
      {t('adminFinancial.missingSuggestedDescription')}
      {preview.length > 0 && (
        <List dense disablePadding sx={{ mt: 1 }}>
          {preview.map((row) => (
            <ListItem key={row.bookingId} disableGutters sx={{ py: 0 }}>
              <ListItemText
                primary={t('adminFinancial.missingSuggestedItem', {
                  bookingId: row.bookingId,
                  teacherName: row.teacherName,
                })}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      )}
      {count > preview.length && (
        <Box sx={{ mt: 0.5 }}>
          <Link component={RouterLink} to={PATH_DASHBOARD.admin.payouts} variant="body2">
            {t('adminFinancial.missingSuggestedMore', { count: count - preview.length })}
          </Link>
        </Box>
      )}
    </Alert>
  );
}
