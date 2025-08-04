import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
// @mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  InputAdornment,
  Alert,
  Chip,
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
// redux
import { useDispatch } from 'react-redux';
import { editPayout } from '../../../../redux/slices/admin';

PayoutEditModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  payout: PropTypes.object,
  onSave: PropTypes.func,
  selectedBookingId: PropTypes.number,
};

export default function PayoutEditModal({ open, onClose, payout, onSave, selectedBookingId }) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(payout?.amount?.toString() || '');
  const [bookingIds, setBookingIds] = useState(
    payout?.bookingIds?.join(', ') || (selectedBookingId ? selectedBookingId.toString() : '')
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Por favor selecciona un archivo válido (JPG, PNG o PDF)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 10MB permitido.');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError('');
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor ingresa un monto válido');
      return;
    }

    if (!bookingIds.trim()) {
      setError('Por favor ingresa al menos un ID de reserva');
      return;
    }

    // Parse booking IDs
    const parsedBookingIds = bookingIds
      .split(',')
      .map(id => id.trim())
      .filter(id => id && !isNaN(id))
      .map(id => parseInt(id, 10));

    if (parsedBookingIds.length === 0) {
      setError('Por favor ingresa IDs de reserva válidos');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let invoiceUrl = payout?.invoiceUrl || '';

      // If a new file is selected, upload it first
      if (selectedFile) {
        // Get presigned URL for upload
        const presignedResponse = await fetch(`/api/payouts/preSignedUrlPayout/${payout.id}`);
        const presignedUrl = await presignedResponse.text();

        // Upload file to S3
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: selectedFile,
          headers: {
            'Content-Type': selectedFile.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file to S3');
        }

        invoiceUrl = presignedUrl.split('?')[0];
      }

      // Update payout
      const payoutData = {
        amount: parseFloat(amount),
        bookingIds: parsedBookingIds,
        invoiceUrl: invoiceUrl,
      };

      await dispatch(editPayout(payout.id, payoutData));

      setUploading(false);
      onSave();
      handleClose();
    } catch (error) {
      setUploading(false);
      setError('Error al actualizar el payout. Por favor intenta nuevamente.');
      console.error('Error updating payout:', error);
    }
  };

  const handleClose = () => {
    setAmount(payout?.amount?.toString() || '');
    setBookingIds(payout?.bookingIds?.join(', ') || (selectedBookingId ? selectedBookingId.toString() : ''));
    setSelectedFile(null);
    setFileName('');
    setError('');
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:edit-fill" />
          <Typography variant="h6">Editar Payout #{payout?.id}</Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Monto"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            helperText="Monto actual del payout"
          />

          <TextField
            fullWidth
            label="IDs de Reservas"
            value={bookingIds}
            onChange={(e) => setBookingIds(e.target.value)}
            helperText="IDs de reservas separados por comas (ej: 45, 67, 89)"
          />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Comprobante de Transferencia
            </Typography>
            
            {payout?.invoiceUrl && !selectedFile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Comprobante actual:
                </Typography>
                <Chip
                  label="Ver comprobante actual"
                  onClick={() => window.open(payout.invoiceUrl, '_blank')}
                  color="primary"
                  variant="outlined"
                  clickable
                />
              </Box>
            )}

            {fileName && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Nuevo archivo seleccionado:
                </Typography>
                <Chip
                  label={fileName}
                  onDelete={() => {
                    setSelectedFile(null);
                    setFileName('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  color="primary"
                />
              </Box>
            )}

            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:upload-fill" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Subiendo...' : 'Seleccionar Nuevo Comprobante'}
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Formatos permitidos: JPG, PNG, PDF (máximo 10MB)
            </Typography>
          </Box>

          {payout && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Información del Payout:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>ID:</strong> {payout.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Monto actual:</strong> {formatPrice(payout.amount)}
                </Typography>
                {payout.transferDate && (
                  <Typography variant="body2">
                    <strong>Fecha de transferencia:</strong> {new Date(payout.transferDate).toLocaleDateString('es-AR')}
                  </Typography>
                )}
                {payout.status && (
                  <Typography variant="body2">
                    <strong>Estado:</strong> {payout.status}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={!amount || !bookingIds.trim() || uploading}
        >
          {uploading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </Dialog>
  );
} 