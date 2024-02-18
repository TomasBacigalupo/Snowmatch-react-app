import { Box, Grid } from "@mui/material";
import { useEffect } from "react";
import { getLessons } from "src/redux/slices/calendar";
import { useDispatch, useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";
import useLocales from "src/hooks/useLocales";
import { Typography } from "@mui/material";
import useAuth from "../../../../hooks/useAuth";
import BookingCard from "../cards/BookingCard";
import { SkeletonBooking, SkeletonConversationItem, SkeletonPost, SkeletonPostItem, SkeletonProduct } from "src/components/skeleton";

const date = new Date()
date.toLocaleString()

export default function UserLessonsList() {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);
  const { translate } = useLocales();
  const { user, isStudent } = useAuth()



  return (
    <Grid container spacing={2}>
      {/* show skelleton if is loading */}
      {isLoading && [0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <Grid key={index} item xs={12} md={6}>
          <SkeletonBooking />
        </Grid>
      ))}

      {/* show bookings */}
      {!isLoading && bookings.map(booking => {
        return (
          <Grid item xs={12} md={6} key={booking.id}>
            <BookingCard key={booking.id} booking={booking} />
          </Grid>
        )
      }
      )}

      {!isLoading && bookings.length === 0 && 
      <Box p={2}>
        <Typography variant="h6">{translate(`lessons.noBookings${isStudent ? '' : '_teacher'}`)}</Typography>
      </Box>
      }

    </Grid>
  );
}
