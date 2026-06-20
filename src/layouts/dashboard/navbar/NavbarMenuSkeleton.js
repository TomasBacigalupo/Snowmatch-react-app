import PropTypes from 'prop-types';
// @mui
import { Stack, Skeleton, Box } from '@mui/material';

// ----------------------------------------------------------------------

NavbarMenuSkeleton.propTypes = {
  count: PropTypes.number,
  isCollapse: PropTypes.bool,
};

export default function NavbarMenuSkeleton({ count = 7, isCollapse = false }) {
  return (
    <Box sx={{ px: 2 }}>
      {!isCollapse && (
        <Skeleton variant="text" width={120} height={16} sx={{ mb: 2, ml: 1 }} />
      )}
      <Stack spacing={1.5}>
        {Array.from({ length: count }).map((_, index) => (
          <Stack
            key={`nav-skeleton-${index}`}
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ px: 1, py: 0.75 }}
          >
            <Skeleton variant="circular" width={24} height={24} />
            {!isCollapse && <Skeleton variant="text" sx={{ flexGrow: 1, height: 20 }} />}
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
