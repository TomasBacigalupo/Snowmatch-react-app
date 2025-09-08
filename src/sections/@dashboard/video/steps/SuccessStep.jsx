import React from 'react';
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useLocales from "src/hooks/useLocales";

export default function SuccessStep({ onClose }) {
    const { translate } = useLocales();
    
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            sx={{
                padding: 4,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                boxShadow: (theme) => theme.customShadows?.z8,
                maxWidth: 600,
                mx: 'auto',
                my: 2
            }}
        >
            <Box
                component="img"
                src="/assets/avatars/snow-ai.png"
                sx={{
                    width: 120,
                    height: 120,
                    mb: 3,
                    borderRadius: '50%',
                    border: (theme) => `4px solid ${theme.palette.primary.main}`,
                    boxShadow: (theme) => theme.customShadows?.z8,
                }}
            />

            <CheckCircleIcon
                sx={{
                    fontSize: 48,
                    color: 'success.main',
                    mb: 2,
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    backgroundColor: 'background.paper',
                    borderRadius: '50%',
                    padding: 0.5
                }}
            />

            <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold' }}>
                {translate('course.exercise.videoUploadedSuccess')} 🎉
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                {translate('course.exercise.snowAnalyzing')}
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    p: 3,
                    mb: 3,
                    backgroundColor: 'background.neutral',
                    borderRadius: 1,
                    border: (theme) => `1px solid ${theme.palette.divider}`
                }}
            >
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {translate('course.exercise.detailedReview')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {translate('course.exercise.proChecksDescription')}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={onClose}
                    sx={{
                        flex: 1,
                        textTransform: 'none',
                        py: 1.5
                    }}
                >
                    {translate('course.exercise.later')}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                    sx={{
                        flex: 1,
                        textTransform: 'none',
                        py: 1.5
                    }}
                >
                    {translate('course.exercise.requestReview')}
                </Button>
            </Box>
        </Box>
    );
}