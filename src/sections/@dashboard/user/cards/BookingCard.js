import PropTypes from 'prop-types';
import { useState } from "react";
import { Typography, Box, Card, Button, Avatar, Divider, TextField } from "@mui/material";
import Iconify from "src/components/Iconify";
import { formatDate } from "@fullcalendar/react";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD, PATH_GUEST } from "src/routes/paths";
import useAuth from "src/hooks/useAuth";
import { useDispatch } from "src/redux/store";
import { setAccepted, setDeclined, setPaid, setUnpaid } from "src/redux/slices/calendar";
import useLocales from "src/hooks/useLocales";
import ConfirmAcceptModal from "../modals/ConfirmAcceptModal";
import ConfirmDeclineModal from "../modals/ConfirmDeclineModal";
import React from 'react';
import Drawer from '@mui/material/Drawer';
import { Grid, IconButton } from '@mui/material';

BookingCard.propTypes = {
    booking: PropTypes.object,
    showInfo: PropTypes.bool,
};

export default function BookingCard({ booking, showInfo = true }) {
    const { translate } = useLocales()
    const dispatch = useDispatch()
    const { user, isStudent } = useAuth()

    const [payedState, setPayedState] = useState()
    const [openAcceptModal, setOpenAcceptModal] = useState(false)
    const [openDeclineModal, setOpenDeclineModal] = useState(false)
    const [lessonState, setLessonState] = useState(booking.state)
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()

    const handlePay = () => {
        // setPayedState(!payedState)
        // if (lessons.every((lesson) => lesson.payed)) {
        //     dispatch(setUnpaid(id))
        // } else {
        //     dispatch(setPaid(id))
        // }
    }

    const handleOpenAcceptModal = () => {
        setOpenAcceptModal(true)
    }
    const handleCloseAcceptModal = () => {
        setOpenAcceptModal(false)
    }
    const handleOpenDeclineModal = () => {
        setOpenDeclineModal(true)
    }
    const handleCloseDeclineModal = () => {
        setOpenDeclineModal(false)
    }
    const handleAcceptEvent = () => {
        // lessons.map((lesson) =>
        //     dispatch(setAccepted(lesson.id))
        // )
        // setLessonState("ACCEPTED")
        handleCloseAcceptModal()
    }
    const handleDeclineEvent = () => {
        // lessons.map((lesson) =>
        //     dispatch(setDeclined(lesson.id))
        // )
        // setLessonState("DECLINED")
        handleCloseDeclineModal()
    }


    return (
        <>
            <Card
                onClick={() => setOpen(true)}
                sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Box >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {booking.state}
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 0.5 }}>
                        {isStudent ? booking?.teacher?.name : booking?.student?.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                        {formatDate(booking.eventList[0].start, { month: 'short', day: 'numeric' })} - {formatDate(booking.eventList[0].end, { month: new Date(booking.eventList[0].end).getMonth() === new Date(booking.eventList[0].start).getMonth() ? undefined : 'short', day: 'numeric' })}
                    </Typography>
                </Box>
                <Avatar alt={isStudent ? booking?.teacher?.name : booking?.student?.name} src={'avatarUrl'} sx={{ width: 40, height: 40 }} />
            </Card>

            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                        borderTopRightRadius: '12px',
                        height: '95%',
                        marginTop: '20px',
                        paddingX: 1
                    }
                }}
            >
                <Box mt={1}>
                    <IconButton onClick={() => setOpen(false)}>
                        <Iconify icon={'line-md:close-circle'} width={25} height={25} />
                    </IconButton>
                </Box>
                <Grid container p={2} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h2" gutterBottom>
                            Detalles de la Reserva
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ pt: 2 }} />
                    </Grid>
                    <Grid item xs={12} >
                        <Box
                            sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                            <Box >
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {booking.state}
                                </Typography>
                                <Typography variant="h5" sx={{ mb: 0.5 }}>
                                    {isStudent ? booking?.teacher?.name : booking?.student?.name}
                                </Typography>
                                <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                                    {formatDate(booking.eventList[0].start, { month: 'short', day: 'numeric' })} - {formatDate(booking.eventList[0].end, { month: new Date(booking.eventList[0].end).getMonth() === new Date(booking.eventList[0].start).getMonth() ? undefined : 'short', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Avatar alt={isStudent ? booking?.teacher?.name : booking?.student?.name} src={'avatarUrl'} sx={{ width: 40, height: 40 }} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Sobre {booking?.student?.name}
                        </Typography>
                        <Box display='flex' flexDirection='column'>
                            <Box display='flex' flex={1} alignItems='center' mb={1}>
                                <Iconify icon={'material-symbols-light:account-circle-outline'} width={40} height={40} />
                                <Typography variant="body1" paragraph ml={2} mb={0}>
                                    {`${booking?.student?.name} ${booking?.student?.lastname}`}
                                </Typography>
                            </Box>
                            <Box display='flex' flex={1} alignItems='center'>
                                <Iconify icon={'material-symbols-light:verified-user-outline'} width={40} height={40} />
                                <Typography variant="body1" paragraph ml={2} mb={0} alignItems='center'>
                                    Verificado
                                </Typography>
                            </Box>
                            <Button variant="outlined" sx={{ mt: 2, py: 1 }} onClick={() => navigate(PATH_GUEST + '/' + booking?.student?.id)}>
                                Mensaje
                            </Button>
                            <Button variant="outlined" sx={{ mt: 2, py: 1 }} onClick={() => navigate(PATH_DASHBOARD.user.profile)}>
                                Llamar
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Detalles de la reserva
                        </Typography>
                        <Box mb={2}>
                            <Typography sx={{ fontSize: '20px' }}>
                                {`Cantidad de días`}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {`${booking?.eventList.length} días`}
                            </Typography>
                            <Divider />
                        </Box>
                        <Box mb={2}>
                            <Typography sx={{ fontSize: '20px' }}>
                                {`Horarios`}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {`${booking?.eventList.length} días`}
                            </Typography>
                            <Divider />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px' }}>
                                {`Alumnos`}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {`${booking?.eventList.length} alumnos`}
                            </Typography>
                            <Divider />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Detalles del pago
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Notas
                        </Typography>
                        <Box display='flex' flexDirection='column'>
                            <TextField minRows={3} rows={3}/>
                            <Button variant="outlined" sx={{ mt: 2, py: 1 }} onClick={() => navigate(PATH_DASHBOARD.user.profile)}>
                                Guardar
                            </Button>
                        </Box>

                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Soporte
                        </Typography>
                        {/* option to contact via email to support@snowmatch.pro */}
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                <Iconify icon={'material-symbols:health-and-safety-outline'} width={25} height={25} mr={2} />
                                <Typography sx={{ fontSize: '20px' }} alignItems='center'>
                                    Ayuda con seguridad
                                </Typography>
                            </Box>

                            <Iconify icon={'material-symbols:chevron-right'} width={25} height={25} />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                <Iconify icon={'material-symbols:edit-outline'} width={25} height={25} mr={2} />
                                <Typography sx={{ fontSize: '20px' }} alignItems='center'>
                                    Cambiar Reserva
                                </Typography>
                            </Box>

                            <Iconify icon={'material-symbols:chevron-right'} width={25} height={25} />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box onClick={() => navigate('/faqs')} display='flex' justifyContent='space-between' alignItems='center'>
                            <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                <Iconify icon={'material-symbols:help-outline-rounded'} width={25} height={25} mr={2} />
                                <Typography sx={{ fontSize: '20px' }} alignItems='center'>
                                    Centro de ayuda
                                </Typography>
                            </Box>

                            <Iconify icon={'material-symbols:chevron-right'} width={25} height={25} />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box display='flex' justifyContent='space-between' alignItems='center'>
                            <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                <Iconify icon={'flat-color-icons:cancel'} width={25} height={25} mr={2} />
                                <Typography sx={{ fontSize: '20px' }} alignItems='center'>
                                    Cancelar reserva
                                </Typography>
                            </Box>
                            <Iconify icon={'material-symbols:chevron-right'} width={25} height={25} />
                        </Box>
                        <Typography variant='body2' flex='1' px={4}>
                            si usted cancela la reserva será penalizado y podría ser suspendido de la plataforma
                        </Typography>

                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
}
