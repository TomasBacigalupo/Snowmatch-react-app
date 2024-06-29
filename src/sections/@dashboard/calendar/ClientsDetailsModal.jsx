import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar } from '@mui/material';
import useLocales from 'src/hooks/useLocales';




const ClientDetailsModal = ({ showClientDetails, setShowClientDetails, currentClient }) => {
    const { translate } = useLocales()
    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = (phone) => {
        window.location.href = `https://wa.me/${phone}`;
    };
    return (
        <Dialog open={showClientDetails} onClose={() => setShowClientDetails(false)}>
            <DialogTitle>
                <Box display='flex' alignItems='center'>
                    <Avatar sx={{
                        mr: 1,
                    }} /> {`${currentClient?.name} ${currentClient?.lastname}`}
                </Box>
            </DialogTitle>
            <DialogContent>
                {currentClient && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>{`Nivel: ${translate('school.clients.form.' + currentClient.level)}`}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">{`Telefono: ${currentClient?.countryCode} ${currentClient?.cellphone}`}</Typography>
                            <Typography variant="body2">{`Notas: ${currentClient?.notes}`}</Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {currentClient && (
                    <>
                        <Button
                            variant="outlined"
                            fullWidth
                            color="primary"
                            onClick={() => handleCall(currentClient?.countryCode + currentClient?.cellphone)}
                            sx={{
                                mr: 1,
                                height: 56,
                            }}
                        >
                            Llamar
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            color="success"
                            onClick={() => handleWhatsApp(currentClient?.countryCode + currentClient?.cellphone)}
                            sx={{
                                mr: 1,
                                height: 56,
                            }}
                        >
                            WhatsApp
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ClientDetailsModal;
