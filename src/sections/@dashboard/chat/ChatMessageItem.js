import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';
import useAuth from 'src/hooks/useAuth';

// Helper function to parse dates as UTC
const parseUTCDate = (dateString) => {
  if (!dateString) return new Date(0);
  
  // If it's already a Date object, return it
  if (dateString instanceof Date) return dateString;
  
  // If it's a string, treat timestamps without timezone as UTC
  if (typeof dateString === 'string') {
    // If it has T but no timezone, append Z to treat as UTC
    if (dateString.includes('T') && !dateString.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(dateString)) {
      return new Date(dateString + 'Z');
    }
    return new Date(dateString);
  }
  
  return new Date(0);
};

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func,
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox }) {
  const {user} = useAuth();
  console.log('user', {user});
  const sender = conversation.participants.find((participant) => participant.id === message.senderId);
  const senderDetails =
    message.senderId == user.id
      ? { type: 'me' }
      : { avatar: sender?.avatar, name: sender?.name };

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' }),
            }}
          >
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(parseUTCDate(message.createdAt), {
              addSuffix: true,
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'black' }),
              ...(isImage && { p: 0 }),
            }}
          >
            {isImage ? (
              <Image
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
            ) : (
              <Typography variant="body2" color={isMe ? 'white' : 'black'}>{message.body}</Typography>
            )}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
