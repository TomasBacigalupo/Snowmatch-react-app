import { useState } from "react";
import { Typography, Box, Card, Button, Avatar } from "@mui/material";
import Iconify from "src/components/Iconify";
import { formatDate } from "@fullcalendar/react";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import useAuth from "src/hooks/useAuth";

export default function EventInfoCard({ lesson }) {
    const { isStudent } = useAuth()
    const { start, end, id, name, lastName, resort, people } = lesson;
    const [toggle, setToogle] = useState(false);

    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ flexGrow: 1, minWidth: 200, pl: 4, pr: 1 }}>
                <Typography variant="subtitle2" noWrap>
                    Event Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'ic:outline-people'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {people}
                    </Typography>
                </Box>
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
                        {`${start.slice(11)}hs a ${end.slice(11)}hs`}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1, minWidth: 0, pl: 0, pr: 0 }}>
                {!isStudent && <Button
                    size="small"
                    onClick={() => setToogle(!toggle)}
                    variant={toggle ? 'text' : 'outlined'}
                    sx={{
                        marginBottom: '3px',
                        marginRight: '3px'
                    }}
                    color={toggle ? 'success' : 'inherit'}
                    startIcon={toggle && <Iconify icon={'eva:checkmark-fill'} />}
                >
                    {toggle ? 'Payed' : 'Pay'}
                </Button>}
            </Box>

        </Card>
    );
}