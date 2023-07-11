import { DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { DialogAnimate } from "src/components/animate";

ConfirmDeclineModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onDecline: PropTypes.func,
}

export default function ConfirmDeclineModal({
    isOpen = false,
    onClose = null,
    onDecline = null,
}) {
    return (
        <DialogAnimate open={isOpen} onClose={onClose}>
            <DialogTitle>Rechazar Clase</DialogTitle>
            <DialogContent>
                <Typography>
                    ¿Estás seguro que deseas rechazar la clase?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='outlined'
                    onClick={onClose}
                >
                    Cancelar
                </Button>
                <Button
                    variant='contained'
                    onClick={onDecline}
                >
                    Rechazar
                </Button>
            </DialogActions>
        </DialogAnimate>
    )
}