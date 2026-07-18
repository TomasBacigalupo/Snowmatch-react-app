import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from '@mui/material';
import { fNumber } from '../../../../utils/formatNumber';

HoursByLevelTable.propTypes = {
  rows: PropTypes.array,
  loading: PropTypes.bool,
};

export default function HoursByLevelTable({ rows = [], loading = false }) {
  const { t } = useTranslation();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('adminFinancial.hoursByLevelTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('adminFinancial.hoursByLevelSubtitle')}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminFinancial.colLevel')}</TableCell>
              <TableCell align="right">{t('adminFinancial.colAssignedHours')}</TableCell>
              <TableCell align="right">{t('adminFinancial.colRequiredHours')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width={40} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={60} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={60} />
                    </TableCell>
                  </TableRow>
                ))
              : (rows || []).map((row) => (
                  <TableRow key={row.level}>
                    <TableCell>{row.level}</TableCell>
                    <TableCell align="right">{fNumber(row.assignedHours || 0)}</TableCell>
                    <TableCell align="right">{fNumber(row.requiredHours || 0)}</TableCell>
                  </TableRow>
                ))}
            {!loading && (!rows || rows.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('adminFinancial.hoursByLevelEmpty')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
