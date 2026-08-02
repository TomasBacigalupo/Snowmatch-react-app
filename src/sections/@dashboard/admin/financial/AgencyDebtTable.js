import PropTypes from 'prop-types';
import { useMemo } from 'react';
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
import { fCurrency, fNumber } from '../../../../utils/formatNumber';

AgencyDebtTable.propTypes = {
  rows: PropTypes.array,
  loading: PropTypes.bool,
};

export default function AgencyDebtTable({ rows = [], loading = false }) {
  const { t } = useTranslation();

  const totals = useMemo(
    () =>
      (rows || []).reduce(
        (acc, row) => ({
          unpaidTotal: acc.unpaidTotal + (row.unpaidTotal || 0),
          bookingCount: acc.bookingCount + (row.bookingCount || 0),
        }),
        { unpaidTotal: 0, bookingCount: 0 }
      ),
    [rows]
  );

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('adminFinancial.agencyDebtTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('adminFinancial.agencyDebtSubtitle')}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('adminFinancial.colAgency')}</TableCell>
              <TableCell align="right">{t('adminFinancial.colUnpaidTotal')}</TableCell>
              <TableCell align="right">{t('adminFinancial.colBookingCount')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton width={120} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={80} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton width={40} />
                    </TableCell>
                  </TableRow>
                ))
              : (rows || []).map((row) => (
                  <TableRow key={row.agencyId}>
                    <TableCell>{row.agencyName || '—'}</TableCell>
                    <TableCell align="right">{fCurrency(row.unpaidTotal || 0)}</TableCell>
                    <TableCell align="right">{fNumber(row.bookingCount || 0)}</TableCell>
                  </TableRow>
                ))}
            {!loading && rows?.length > 0 && (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2">{t('adminFinancial.agencyDebtTotal')}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">{fCurrency(totals.unpaidTotal)}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2">{fNumber(totals.bookingCount)}</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && (!rows || rows.length === 0) && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body2" color="text.secondary">
                    {t('adminFinancial.agencyDebtEmpty')}
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
