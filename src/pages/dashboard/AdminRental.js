import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
  Alert,
  Snackbar,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  InputAdornment,
  Skeleton,
  Checkbox,
  useTheme,
  useMediaQuery,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
import { emptyRows } from '../../hooks/useTable';
// sections
import RentalProductForm from '../../sections/@dashboard/admin/rental/RentalProductForm';
import RentalFiltersBar from '../../sections/@dashboard/admin/rental/RentalFiltersBar';
// redux
import { getRentalItems, createRentalItem, updateRentalItem, deleteRentalItem } from '../../redux/slices/rental';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'image', label: 'Imagen', align: 'left' },
  { id: 'name', label: 'Nombre', align: 'left' },
  { id: 'category', label: 'Categoría', align: 'left' },
  { id: 'pricePerDay', label: 'Precio/día', align: 'right' },
  { id: 'variants', label: 'Variantes', align: 'center' },
  { id: 'status', label: 'Estado', align: 'center' },
  { id: 'actions', label: 'Acciones', align: 'center' },
];

const CATEGORY_OPTIONS = [
  { value: 'SKI', label: 'Ski' },
  { value: 'SNOWBOARD', label: 'Snowboard' },
  { value: 'POLES', label: 'Bastones' },
  { value: 'BOOTS', label: 'Botas' },
  { value: 'COMBO', label: 'Combo' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Activo', color: 'success' },
  { value: 'INACTIVE', label: 'Inactivo', color: 'default' },
  { value: 'OUT_OF_STOCK', label: 'Sin Stock', color: 'warning' },
];

// ----------------------------------------------------------------------

export default function AdminRental() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  // State for rental items
  const { items, loading, error, successMessage } = useSelector((state) => state.rental);
  
  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResort, setFilterResort] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  
  // Modal states
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load rental items on component mount
  useEffect(() => {
    loadRentalItems();
  }, [page, rowsPerPage, filterName, filterCategory, filterStatus, filterResort, orderBy, order]);

  const loadRentalItems = async () => {
    const filters = {
      page,
      size: rowsPerPage,
      name: filterName || undefined,
      category: filterCategory !== 'all' ? filterCategory : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      resortId: filterResort || undefined,
      sortBy: orderBy,
      sortOrder: order,
    };
    
    await dispatch(getRentalItems(filters));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleSelectAllRows = (event) => {
    if (event.target.checked) {
      const newSelecteds = items.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleOpenForm = (item = null) => {
    setEditingItem(item);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setOpenForm(false);
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem) {
        await dispatch(updateRentalItem({ id: editingItem.id, ...itemData }));
      } else {
        await dispatch(createRentalItem(itemData));
      }
      handleCloseForm();
      loadRentalItems();
    } catch (error) {
      console.error('Error saving rental item:', error);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await dispatch(deleteRentalItem(itemToDelete.id));
      setOpenDeleteDialog(false);
      setItemToDelete(null);
      loadRentalItems();
    }
  };

  const handleBulkDelete = async () => {
    // Implement bulk delete functionality
    console.log('Bulk delete selected items:', selected);
  };

  const filteredItems = items || [];
  const isNotFound = !filteredItems.length && !loading;

  return (
    <Page title="Admin: Rental Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Gestión de Productos de Rental"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.root },
            { name: 'Rental' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => handleOpenForm()}
            >
              Nuevo Producto
            </Button>
          }
        />

        <Stack spacing={3}>
          {/* Filters Bar */}
          <RentalFiltersBar
            filterName={filterName}
            filterCategory={filterCategory}
            filterStatus={filterStatus}
            filterResort={filterResort}
            onFilterName={setFilterName}
            onFilterCategory={setFilterCategory}
            onFilterStatus={setFilterStatus}
            onFilterResort={setFilterResort}
            categoryOptions={CATEGORY_OPTIONS}
            statusOptions={STATUS_OPTIONS}
          />

          {/* Selected Actions */}
          {selected.length > 0 && (
            <TableSelectedActions
              numSelected={selected.length}
              rowCount={filteredItems.length}
              onSelectAllRows={handleSelectAllRows}
              actions={
                <Tooltip title="Eliminar seleccionados">
                  <IconButton color="primary" onClick={handleBulkDelete}>
                    <Iconify icon="eva:trash-2-fill" />
                  </IconButton>
                </Tooltip>
              }
            />
          )}

          {/* Products Table */}
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                <Table>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={filteredItems.length}
                    numSelected={selected.length}
                    onSort={handleSort}
                    onSelectAllRows={handleSelectAllRows}
                  />

                  <TableBody>
                    {filteredItems
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { id, name, description, category, pricePerDay, imageUrl, status, variants } = row;
                        const isItemSelected = selected.indexOf(id) !== -1;

                        return (
                          <TableRow
                            hover
                            key={id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={() => handleSelectRow(id)}
                              />
                            </TableCell>

                            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                alt={name}
                                src={imageUrl}
                                variant="rounded"
                                sx={{ width: 48, height: 48, mr: 2 }}
                              />
                            </TableCell>

                            <TableCell>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {description}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={CATEGORY_OPTIONS.find(cat => cat.value === category)?.label || category}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell align="right">
                              <Typography variant="subtitle2">
                                ${pricePerDay?.toFixed(2)}
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <Typography variant="body2">
                                {variants?.length || 0} variantes
                              </Typography>
                            </TableCell>

                            <TableCell align="center">
                              <Chip
                                label={STATUS_OPTIONS.find(st => st.value === status)?.label || status}
                                color={STATUS_OPTIONS.find(st => st.value === status)?.color || 'default'}
                                size="small"
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Tooltip title="Editar">
                                <IconButton onClick={() => handleOpenForm(row)}>
                                  <Iconify icon="eva:edit-fill" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton color="error" onClick={() => handleDeleteClick(row)}>
                                  <Iconify icon="eva:trash-2-fill" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <TableEmptyRows
                      height={52}
                      emptyRows={emptyRows(page, rowsPerPage, filteredItems.length)}
                    />
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={filteredItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Stack>

        {/* Product Form Modal */}
        <Dialog
          open={openForm}
          onClose={handleCloseForm}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <DialogContent>
            <RentalProductForm
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={handleCloseForm}
              categoryOptions={CATEGORY_OPTIONS}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que quieres eliminar el producto "{itemToDelete?.name}"?
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error Messages */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => dispatch({ type: 'rental/clearMessage' })}
        >
          <Alert severity="success" onClose={() => dispatch({ type: 'rental/clearMessage' })}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => dispatch({ type: 'rental/clearError' })}
        >
          <Alert severity="error" onClose={() => dispatch({ type: 'rental/clearError' })}>
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
} 