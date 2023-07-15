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

EventCard.propTypes = {
    lesson: PropTypes.object,
    showInfo: PropTypes.bool,
};

export default function EventCard({ lessons, showInfo = true }) {
    const { translate } = useLocales()
    const dispatch = useDispatch()
    const { user, isStudent } = useAuth()

    const [{ start, end, id, name, lastName, resort, payed, owner, students, state }] = lessons;
    const [payedState, setPayedState] = useState(lessons.every((lesson) => lesson.payed === lessons[0].payed) ? lessons[0].payed : false)
    const [openAcceptModal, setOpenAcceptModal] = useState(false)
    const [openDeclineModal, setOpenDeclineModal] = useState(false)
    const [lessonState, setLessonState] = useState(lessons.every((lesson) => lesson.state === lessons[0].state) ? lessons[0].state : "PENDING")
    const navigate = useNavigate()

    const handlePay = () => {
        setPayedState(!payedState)
        if (lessons.every((lesson) => lesson.payed)) {
            dispatch(setUnpaid(id))
        } else {
            dispatch(setPaid(id))
        }
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
        lessons.map((lesson) =>
            dispatch(setAccepted(lesson.id))
        )
        setLessonState("ACCEPTED")
        handleCloseAcceptModal()
    }
    const handleDeclineEvent = () => {
        lessons.map((lesson) =>
            dispatch(setDeclined(lesson.id))
        )
        setLessonState("DECLINED")
        handleCloseDeclineModal()
    }


    return (
        <Card
            sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Avatar alt={isStudent ? owner.name : students[0]?.name} src={'avatarUrl'} sx={{ width: 48, height: 48 }} />
            <Box sx={{ flexGrow: 1, minWidth: 200, pl: 2, pr: 1 }}>
                <Typography variant="subtitle2" noWrap>
                    {isStudent ? `${owner.name} ${owner.lastname}` : `${students[0]?.name}`}
                </Typography>
                {resort &&
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon={'eva:pin-fill'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {resort}
                        </Typography>
                    </Box>
                }
                {showInfo && lessons.map((lesson, index) => {
                  const startHour = parseInt(lesson.start.toString().slice(16, 18));
                  const endHour = parseInt(lesson.end.toString().slice(16, 18));
                  let timePeriod;

                  if (startHour === 6 && endHour === 9) {
                    timePeriod = 'MORNING';
                  } else if (startHour === 9 && endHour === 12) {
                    timePeriod = 'AFTERNOON';
                  } else {
                    timePeriod = 'FULL DAY';
                  }
                  return (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Iconify icon={'material-symbols:calendar-month'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1, width: 40 }} noWrap>
                            {`${lesson.start.toLocaleDateString('es-AR', { month: '2-digit', day: '2-digit', })}`}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                            {timePeriod}
                        </Typography>
                    </Box>
                  </>
                )})}
                <Box display='flex' alignItems='center'>
                    {lessonState && lessonState === 'ACCEPTED' && <Iconify
                        icon={'eva:checkmark-circle-fill'}
                        sx={{
                            width: 16, height: 16, mr: 0.5, flexShrink: 0,
                            color: 'success.main',

                        }}
                    />}
                    {lessonState && lessonState === 'PENDING' && <Iconify
                        icon={'eva:clock-outline'}
                        sx={{
                            width: 16, height: 16, mr: 0.5, flexShrink: 0,
                            color: 'warning.main',
                        }}
                    />}
                    {lessonState && lessonState === 'DECLINED' && <Iconify
                        icon={'eva:close-circle-fill'}
                        sx={{
                            width: 16, height: 16, mr: 0.5, flexShrink: 0,
                            color: 'error.main',
                        }}
                    />}
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {lessonState && lessonState === 'ACCEPTED' && translate('event.accepted')}
                        {lessonState && lessonState === 'PENDING' && translate('event.pending')}
                        {lessonState && lessonState === 'DECLINED' && translate('event.declined')}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0, pl: 0, pr: 0 }} alignItems={'center'} justifyContent={'center'}>
                {/*{!isStudent && state === "ACCEPTED" && <Button
                    size="small"
                    onClick={handlePay}
                    variant={payed ? 'text' : 'outlined'}
                    sx={{
                        marginBottom: '3px',
                        marginRight: '3px',
                        zIndex: 99999999
                    }}
                    color={payedState ? 'success' : 'inherit'}
                    startIcon={payedState && <Iconify icon={'eva:checkmark-fill'} />}
                >
                    {payedState ? translate('event.payed') : translate('event.pay')}
                </Button>}*/}
                {showInfo &&
                    <Button
                        fullWidth
                        size="small"
                        onClick={() => {
                            navigate(`${isStudent ? '/match/lessons' : PATH_DASHBOARD.user.lessons}/${id}`)
                        }}
                        sx={{
                            marginBottom: '3px',
                            marginRight: '3px',
                            zIndex: 99999999
                        }}
                        variant={'outlined'}
                        color={'primary'}
                        startIcon={<Iconify icon={'mdi:user'} />}
                        disabled={!(lessonState === 'ACCEPTED' && payed )}
                    >
                        {translate('event.information')}
                    </Button>
                }
                {!isStudent && lessonState === "PENDING" && showInfo &&
                    <Box >
                        <Button
                            fullWidth
                            size="small"
                            variant={'contained'}
                            sx={{
                                marginBottom: '3px',
                                marginRight: '3px',
                                zIndex: 99999999
                            }}
                            color={'success'}
                            onClick={handleOpenAcceptModal}
                        >
                            {translate('event.accept')}
                        </Button>
                        <Button
                            fullWidth
                            size="small"
                            onClick={handleOpenDeclineModal}
                            variant={'outlined'}
                            sx={{
                                marginBottom: '3px',
                                marginRight: '3px',
                                zIndex: 99999999
                            }}
                            color={'error'}
                        >
                            {translate('event.decline')}
                        </Button>
                    </Box>
                }
            </Box>
            <ConfirmAcceptModal isOpen={openAcceptModal} onClose={handleCloseAcceptModal} onAccept={handleAcceptEvent} />
            <ConfirmDeclineModal isOpen={openDeclineModal} onClose={handleCloseDeclineModal} onDecline={handleDeclineEvent} />
        </Card>
    );
}
