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
        <Card
            sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
            <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {booking.state}
                </Typography>
                <Typography variant="h5" sx={{ mb: 0.5 }}>
                    {isStudent ? booking?.teacher?.name : booking?.student?.name}
                </Typography>
                <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                    {formatDate(booking.eventList[0].start, { month: 'short', day: 'numeric'})} - {formatDate(booking.eventList[0].end, { month: new Date(booking.eventList[0].end).getMonth() === new Date(booking.eventList[0].start).getMonth() ? undefined : 'short', day: 'numeric' })}
                </Typography>
            </Box>
            <Avatar alt={isStudent ? booking?.teacher?.name : booking?.student?.name} src={'avatarUrl'} sx={{ width: 40, height: 40 }} />
        </Card>
    );
}
