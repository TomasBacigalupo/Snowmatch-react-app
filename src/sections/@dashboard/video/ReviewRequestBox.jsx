import React, { useState, useEffect } from 'react';
import { Drawer, Dialog, Grid, Typography, IconButton, Button, Avatar, Stack, AvatarGroup, Box } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { Hidden } from '@mui/material';
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from 'src/redux/store';
import { proCheck } from 'src/redux/slices/video';
import { LoadingButton } from '@mui/lab';

const ReviewRequestBox = ({ isOpen, closeDrawer, onRequestReview }) => {
    const [open, setOpen] = useState(isOpen);
    const theme = useTheme();

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    return (
        <>
            {/* Botón fijo en la parte inferior */}
            <Grid
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: '#fff',
                    borderTopLeftRadius: '12px',
                    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 999,
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
                container justifyContent="center" alignItems="center" onClick={() => setOpen(true)}
            >
                <Grid item xs={8} md={6} pl={2} pt={2}>
                    <b>Solicita un experto</b> <br /> para corregir tu video
                </Grid>
                <Grid item xs={4} md={6} pr={2} pt={2}>
                    <Button variant="contained" color="primary" fullWidth sx={{ p: 2 }}>
                        ProCheck
                    </Button>
                </Grid>
            </Grid>

            {/* Drawer en Mobile */}
            <Hidden smUp>
                <Drawer
                    anchor="bottom"
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        if (closeDrawer) closeDrawer();
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '100%',
                            paddingBottom: 2,
                            borderTopLeftRadius: '12px',
                            borderTopRightRadius: '12px',
                        },
                    }}
                >
                    <ReviewContent setOpen={setOpen} closeDrawer={closeDrawer} onRequestReview={onRequestReview} />
                </Drawer>
            </Hidden>

            {/* Dialog en Desktop */}
            <Hidden smDown>
                <Dialog
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        if (closeDrawer) closeDrawer();
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            width: '33%',
                            paddingBottom: 2,
                            borderRadius: '12px',
                        },
                    }}
                >
                    <ReviewContent setOpen={setOpen} closeDrawer={closeDrawer} onRequestReview={onRequestReview} />
                </Dialog>
            </Hidden>
        </>
    );
};

const ReviewContent = ({ setOpen, closeDrawer, onRequestReview }) => {
    const dispatch = useDispatch();
    const { isLoadingProCheck } = useSelector(state => state.video);
    return (
        <Grid container direction="column" alignItems="center" p={3}>
            <Grid item xs={12} textAlign="right" width="100%">
                <IconButton onClick={() => {
                    setOpen(false);
                    if (closeDrawer) closeDrawer();
                }}>
                    <Iconify icon="ic:round-close" width={24} height={24} />
                </IconButton>
            </Grid>

            <Stack direction="column" alignItems="center" spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 48, height: 48, border: "2px solid white" } }}>
                        <Avatar src="/images/pro-instructor-1.jpg" />
                        <Avatar src="/images/pro-instructor-2.jpg" />
                        <Avatar src="/images/pro-instructor-3.jpg" />
                    </AvatarGroup>
                </Box><Typography variant="h6" fontWeight="bold">
                    Obtén una revisión de un SnowMatch Pro
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    Un instructor experto analizará tu video y te dará consejos para mejorar tu técnica.
                </Typography>
                <LoadingButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ py: 1.5 }}
                    loading={isLoadingProCheck}
                    onClick={() => {
                        onRequestReview();
                        setOpen(false);
                        if (closeDrawer) closeDrawer();
                    }}
                >
                    Solicitar revisión
                </LoadingButton>
            </Stack>
        </Grid>
    );
};

export default ReviewRequestBox;