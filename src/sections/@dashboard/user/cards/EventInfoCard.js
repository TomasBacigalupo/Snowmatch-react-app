import { useState } from "react";
import { Typography, Box, Card, Button, Avatar } from "@mui/material";
import Iconify from "src/components/Iconify";
import { formatDate } from "@fullcalendar/react";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import useAuth from "src/hooks/useAuth";
import useLocales from "src/hooks/useLocales";

export default function EventInfoCard({ lesson }) {
    const { isStudent } = useAuth()
    const { start, end, id, name, lastName, resort, people: maxStudents, payed, state } = lesson;
    const [toggle, setToogle] = useState(payed);
    const {translate} = useLocales()
    const [lessonState, setLessonState] = useState(state)

    return (
        <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            {/*{console.log({lesson})}*/}
            <Box sx={{ flexGrow: 1, minWidth: 200, pl: 4, pr: 1 }}>
                <Typography variant="subtitle2" noWrap>
                    {lesson.owner ? `${lesson.owner.name}` : `${translate('generalApp.bookedLessons')}`}
                </Typography>
                {maxStudents &&
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <Iconify icon={'ic:outline-people'} sx={{width: 16, height: 16, mr: 0.5, flexShrink: 0}}/>
                      <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                          {maxStudents}
                      </Typography>
                  </Box>
                }
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify icon={'eva:pin-fill'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {resort}
                    </Typography>
                </Box>
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