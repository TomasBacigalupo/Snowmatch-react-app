import PropTypes from 'prop-types';
import { useState } from "react";
import { Typography, Box, Card, Button, Avatar } from "@mui/material";
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
                onClick={()=> setOpen(true)}
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
                        height: '90%',
                        marginTop: '20px'
                    }
                }}
            >
                <Box mt={1}>
                    <IconButton onClick={() => setOpen(false)}>
                        <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                    </IconButton>
                </Box>
                <Grid p={2} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>
                            Detalles de la Reserva
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Estricta
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" paragraph>
                            Este instructor tiene un política de cancelación estricta. Si cancelas tu reserva con menos de 15 días de anticipación, no se hará reembolso.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" paragraph>
                            En caso de cancelar con mas de 15 dias de anticipación, se hará un reembolso del 50%.
                        </Typography>
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
}
