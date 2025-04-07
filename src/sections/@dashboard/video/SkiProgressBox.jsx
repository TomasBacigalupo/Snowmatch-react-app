import PropTypes from 'prop-types';
import { Box, Typography, Card, LinearProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useLocales from 'src/hooks/useLocales';

export default function SkiProgressBox({ progress = 0 }) {
  const navigate = useNavigate();
  const {translate} = useLocales();

  const handleClick = () => {
    navigate('/match/videoCoach/training');
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: '0px',
      }}
    >
      {progress > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            {translate('progress.yourSkiProgress')}
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 1, height: 10, borderRadius: 1 }}
          />
          
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {`${Math.round(progress)}% ${translate('progress.completed')}`}
          </Typography>
        </>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            {translate('progress.joinSkiLessons')}
          </Typography>
          
          <Box sx={{ 
            mb: 3,
            px: 2,
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Progress lines */}
            <Box sx={{
              position: 'absolute',
              top: 8,
              left: '10%',
              right: '10%',
              display: 'flex',
              height: 2,
            }}>
              {/* Background line */}
              <Box sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'grey.300',
                position: 'absolute',
              }} />
              {/* Animated progress line */}
              <Box sx={{
                width: '0%',
                height: '100%',
                bgcolor: 'primary.main',
                position: 'absolute',
                animation: 'progressLine 1.5s ease-out forwards',
                '@keyframes progressLine': {
                  '0%': {
                    width: '0%',
                  },
                  '100%': {
                    width: '100%',
                  }
                }
              }} />
            </Box>
            
            {/* Progress dots and labels */}
            {['beginner', 'intermediate', 'advanced'].map((level, index) => (
              <Box
                key={level}
                sx={{
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  border: '3px solid',
                  borderColor: 'grey.300',
                  position: 'relative',
                  animation: 'dotFill 1.5s ease-out forwards',
                  animationDelay: `${index * 0.5}s`,
                  '@keyframes dotFill': {
                    '0%': {
                      borderColor: 'grey.300',
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.2)',
                    },
                    '100%': {
                      borderColor: 'primary.main',
                      transform: 'scale(1)',
                    }
                  }
                }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.primary',
                      display: 'block',
                      fontWeight: 'bold',
                      opacity: 0,
                      animation: 'fadeIn 0.5s ease-out forwards',
                      animationDelay: `${index * 0.5 + 0.25}s`,
                      '@keyframes fadeIn': {
                        '0%': {
                          opacity: 0,
                          transform: 'translateY(5px)',
                        },
                        '100%': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        }
                      }
                    }}
                  >
                    {translate(`progress.levels.${level}`)}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                      fontSize: '0.7rem',
                      opacity: 0,
                      animation: 'fadeIn 0.5s ease-out forwards',
                      animationDelay: `${index * 0.5 + 0.5}s`,
                    }}
                  >
                    {translate(`progress.levels.${level}Desc`)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {translate('progress.startYourJourney')}
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleClick}
            sx={{ minWidth: 200 }}
          >
            {translate('progress.goToFirstLevel')}
          </Button>
        </Box>
      )}
    </Card>
  );
}

SkiProgressBox.propTypes = {
  progress: PropTypes.number,
};
