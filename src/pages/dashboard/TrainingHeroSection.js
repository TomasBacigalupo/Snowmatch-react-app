import { Box, Typography } from '@mui/material';

// Hero Section Component
export default function TrainingHeroSection({ title, subtitle, backgroundImage }) {
    return (
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 5,
          p: 4,
          color: 'white',
          background: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.1), rgba(255,255,255,1)), url(${backgroundImage}) center/cover`,
          minHeight: 500,
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'start',
          flexDirection: 'column',
          textAlign: 'left',
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, maxWidth: 600 }}>
          {subtitle}
        </Typography>
      </Box>
    );
  }