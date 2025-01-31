import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Divider, Collapse, Box, Avatar } from '@mui/material';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import TeacherDetailsReviewList from './TeacherDetailsReviewList';
import TeacherDetailsReviewOverview from './TeacherDetailsReviewOverview';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';
import { dispatch } from 'src/redux/store';
import { setRequestedRoute } from 'src/redux/slices/config';
import { Button } from '@mui/material';
import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import TeacherDetailsReview from './TeacherDetailsReview';
import ProductDetailsReviewFormMobile from './ProductDetailsReviewFormMobile';
import { set } from 'lodash';
import Login from 'src/pages/auth/Login';
import Register from 'src/pages/auth/Register';
import RegisterStudent from 'src/pages/auth/RegisterStudent';
import PageVerifyWhatsApp from 'src/pages/PageVerifyWhatsApp';

// ----------------------------------------------------------------------

TeacherDetailsMobileReview.propTypes = {
    teacher: PropTypes.object,
    openForm: PropTypes.bool
};

export default function TeacherDetailsMobileReview({ teacher, openForm = false }) {
    const [reviewBox, setReviewBox] = useState(openForm);
    const navigate = useNavigate()
    const { isStudent,
        emailVerified,
        phoneVerified } = useAuth()

    const [open, setOpen] = React.useState(false);
    const [openReviewModal, setOpenReviewModal] = React.useState(false);

    const handleOpenReviewBox = () => {
        if (isStudent) {
            setReviewBox((prev) => !prev);
        } else {
            dispatch(setRequestedRoute(`/match/teacher/${teacher.id}`))
            navigate('review')
        }

    };

    const handleCloseReviewBox = () => {
        setReviewBox(false);
    };

    return (
        <>
            <TeacherDetailsReviewOverview teacher={teacher} onOpen={handleOpenReviewBox} />

            {/* Review Form */}
            {/* <Collapse in={reviewBox}>
                <ProductDetailsReviewForm onClose={handleCloseReviewBox} id="move_add_review" teacherId={teacher.id} />
                <Divider />
            </Collapse> */}
            <TeacherDetailsReviewList teacher={teacher} horizontal={true} />

            <Box sx={{ pt: 3, px: 2, pb: 2 }}>
                <Button onClick={() => setOpen(true)} variant='outlined' fullWidth={true}>Mostrár más reviews</Button>
            </Box>
            <Box sx={{ px: 2, pb: 2 }}>
                <Button onClick={() => setOpenReviewModal(true)} variant='contained' fullWidth={true}>Dejar review</Button>
            </Box>
            <Drawer
                anchor="bottom"
                open={openReviewModal}
                onClose={() => setOpenReviewModal(false)}
                sx={{
                    paddingTop: 'env(safe-area-inset-top)',
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                        borderTopRightRadius: '12px',
                        height: '95%',
                        marginTop: 'env(safe-area-inset-top)',
                        paddingX: 1,
                    }
                }}
            >
                <Box mt={1} flex justifyContent='center' width='100%'>
                    <IconButton onClick={() => setOpenReviewModal(false)}>
                        <Iconify icon={'line-md:close-circle'} width={25} height={25} />
                    </IconButton>
                </Box>

                {!isStudent && <>
                    <RegisterStudent />
                </>}
                {isStudent && !(emailVerified || phoneVerified) && <>
                    <PageVerifyWhatsApp />
                </>}
                {isStudent && (emailVerified || phoneVerified) && <>

                    <Grid container p={2} spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h2" gutterBottom>
                                Calificá tu experiencia
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ pt: 2 }} />
                        </Grid>
                        <Grid item xs={12} >
                            <Box
                                sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                <Box >
                                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                                        {teacher?.name}
                                    </Typography>
                                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                                        {/* {formatDate(booking.eventList[0]?.start, { month: 'short', day: 'numeric' })} - {formatDate(booking.eventList[booking.eventList.length - 1]?.end, { month: new Date(booking.eventList[0]?.end).getMonth() === new Date(booking.eventList[0]?.start).getMonth() ? undefined : 'short', day: 'numeric' })} */}
                                    </Typography>
                                </Box>
                                <Avatar alt={teacher?.name} src={teacher.image} sx={{ width: 40, height: 40 }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ pt: 0 }} />
                        </Grid>
                        {/* {isPending && !isStudent && (
                        <>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display='flex' flex={1} width='100%' flexGrow={1}>
                                    <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, mr: 2, color: 'black', borderColor: 'black' }} onClick={() => { }}>
                                        Rechazar
                                    </Button>
                                    <Button fullWidth variant="contained" sx={{ mt: 2, py: 1 }} onClick={handleAccept}>
                                        Aprobar
                                    </Button>
                                </Box>
                            </Grid>
                        </>
                    )} */}
                        <Grid item xs={12}>
                            <ProductDetailsReviewFormMobile onClose={() => {
                                setOpenReviewModal(false)
                            }} id="move_add_review" teacherId={teacher.id} bookingId={null} />
                        </Grid>
                    </Grid>
                </>
                }
            </Drawer>
            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    paddingTop: 'env(safe-area-inset-top)',
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', height: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                        borderTopRightRadius: '12px'
                    }
                }}
            >
                <Grid>
                    <Grid item xs={12} p={2} pb={0}>
                        <IconButton onClick={() => setOpen(false)}>
                            <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                </Grid>
                <TeacherDetailsReview teacher={teacher} />
            </Drawer>
        </>
    );
}
