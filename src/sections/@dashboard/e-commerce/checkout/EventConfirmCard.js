import { useState } from "react";
import { Typography, Box, Card, Button, Avatar } from "@mui/material";
import Iconify from "src/components/Iconify";
import { formatDate } from "@fullcalendar/react";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import useLocales from "src/hooks/useLocales";

export default function EventConfirmCard({ event }) {

    const { date, resort, people, lessonTime } = event;
    const {translate} = useLocales()
    const navigate = useNavigate()
    const [toggle, setToogle] = useState(false);

    return (
        <Card
            sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Box sx={{ flexGrow: 1, minWidth: 200,}}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'eva:pin-fill'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {resort}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'material-symbols:calendar-month'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {formatDate(date)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'ic:outline-access-time'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {translate('checkout.' + lessonTime.toLowerCase())}
                    </Typography>
                </Box>
                
            </Box>
        </Card>
    );
}