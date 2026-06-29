import { paramCase } from 'change-case';
import { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ADMIN_BOOKING_RESORT_FILTER_OPTIONS } from 'src/utils/adminBookingResortOptions';
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
  TableCell,
  TableRow,
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
  Skeleton,
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
import { getTeachers, openModal, closeModal, getBooking, getBookings, getResortAdminBookings, getBookingIntents, getResortAdminBookingIntents, openEditBookingModal, deleteBooking, openDeleteModal, closeDeleteModal } from '../../redux/slices/admin'
import { DialogAnimate } from '../../components/animate';
import DeclineForm from '../../sections/@dashboard/admin/DeclineForm';
import AdminTableCard from 'src/sections/@dashboard/admin/list/AdminTableCard';
import AdminBookingTableRow from 'src/sections/@dashboard/admin/list/AdminBookingTableRow';
import AdminBookingTableCard from 'src/sections/@dashboard/admin/list/AdminBookingTableCard';
import AdminBookingIntentTableRow from 'src/sections/@dashboard/admin/list/AdminBookingIntentTableRow';
import BookingModal from 'src/sections/@dashboard/admin/BookingModal';
import GearBookingModal from 'src/sections/@dashboard/admin/GearBookingModal';
import BookingSummary from 'src/sections/@dashboard/admin/list/BookingSummary';
import useAuth from 'src/hooks/useAuth';
import BookingDetailsDrawer from 'src/sections/@dashboard/admin/list/BookingDetailsDrawer';
import GearBookingDetailsDrawer from 'src/sections/@dashboard/admin/list/GearBookingDetailsDrawer';

// ---------------------------------------------------------------------


const ROLE_OPTIONS = [
  'PENDING', 'ACCEPTED', 'DECLINED'
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
  const { t } = useTranslation();

  const tableHead = useMemo(
    () => [
      { id: 'id', label: t('adminBookings.table.id'), align: 'left' },
      { id: 'student', label: t('adminBookings.table.student'), align: 'left' },
      { id: 'teacher', label: t('adminBookings.table.teacher'), align: 'left' },
      { id: 'events', label: t('adminBookings.table.classes'), align: 'left' },
      { id: 'hours', label: t('adminBookings.table.hours'), align: 'left' },
      { id: 'dates', label: t('adminBookings.table.dates'), align: 'left' },
      { id: 'resort', label: t('adminBookings.table.resort'), align: 'left' },
      { id: 'capacity', label: t('adminBookings.table.capacity'), align: 'left' },
      { id: 'price', label: t('adminBookings.table.price'), align: 'left' },
      { id: 'internalComment', label: t('adminBookings.table.internalComment'), align: 'left' },
      { id: 'includes', label: t('adminBookings.table.includes'), align: 'left' },
      { id: 'paymentStatus', label: t('adminBookings.table.paymentStatus'), align: 'left' },
    ],
    [t]
  );

  const tableHeadGear = useMemo(
    () => [
      { id: 'id', label: t('adminBookings.table.id'), align: 'left' },
      { id: 'student', label: t('adminBookings.table.student'), align: 'left' },
      { id: 'state', label: t('adminBookings.table.state'), align: 'left' },
      { id: 'resort', label: t('adminBookings.table.center'), align: 'left' },
      { id: 'price', label: t('adminBookings.table.price'), align: 'left' },
      { id: 'paymentStatus', label: t('adminBookings.table.paymentStatus'), align: 'left' },
      { id: 'comments', label: t('adminBookings.table.notes'), align: 'left' },
    ],
    [t]
  );

  const tableHeadIntent = useMemo(
    () => [
      ...tableHead,
      { id: 'actions', label: t('adminBookings.table.actions'), align: 'right' },
    ],
    [tableHead, t]
  );

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

  const { user, isResortAdmin } = useAuth();
  const lockedResort = isResortAdmin ? user?.managedResort : null;

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
    bookingListKind === 'lesson' ? (lockedResort || 'CERRO_CATEDRAL') : (lockedResort || '')
  );
  /** Calendar year for month/day filters (must match lesson event dates in DB). */
  const [filterYear, setFilterYear] = useState(() => new Date().getFullYear());
  const [filterDate, setFilterDate] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [listTab, setListTab] = useState(0);
  const filterStatus = 'all';
  const activeListTab = bookingListKind === 'lesson' ? listTab : 0;
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hasLoadedBookings, setHasLoadedBookings] = useState(false);
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
    // Resort filter is handled entirely client-side because the DB has inconsistent
    // formats (CERRO_CATEDRAL and "Cerro Catedral"). Sending resort to the API only
    // returns one format. Instead: send no resort, load a larger batch (2000 covers
    // a full season at any resort), and filter both formats client-side.
    const resortValue = partial.resort !== undefined ? partial.resort : filterResort;
    const resortActive = !!resortValue;
    const resortForApi = '';
    const effectiveSize = resortActive ? 2000 : (partial.rowsPerPage ?? rowsPerPage);
    const effectivePage = resortActive ? 0 : (partial.page ?? page);
    if (isResortAdmin) {
      dispatch(
        getResortAdminBookings(
          teacherForQuery,
          partial.studentId ?? filterStudentId,
          partial.month ?? filterMonth,
          effectivePage,
          effectiveSize,
          dayArg,
          partial.bookingKind ?? bookingListKind,
          partial.year ?? filterYear,
          stateArg
        )
      );
    } else {
      dispatch(
        getBookings(
          teacherForQuery,
          partial.studentId ?? filterStudentId,
          partial.month ?? filterMonth,
          effectivePage,
          effectiveSize,
          resortForApi,
          dayArg,
          partial.bookingKind ?? bookingListKind,
          partial.year ?? filterYear,
          stateArg
        )
      );
    }
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
    if (lockedResort) return;
    setFilterResort(event.target.value);
    setPage(0);
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
    window.open(`https://wa.me/${countryCode}${cellphone}?text=${encodeURIComponent(t('adminBookings.whatsappGreeting', { name }))}`, '_blank')
  }

  const displayBookings = useMemo(() => {
    let rows = tableData ?? [];
    if (filterResort) {
      const resortLabel = ADMIN_BOOKING_RESORT_FILTER_OPTIONS.find((o) => o.value === filterResort)?.label;
      rows = rows.filter((row) => row.resort === (resortLabel ?? filterResort) || row.resort === filterResort);
      // API year filter keys on booking creation date, not lesson date — filter by event year client-side
      if (filterYear) {
        rows = rows.filter((row) =>
          Array.isArray(row.eventList) && row.eventList.some((e) => new Date(e.start).getFullYear() === filterYear)
        );
      }
    }
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
  }, [tableData, filterName, filterResort, filterYear, order, orderBy]);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = displayBookings.length === 0;

  const dispatch = useDispatch();

  const { teachers: reduxTeachers, isOpenModal, isOpenEditBookingModal, isOpenDeleteModal, selectedEmail, selectedBookingId, bookings, bookingIntents, isLoadingBookings } = useSelector((state) => state.admin);

  // When resort is active, we loaded all records and paginate client-side.
  const pagedBookings = useMemo(() => {
    if (!filterResort) return displayBookings;
    const start = page * rowsPerPage;
    return displayBookings.slice(start, start + rowsPerPage);
  }, [displayBookings, filterResort, page, rowsPerPage]);

  const displayRows = activeListTab === 0 ? pagedBookings : (bookingIntents ?? []);

  console.log('Modal states:', { isOpenDeleteModal, selectedBookingId });

  const [reqPage, setReqPage] = useState(0);

  const onChangePage2 = async (event, newPage) => {
    setPage(newPage);
    if (!filterResort) dispatchBookings({ page: newPage });
  };

  const onChangePage3 = (event, newPage) => {
    dispatch(getTeachers(newPage, filterRole))
    setTableData(reduxTeachers ?? [])
    setPage(newPage)
  }

  const handleTeacherInputChange = (event, newValue) => {
    dispatch(getTeachers(0, "TEACHER", newValue, 0));
  };

  const handleStudentInputChange = (event, newValue) => {
    dispatch(getTeachers(0, "STUDENT", newValue, 0));
  };

  const handleChangeRowsPerPage = (event) => {
    const newSize = Number(event.target.value);
    onChangeRowsPerPage(event);
    if (!filterResort) dispatchBookings({ rowsPerPage: newSize, page: 0 });
  };

  useEffect(() => {
    if (!lockedResort) return;
    setFilterResort(lockedResort);
    setPage(0);
    dispatchBookings({ resort: lockedResort, page: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedResort]);

  useEffect(() => {
    setTableData(bookings ?? []);
  }, [bookings]);

  useEffect(() => {
    if (!isLoadingBookings) {
      setHasLoadedBookings(true);
    }
  }, [isLoadingBookings]);

  useEffect(() => {
    setHasLoadedBookings(false);
  }, [bookingListKind, activeListTab]);

  useEffect(() => {
    if (user) dispatchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, rowsPerPage, bookingListKind]);

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
    if (isResortAdmin) {
      dispatch(
        getResortAdminBookingIntents(
          filterStudentId || undefined,
          filterMonth || undefined,
          page,
          rowsPerPage,
          filterYear
        )
      );
    } else {
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
    }
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

  const tableHeadLabel = bookingListKind === 'gear' ? tableHeadGear : tableHead;

  const activeTableHead = activeListTab === 0 ? tableHeadLabel : tableHeadIntent;
  const showTableSkeleton = isLoadingBookings || (Boolean(user) && !hasLoadedBookings);

  const renderTableSkeleton = () =>
    Array.from({ length: Math.min(rowsPerPage, 10) }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {activeTableHead.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            <Skeleton animation="wave" width="80%" height={dense ? 20 : 24} />
          </TableCell>
        ))}
        {activeListTab === 0 && (
          <TableCell align="right" padding="checkbox">
            <Skeleton animation="wave" variant="circular" width={24} height={24} sx={{ ml: 'auto' }} />
          </TableCell>
        )}
      </TableRow>
    ));

  return (
    <Page title={pageTitle}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={heading}
          action={
            !isResortAdmin && (bookingListKind === 'lesson' || bookingListKind === 'gear') ? (
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
                {bookingListKind === 'gear'
                  ? t('adminBookings.newGearBooking')
                  : t('adminBookings.newBooking')}
              </Button>
            ) : undefined
          }
        />
        {bookingListKind === 'lesson' && (
          <Tabs value={listTab} onChange={(e, v) => setListTab(v)} sx={{ px: 2, mb: 1 }}>
            <Tab label={t('adminBookings.tabs.bookings')} />
            <Tab label={t('adminBookings.tabs.openBookings')} />
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
          hideMoreFilters={isResortAdmin}
          lockResort={lockedResort}
        />
        {!isResortAdmin && (
          <>
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
              {t('adminBookings.showStats')}
            </Button>
            <Collapse in={statsOpen}>
              <BookingSummary
                bookings={activeListTab === 0 ? displayBookings : []}
                isGearBookings={bookingListKind === 'gear'}
              />
            </Collapse>
          </>
        )}
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
          {bookingListKind === 'gear' && (
            <GearBookingModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              refreshBookings={refreshBookings}
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
                      <Tooltip title={t('adminBookings.deleteTooltip')}>
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
                    headLabel={activeListTab === 0 ? tableHeadLabel : tableHeadIntent}
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
                    {showTableSkeleton
                      ? renderTableSkeleton()
                      : activeListTab === 0
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

                    {!showTableSkeleton && <TableEmptyRows height={denseHeight} emptyRows={0} />}

                    <TableNoData
                      isNotFound={
                        !showTableSkeleton &&
                        (activeListTab === 0 ? isNotFound : !(bookingIntents && bookingIntents.length))
                      }
                      title={t('adminBookings.empty.title')}
                      hideImage
                    />
                  </TableBody>
                </Table>
              </TableContainer>
            </Hidden>
            <Hidden smUp>
              {showTableSkeleton
                ? Array.from({ length: Math.min(rowsPerPage, 5) }).map((_, index) => (
                    <Card key={`card-skeleton-${index}`} sx={{ width: '100%', my: 0.5, p: 2 }}>
                      <Skeleton animation="wave" variant="text" width="60%" height={28} />
                      <Skeleton animation="wave" variant="text" width="40%" />
                      <Skeleton animation="wave" variant="text" width="50%" />
                    </Card>
                  ))
                : activeListTab === 0 &&
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
                    {t('adminBookings.mobilePendingHint')}
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
              count={filterResort ? displayBookings.length : -1}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage2}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label={t('adminBookings.dense')}
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
        <DialogAnimate open={isOpenModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{t('adminBookings.declineDialog.title')}</DialogTitle>
          <DeclineForm
            email={selectedEmail}
            onCancel={handleDeclineCloseModal}
          ></DeclineForm>
        </DialogAnimate>
        <DialogAnimate open={isOpenEditBookingModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{t('adminBookings.editDialog.title')}</DialogTitle>
          <DeclineForm
            email={selectedEmail}
            onCancel={handleDeclineCloseModal}
          ></DeclineForm>
        </DialogAnimate>
        <DialogAnimate open={isOpenDeleteModal} onClose={handleDeleteCloseModal}>
          <DialogTitle>{t('adminBookings.deleteDialog.title')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t('adminBookings.deleteDialog.body')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleDeleteCloseModal}>
              {t('adminBookings.deleteDialog.cancel')}
            </Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
              {t('adminBookings.deleteDialog.confirm')}
            </Button>
          </DialogActions>
        </DialogAnimate>
      </Container>
    </Page>
  );
}

export default function AdminReviewBookings() {
  const { t } = useTranslation();

  return (
    <AdminBookingsPage
      bookingListKind="lesson"
      pageTitle={t('adminBookings.pageTitle')}
      heading={t('adminBookings.heading')}
    />
  );
}
