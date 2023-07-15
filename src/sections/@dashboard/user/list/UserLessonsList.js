import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { getLessons } from "src/redux/slices/calendar";
import { useDispatch, useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";
import useLocales from "src/hooks/useLocales";
import { Typography } from "@mui/material";
import useAuth from "../../../../hooks/useAuth";

const date = new Date()
date.toLocaleString()

export default function UserLessonsList() {
  const dispatch = useDispatch();
  const { lessons } = useSelector((state) => state.calendar);
  const { translate } = useLocales();
  const { user, isStudent } = useAuth()

  useEffect(() => {
    dispatch(getLessons());
  }, [dispatch]);

  // Group lessons by student
const groupedLessons = lessons.reduce((groups, lesson) => {
    // If is Teacher, group by student
    if (!isStudent) {
      const students = lesson.students;
      students.forEach((student) => {
        if (!groups[student.name]) {
          if (lesson.start >= new Date()) {
            groups[student.name] = [];
            groups[student.name].push(lesson);
          }
        } else if (lesson.start >= new Date()) {
          groups[student.name].push(lesson);
        }
      });
    }
    // If is Student, group by teacher
    else {
      const teacher = lesson.owner;
        if (!groups[teacher.name]) {
          if (lesson.start >= new Date()) {
            groups[teacher.name] = [];
            groups[teacher.name].push(lesson);
          }
        } else if (lesson.start >= new Date()) {
          groups[teacher.name].push(lesson);
        }
    }
    return groups;
  }, {});


  return (
    <Grid container spacing={2}>
      {lessons.filter(e => e.start >= new Date()).length === 0 &&
        <Box display='flex'>
                <Typography>{translate("lessons.noFeatureLessons")}</Typography>
        </Box>
      }
      {Object.entries(groupedLessons).map(([student, studentGroup], idx) => (
        <Grid item xs={12} md={6} key={student}>
          <EventCard key={idx} lessons={studentGroup} />
        </Grid>
      ))}
    </Grid>
  );
}
