import React, { useState, useEffect } from 'react';
import { Drawer, Dialog, Grid, Typography, IconButton, Button, Avatar, Stack, AvatarGroup, Box, Divider, SwipeableDrawer } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { Hidden } from '@mui/material';
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from 'src/redux/store';
import { proCheck } from 'src/redux/slices/video';
import { LoadingButton } from '@mui/lab';
import { CloseIcon } from 'src/theme/overrides/CustomIcons';
import PremiumContainer from 'src/sections/payment/Premiumcontainer';
import useLocales from 'src/hooks/useLocales';
import useAuth from 'src/hooks/useAuth';

const ReviewRequestBox = ({ isOpen, closeDrawer, onRequestReview }) => {
    const [open, setOpen] = useState(isOpen);
    const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
    const { user } = useAuth();

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
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    disableSwipeToOpen={false}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: {
                            height: user.proCheckCredits > 0 ? 'fit' : '100%',
                            maxHeight: '100%',
                            width: '100vw',
                            maxWidth: '100vw',
                            paddingTop: user.proCheckCredits > 0 ? '2' : "env(safe-area-inset-top)",
                            borderRadius: user.proCheckCredits > 0 ? '16px' : "0"
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            overflow: "auto",
                            height: "100%",
                        }}
                    >
                        {/* Encabezado con Cierre */}
                        {user.proCheckCredits === 0 && <Box px={2} display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight={600}>
                                Pro Check
                            </Typography>
                            <IconButton onClick={() => setOpen(false)}>
                                <Iconify icon="ic:round-close" width={24} height={24} />
                            </IconButton>
                        </Box>}

                        {user.proCheckCredits === 0 && <Divider />}
                        {user.proCheckCredits === 0 && <PremiumContainer />}
                        {user.proCheckCredits > 0 && <ReviewContent setOpen={setOpen} closeDrawer={closeDrawer} onRequestReview={onRequestReview} />}

                    </Box>
                </SwipeableDrawer>
            </Hidden>
        </>
    );
};

const ReviewContent = ({ setOpen, closeDrawer, onRequestReview }) => {
    const [showPaymentDrawer, setShowPaymentDrawer] = useState(false);
    const dispatch = useDispatch();
    const { isLoadingProCheck } = useSelector(state => state.video);
    const { translate } = useLocales();
    const { user } = useAuth();
    const handleProCheck = () => {
        if (user?.proCheckCredits > 0) {
            onRequestReview();
            setOpen(false);
            if (closeDrawer) closeDrawer();
        } else {
            setShowPaymentDrawer(true)
        }
    }
    return (
        <Grid container direction="row" alignItems="center" p={3}>
            <Grid item xs={12}>
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                        <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 48, height: 48, border: "2px solid white" } }}>
                            <Avatar src="/assets/pro/1.png" />
                            <Avatar src="/assets/pro/2.png" />
                            <Avatar src="/assets/pro/3.png" />
                        </AvatarGroup>
                    </Box><Typography variant="h6" fontWeight="bold">
                        {translate("reviewRequestBox.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        {translate("reviewRequestBox.subtitle")}
                    </Typography>
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ py: 1.5 }}
                        loading={isLoadingProCheck}
                        onClick={handleProCheck}
                    >
                        {translate("reviewRequestBox.cta")}
                    </LoadingButton>
                </Stack>
            </Grid>

        </Grid>
    );
};

export default ReviewRequestBox;