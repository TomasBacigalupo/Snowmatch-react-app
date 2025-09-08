import React from 'react';
import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import VideoTrimmer from "../VideoTrimmer";
import ProgressComponent from "../ProgressComponent";

export default function VideoStep({ 
    videoPreviewUrl, 
    onUpload, 
    loadingCompresor, 
    progress 
}) {
    return (
        <Box my={2} display="flex" height='100%' flexDirection="column" justifyContent='space-between'>
            <Box my={2}>
                {videoPreviewUrl && (
                    <VideoTrimmer videoUrl={videoPreviewUrl} />
                )}
            </Box>

            {progress > 0 && <ProgressComponent _progress={progress} />}

            <LoadingButton
                loading={loadingCompresor}
                variant="contained"
                fullWidth
                onClick={onUpload}
                sx={{ 
                    py: 2, 
                    my: 2,
                    backgroundColor: 'black',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }
                }}
            >
                Continuar
            </LoadingButton>
        </Box>
    );
}