import PropTypes from 'prop-types';
// @mui
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import useLocales from 'src/hooks/useLocales';

ConfirmationDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default function ConfirmationDialog({ open, onClose }) {
    const {translate} = useLocales()
    const handleConfirm = () => {
        // Aquí puedes agregar la lógica para procesar la confirmación
        // Puede ser el envío de datos a través de una API, actualización del estado, etc.
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{translate('reservationDialog.title')}</DialogTitle>
            <DialogContent>
                <Typography gutterBottom>
                    {translate('reservationDialog.content')}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {translate('reservationDialog.cancelationMessage')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleConfirm} sx={{ ml: 1 }}>
                    {translate('reservationDialog.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
