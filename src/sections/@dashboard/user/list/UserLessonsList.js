import { formatDate } from "@fullcalendar/react";
import { Grid } from "@mui/material";
import { start } from "nprogress";
import useAuth from "src/hooks/useAuth";
import { useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";

const date = new Date()
date.toLocaleString()

export default function UserLessonsList(){
    const {user, isTeacher} = useAuth()
    const {events} = useSelector(state => state.calendar) 
    const lessons = isTeacher ? user?.events.filter(e => e.source === 'APP') : events.filter(e => e.source === 'APP').map(e => ({
        ...e,
        start: e.start.toLocaleString(),
        end: e.end.toLocaleString()
    }))

    return (
        <Grid container spacing={2}>
            {lessons.map((lesson, idx) => 
                <Grid item xs={12} md={6}>
                    <EventCard key={idx} lesson={lesson} />
                </Grid>
            )}
        </Grid>
    )
    
}