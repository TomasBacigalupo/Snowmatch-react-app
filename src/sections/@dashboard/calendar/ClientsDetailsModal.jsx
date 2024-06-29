import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';



const ClientDetailsModal = ({ showClientDetails, setShowClientDetails, currentClient }) => {
    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = (phone) => {
        window.location.href = `https://wa.me/${phone}`;
    };
    return (
        <Dialog open={showClientDetails} onClose={() => setShowClientDetails(false)}>
            <DialogContent>
                {currentClient && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h2" gutterBottom>{`${currentClient.name} ${currentClient.lastname}`}</Typography>
                        <Typography variant="h6" gutterBottom>{`Level: ${currentClient.level}`}</Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">{`Phone: ${currentClient.phone}`}</Typography>
                            <Typography variant="body2">{`Notes: ${currentClient.notes}`}</Typography>
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
                            onClick={() => handleCall(currentClient.phone)}
                            sx={{ mr: 1,
                                height: 56,
                             }}
                        >
                            Call
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            color="success"
                            onClick={() => handleWhatsApp(currentClient.phone)}
                            sx={{ mr: 1,
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
