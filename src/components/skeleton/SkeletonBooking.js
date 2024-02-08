// @mui
import { Box, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonBooking() {
  return (
    <>
       <Box sx={{ mt: 3, display: 'flex', alignItems: 'flx-start', p:1 }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={60} />
        </Box>
        <Skeleton variant="circular" width={50} height={50} />
      </Box>
    </>
  );
}
