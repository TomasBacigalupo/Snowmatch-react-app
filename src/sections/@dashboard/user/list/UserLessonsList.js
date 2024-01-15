import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { getLessons } from "src/redux/slices/calendar";
import { useDispatch, useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";
import useLocales from "src/hooks/useLocales";
import { Typography } from "@mui/material";
import useAuth from "../../../../hooks/useAuth";
import BookingCard from "../cards/BookingCard";

const date = new Date()
date.toLocaleString()

export default function UserLessonsList() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);
  const { translate } = useLocales();
  const { user, isStudent } = useAuth()



  return (
    <Grid container spacing={2}>
      {bookings.map(booking => {
        return (
          <Grid item xs={12} md={6} key={booking.id}>
            <BookingCard key={booking.id} booking={booking} />
          </Grid>
        )}
      )}
      
    </Grid>
  );
}
