import { Button, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from 'react';
import Markdown from "src/components/Markdown";
import useLocales from "src/hooks/useLocales";

export default function ChallengeStep({ course, demoUrl, onNext }) {
    const { translate } = useLocales();

    return (
        <Box my={2} display="flex" height='100%' flexDirection="column" justifyContent='space-between'>
            <Box mb={2} display="flex" flexDirection="column" >
                <Box>
                    <Paper
                        sx={{
                            border: '2px solid', // Borde
                            borderColor: 'primary.dark', // Color primario oscuro
                            borderRadius: 2, // Bordes redondeados
                            p: 2, // Padding
                        }}
                    >
                        <Markdown>
                            {translate(`course.${course}.tip`)}
                        </Markdown>
                    </Paper>
                </Box>
                <Box mt={4}>
                    <video
                        src={demoUrl}
                        width="100%"
                        height="300px"
                        controls
                        playsInline
                        disablePictureInPicture
                        autoPlay={true}
                        muted
                        style={{
                            borderRadius: '12px',
                            objectFit: 'cover',
                            display: 'block',
                            backgroundColor: 'black'
                        }}
                    ></video>
                </Box>
                {/* Header con icono y título */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Box
                        component="img"
                        src="/icons/pc.jpg"
                        sx={{ width: 140, height: 140, objectFit: "contain" }}
                    />
                    <Typography variant="h3" sx={{ color: "primary.dark" }}>
                        SnowMatch AI Corrigirá tu video
                    </Typography>
                </Box>
            </Box>

            <Button 
                variant="contained" 
                sx={{ py: 2, mt: 2, mb: "calc(env(safe-area-inset-bottom) + 5px)" }} 
                fullWidth 
                onClick={onNext}
            >
                Start Challange
            </Button>
        </Box>
    );
}