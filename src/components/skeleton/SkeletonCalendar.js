import PropTypes from 'prop-types';
import { Box, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

const DAY_HEADERS = 7;
const WEEKS = 6;

export default function SkeletonCalendar({ height = 720 }) {
  const cellHeight = typeof height === 'number' ? (height - 48) / WEEKS : 100;

  return (
    <Box sx={{ height, p: 1 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0,
          mb: 0.5,
        }}
      >
        {Array.from({ length: DAY_HEADERS }).map((_, index) => (
          <Skeleton key={`header-${index}`} variant="text" height={40} sx={{ mx: 0.5 }} />
        ))}
      </Box>

      {Array.from({ length: WEEKS }).map((_, weekIndex) => (
        <Box
          key={`week-${weekIndex}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0,
            minHeight: cellHeight,
          }}
        >
          {Array.from({ length: DAY_HEADERS }).map((__, dayIndex) => (
            <Box
              key={`cell-${weekIndex}-${dayIndex}`}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: 0.75,
                minHeight: cellHeight,
              }}
            >
              <Skeleton variant="text" width={24} height={24} />
              {(weekIndex + dayIndex) % 3 === 0 && (
                <Skeleton variant="rounded" height={20} sx={{ mt: 0.5 }} />
              )}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

SkeletonCalendar.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
