import { paramCase } from 'change-case';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  Container,
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
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../components/table';
// sections
import { AdminTableToolbar, AdminTableRow } from '../../sections/@dashboard/admin/list';
import TeacherDetailsDrawer from 'src/sections/@dashboard/admin/list/TeacherDetailsDrawer';
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers, getResortAdminTeachers, openModal, closeModal } from '../../redux/slices/admin';
import useAuth from '../../hooks/useAuth';
import { DialogAnimate } from '../../components/animate';
import DeclineForm from '../../sections/@dashboard/admin/DeclineForm';
import AdminTableCard from 'src/sections/@dashboard/admin/list/AdminTableCard';

const SORT_BY_OPTIONS = ['priority', 'id'];
const ROLE_OPTIONS = ['TEACHER', 'STUDENT'];

// ----------------------------------------------------------------------

export default function AdminReview() {
  const { t } = useTranslation();
  const tableHead = useMemo(
    () => [
      { id: 'id', label: t('adminReview.table.id'), align: 'left' },
      { id: 'name', label: t('adminReview.table.name'), align: 'left' },
      { id: 'level', label: t('adminReview.table.level'), align: 'left' },
      { id: 'priority', label: t('adminReview.table.priority'), align: 'left' },
      { id: 'isAuthorized', label: t('adminReview.table.authorized'), align: 'center' },
      { id: 'state', label: t('adminReview.table.state'), align: 'left' },
    ],
    [t]
  );

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    onSort,
    onChangeDense,
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
  const [filterSortBy, setFilterSortBy] = useState(isResortAdmin ? 'priority' : 'id');
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

  const handleFilterSortBy = (event) => {
    setFilterSortBy(event.target.value);
    setPage(0);
  };

  const handleDeclineOpenModal = (email) => {
    dispatch(openModal(email));
  };

  const handleDeclineCloseModal = () => {
    dispatch(closeModal());
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
        {tableHead.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align}>
            <Skeleton width="80%" height={dense ? 20 : 24} />
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
      dispatch(getResortAdminTeachers(pageNum, filterRole, filterName, filterLevel, size, filterSortBy));
    } else {
      dispatch(getTeachers(pageNum, filterRole, filterName, filterLevel, size, filterResort, filterSortBy));
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
  }, [filterRole, filterName, filterLevel, filterResort, filterSortBy, isResortAdmin]);

  return (
    <Page title={t('adminReview.pageTitle')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('adminReview.heading')}
          links={[
            { name: t('menu.dashboard'), href: PATH_DASHBOARD.root },
            { name: t('menu.admin'), href: PATH_DASHBOARD.admin.root },
            { name: t('adminReview.breadcrumb.review') },
          ]}
        />

        <Card>
          <AdminTableToolbar
            filterName={filterNameInput}
            filterRole={filterRole}
            filterLevel={filterLevel}
            filterResort={filterResort}
            filterSortBy={filterSortBy}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            onFilterLevel={handleFilterLevel}
            onFilterResort={handleFilterResort}
            onFilterSortBy={handleFilterSortBy}
            optionsRole={ROLE_OPTIONS}
            optionsSortBy={SORT_BY_OPTIONS}
            showSearchAdmin={false}
            showRole={false}
            showMonth={false}
            showTeacherId={false}
            showStudentId={false}
            showResort
            showSortBy
            lockResort={lockedResort}
          />

          <Scrollbar>
            <Hidden smDown>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHead}
                    onSort={onSort}
                  />

                  <TableBody>
                    {isLoading
                      ? renderTableSkeleton()
                      : tableData?.map((row) => (
                          <AdminTableRow
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
                      showRole={false}
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
              label={t('adminReview.dense')}
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>

        <TeacherDetailsDrawer open={drawerOpen} onClose={handleCloseDrawer} teacher={selectedTeacher} />

        <DialogAnimate open={isOpenModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{t('adminReview.declineDialog.title')}</DialogTitle>
          <DeclineForm email={selectedEmail} onCancel={handleDeclineCloseModal} />
        </DialogAnimate>
      </Container>
    </Page>
  );
}
