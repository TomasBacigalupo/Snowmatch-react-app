import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import React from 'react';
import VideoTrimmer from "../VideoTrimmer";
import ProgressComponent from "../ProgressComponent";

export default function VideoTrimmingStep({ 
    videoPreviewUrl, 
    onUpload, 
    loadingCompresor, 
    progress 
}) {
    return (
        <Box my={2} display="flex" height='100%' flexDirection="column" justifyContent='space-between'>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Elige los mejores 30 segundos de tu video
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Desliza los marcadores para seleccionar el segmento más destacado de tu bajada.
                </Typography>
            </Box>

            <Box my={2} sx={{ flex: 1 }}>
                {videoPreviewUrl && (
                    <VideoTrimmer
                        videoUrl={videoPreviewUrl}
                        maxDuration={30} // Limit to 30 seconds
                        onTrim={() => {}} // Handle trim if needed
                        isLoading={loadingCompresor}
                    />
                )}
            </Box>

            {progress > 0 && <ProgressComponent _progress={progress} />}

            <LoadingButton
                loading={loadingCompresor}
                variant="contained"
                color="primary"
                fullWidth
                onClick={onUpload}
                sx={{ py: 2, my: 2 }}
            >
                Subir Video
            </LoadingButton>
        </Box>
    );
}