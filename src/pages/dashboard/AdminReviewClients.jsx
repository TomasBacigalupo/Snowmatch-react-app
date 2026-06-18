import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  DialogTitle,
} from '@mui/material';
import Hidden from 'src/components/LegacyHidden';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator } from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import { AdminTableToolbar } from '../../sections/@dashboard/admin/list';
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers, openModal, closeModal, setClientContacted } from '../../redux/slices/admin';
import { DialogAnimate } from '../../components/animate';
import DeclineForm from '../../sections/@dashboard/admin/DeclineForm';
import AdminTableCard from 'src/sections/@dashboard/admin/list/AdminTableCard';
import AdminTableRowClients from 'src/sections/@dashboard/admin/list/AdminTableRowClients';
import ClientDetailsDrawer from 'src/sections/@dashboard/admin/list/ClientDetailsDrawer';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = ['TEACHER', 'STUDENT'];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phone', label: 'Telefono', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'credits', label: 'Creditos', align: 'left' },
  { id: 'contacted', label: 'Contacted', align: 'center' },
];

// ----------------------------------------------------------------------

export default function AdminReviewClients() {
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
    onChangeRowsPerPage,
  } = useTable({ defaultRowsPerPage: 10 });

  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [filterNameInput, setFilterNameInput] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(ROLE_OPTIONS[1]);
  const [filterLevel, setFilterLevel] = useState(0);
  const [filterResort, setFilterResort] = useState('');

  const debounceRef = useRef(null);

  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    setFilterResort(event.target.value);
    setPage(0);
  };

  const handleDeclineOpenModal = (email) => {
    dispatch(openModal(email));
  };

  const handleDeclineCloseModal = () => {
    dispatch(closeModal());
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
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

  const dispatch = useDispatch();
  const { teachers, isOpenModal, selectedEmail } = useSelector((state) => state.admin);

  const onChangePage2 = (event, newPage) => {
    dispatch(getTeachers(newPage, filterRole, filterName, filterLevel, rowsPerPage, filterResort));
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onChangeRowsPerPage(event);
    setPage(0);
    dispatch(getTeachers(0, filterRole, filterName, filterLevel, Number(event.target.value), filterResort));
  };

  const handleRowClick = (row) => {
    setSelectedClient(row);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedClient(null);
  };

  useEffect(() => {
    let data = teachers ?? [];
    if (filterResort) {
      data = data.filter((client) => {
        const enumMatch = Array.isArray(client.resortsEnum)
          && client.resortsEnum.some((r) => String(r) === filterResort || r?.name === filterResort);
        const legacyMatch = Array.isArray(client.resorts)
          && client.resorts.some((r) => String(r) === filterResort);
        return enumMatch || legacyMatch;
      });
    }
    setTableData(data);
  }, [teachers, filterResort]);

  useEffect(() => {
    dispatch(getTeachers(0, filterRole, filterName, filterLevel, rowsPerPage, filterResort));
    setPage(0);
  }, [filterRole, filterName, filterLevel, filterResort]);

  return (
    <Page title="Admin Clients: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Clients List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Clients' },
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
            showRole={false}
            showLevel={false}
            showMountain={false}
            showTeacherId={false}
            showMonth={false}
            showStudentId={false}
            showSearchAdmin={false}
            showResort={true}
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
                      onSelectAllRows(checked, tableData?.map((row) => row.id))
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
                      onSelectAllRows(checked, tableData?.map((row) => row.id))
                    }
                  />

                  <TableBody>
                    {tableData?.map((row) => (
                      <AdminTableRowClients
                        key={row.userId}
                        row={row}
                        selected={selected.includes(row.userId)}
                        onSelectRow={() => onSelectRow(row.userId)}
                        onEditRow={() => handleEditRow(row.id)}
                        onConfirmRow={() => handleConfirmRow(row.id)}
                        onDeclineRow={() => handleDeclineOpenModal(row.email)}
                        onWapp={() => handleContactWapp(row.countryCode, row.cellphone, row.name)}
                        onEvents={() => navigate(PATH_DASHBOARD.admin.events(row.id))}
                        onContactedChange={(contacted) => dispatch(setClientContacted(row.id, contacted))}
                        onClick={() => handleRowClick(row)}
                      />
                    ))}
                    <TableEmptyRows height={denseHeight} emptyRows={0} />
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Hidden>

            <Hidden smUp>
              {tableData?.map((row) => (
                <AdminTableCard
                  key={row.userId}
                  row={row}
                  selected={selected.includes(row.userId)}
                  onSelectRow={() => onSelectRow(row.userId)}
                  onEditRow={() => handleEditRow(row.id)}
                  onConfirmRow={() => handleConfirmRow(row.id)}
                  onDeclineRow={() => handleDeclineOpenModal(row.email)}
                  onWapp={() => handleContactWapp(row.countryCode, row.cellphone, row.name)}
                  onEvents={() => navigate(PATH_DASHBOARD.admin.events(row.id))}
                  onContactedChange={(contacted) => dispatch(setClientContacted(row.id, contacted))}
                  onClick={() => handleRowClick(row)}
                />
              ))}
            </Hidden>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={-1}
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

        <DialogAnimate open={isOpenModal} onClose={handleDeclineCloseModal}>
          <DialogTitle>{'Seguro que queres declinar?'}</DialogTitle>
          <DeclineForm email={selectedEmail} onCancel={handleDeclineCloseModal} />
        </DialogAnimate>

        <ClientDetailsDrawer
          open={isDrawerOpen}
          onClose={handleCloseDrawer}
          client={selectedClient}
        />
      </Container>
    </Page>
  );
}
