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
  { id: 'bookingId', label: 'Booking ID', align: 'left' },
  { id: 'createdAt', label: 'Created', align: 'center' },
  { id: 'studentId', label: 'Student ID', align: 'left' },
  { id: 'teacherId', label: 'Teacher ID', align: 'left' },
  { id: 'resort', label: 'Resort', align: 'left' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'paymentStatus', label: 'Payment', align: 'center' },
  { id: 'paymentMethod', label: 'Method', align: 'center' },
  { id: 'hasPayout', label: 'Payout', align: 'center' },
  { id: 'invoice', label: 'Invoice', align: 'center' },
  { id: 'totalCharged', label: 'Total', align: 'right' },
];

const BOOKING_STATUS_COLORS = {
  pending: 'warning',
  confirmed: 'info',
  cancelled: 'error',
  completed: 'success',
};

const PAYMENT_STATUS_COLORS = {
  paid: 'success',
  pending: 'warning',
  failed: 'error',
};

BookingsTable.propTypes = {
  bookings: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
};

export default function BookingsTable({ bookings, loading = false, onRefresh }) {
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
    tableData: bookings,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = !dataFiltered.length && !!filterName;

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleViewInvoice = (invoiceUrl) => {
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Completado',
    };
    return statusMap[status] || status;
  };

  const formatPaymentStatus = (status) => {
    const statusMap = {
      paid: 'Pagado',
      pending: 'Pendiente',
      failed: 'Fallido',
    };
    return statusMap[status] || status;
  };

  const formatPaymentMethod = (method) => {
    const methodMap = {
      stripe: 'Stripe',
      cash: 'Efectivo',
      transfer: 'Transferencia',
      other: 'Otro',
    };
    return methodMap[method] || method;
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={filterName}
          onChange={(event) => handleFilterName(event.target.value)}
          placeholder="Search by student ID or teacher ID..."
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
              rowCount={bookings.length}
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
                          {row.bookingId}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" noWrap>
                          {fDateTime(row.createdAt)}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.studentId}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.teacherId}
                        </Typography>
                      </TableCell>

                      <TableCell align="left">
                        <Typography variant="body2" noWrap>
                          {row.resort}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={formatStatus(row.status)}
                          color={BOOKING_STATUS_COLORS[row.status]}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={formatPaymentStatus(row.paymentStatus)}
                          color={PAYMENT_STATUS_COLORS[row.paymentStatus]}
                          size="small"
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" noWrap>
                          {formatPaymentMethod(row.paymentMethod)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={row.hasPayout ? 'Sí' : 'No'}
                          color={row.hasPayout ? 'success' : 'default'}
                          size="small"
                        />
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

                      <TableCell align="right">
                        <Typography variant="body2" noWrap>
                          {fCurrency(row.totalCharged)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
              )}

              <TableEmptyRows
                height={dense ? 52 : 72}
                emptyRows={emptyRows(page, rowsPerPage, bookings.length)}
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
        item.studentId.toString().indexOf(filterName) !== -1 ||
        item.teacherId.toString().indexOf(filterName) !== -1
    );
  }

  return tableData;
} 