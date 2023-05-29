import { Grid } from "@mui/material";
import { useEffect } from "react";
import { getLessons } from "src/redux/slices/calendar";
import { useDispatch, useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";
import useLocales from "src/hooks/useLocales";
import { Typography } from "@mui/material";

const date = new Date()
date.toLocaleString()

export default function UserLessonsList(){
    const dispatch = useDispatch()
    const {lessons} = useSelector(state => state.calendar)
    const {translate} = useLocales()
    useEffect(()=>{
        dispatch(getLessons())
    },[dispatch])
    return (
        <Grid container spacing={2}>
            {lessons.filter(e => e.start >= new Date()).length === 0 && 
                <Typography>{translate("lessons.noFeatureLessons")}</Typography>
            }
            {lessons.filter(e => e.start >= new Date()).map((lesson, idx) => 
                <Grid item xs={12} md={6}>
                    <EventCard key={idx} lesson={lesson} />
                </Grid>
            )}
             
        </Grid>
    )
    
}