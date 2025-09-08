import React from 'react';
import { Box, Paper, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import useLocales from "src/hooks/useLocales";
import StoryPlayer from "../StoryPlayer";
import Markdown from "src/components/Markdown";

export default function ExerciseStep({ onNext, level }) {
    const { translate } = useLocales();

    return (
        <Box my={2} display="flex" height='100%' flexDirection="column" sx={{ position: 'relative' }}>
            <Box mb={2} display="flex" flexDirection="column" sx={{ flex: 1, overflow: 'auto', pb: 10 }}>
                <StoryPlayer />
                <Box>
                    <Paper
                        sx={{
                            border: '2px solid',
                            borderColor: 'primary.dark',
                            borderRadius: 2,
                            p: 2,
                            mb: 4
                        }}
                    >
                        <Markdown>
                            {translate(`course.${level}.objective`)}
                        </Markdown>
                    </Paper>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Box
                        component="img"
                        src="/assets/avatars/snow-ai.png"
                        sx={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: '50%',
                            border: (theme) => `4px solid ${theme.palette.primary.main}`,
                            boxShadow: (theme) => theme.customShadows?.z8,
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            }
                        }}
                    />
                    <Box>
                        <Typography variant="h3" sx={{ color: "primary.dark" }}>
                            {translate('course.exercise.aiCorrection')}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                            Snow es un instructor de esqui AI
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        mt: 4,
                        p: 3,
                        backgroundColor: 'background.neutral',
                        borderRadius: 2,
                        border: (theme) => `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1, color: 'primary.dark' }}>
                        ¿Querés una revisión más detallada?
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        También vas a poder solicitar que un instructor de SnowMatch te dé sus correcciones personalizadas.
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    px: 2,
                    marginBottom: 'env(safe-area-inset-bottom)',
                    zIndex: 1000,
                    backgroundColor: 'background.paper'
                }}
            >
                <Button
                    variant="contained"
                    sx={{
                        py: 2,
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }
                    }}
                    fullWidth
                    onClick={onNext}
                >
                    {translate('course.exercise.selectVideo')}
                </Button>
            </Box>
        </Box>
    );
}