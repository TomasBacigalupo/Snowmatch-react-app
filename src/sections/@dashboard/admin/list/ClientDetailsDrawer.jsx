import { Drawer, Box, IconButton, Typography, Stack, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacher, getBookings } from 'src/redux/slices/admin';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import Label from 'src/components/Label';
import { useTheme } from '@mui/material/styles';

export default function ClientDetailsDrawer({ open, onClose, client }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { teacher, bookings } = useSelector((state) => state.admin);
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied to clipboard!', { variant: 'success' });
  };

  useEffect(() => {
    if (client?.id) {
      dispatch(getTeacher(client.id));
      dispatch(getBookings(undefined, client.id, undefined, undefined, undefined, undefined)); // Get all bookings for this teacher
    }
  }, [dispatch, client?.id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDateRange = (eventList) => {
    if (!eventList?.length) return '-';
    const dates = eventList.map(event => new Date(event.end));
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (!teacher) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: { 
          width: { 
            xs: '100%', 
            sm: 600,
            md: 800 
          },
          '& .MuiDrawer-paper': {
            width: { 
              xs: '100%', 
              sm: 600,
              md: 800 
            },
            boxSizing: 'border-box',
          },
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Client Details</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
            <Typography variant="body1">{teacher.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{teacher.email}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
            <Typography variant="body1">{teacher.cellphone}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Credits</Typography>
            <Typography variant="body1">{teacher.proCheckCredits}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">State</Typography>
            <Typography variant="body1">{teacher.state}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Role</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Notification Token</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1">{teacher.notificationToken}</Typography>
              <IconButton 
                size="small" 
                onClick={() => handleCopyToClipboard(teacher.notificationToken)}
                sx={{ ml: 1 }}
              >
                <Iconify icon="eva:copy-fill" width={20} height={20} />
              </IconButton>
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Country Code</Typography>
            <Typography variant="body1">{teacher.countryCode}</Typography>
          </Box>

          {/* Bookings Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Reservas ({bookings?.length || 0})</Typography>
            {bookings && bookings.length > 0 ? (
              <Card>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Fechas</TableCell>
                        <TableCell>Montaña</TableCell>
                        <TableCell>Capacidad</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>Estado Pago</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id} hover>
                          <TableCell>
                            <Typography variant="body2">{booking.id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.student ? `${booking.student.name} ${booking.student.lastname}` : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {getDateRange(booking.eventList)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{booking.resort || '-'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {booking.adults || 0} adultos
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.children || 0} niños
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="primary.main">
                              {formatPrice(booking.price || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={
                                (booking.paymentStatus === 'PENDING' && 'warning') ||
                                (booking.paymentStatus === 'PAID' && 'success') ||
                                'error'
                              }
                              sx={{ textTransform: 'capitalize' }}
                            >
                              {booking.paymentStatus || 'PENDING'}
                            </Label>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay reservas para este cliente.
              </Typography>
            )}
          </Box>
          {/* Add more client details as needed */}
        </Stack>
      </Box>
    </Drawer>
  );
} 