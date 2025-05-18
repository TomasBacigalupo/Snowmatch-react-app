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
import { acceptAndPay } from 'src/redux/slices/bookings';
import ProductDetailsReviewForm from '../../e-commerce/teacher-details/ProductDetailsReviewForm';
import ProductDetailsReviewFormMobile from '../../e-commerce/teacher-details/ProductDetailsReviewFormMobile';
import { fCurrency } from 'src/utils/formatNumber';
import { calculateTotalHours, getComissionByLevel, getPayByHoursLevel, getPayByLevel } from 'src/redux/slices/teachers';

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
    const [open, setOpen] = React.useState(false);
    const [rateOpen, setRateOpen] = React.useState(false);
    const navigate = useNavigate()

    const isPending = booking.state === 'PENDING';
    const isAccepted = booking.state === 'ACCEPTED';

    const fullTeacherPhoneNumber = `${booking?.teacher?.countryCode}${booking?.teacher?.cellphone}`;
    const fullStudentPhoneNumber = `${booking?.student?.countryCode}${booking?.student?.cellphone}`;


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

    const handleAccept = () => {
        dispatch(acceptAndPay(booking.id));
    }

    const renderBookingStateLabel = () => {
        if (booking.state === 'PENDING') {
            return (
                <Typography variant="body2" color="primary" sx={{ fontWeight: 1000 }}>
                    Confirmación pendiente
                </Typography>
            )
        }
        if (booking.state === 'ACCEPTED') {
            return (
                <Typography variant="body2" sx={{ fontWeight: 1000 }}>
                    Reserva confirmada
                </Typography>
            )
        }
        if (booking.state === 'DECLINED') {
            return (
                <Typography variant="body2" color="error" sx={{ fontWeight: 1000 }}>
                    Reserva rechazada
                </Typography>
            )
        }
    }

    const renderTimes = () => {
        const sortedEvents = [...booking.eventList];
        return sortedEvents.sort((a, b) => new Date(a) < new Date(b)).map((event) => {
            const start = new Date(event?.start);
            const end = new Date(event?.end);

            if (start.getHours() === 9 && end.getHours() === 13) {
                return (
                    <Typography variant="body1" paragraph>
                        {`${formatDate(start, { month: 'short', day: 'numeric' })} - Mañana`}
                    </Typography>
                )
            }
            if (start.getHours() === 13 && end.getHours() === 17) {
                return (
                    <Typography variant="body1" paragraph>
                        {`${formatDate(start, { month: 'short', day: 'numeric' })} - Tarde`}
                    </Typography>
                )
            }
            return (
                <Typography variant="body1" paragraph>
                    {`${formatDate(start, { month: 'short', day: 'numeric' })} - Todo el día`}
                </Typography>
            )
        })
    }

    const handleMessage = () => {
        //open whats app to user
        if (isStudent) {
            window.open(`https://api.whatsapp.com/send?phone=${fullTeacherPhoneNumber}`, '_blank');
        } else {
            window.open(`https://api.whatsapp.com/send?phone=${fullStudentPhoneNumber}`, '_blank');
        }
    };

    const handleCall = () => {
        //open phone app to user
        if (isStudent) {
            const fullPhoneNumber = `${booking?.teacher?.countryCode}${booking?.teacher?.cellphone}`;
            window.open(`tel:+${fullTeacherPhoneNumber}`, '_blank');
        } else {
            const fullPhoneNumber = `${booking?.student?.countryCode}${booking?.student?.cellphone}`;
            window.open(`tel:+${fullStudentPhoneNumber}`, '_blank');
        }
    };

    const openWhatsApp = () => {
        const phoneNumber = process.env.REACT_APP_WHATS_APP;
        const url = `https://wa.me/${phoneNumber}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <Card
                onClick={() => setOpen(true)}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                <Box display='flex' justifyContent='space-between' width={'100%'} flexGrow={1}>
                    <Box>
                        {renderBookingStateLabel()}
                        <Typography variant="h5" sx={{ mb: 0.5 }}>
                            {isStudent ? booking?.teacher?.name : booking?.student?.name}
                        </Typography>
                        <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                            {formatDate(booking.eventList[0]?.start, { month: 'short', day: 'numeric' })} - {formatDate(booking.eventList[booking.eventList.length - 1]?.end, { month: new Date(booking.eventList[0]?.end).getMonth() === new Date(booking.eventList[0]?.start).getMonth() ? undefined : 'short', day: 'numeric' })}
                        </Typography>
                    </Box>
                    <Avatar alt={isStudent ? booking?.teacher?.name : booking?.student?.name} src={isStudent ? booking.teacher.imageS3 : booking.student.imageS3} sx={{ width: 40, height: 40 }} />
                </Box>
                {isPending && !isStudent && <Box display='flex' flex={1} width='100%' flexGrow={1}>
                    <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, mr: 2, color: 'black', borderColor: 'black' }} onClick={() => { }}>
                        Rechazar
                    </Button>
                    <Button fullWidth variant="contained" sx={{ mt: 2, py: 1 }} onClick={handleAccept}>
                        Aprobar
                    </Button>
                </Box>}
                {isAccepted && isStudent && <Box display='flex' flex={1} width='100%' flexDirection='column' flexGrow={1}>
                    <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, mr: 2, color: 'black', borderColor: 'black' }} onClick={handleMessage}>
                        Mensaje
                    </Button>
                    <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, color: 'black', borderColor: 'black' }} onClick={handleCall}>
                        Llamar
                    </Button>
                </Box>}
                {isAccepted && isStudent && !booking.rate && new Date(booking.eventList[0]?.start) < new Date() && <Box display='flex' flex={1} width='100%' flexDirection='column' flexGrow={1}>
                    <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, mr: 2, color: 'black', borderColor: 'black' }} onClick={() => setRateOpen(true)}>
                        Rate
                    </Button>
                </Box>}
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
                                    {formatDate(booking.eventList[0]?.start, { month: 'short', day: 'numeric' })} - {formatDate(booking.eventList[booking.eventList.length - 1]?.end, { month: new Date(booking.eventList[0]?.end).getMonth() === new Date(booking.eventList[0]?.start).getMonth() ? undefined : 'short', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Avatar alt={isStudent ? booking?.teacher?.name : booking?.student?.name} src={isStudent ? booking.teacher.imageS3 : booking.student.imageS3} sx={{ width: 40, height: 40 }} />
                        </Box>
                    </Grid>
                    {isPending && !isStudent && (
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
                    )}

                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Sobre {isStudent ? booking?.teacher.name : booking?.student?.name}
                        </Typography>
                        <Box display='flex' flexDirection='column'>
                            <Box display='flex' flex={1} alignItems='center' mb={1}>
                                <Iconify icon={'material-symbols-light:account-circle-outline'} width={40} height={40} />
                                <Typography variant="body1" paragraph ml={2} mb={0}>
                                    {`${isStudent ? booking?.teacher?.name : booking?.student?.name} ${isStudent ? booking?.teacher?.lastname : booking?.student?.lastname}`}
                                </Typography>
                            </Box>
                            <Box display='flex' flex={1} alignItems='center'>
                                <Iconify icon={'material-symbols-light:verified-user-outline'} width={40} height={40} />
                                <Typography variant="body1" paragraph ml={2} mb={0} alignItems='center'>
                                    Verificado
                                </Typography>
                            </Box>
                            <Box display='flex' flex={1} alignItems='center' border='solid' borderRadius={1} padding={2} borderColor='gray' my={2}>
                                <Typography variant="body1">
                                    {`${booking?.userComment}`}
                                </Typography>
                            </Box>

                            <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, mr: 2, color: 'black', borderColor: 'black' }} onClick={handleMessage}>
                                Mensaje
                            </Button>
                            <Button fullWidth variant="outlined" sx={{ mt: 2, py: 1, color: 'black', borderColor: 'black' }} onClick={handleCall}>
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
                            {renderTimes()}
                            <Divider />
                        </Box>
                        <Box mb={2}>
                            <Typography sx={{ fontSize: '20px' }}>
                                {`Adultos`}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {`${booking?.adults} adultos`}
                            </Typography>
                            <Divider />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px' }}>
                                {`Niños`}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {`${booking?.children} niños`}
                            </Typography>
                            <Divider />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    {/* <Grid item xs={12} container justifyContent='space-between'>
                        <Grid item xs={12}>
                            <Typography variant="h3" paragraph>
                                Detalles del pago
                            </Typography>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography variant="body1" paragraph>
                                {`Clase`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'end' }}>
                            <Typography variant="body1" paragraph>
                                {fCurrency(booking.price)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography variant="body1" paragraph>
                                {`Impuesto IVA (21%)`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'end' }}>
                            <Typography variant="body1" paragraph>
                                {fCurrency(booking.price / 1.21 * 0.21)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography variant="body1" paragraph>
                                {`Gastos de pago (5%)`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'end' }}>
                            <Typography variant="body1" paragraph>
                                {fCurrency(booking.price * 0.05)}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography variant="body1" paragraph>
                                {`Impuestos Brutos`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'end' }}>
                            <Typography variant="body1" paragraph>
                                {fCurrency(
                                    (booking.price - (booking.price /1.21*0.21)) * 0.035
                                )}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} >
                            <Typography variant="body1" paragraph>
                                {`Comisión SnowMatch`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'end' }}>
                            <Typography variant="body1" paragraph>
                                {fCurrency(booking.price - getPayByHoursLevel(user.level, calculateTotalHours(booking.eventList))- (booking.price - (booking.price /1.21*0.21)) * 0.035 - booking.price * 0.05-booking.price / 1.21 * 0.21)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <Divider sx={{
                                borderBottomWidth: 2,
                                mb: 1
                            }} />
                        </Grid>

                        <Grid item xs={6} >
                            <Typography variant="body1" paragraph>
                                {`Total a cobrar`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'end' }}>
                            <Typography variant="body1" paragraph>
                                {fCurrency(getPayByHoursLevel(user.level, calculateTotalHours(booking.eventList)))}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid> */}
                    {/* <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Notas
                        </Typography>
                        <Box display='flex' flexDirection='column'>
                            <TextField minRows={3} rows={3} />
                            <Button variant="outlined" sx={{ mt: 2, py: 1, color: 'black', borderColor: 'black' }} onClick={() => navigate(PATH_DASHBOARD.user.profile)}>
                                Guardar
                            </Button>
                        </Box>
                    </Grid> */}
                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h3" paragraph>
                            Soporte
                        </Typography>
                        {/* option to contact via email to support@snowmatch.pro */}
                        <Box onClick={openWhatsApp} display='flex' justifyContent='space-between' alignItems='center'>
                            <Box display='flex' justifyContent='flex-start' alignItems='center'>
                                <Iconify icon={'material-symbols:health-and-safety-outline'} width={25} height={25} mr={2} />
                                <Typography sx={{ fontSize: '20px' }} alignItems='center'>
                                    Ayuda con seguridad
                                </Typography>
                            </Box>

                            <Iconify icon={'material-symbols:chevron-right'} width={25} height={25} />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box onClick={openWhatsApp} display='flex' justifyContent='space-between' alignItems='center'>
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
                        <Box onClick={openWhatsApp} display='flex' justifyContent='space-between' alignItems='center'>
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
            <Drawer
                anchor="bottom"
                open={rateOpen}
                onClose={() => setRateOpen(false)}
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
                    <IconButton onClick={() => setRateOpen(false)}>
                        <Iconify icon={'line-md:close-circle'} width={25} height={25} />
                    </IconButton>
                </Box>
                <Grid container p={2} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h2" gutterBottom>
                            Rate your lesson
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
                                    {formatDate(booking.eventList[0]?.start, { month: 'short', day: 'numeric' })} - {formatDate(booking.eventList[booking.eventList.length - 1]?.end, { month: new Date(booking.eventList[0]?.end).getMonth() === new Date(booking.eventList[0]?.start).getMonth() ? undefined : 'short', day: 'numeric' })}
                                </Typography>
                            </Box>
                            <Avatar alt={isStudent ? booking?.teacher?.name : booking?.student?.name} src={isStudent ? booking.teacher.imageS3 : booking.student.imageS3} sx={{ width: 40, height: 40 }} />
                        </Box>
                    </Grid>
                    {isPending && !isStudent && (
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
                    )}

                    <Grid item xs={12}>
                        <Divider sx={{ borderBottomWidth: 8, }} />
                    </Grid>
                    <Grid item xs={12}>
                        <ProductDetailsReviewFormMobile onClose={() => {
                            setRateOpen(false)
                        }} id="move_add_review" teacherId={booking?.teacher.id} bookingId={booking.id} />
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
}
