import { formatDate } from "@fullcalendar/react";
import { Grid } from "@mui/material";
import { start } from "nprogress";
import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import { getLessons } from "src/redux/slices/calendar";
import { useDispatch, useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";

const date = new Date()
date.toLocaleString()

export default function UserLessonsList(){
    const {user, isTeacher} = useAuth()
    const dispatch = useDispatch()
    const {lessons} = useSelector(state => state.calendar) 
    useEffect(()=>{
        dispatch(getLessons())
    },[dispatch])
    return (
        <Grid container spacing={2}>
            {lessons.filter(e => e.start > new Date()).map((lesson, idx) => 
                <Grid item xs={12} md={6}>
                    <EventCard key={idx} lesson={lesson} />
                </Grid>
            )}
        </Grid>
    )
    
}