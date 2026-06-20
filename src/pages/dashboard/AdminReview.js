import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Tooltip,
  TableBody,
  TableCell,
  TableRow,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  DialogTitle,
  Skeleton,
} from '@mui/material';
import Hidden from 'src/components/LegacyHidden';
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
import TeacherDetailsDrawer from 'src/sections/@dashboard/admin/list/TeacherDetailsDrawer';
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers, getResortAdminTeachers, openModal, closeModal } from '../../redux/slices/admin'
import useAuth from '../../hooks/useAuth';
import { DialogAnimate } from '../../components/animate';
import DeclineForm from '../../sections/@dashboard/admin/DeclineForm';
import AdminTableCard from 'src/sections/@dashboard/admin/list/AdminTableCard';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = ['TEACHER', 'STUDENT'];

const TABLE_HEAD = [
  { id: 'select', label: '', width: 48 },
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'level', label: 'Level', align: 'left' },
  { id: 'isAuthorized', label: 'Authorized', align: 'center' },
  { id: 'state', label: 'State', align: 'left' },
];

// ----------------------------------------------------------------------

export default function AdminReview() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isResortAdmin, user } = useAuth();
  const lockedResort = isResortAdmin ? user?.managedResort : null;
  const { teachers, isOpenModal, selectedEmail, isLoading } = useSelector((state) => state.admin);

  const [tableData, setTableData] = useState([]);
  const [filterNameInput, setFilterNameInput] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(ROLE_OPTIONS[0]);
  const [filterLevel, setFilterLevel] = useState(0);
  const [filterResort, setFilterResort] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const debounceRef = useRef(null);

  const handleFilterName = (value) => {
    setFilterNameInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilterName(value);
      setPage(0);
    }, 400);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
    setPage(0);
  };

  const handleFilterLevel = (event) => {
    setFilterLevel(event.target.value);
    setPage(0);
  };

  const handleFilterResort = (event) => {
    if (lockedResort) return;
    setFilterResort(event.target.value);
    setPage(0);
  };

  const handleDeclineOpenModal = (email) => {
    dispatch(openModal(email));
  };

  const handleDeclineCloseModal = () => {
    dispatch(closeModal());
  };

  const handleDeleteRows = (ids) => {
    setTableData((prev) => prev.filter((row) => !ids.includes(row.id)));
    setSelected([]);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(paramCase(id)));
  };

  const handleConfirmRow = (id) => {
    navigate(PATH_DASHBOARD.admin.confirm(id));
  };

  const handleContactWapp = (countryCode, cellphone, name) => {
    window.open(`https://wa.me/${countryCode}${cellphone}?text=Hola ${name}, `, '_blank');
  };

  const denseHeight = dense ? 52 : 72;
  const isNotFound = !tableData.length && (!!filterName || !!filterResort);
  const paginationCount =
    !isLoading && tableData.length < rowsPerPage ? page * rowsPerPage + tableData.length : -1;

  const renderTableSkeleton = () =>
    Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {TABLE_HEAD.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align} padding={headCell.id === 'select' ? 'checkbox' : 'normal'}>
            <Skeleton width={headCell.id === 'select' ? 24 : '80%'} height={dense ? 20 : 24} />
          </TableCell>
        ))}
      </TableRow>
    ));

  const handleRowClick = (row) => {
    setSelectedTeacher(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const fetchTeachers = (pageNum, size) => {
    if (isResortAdmin) {
      dispatch(getResortAdminTeachers(pageNum, filterRole, filterName, filterLevel, size));
    } else {
      dispatch(getTeachers(pageNum, filterRole, filterName, filterLevel, size, filterResort));
    }
  };

  const onChangePage2 = (event, newPage) => {
    fetchTeachers(newPage, rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onChangeRowsPerPage(event);
    setPage(0);
    fetchTeachers(0, Number(event.target.value));
  };

  useEffect(() => {
    if (!lockedResort) return;
    setFilterResort(lockedResort);
    setPage(0);
  }, [lockedResort, setPage]);

  useEffect(() => {
    let data = teachers ?? [];
    if (!isResortAdmin) {
      const resortToMatch = filterResort || lockedResort;
      if (resortToMatch) {
        data = data.filter((teacher) => {
          const enumMatch = Array.isArray(teacher.resortsEnum)
            && teacher.resortsEnum.some((r) => String(r) === resortToMatch || r?.name === resortToMatch);
          const legacyMatch = Array.isArray(teacher.resorts)
            && teacher.resorts.some((r) => String(r) === resortToMatch);
          return enumMatch || legacyMatch;
        });
      }
    }
    setTableData(data);
  }, [teachers, lockedResort, filterResort, isResortAdmin]);

  useEffect(() => {
    fetchTeachers(0, rowsPerPage);
    setPage(0);
  }, [filterRole, filterName, filterLevel, filterResort, isResortAdmin]);

  return (
    <Page title="Admin Review: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Teacher Review List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Review' },
          ]}
        />

        <Card>
          <AdminTableToolbar
            filterName={filterNameInput}
            filterRole={filterRole}
            filterLevel={filterLevel}
            filterResort={filterResort}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onFilterLevel={handleFilterLevel}
            onFilterResort={handleFilterResort}
            optionsRole={ROLE_OPTIONS}
            showSearchAdmin={false}
            showRole={false}
            showMonth={false}
            showTeacherId={false}
            showStudentId={false}
            showResort
            lockResort={lockedResort}
          />

          <Scrollbar>
            <Hidden smDown>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(checked, tableData.map((row) => row.id))
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
                      onSelectAllRows(checked, tableData.map((row) => row.id))
                    }
                  />

                  <TableBody>
                    {isLoading
                      ? renderTableSkeleton()
                      : tableData?.map((row) => (
                          <AdminTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onConfirmRow={() => handleConfirmRow(row.id)}
                            onDeclineRow={() => handleDeclineOpenModal(row.email)}
                            onWapp={() => handleContactWapp(row.countryCode, row.cellphone, row.name)}
                            onEvents={() => navigate(PATH_DASHBOARD.admin.events(row.id))}
                            onClick={() => handleRowClick(row)}
                          />
                        ))}
                    {!isLoading && <TableEmptyRows height={denseHeight} emptyRows={0} />}
                    <TableNoData isNotFound={!isLoading && isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Hidden>

            <Hidden smUp>
              {isLoading
                ? Array.from({ length: rowsPerPage }).map((_, index) => (
                    <Card key={`card-skeleton-${index}`} sx={{ width: '100%', my: 0.5, p: 2 }}>
                      <Skeleton variant="text" width="60%" height={28} />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="50%" />
                    </Card>
                  ))
                : tableData?.map((row) => (
                    <AdminTableCard
                      key={row.id}
                      row={row}
                      onEditRow={() => handleEditRow(row.id)}
                      onConfirmRow={() => handleConfirmRow(row.id)}
                      onDeclineRow={() => handleDeclineOpenModal(row.email)}
                      onWapp={() => handleContactWapp(row.countryCode, row.cellphone, row.name)}
                      onEvents={() => navigate(PATH_DASHBOARD.admin.events(row.id))}
                      onClick={() => handleRowClick(row)}
                    />
                  ))}
            </Hidden>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={paginationCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage2}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>

        <TeacherDetailsDrawer open={drawerOpen} onClose={handleCloseDrawer} teacher={selectedTeacher} />

        <DialogAnimate open={isOpenModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{'Seguro que queres Eliminar la reserva?'}</DialogTitle>
          <DeclineForm email={selectedEmail} onCancel={handleDeclineCloseModal} />
        </DialogAnimate>
      </Container>
    </Page>
  );
}
