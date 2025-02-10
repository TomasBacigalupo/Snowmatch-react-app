import React, { useState } from "react";
import { Box, IconButton, Divider, List, ListItem, ListItemText, SwipeableDrawer, Typography } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useTheme } from '@mui/material/styles';
import ReactPlayer from "react-player";
import Markdown from "src/components/Markdown";
import useLocales from "src/hooks/useLocales";
import CloseIcon from '@mui/icons-material/Close';

export default function VideoReviewedBottomSheet({ open, onClose, onOpen, selectedVideo }) {
    const theme = useTheme();
    console.log('open', open);
    const { translate } = useLocales();
    return (
        <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={onOpen}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
                PaperProps={{
                    sx: {
                        height: '100%',
                        maxHeight: '100%',
                        paddingTop: 'env(safe-area-inset-bottom)',
                        width: '100vw',  // Asegura que el ancho sea igual al viewport
                        maxWidth: '100%',
                    },
                }}
            >
                <Box
                    sx={{
                        padding: theme.spacing(2),
                        width: '100vw',  // Asegura que el ancho sea igual al viewport
                        maxWidth: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                    }}
                >
                    {selectedVideo && (
                        <>
                            <Box display="flex" justifyContent="flex-end" mb={2}>
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={onClose}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Typography variant="h4" gutterBottom align="center">
                                {translate(`course.${selectedVideo.course}.title`)}
                            </Typography>
                            <Box my={2}>
                                <ReactPlayer
                                    url={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${selectedVideo.videoUrl}`}
                                    controls
                                    style={{ maxHeight: '300px', maxWidth: '100%', }}
                                />
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {translate('videoCoachScreen.score')} {selectedVideo.score}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {translate('videoCoachScreen.review')}
                            </Typography>
                            <Markdown>
                                {selectedVideo.comment}
                            </Markdown>
                        </>
                    )}
                </Box>
            </SwipeableDrawer>
    )

}
