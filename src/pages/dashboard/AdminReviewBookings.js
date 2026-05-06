import { paramCase } from 'change-case';
import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
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
  DialogContent,
  DialogActions,
  Typography,
  Tabs,
  Tab,
  Collapse,
} from '@mui/material';
import Hidden from 'src/components/LegacyHidden';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { emptyRows } from '../../hooks/useTable';
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
import { getTeachers, openModal, closeModal, getBooking, getBookings, getBookingIntents, openEditBookingModal, deleteBooking, openDeleteModal, closeDeleteModal } from '../../redux/slices/admin'
import { DialogAnimate } from '../../components/animate';
import DeclineForm from '../../sections/@dashboard/admin/DeclineForm';
import AdminTableCard from 'src/sections/@dashboard/admin/list/AdminTableCard';
import AdminBookingTableRow from 'src/sections/@dashboard/admin/list/AdminBookingTableRow';
import AdminBookingTableCard from 'src/sections/@dashboard/admin/list/AdminBookingTableCard';
import AdminBookingIntentTableRow from 'src/sections/@dashboard/admin/list/AdminBookingIntentTableRow';
import BookingModal from 'src/sections/@dashboard/admin/BookingModal';
import BookingSummary from 'src/sections/@dashboard/admin/list/BookingSummary';
import useAuth from 'src/hooks/useAuth';
import BookingDetailsDrawer from 'src/sections/@dashboard/admin/list/BookingDetailsDrawer';
import GearBookingDetailsDrawer from 'src/sections/@dashboard/admin/list/GearBookingDetailsDrawer';

// ---------------------------------------------------------------------


const ROLE_OPTIONS = [
  'PENDING', 'ACCEPTED', 'DECLINED'
];

const TABLE_HEAD = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'student', label: 'Cliente', align: 'left' },
  { id: 'teacher', label: 'Instructor', align: 'left' },
  { id: 'events', label: 'Clases', align: 'left' },
  { id: 'hours', label: 'Horas', align: 'left' },
  { id: 'dates', label: 'Fechas', align: 'left' },
  { id: 'resort', label: 'Montaña', align: 'left' },
  { id: 'capacity', label: 'Capacidad', align: 'left' },
  { id: 'price', label: 'Precio', align: 'left' },
  { id: 'internalComment', label: 'Comentario Interno', align: 'left' },
  { id: 'includes', label: 'Incluye', align: 'left' },
  { id: 'paymentStatus', label: 'Estado Pago', align: 'left' },
];

/** Admin list for GEAR_ONLY / rental bookings (no lessons, no instructor). */
const TABLE_HEAD_GEAR = [
  { id: 'id', label: 'ID', align: 'left' },
  { id: 'student', label: 'Cliente', align: 'left' },
  { id: 'state', label: 'Estado', align: 'left' },
  { id: 'resort', label: 'Centro', align: 'left' },
  { id: 'price', label: 'Precio', align: 'left' },
  { id: 'paymentStatus', label: 'Estado pago', align: 'left' },
  { id: 'comments', label: 'Notas', align: 'left' },
];

function sumBookingHours(row) {
  if (!row.eventList?.length) return 0;
  let total = 0;
  row.eventList.forEach((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const durationInHours = (end - start) / (1000 * 60 * 60);
    if (durationInHours === 4) {
      total += 3;
    } else if (durationInHours > 5) {
      total += 6;
    } else {
      total += durationInHours;
    }
  });
  return total;
}

function compareAdminBookings(rowA, rowB, orderBy, order) {
  const dir = order === 'desc' ? -1 : 1;
  const cmpNum = (a, b) => {
    if (a < b) return -1 * dir;
    if (a > b) return 1 * dir;
    return 0;
  };
  const cmpStr = (a, b) => {
    const sa = String(a ?? '').toLowerCase();
    const sb = String(b ?? '').toLowerCase();
    if (sa < sb) return -1 * dir;
    if (sa > sb) return 1 * dir;
    return 0;
  };
  switch (orderBy) {
    case 'student':
      return cmpStr(
        `${rowA.student?.name || ''} ${rowA.student?.lastname || ''}`.trim(),
        `${rowB.student?.name || ''} ${rowB.student?.lastname || ''}`.trim()
      );
    case 'teacher':
      return cmpStr(
        `${rowA.teacher?.name || ''} ${rowA.teacher?.lastname || ''}`.trim(),
        `${rowB.teacher?.name || ''} ${rowB.teacher?.lastname || ''}`.trim()
      );
    case 'events':
      return cmpNum(rowA.eventList?.length || 0, rowB.eventList?.length || 0);
    case 'hours':
      return cmpNum(sumBookingHours(rowA), sumBookingHours(rowB));
    case 'dates': {
      const da = rowA.eventList?.length ? new Date(rowA.eventList[0].start).getTime() : 0;
      const db = rowB.eventList?.length ? new Date(rowB.eventList[0].start).getTime() : 0;
      return cmpNum(da, db);
    }
    case 'capacity':
      return cmpNum(
        (rowA.adults || 0) + (rowA.children || 0),
        (rowB.adults || 0) + (rowB.children || 0)
      );
    case 'price':
      return cmpNum(Number(rowA.price) || 0, Number(rowB.price) || 0);
    case 'internalComment':
      return cmpStr(rowA.internalComment, rowB.internalComment);
    case 'includes':
      return cmpNum(
        (rowA.includesLunch ? 1 : 0) + (rowA.includesEquipments ? 2 : 0),
        (rowB.includesLunch ? 1 : 0) + (rowB.includesEquipments ? 2 : 0)
      );
    case 'paymentStatus':
      return cmpStr(rowA.paymentStatus, rowB.paymentStatus);
    case 'state':
      return cmpStr(rowA.state, rowB.state);
    case 'comments':
      return cmpStr(
        `${rowA.internalComment || ''} ${rowA.userComment || ''}`,
        `${rowB.internalComment || ''} ${rowB.userComment || ''}`
      );
    case 'resort':
      return cmpStr(rowA.resort, rowB.resort);
    case 'id':
    default:
      return cmpNum(Number(rowA.id) || 0, Number(rowB.id) || 0);
  }
}

// ----------------------------------------------------------------------

export function AdminBookingsPage({ bookingListKind, pageTitle, heading }) {
  const {
    dense,
    page,
    order,
    orderBy,
    setOrderBy,
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
  
  console.log('AdminReviewBookings - isOpen state:', isOpen);
  const [filterMonth, setFilterMonth] = useState(() =>
    bookingListKind === 'gear' ? String(new Date().getMonth() + 1).padStart(2, '0') : ''
  );
  const [filterTeacherId, setFilterTeacherId] = useState('');
  const [filterStudentId, setFilterStudentId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [filterResort, setFilterResort] = useState(() =>
    bookingListKind === 'lesson' ? 'CERRO_CATEDRAL' : ''
  );
  /** Calendar year for month/day filters (must match lesson event dates in DB). */
  const [filterYear, setFilterYear] = useState(() => new Date().getFullYear());
  const [filterDate, setFilterDate] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [listTab, setListTab] = useState(0);
  const filterStatus = 'all';
  const activeListTab = bookingListKind === 'lesson' ? listTab : 0;
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

  const dispatchBookings = (partial = {}) => {
    const teacherForQuery = bookingListKind === 'gear' ? '' : (partial.teacherId ?? filterTeacherId);
    const dayArg =
      'day' in partial
        ? partial.day == null
          ? undefined
          : partial.day
        : filterDate
          ? new Date(filterDate).getDate()
          : undefined;
    const stateArg =
      partial.state !== undefined
        ? partial.state
        : filterStatus !== 'all'
          ? filterStatus
          : undefined;
    dispatch(
      getBookings(
        teacherForQuery,
        partial.studentId ?? filterStudentId,
        partial.month ?? filterMonth,
        partial.page ?? page,
        partial.rowsPerPage ?? rowsPerPage,
        partial.resort ?? filterResort,
        dayArg,
        partial.bookingKind ?? bookingListKind,
        partial.year ?? filterYear,
        stateArg
      )
    );
  };

  const handleFilterMonth = (event) => {
    setFilterMonth(event.target.value);
    setPage(0);
    dispatchBookings({ month: event.target.value });
  };

  const handleFilterYear = (event) => {
    const y = Number(event.target.value);
    setFilterYear(y);
    setPage(0);
    dispatchBookings({ year: y });
  };

  const handleFilterResort = (event) => {
    setFilterResort(event.target.value);
    dispatchBookings({ resort: event.target.value });
  };

  const handleFilterTeacherId = (event) => {
    const value = event?.target?.value ?? event;
    setFilterTeacherId(value);
    dispatchBookings({ teacherId: value });
  };

  const handleFilterStudentId = (event) => {
    const value = event.target.value;
    setFilterStudentId(value);
    dispatchBookings({ studentId: value });
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

  const displayBookings = useMemo(() => {
    let rows = tableData ?? [];
    if (filterName?.trim()) {
      const q = filterName.toLowerCase().trim();
      rows = rows.filter((row) => {
        const s = row.student;
        const full = `${s?.name || ''} ${s?.lastname || ''}`.toLowerCase();
        return full.includes(q) || String(row.id).includes(q);
      });
    }
    const stabilized = rows.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
      const ord = compareAdminBookings(a[0], b[0], orderBy, order);
      if (ord !== 0) return ord;
      return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
  }, [tableData, filterName, order, orderBy]);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = displayBookings.length === 0;

  const dispatch = useDispatch();

  const { teachers: reduxTeachers, isOpenModal, isOpenEditBookingModal, isOpenDeleteModal, selectedEmail, selectedBookingId, bookings, bookingIntents } = useSelector((state) => state.admin);

  const displayRows = activeListTab === 0 ? displayBookings : (bookingIntents ?? []);

  console.log('Modal states:', { isOpenDeleteModal, selectedBookingId });

  const [reqPage, setReqPage] = useState(0);

  const onChangePage2 = async (event, newPage) => {
    setPage(newPage);
    dispatchBookings({ page: newPage });
  };

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
    if (user) dispatchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, bookingListKind]);

  useEffect(() => {
    setPage(0);
    setOrderBy(bookingListKind === 'gear' ? 'id' : 'student');
  }, [bookingListKind, setOrderBy, setPage]);

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
    dispatchBookings();
  };

  const refreshBookingIntents = () => {
    dispatch(
      getBookingIntents(
        filterStudentId || undefined,
        filterMonth || undefined,
        page,
        rowsPerPage,
        filterResort || undefined,
        filterYear
      )
    );
  };

  useEffect(() => {
    if (bookingListKind === 'lesson' && listTab === 1) {
      refreshBookingIntents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh after tab/filters
  }, [bookingListKind, listTab, filterStudentId, filterMonth, filterYear, page, rowsPerPage, filterResort, dispatch]);

  const handleFilterDate = (newValue) => {
    setFilterDate(newValue);
    if (newValue == null) {
      setPage(0);
      dispatchBookings({ day: undefined });
      return;
    }
    const month = newValue.getMonth() + 1;
    const day = newValue.getDate();
    const y = newValue.getFullYear();
    setFilterMonth(String(month).padStart(2, '0'));
    setFilterYear(y);
    setPage(0);
    dispatchBookings({ month: String(month).padStart(2, '0'), day, year: y });
  };

  const tableHeadLabel = bookingListKind === 'gear' ? TABLE_HEAD_GEAR : TABLE_HEAD;

  return (
    <Page title={pageTitle}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          action={
            bookingListKind === 'lesson' ? (
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
            ) : undefined
          }
        />
        {bookingListKind === 'lesson' && (
          <Tabs value={listTab} onChange={(e, v) => setListTab(v)} sx={{ px: 2, mb: 1 }}>
            <Tab label="Reservas" />
            <Tab label="Pendientes (sin instructor)" />
          </Tabs>
        )}
        <AdminTableToolbar
          filterName={filterName}
          filterRole={filterRole}
          filterLevel={filterLevel}
          filterYear={filterYear}
          filterMonth={filterMonth}
          filterTeacherId={filterTeacherId}
          filterStudentId={filterStudentId}
          filterResort={filterResort}
          filterDate={filterDate}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          onFilterLevel={handleFilterLevel}
          onFilterYear={handleFilterYear}
          onFilterMonth={handleFilterMonth}
          onFilterTeacherId={handleFilterTeacherId}
          onFilterStudentId={handleFilterStudentId}
          onFilterResort={handleFilterResort}
          onFilterDate={handleFilterDate}
          bookings
          hideInstructorFilters={bookingListKind === 'gear'}
        />
        <Button
          color="inherit"
          size="small"
          onClick={() => setStatsOpen((o) => !o)}
          endIcon={
            <Iconify
              icon={statsOpen ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
              sx={{ width: 20, height: 20 }}
            />
          }
          sx={{ alignSelf: 'flex-start', px: 0, mb: statsOpen ? 1 : 0, typography: 'body2' }}
        >
          Show stats
        </Button>
        <Collapse in={statsOpen}>
          <BookingSummary
            bookings={activeListTab === 0 ? displayBookings : []}
            isGearBookings={bookingListKind === 'gear'}
          />
        </Collapse>
        <Card>
          {bookingListKind === 'lesson' && (
            <BookingModal
              isOpen={isOpen}
              onClose={() => {
                console.log('BookingModal onClose called');
                setIsOpen(false);
                refreshBookings();
                refreshBookingIntents();
              }}
              filterTeacherId={filterTeacherId}
              filterStudentId={filterStudentId}
              filterMonth={filterMonth}
              page={page}
              rowsPerPage={rowsPerPage}
              filterResort={filterResort}
            />
          )}
          <Divider />
          <Scrollbar>
            <Hidden smDown>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && activeListTab === 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={displayRows.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        displayRows?.map((row) => row.id)
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
                    headLabel={activeListTab === 0 ? tableHeadLabel : TABLE_HEAD}
                    rowCount={displayRows?.length ?? 0}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      activeListTab === 0
                        ? onSelectAllRows(
                            checked,
                            displayRows?.map((row) => row.id)
                          )
                        : undefined
                    }
                  />

                  <TableBody>
                    {activeListTab === 0
                      ? displayRows?.map((row) => (
                          <AdminBookingTableRow
                            key={row.id}
                            row={row}
                            isGearAdminList={bookingListKind === 'gear'}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onConfirmRow={() => handleConfirmRow(row.id)}
                            onDeclineRow={() =>
                              handleDeclineOpenModal(row.student?.email || row.email)
                            }
                            onWapp={() => {
                              handleContactWapp(
                                row.student?.countryCode || row.countryCode,
                                row.student?.cellphone || row.cellphone,
                                row.student?.name || row.name
                              );
                            }}
                            onEvents={() => {
                              if (row.teacher?.id) navigate(PATH_DASHBOARD.admin.events(row.teacher.id));
                            }}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            refreshBookings={refreshBookings}
                          />
                        ))
                      : displayRows?.map((row) => (
                          <AdminBookingIntentTableRow
                            key={row.id}
                            row={row}
                            onRefreshIntents={refreshBookingIntents}
                          />
                        ))}

                    <TableEmptyRows height={denseHeight} emptyRows={0} />

                    <TableNoData
                      isNotFound={
                        activeListTab === 0 ? isNotFound : !(bookingIntents && bookingIntents.length)
                      }
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Hidden>
            <Hidden smUp>
              {activeListTab === 0 &&
                displayBookings?.map((row) => (
                  <Box
                    key={row.id}
                    onClick={() => {
                      setOpenDrawer(true);
                      setSelectedBooking(row);
                    }}
                  >
                    <AdminBookingTableCard
                      row={row}
                      isGearAdminList={bookingListKind === 'gear'}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onConfirmRow={() => handleConfirmRow(row.id)}
                      onDeclineRow={() =>
                        handleDeclineOpenModal(row.student?.email || row.email)
                      }
                      onWapp={() => {
                        handleContactWapp(
                          row.student?.countryCode || row.countryCode,
                          row.student?.cellphone || row.cellphone,
                          row.student?.name || row.name
                        );
                      }}
                      onEvents={() => {
                        if (row.teacher?.id) navigate(PATH_DASHBOARD.admin.events(row.teacher.id));
                      }}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      refreshBookings={refreshBookings}
                    />
                  </Box>
                ))}
              {bookingListKind === 'lesson' && activeListTab === 1 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes sin instructor: abrí esta página en escritorio para asignar o cancelar.
                  </Typography>
                </Box>
              )}
              {openDrawer && selectedBooking && (
                bookingListKind === 'gear' ? (
                  <GearBookingDetailsDrawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    booking={selectedBooking}
                    refreshBookings={refreshBookings}
                  />
                ) : (
                  <BookingDetailsDrawer
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                    booking={selectedBooking}
                    refreshBookings={refreshBookings}
                  />
                )
              )}
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

export default function AdminReviewBookings() {
  return (
    <AdminBookingsPage
      bookingListKind="lesson"
      pageTitle="Admin Review: List"
      heading="Bookings Reveiw List"
    />
  );
}
