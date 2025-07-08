import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  DialogTitle,
  Hidden,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { AdminTableToolbar, AdminTableRow } from '../../sections/@dashboard/admin/list';
//cosas de fede
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers, openModal, closeModal, getBooking, getBookings, openEditBookingModal, deleteBooking, openDeleteModal, closeDeleteModal } from '../../redux/slices/admin'
import { DialogAnimate } from '../../components/animate';
import DeclineForm from '../../sections/@dashboard/admin/DeclineForm';
import AdminTableCard from 'src/sections/@dashboard/admin/list/AdminTableCard';
import AdminBookingTableRow from 'src/sections/@dashboard/admin/list/AdminBookingTableRow';
import AdminBookingTableCard from 'src/sections/@dashboard/admin/list/AdminBookingTableCard';
import BookingModal from 'src/sections/@dashboard/admin/BookingModal';
import BookingSummary from 'src/sections/@dashboard/admin/list/BookingSummary';
import useAuth from 'src/hooks/useAuth';
import BookingDetailsDrawer from 'src/sections/@dashboard/admin/list/BookingDetailsDrawer';

// ---------------------------------------------------------------------


const STATUS_OPTIONS = ['PENDING', 'ACCEPTED', 'DECLINED'];

const ROLE_OPTIONS = [
  'PENDING', 'ACCEPTED', 'DECLINED'
];

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'student', label: 'Cliente', align: 'left' },
  { id: 'teacher', label: 'Instructor', align: 'left' },
  { id: 'events', label: 'Clases', align: 'left' },
  { id: 'dates', label: 'Fechas', align: 'left' },
  { id: 'resort', label: 'Montaña', align: 'left' },
  { id: 'capacity', label: 'Capacidad', align: 'left' },
  { id: 'price', label: 'Precio', align: 'left' },
  { id: 'internalComment', label: 'Comentario Interno', align: 'left' },
  { id: 'includes', label: 'Incluye', align: 'left' },
  { id: 'paymentStatus', label: 'Estado Pago', align: 'left' },
];

// ----------------------------------------------------------------------

export default function AdminReviewBookings() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { user } = useAuth();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(ROLE_OPTIONS[0]);
  const [filterLevel, setFilterLevel] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterTeacherId, setFilterTeacherId] = useState('');
  const [filterStudentId, setFilterStudentId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterResort, setFilterResort] = useState('');
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('PENDING');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeclineOpenModal = (email) => {
    dispatch(openModal(email));
  };

  const handleDeclineCloseModal = () => {
    dispatch(closeModal());
  };

  const handleDeleteCloseModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleConfirmDelete = () => {
    dispatch(deleteBooking(selectedBookingId));
    dispatch(closeDeleteModal());
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleFilterLevel = (event) => {
    setFilterLevel(event.target.value);
  };

  const handleFilterMonth = (event) => {
    setFilterMonth(event.target.value);
    dispatch(getBookings(filterTeacherId, filterStudentId, event.target.value, page, rowsPerPage, filterResort));
  };

  const handleFilterResort = (event) => {
    setFilterResort(event.target.value);
    dispatch(getBookings(filterTeacherId, filterStudentId, filterMonth, page, rowsPerPage, event.target.value));
  };

  const handleFilterTeacherId = (event) => {
    const value = event?.target?.value ?? event;
    setFilterTeacherId(value);
    dispatch(getBookings(value, filterStudentId, filterMonth, page, rowsPerPage, filterResort));
  };

  const handleFilterStudentId = (event) => {
    const value = event.target.value;
    setFilterStudentId(value);
    dispatch(getBookings(filterTeacherId, value, filterMonth, page, rowsPerPage, filterResort));
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    dispatch(openEditBookingModal(id));
  };

  const handleConfirmRow = (id) => {
    navigate(PATH_DASHBOARD.admin.confirm(id));
  };

  const handleContactWapp = (countryCode, cellphone, name) => {
    window.open(`https://wa.me/${countryCode}${cellphone}?text=Hola ${name}, `, '_blank')
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const dispatch = useDispatch();

  const { teachers: reduxTeachers, isOpenModal, isOpenEditBookingModal, isOpenDeleteModal, selectedEmail, selectedBookingId, bookings } = useSelector((state) => { return state.admin });

  console.log('Modal states:', { isOpenDeleteModal, selectedBookingId });

  const [reqPage, setReqPage] = useState(0);

  const onChangePage2 = async (event, newPage) => {
    dispatch(getTeachers(newPage + 1, filterRole))
    setPage(newPage)
  }

  const onChangePage3 = (event, newPage) => {
    dispatch(getTeachers(newPage, filterRole))
    setTableData(reduxTeachers ?? [])
    setPage(newPage)
  }

  const handleTeacherInputChange = (event, newValue) => {
    dispatch(getTeachers(1, "TEACHER", newValue, 0));
  };

  const handleStudentInputChange = (event, newValue) => {
    dispatch(getTeachers(1, "STUDENT", newValue, 0));
  };

  useEffect(() => {
    setTableData(bookings ?? []);
    console.log({ bookings })
  }, [bookings]);

  useEffect(() => {
    user && dispatch(getBookings(filterTeacherId, filterStudentId, filterMonth, page, rowsPerPage))
  }, [page, rowsPerPage])

  useEffect(() => {
    if (reduxTeachers) {
      setTeachers(reduxTeachers);
    }
  }, [reduxTeachers]);

  useEffect(() => {
    if (students) {
      setStudents(students);
    }
  }, [students]);

  const handleDeleteRow = (id) => {
    console.log('handleDeleteRow called with id:', id);
    dispatch(openDeleteModal(id));
  }

  const refreshBookings = () => {
    dispatch(getBookings(filterTeacherId, filterStudentId, filterMonth, page, rowsPerPage, filterResort));
  }

  return (
    <Page title="Admin Review: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Bookings Reveiw List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Bookings' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setIsOpen(true)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 1,
                boxShadow: (theme) => theme.customShadows?.primary,
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows?.primaryHover,
                },
              }}
            >
              Nueva Reserva
            </Button>
          }
        />
        <AdminTableToolbar
          filterName={filterName}
          filterRole={filterRole}
          filterLevel={filterLevel}
          filterMonth={filterMonth}
          filterTeacherId={filterTeacherId}
          filterStudentId={filterStudentId}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          onFilterLevel={handleFilterLevel}
          onFilterMonth={handleFilterMonth}
          onFilterTeacherId={handleFilterTeacherId}
          onFilterStudentId={handleFilterStudentId}
          onFilterResort={handleFilterResort}
          bookings={true}
        />
        <BookingSummary bookings={tableData} />
        <Card>
          <BookingModal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              refreshBookings();
            }}
            filterTeacherId={filterTeacherId}
            filterStudentId={filterStudentId}
            filterMonth={filterMonth}
            page={page}
            rowsPerPage={rowsPerPage}
            filterResort={filterResort}
          />
          <Divider />
          <Scrollbar>
            <Hidden smDown>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData?.map((row) => row.id)
                      )
                    }
                    actions={
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData?.length ?? 0}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData?.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {tableData?.map((row) => (
                      <AdminBookingTableRow
                        key={row.userId}
                        row={row}
                        selected={selected.includes(row.userId)}
                        onSelectRow={() => onSelectRow(row.userId)}
                        onEditRow={() => handleEditRow(row.id)}
                        onConfirmRow={() => handleConfirmRow(row.id)}
                        onDeclineRow={() => handleDeclineOpenModal(row.email)}
                        onWapp={() => { handleContactWapp(row.countryCode, row.cellphone, row.name) }}
                        onEvents={() => { navigate(PATH_DASHBOARD.admin.events(row.teacher.id)) }}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        refreshBookings={refreshBookings}
                      />))}

                    <TableEmptyRows height={denseHeight} emptyRows={0} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Hidden>
            <Hidden smUp>
              {tableData?.map((row) => (
                <Box onClick={() =>{ 
                  setOpenDrawer(true)
                  setSelectedBooking(row)
                }}><AdminBookingTableCard
                  key={row.userId}
                  row={row}
                  selected={selected.includes(row.userId)}
                  onSelectRow={() => onSelectRow(row.userId)}
                  onEditRow={() => handleEditRow(row.id)}
                  onConfirmRow={() => handleConfirmRow(row.id)}
                  onDeclineRow={() => handleDeclineOpenModal(row.email)}
                  onWapp={() => { handleContactWapp(row.countryCode, row.cellphone, row.name) }}
                  onEvents={() => { navigate(PATH_DASHBOARD.admin.events(row.id)) }}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  refreshBookings={refreshBookings}
                /></Box>))}
             {openDrawer && selectedBooking && <BookingDetailsDrawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                booking={selectedBooking}
                refreshBookings={refreshBookings}
              />}
            </Hidden>

          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]}
              component="div"
              count={-1}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage2}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
        <DialogAnimate open={isOpenModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{'Seguro que queres declinar?'}</DialogTitle>
          <DeclineForm
            email={selectedEmail}
            onCancel={handleDeclineCloseModal}
          ></DeclineForm>
        </DialogAnimate>
        <DialogAnimate open={isOpenEditBookingModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{'Seguro que queres Editar esta reserva?'}</DialogTitle>
          <DeclineForm
            email={selectedEmail}
            onCancel={handleDeclineCloseModal}
          ></DeclineForm>
        </DialogAnimate>
        <DialogAnimate open={isOpenDeleteModal} onClose={handleDeleteCloseModal}>
          <DialogTitle>{'¿Estás seguro que quieres eliminar la reserva?'}</DialogTitle>
          <DialogContent>
            <Typography>
              Esta reserva ni su información van a poder ser visibles nunca más
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleDeleteCloseModal}>
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </DialogActions>
        </DialogAnimate>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  return tableData

  if (tableData.length === 0) {
    return tableData
  }
  const stabilizedThis = tableData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis?.map((el) => el[0]);

  if (filterName) {
    tableData = tableData?.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData?.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData?.filter((item) => item.role === filterRole);
  }

  return tableData;
}
