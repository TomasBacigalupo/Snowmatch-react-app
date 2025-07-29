import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { fCurrency } from 'src/utils/formatNumber';
import { calculateTeacherPay } from 'src/utils/calculateTeacherPay';
import { uploadInvoice } from 'src/redux/slices/bookings';

const InvoiceUpload = ({ booking, teacherLevel, onUploadSuccess }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalToCharge = calculateTeacherPay(teacherLevel, booking.eventList);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setError('Por favor selecciona un archivo PDF, JPEG o PNG');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await dispatch(uploadInvoice(
        booking.id,
        selectedFile,
        booking.teacher.id,
        totalToCharge,
        booking.eventList.length
      ));
      
      setSuccess('Factura subida exitosamente');
      setSelectedFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setError('Error al subir la factura. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Subir Factura
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Total a cobrar:</strong> {fCurrency(totalToCharge)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Basado en {booking.eventList.length} días de clase
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <input
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          id="invoice-file"
          type="file"
          onChange={handleFileSelect}
        />
        <label htmlFor="invoice-file">
          <Button
            variant="outlined"
            component="span"
            startIcon={<UploadIcon />}
            disabled={uploading}
            fullWidth
          >
            Seleccionar Factura
          </Button>
        </label>
      </Box>

      {selectedFile && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Archivo seleccionado: {selectedFile.name}
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        fullWidth
        startIcon={uploading ? <CircularProgress size={20} /> : null}
      >
        {uploading ? 'Subiendo...' : 'Subir Factura'}
      </Button>
    </Paper>
  );
};

export default InvoiceUpload; 