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
  useTheme,
  useMediaQuery,
} from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import TruncatedGearText from '../../components/rental/TruncatedGearText';
import { TableEmptyRows, TableHeadCustom } from '../../components/table';
import { emptyRows } from '../../hooks/useTable';
// sections
import RentalProductForm from '../../sections/@dashboard/admin/rental/RentalProductForm';
import RentalFiltersBar from '../../sections/@dashboard/admin/rental/RentalFiltersBar';
// redux
import { getRentalItems, createRentalItem, updateRentalItem, deleteRentalItem } from '../../redux/slices/rental';
import useAuth from '../../hooks/useAuth';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'image', label: 'Imagen', align: 'left' },
  { id: 'name', label: 'Nombre', align: 'left' },
  { id: 'category', label: 'Categoría', align: 'left' },
  { id: 'provider', label: 'Proveedor', align: 'left' },
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
  const { isResortAdmin, user } = useAuth();
  const lockedResort = isResortAdmin ? user?.managedResort : null;
  
  // State for rental items
  const { items, isLoading, error, successMessage } = useSelector((state) => state.rental);
  
  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterResort, setFilterResort] = useState(lockedResort || 'CERRO_CATEDRAL');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  
  // Modal states
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load rental items on component mount
  useEffect(() => {
    if (lockedResort) {
      setFilterResort(lockedResort);
    }
  }, [lockedResort]);

  useEffect(() => {
    loadRentalItems();
  }, [page, rowsPerPage, filterCategory, filterStatus, filterResort, orderBy, order]);

  const loadRentalItems = async () => {
    const filters = {
      page,
      size: rowsPerPage,
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
      const rentalProviderId =
        itemData.rentalProviderId && String(itemData.rentalProviderId).trim() !== ''
          ? itemData.rentalProviderId
          : null;
      const payload = { ...itemData, rentalProviderId };
      if (editingItem) {
        await dispatch(updateRentalItem({ id: editingItem.id, ...payload })).unwrap();
      } else {
        await dispatch(createRentalItem(payload)).unwrap();
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

  const filteredItems = items || [];
  const isNotFound = !filteredItems.length && !isLoading;

  const renderTableSkeleton = () =>
    Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton variant="rounded" width={48} height={48} />
        </TableCell>
        <TableCell>
          <Stack spacing={0.5}>
            <Skeleton width="80%" height={20} />
            <Skeleton width="60%" height={16} />
          </Stack>
        </TableCell>
        <TableCell>
          <Skeleton width={64} height={24} sx={{ borderRadius: 1 }} />
        </TableCell>
        <TableCell>
          <Skeleton width="70%" height={20} />
        </TableCell>
        <TableCell align="right">
          <Skeleton width={60} height={20} sx={{ ml: 'auto' }} />
        </TableCell>
        <TableCell align="center">
          <Skeleton width={80} height={20} sx={{ mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
          <Skeleton width={64} height={24} sx={{ borderRadius: 1, mx: 'auto' }} />
        </TableCell>
        <TableCell align="center">
          <Stack direction="row" spacing={1} justifyContent="center">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Stack>
        </TableCell>
      </TableRow>
    ));

  return (
    <Page title="Admin: Rental Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Gestión de Productos de Rental"
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
            filterCategory={filterCategory}
            filterStatus={filterStatus}
            filterResort={filterResort}
            onFilterCategory={setFilterCategory}
            onFilterStatus={setFilterStatus}
            onFilterResort={setFilterResort}
            categoryOptions={CATEGORY_OPTIONS}
            statusOptions={STATUS_OPTIONS}
            lockResort={lockedResort}
          />

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
                    onSort={handleSort}
                    appendTrailingActionsLabel={false}
                  />

                  <TableBody>
                    {isLoading
                      ? renderTableSkeleton()
                      : filteredItems
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const {
                          id,
                          name,
                          description,
                          category,
                          pricePerDay,
                          imageUrl,
                          status,
                          variants,
                          rentalProvider,
                        } = row;

                        return (
                          <TableRow hover key={id} tabIndex={-1}>
                            <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                alt={name}
                                src={imageUrl}
                                variant="rounded"
                                sx={{ width: 48, height: 48, mr: 2 }}
                              />
                            </TableCell>

                            <TableCell>
                              <TruncatedGearText variant="subtitle2" text={name} />
                              <TruncatedGearText
                                variant="body2"
                                text={description}
                                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                              />
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={CATEGORY_OPTIONS.find(cat => cat.value === category)?.label || category}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 160 }} title={rentalProvider?.name}>
                                {rentalProvider?.name || '—'}
                              </Typography>
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
                    {!isLoading && (
                      <TableEmptyRows
                        height={52}
                        emptyRows={emptyRows(page, rowsPerPage, filteredItems.length)}
                      />
                    )}
                    {isNotFound && (
                      <TableRow>
                        <TableCell colSpan={TABLE_HEAD.length}>
                          <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                            <Typography variant="h5">
                              Acá vas a ver tus productos en alquiler
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Todavía no tenés ninguno. Creá uno para empezar.
                            </Typography>
                            <Button
                              variant="contained"
                              startIcon={<Iconify icon="eva:plus-fill" />}
                              onClick={() => handleOpenForm()}
                            >
                              Crear producto
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )}
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
              key={editingItem?.id ?? 'create'}
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={handleCloseForm}
              categoryOptions={CATEGORY_OPTIONS}
              lockResort={lockedResort}
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