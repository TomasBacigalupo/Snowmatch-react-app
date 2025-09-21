import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { Box, Typography, Avatar, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

TypingIndicator.propTypes = {
  conversationKey: PropTypes.string,
};

export default function TypingIndicator({ conversationKey }) {
  const { typingUsers } = useSelector((state) => state.chat);
  
  if (!conversationKey || !typingUsers[conversationKey]) {
    return null;
  }

  const currentTypingUsers = Object.values(typingUsers[conversationKey]);
  
  if (currentTypingUsers.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        minHeight: 40,
        backgroundColor: alpha('#000', 0.02),
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {currentTypingUsers.length === 1 ? (
          <>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: 'primary.main',
                fontSize: '0.75rem',
              }}
            >
              {currentTypingUsers[0].userName?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {currentTypingUsers[0].userName} está escribiendo
              <Box
                component="span"
                sx={{
                  ml: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <TypingDots />
              </Box>
            </Typography>
          </>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Varios usuarios están escribiendo
            <Box
              component="span"
              sx={{
                ml: 1,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <TypingDots />
            </Box>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}

// Typing dots animation component
function TypingDots() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        '& .typing-dot': {
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          animation: 'typing 1.4s infinite ease-in-out',
          '&:nth-of-type(1)': {
            animationDelay: '0s',
          },
          '&:nth-of-type(2)': {
            animationDelay: '0.16s',
          },
          '&:nth-of-type(3)': {
            animationDelay: '0.32s',
          },
        },
        '@keyframes typing': {
          '0%, 80%, 100%': {
            transform: 'scale(0.8)',
            opacity: 0.5,
          },
          '40%': {
            transform: 'scale(1)',
            opacity: 1,
          },
        },
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box key={index} className="typing-dot" />
      ))}
    </Box>
  );
}
