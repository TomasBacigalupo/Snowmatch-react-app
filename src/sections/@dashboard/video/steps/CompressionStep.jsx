import React from 'react';
import { Box, Typography, LinearProgress, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import useLocales from 'src/hooks/useLocales';

export default function CompressionStep({ 
    progress, 
    onCancel, 
    onBack 
}) {
    const { translate } = useLocales();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 3,
                textAlign: 'center'
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 400, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {translate('course.exercise.compressing')}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {translate('course.exercise.compressingDescription')}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                            }
                        }} 
                    />
                </Box>

                <Typography variant="body2" color="text.secondary">
                    {Math.round(progress)}%
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button 
                    variant="outlined" 
                    onClick={onBack}
                    disabled={progress > 0}
                >
                    {translate('common.back')}
                </Button>
                
                <LoadingButton 
                    variant="contained" 
                    color="error"
                    onClick={onCancel}
                    loading={false}
                >
                    {translate('common.cancel')}
                </LoadingButton>
            </Box>
        </Box>
    );
}