import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Tooltip,
  Chip,
  Link,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../../../components/table';
// hooks
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDateTime } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'payoutId', label: 'Payout ID', align: 'left' },
  { id: 'bookingId', label: 'Booking ID', align: 'left' },
  { id: 'teacherName', label: 'Instructor', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'right' },
  { id: 'currency', label: 'Currency', align: 'center' },
  { id: 'date', label: 'Created Date', align: 'center' },
  { id: 'invoice', label: 'Invoice', align: 'center' },
  { id: 'actions', label: 'Actions', align: 'center' },
];



PayoutsTable.propTypes = {
  payouts: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
  onMarkAsPaid: PropTypes.func,
};

export default function PayoutsTable({ payouts, loading = false, onRefresh, onMarkAsPaid }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered = applySortFilter({
    tableData: payouts,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length && !!filterName;

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleMarkAsPaid = async (payoutId) => {
    try {
      if (onMarkAsPaid) {
        await onMarkAsPaid(payoutId);
      } else {
        console.log('Marking payout as paid:', payoutId);
        onRefresh();
      }
    } catch (error) {
      console.error('Error marking payout as paid:', error);
    }
  };

  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  const handleDownloadCSV = (payoutId) => {
    // TODO: Implement CSV download for specific payout
    console.log('Downloading CSV for payout:', payoutId);
  };



  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={filterName}
          onChange={(event) => handleFilterName(event.target.value)}
          placeholder="Search by instructor name or booking ID..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={payouts.length}
              onSort={onSort}
            />

            <TableBody>
              {loading ? (
                // Loading skeletons
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell key={headCell.id} align={headCell.align}>
                        <Skeleton width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                          {row.payoutId}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.bookingId}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.teacherName}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" noWrap>
                          {fCurrency(row.amount)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" noWrap>
                          {row.currency}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" noWrap>
                          {fDateTime(row.scheduledAt)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {row.invoiceUrl ? (
                          <Tooltip title="View Invoice">
                            <IconButton
                              size="small"
                              onClick={() => handleViewInvoice(row.invoiceUrl)}
                            >
                              <Iconify icon="eva:file-text-fill" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Mark as Paid">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleMarkAsPaid(row.id)}
                            >
                              <Iconify icon="eva:checkmark-circle-fill" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Download CSV">
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadCSV(row.id)}
                            >
                              <Iconify icon="eva:download-fill" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}

              <TableEmptyRows
                height={dense ? 52 : 72}
                emptyRows={emptyRows(page, rowsPerPage, payouts.length)}
              />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={dataFiltered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.teacherName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.bookingId.toString().indexOf(filterName) !== -1
    );
  }

  return tableData;
} 