import { Grid } from "@mui/material";
import useAuth from "src/hooks/useAuth";
import EventCard from "../cards/EventCard";

export default function UserLessonsList(){
    const {user} = useAuth()

    const lessons = user?.events.filter(e => e.source === 'APP')

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