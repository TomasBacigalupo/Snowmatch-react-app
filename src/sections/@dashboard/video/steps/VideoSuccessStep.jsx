import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function VideoSuccessStep({ onClose }) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            sx={{ padding: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}
        >
            <CheckCircleIcon
                sx={{ fontSize: 64, color: 'green', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
                Excelente Bajada! 🎉
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                SnowMatch AI corrigio tu video. Te vamos a enviar una notificacion cuando un Pro lo revise.
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 3 }}>
                Mientras tanto podés mirar otros cursos para preparate para tu proximo Challange.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={onClose}
                sx={{ textTransform: 'none' }}
            >
                Close
            </Button>
        </Box>
    );
}