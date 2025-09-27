import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Input, Divider, IconButton, InputAdornment } from '@mui/material';
// utils
import uuidv4 from '../../../utils/uuidv4';
// components
import Iconify from '../../../components/Iconify';
import EmojiPicker from '../../../components/EmojiPicker';
import useAuth from 'src/hooks/useAuth';
// services
import webSocketService from '../../../services/websocketService';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: 56,
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  onSend: PropTypes.func,
};

export default function ChatMessageInput({ disabled, conversationId, onSend }) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const typingTimerRef = useRef(null);

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleInputChange = (event) => {
    const newMessage = event.target.value;
    setMessage(newMessage);
    
    // Handle typing indicators
    if (conversationId && newMessage.length > 0) {
      webSocketService.sendTypingIndicator(conversationId, true);
      
      // Clear existing timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      
      // Set timer to stop typing after 1 second of inactivity
      typingTimerRef.current = setTimeout(() => {
        webSocketService.sendTypingIndicator(conversationId, false);
      }, 1000);
    }
  };

  const handleBlur = () => {
    // Stop typing when input loses focus
    if (conversationId) {
      webSocketService.sendTypingIndicator(conversationId, false);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    }
  };

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    console.log('conversationId', conversationId);
    if (!message) {
      return '';
    }
    
    // Stop typing indicator when sending message
    if (conversationId) {
      webSocketService.sendTypingIndicator(conversationId, false);
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    }
    
    if (onSend && conversationId) {
      onSend({
        conversationId,
        messageId: uuidv4(),
        message,
        contentType: 'text',
        attachments: [],
        createdAt: new Date().toISOString().replace(/[+-]\d{2}:?\d{2}$/, ''),
        senderId: user.id,
      });
    }
    return setMessage('');
  };

  return (
    <RootStyle>
      <Input
        disabled={disabled}
        fullWidth
        value={message}
        disableUnderline
        onKeyUp={handleKeyUp}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Type a message"
        sx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
          </InputAdornment>
        }
      // endAdornment={
      //   <Stack direction="row" spacing={1} sx={{ flexShrink: 0, mr: 1.5 }}>
      //     <IconButton disabled={disabled} size="small" onClick={handleAttach}>
      //       <Iconify icon="ic:round-add-photo-alternate" width={22} height={22} />
      //     </IconButton>
      //     <IconButton disabled={disabled} size="small" onClick={handleAttach}>
      //       <Iconify icon="eva:attach-2-fill" width={22} height={22} />
      //     </IconButton>
      //     <IconButton disabled={disabled} size="small">
      //       <Iconify icon="eva:mic-fill" width={22} height={22} />
      //     </IconButton>
      //   </Stack>
      // }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton color="primary" disabled={!message} onClick={handleSend} sx={{ mx: 1 }}>
        <Iconify icon="ic:round-send" width={22} height={22} />
      </IconButton>

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
    </RootStyle>
  );
}
