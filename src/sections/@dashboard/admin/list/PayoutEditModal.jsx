import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

function getIntlLocale(lang) {
  if (lang?.startsWith('pt')) return 'pt-BR';
  if (lang?.startsWith('en')) return 'en-US';
  return 'es-AR';
}

PayoutEditModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  payout: PropTypes.object,
  onSave: PropTypes.func,
  selectedBookingId: PropTypes.number,
};

export default function PayoutEditModal({ open, onClose, payout, onSave, selectedBookingId }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const intlLocale = getIntlLocale(i18n.language);
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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError(t('adminBookings.payoutEdit.invalidFileType'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t('adminBookings.payoutEdit.fileTooLarge'));
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError('');
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError(t('adminBookings.payoutEdit.invalidAmount'));
      return;
    }

    if (!bookingIds.trim()) {
      setError(t('adminBookings.payoutEdit.invalidBookingIds'));
      return;
    }

    const parsedBookingIds = bookingIds
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id && !Number.isNaN(Number(id)))
      .map((id) => parseInt(id, 10));

    if (parsedBookingIds.length === 0) {
      setError(t('adminBookings.payoutEdit.invalidBookingIds'));
      return;
    }

    setUploading(true);
    setError('');

    try {
      let invoiceUrl = payout?.invoiceUrl || '';

      if (selectedFile) {
        const presignedResponse = await fetch(`/api/payouts/preSignedUrlPayout/${payout.id}`);
        const presignedUrl = await presignedResponse.text();

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

      const payoutData = {
        amount: parseFloat(amount),
        bookingIds: parsedBookingIds,
        invoiceUrl,
      };

      await dispatch(editPayout(payout.id, payoutData));

      setUploading(false);
      onSave();
      handleClose();
    } catch (err) {
      setUploading(false);
      setError(t('adminBookings.payoutEdit.updateError'));
      console.error('Error updating payout:', err);
    }
  };

  const handleClose = () => {
    setAmount(payout?.amount?.toString() || '');
    setBookingIds(
      payout?.bookingIds?.join(', ') || (selectedBookingId ? selectedBookingId.toString() : '')
    );
    setSelectedFile(null);
    setFileName('');
    setError('');
    onClose();
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: 'ARS',
    }).format(price);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:edit-fill" />
          <Typography variant="h6">
            {t('adminBookings.payoutEdit.title', { id: payout?.id })}
          </Typography>
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
            label={t('adminBookings.payoutEdit.amount')}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            helperText={t('adminBookings.payoutEdit.amountHelper')}
          />

          <TextField
            fullWidth
            label={t('adminBookings.payoutEdit.bookingIds')}
            value={bookingIds}
            onChange={(e) => setBookingIds(e.target.value)}
            helperText={t('adminBookings.payoutEdit.bookingIdsHelper')}
          />

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('adminBookings.payoutEdit.transferProof')}
            </Typography>

            {payout?.invoiceUrl && !selectedFile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('adminBookings.payoutEdit.currentProof')}
                </Typography>
                <Chip
                  label={t('adminBookings.payoutEdit.viewCurrentProof')}
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
                  {t('adminBookings.payoutEdit.newFileSelected')}
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
              {uploading
                ? t('adminBookings.payoutEdit.uploading')
                : t('adminBookings.payoutEdit.selectNewProof')}
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {t('adminBookings.payoutEdit.fileFormatsHint')}
            </Typography>
          </Box>

          {payout && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('adminBookings.payoutEdit.payoutInfo')}
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>{t('adminBookings.payoutEdit.infoId')}</strong> {payout.id}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('adminBookings.payoutEdit.infoAmount')}</strong>{' '}
                  {formatPrice(payout.amount)}
                </Typography>
                {payout.transferDate && (
                  <Typography variant="body2">
                    <strong>{t('adminBookings.payoutEdit.infoTransferDate')}</strong>{' '}
                    {new Date(payout.transferDate).toLocaleDateString(intlLocale)}
                  </Typography>
                )}
                {payout.status && (
                  <Typography variant="body2">
                    <strong>{t('adminBookings.payoutEdit.infoStatus')}</strong> {payout.status}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          {t('adminBookings.deleteDialog.cancel')}
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!amount || !bookingIds.trim() || uploading}
        >
          {uploading
            ? t('adminBookings.payoutEdit.saving')
            : t('adminBookings.payoutEdit.saveChanges')}
        </Button>
      </DialogActions>

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
