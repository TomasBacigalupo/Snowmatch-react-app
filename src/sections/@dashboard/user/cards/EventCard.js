import { useState } from "react";
import { Typography, Box, Card, Button, Avatar } from "@mui/material";
import Iconify from "src/components/Iconify";
import { formatDate } from "@fullcalendar/react";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD, PATH_GUEST } from "src/routes/paths";
import useAuth from "src/hooks/useAuth";
import { useDispatch } from "src/redux/store";
import { setPaid, setUnpaid } from "src/redux/slices/calendar";
import useLocales from "src/hooks/useLocales";

export default function EventCard({ lesson }) {
    const { translate } = useLocales()
    const dispatch = useDispatch()
    const { user, isStudent } = useAuth()

    const { start, end, id, name, lastName, resort, payed, owner, student } = lesson;
    const [payedState, setPayedState] = useState(payed)
    const navigate = useNavigate()

    const handlePay = () => {
        setPayedState(!payedState)
        if (lesson.pay) {
            dispatch(setUnpaid(id))
        } else {
            dispatch(setPaid(id))
        }
    }

    return (
        <Card
            sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Avatar alt={'Tomi'} src={'avatarUrl'} sx={{ width: 48, height: 48 }} />
            <Box sx={{ flexGrow: 1, minWidth: 200, pl: 2, pr: 1 }}>
                <Typography variant="subtitle2" noWrap>
                    {isStudent ? `${owner.name} ${owner.lastname}` : `${student.name} ${student.lastname}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'eva:pin-fill'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {resort}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'material-symbols:calendar-month'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {`${formatDate(start)}`}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'ic:outline-access-time'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {`${start.toString().slice(16, 21)}hs a ${end.toString().slice(16, 21)}hs`}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0, pl: 0, pr: 0 }}>
                {!isStudent && <Button
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
                </Button>}

                <Button
                    size="small"
                    onClick={() => {
                        navigate(`${isStudent ? '/match/lessons' : PATH_DASHBOARD.user.lessons}/${id}`)
                    }}
                    variant={'outlined'}
                    color={'primary'}
                    startIcon={<Iconify icon={'mdi:user'} />}
                >
                    {translate('event.information')}
                </Button>
            </Box>

        </Card>
    );
}
