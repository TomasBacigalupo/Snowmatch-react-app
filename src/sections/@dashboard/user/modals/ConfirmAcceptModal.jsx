import { DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { DialogAnimate } from "src/components/animate";

ConfirmAcceptModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onAccept: PropTypes.func,
}

export default function ConfirmAcceptModal({
    isOpen = false,
    onClose = null,
    onAccept = null,
}) {
    return (
        <DialogAnimate open={isOpen} onClose={onClose}>
            <DialogTitle>Confirmár Clase</DialogTitle>
            <DialogContent>
                <Typography>
                    ¿Estás seguro que deseas confirmar la clase?
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
                    onClick={onAccept}
                >
                    Aceptar
                </Button>
            </DialogActions>
        </DialogAnimate>
    )
}