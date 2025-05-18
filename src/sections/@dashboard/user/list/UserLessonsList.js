import { Box, Grid, IconButton } from "@mui/material";
import { useEffect, useRef } from "react";
import { getLessons } from "src/redux/slices/calendar";
import { useDispatch, useSelector } from "src/redux/store";
import EventCard from "../cards/EventCard";
import useLocales from "src/hooks/useLocales";
import { Typography } from "@mui/material";
import useAuth from "../../../../hooks/useAuth";
import BookingCard from "../cards/BookingCard";
import { SkeletonBooking, SkeletonConversationItem, SkeletonPost, SkeletonPostItem, SkeletonProduct } from "src/components/skeleton";
import Iconify from "src/components/Iconify";

const date = new Date()
date?.toLocaleString()

export default function UserLessonsList({ horizontal = false }) {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);
  const { translate } = useLocales();
  const { user, isStudent } = useAuth()
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Same as minWidth of each card
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: currentScroll + (direction === 'right' ? scrollAmount : -scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  if (horizontal) {
    return (
      <Box sx={{ position: 'relative' }}>
        {!isLoading && bookings.length > 1 && (
          <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1, display: 'flex', gap: 1 }}>
            <IconButton onClick={() => handleScroll('left')} size="small">
              <Iconify icon="eva:arrow-ios-back-fill" />
            </IconButton>
            <IconButton onClick={() => handleScroll('right')} size="small">
              <Iconify icon="eva:arrow-ios-forward-fill" />
            </IconButton>
          </Box>
        )}
        <Box sx={{ overflowX: 'auto', p: 2 }} ref={scrollContainerRef}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            {/* show skeleton if is loading */}
            {isLoading && [0, 1, 2, 3, 4].map((index) => (
              <Box key={index} sx={{ width: '100%', flexShrink: 0 }}>
                <SkeletonBooking />
              </Box>
            ))}

            {/* show bookings */}
            {!isLoading && bookings.map(booking => (
              <Box key={booking.id} sx={{ width: '100%', flexShrink: 0 }}>
                <BookingCard booking={booking} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

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
