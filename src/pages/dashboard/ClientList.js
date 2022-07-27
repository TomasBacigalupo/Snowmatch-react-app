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
import { ClientTableRow, ClientTableToolbar } from '../../sections/@dashboard/user/list';

// redux
import { getClients, selectClient, deleteClient } from '../../redux/slices/clients'
import { useDispatch, useSelector } from '../../redux/store';

import { useMediaQuery } from 'react-responsive';
import useLocales from 'src/hooks/useLocales';
import HoverButton from 'src/components/HoverButton';



// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all'];

const LEVEL_OPTIONS = [
  'ALL',
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
];



const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'lastname', label: 'Lastname', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'level', label: 'Level', align: 'left' },
  { id: '' },
];

const TABLE_HEAD_MOBILE = [
  { id: '' },
  { id: 'name', label: 'Info', align: 'left' },
  { id: '' },

];

// ----------------------------------------------------------------------

export default function UserList() {
  const {
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
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();



  const dispatch = useDispatch();

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterLevel, setFilterLevel] = useState('ALL');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const { clients } = useSelector((state) =>{return state.clients});

  const { translate } = useLocales()

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterLevel = (event) => {
    setFilterLevel(event.target.value);
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteClient(id));
    const deleteRow = tableData.filter((row) => row.id === id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    dispatch(selectClient(id));
    navigate(PATH_DASHBOARD.school.edit("client"));
  };


  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    setTableData(clients);
  });

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterLevel,
    filterStatus
  });


  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterLevel) ||
    (!dataFiltered.length && !!filterStatus);

const isMobile = useMediaQuery({ query: `(max-width: 760px)` });


  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate("heading.clientList")}
          links={[
            { name: translate('breadcrumb.dashboard'), href: PATH_DASHBOARD.root },
            { name: translate("breadcrumb.school"), href: PATH_DASHBOARD.school.root },
            { name: translate("breadcrumb.agenda") },
          ]}
          action={
            <HoverButton
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.school.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              {translate('school.clients.newClient')}
            </HoverButton>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab disableRipple key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <ClientTableToolbar
            filterName={filterName}
            filterLevel={filterLevel}
            onFilterName={handleFilterName}
            onFilterLevel={handleFilterLevel}
            optionsLevel={LEVEL_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{  position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  numSelected={selected.length}
                  rowCount={tableData.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
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

              <Table size={'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={isMobile? TABLE_HEAD_MOBILE:TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <ClientTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={72} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />


          </Box>
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterLevel, filterStatus }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  }); 

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => (item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) || item.lastname.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterLevel !== 'ALL') {
    tableData = tableData.filter((item) => item.level === filterLevel);
  }

  return tableData;
}
