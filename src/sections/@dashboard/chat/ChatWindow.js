import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, Divider, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  addRecipients,
  onSendMessage,
  getConversation,
  getAdminConversation,
  getParticipants,
  getAdminParticipants,
  markConversationAsRead,
  resetActiveConversation,
  sendMessage,
  resetUnreadCount,
} from '../../../redux/slices/chat';
// services
import webSocketService from '../../../services/websocketService';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.chat;
  const conversation = activeConversationId ? conversations.byId[activeConversationId] : null;
  if (conversation) {
    return conversation;
  }
  const initState = {
    id: '',
    messages: [],
    participants: [],
    unreadCount: 0,
    type: '',
  };
  return initState;
};

export default function ChatWindow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { conversationId } = useParams();
  const { isResortAdmin } = useAuth();
  const { contacts, recipients, participants, activeConversationId } = useSelector((state) => state.chat);
  const conversation = useSelector((state) => conversationSelector(state));

  const isAdminUserChatMonitor = pathname.includes('/admin/user-chats');

  const mode = conversationId ? 'DETAIL' : 'COMPOSE';
  const displayParticipants = isAdminUserChatMonitor
    ? participants
    : participants.filter((item) => item.id !== '8864c717-587d-472a-929a-8e5f298024da-0');

  useEffect(() => {
    const getDetails = async () => {
      if (isAdminUserChatMonitor) {
        const adminChatOpts = { resortAdmin: isResortAdmin };
        await dispatch(getAdminParticipants(conversationId, adminChatOpts));
        try {
          await dispatch(getAdminConversation(conversationId, adminChatOpts));
        } catch (error) {
          console.error(error);
          navigate(PATH_DASHBOARD.admin.userChats);
        }
        return;
      }

      dispatch(getParticipants(conversationId));
      try {
        await dispatch(getConversation(conversationId));
        
        // Subscribe to WebSocket for real-time updates
        // Ensure we're subscribed to the correct conversation channel
        if (conversationId && webSocketService.isConnected()) {
          webSocketService.subscribeToConversation(conversationId);
          console.log(`📡 ChatWindow: Subscribed to conversation channel: conversation-${conversationId}`);
        }
        
        // Reset unread count when opening conversation
        dispatch(resetUnreadCount({ conversationId }));
      } catch (error) {
        console.error(error);
        navigate(PATH_DASHBOARD.chat.new);
      }
    };
    
    if (conversationId) {
      getDetails();
    } else if (activeConversationId) {
      dispatch(resetActiveConversation());
      webSocketService.unsubscribeFromConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (!isAdminUserChatMonitor && activeConversationId) {
      dispatch(markConversationAsRead(activeConversationId));
    }
  }, [dispatch, activeConversationId, isAdminUserChatMonitor]);

  const handleAddRecipients = (recipients) => {
    dispatch(addRecipients(recipients));
  };

  const handleSendMessage = async (value) => {
    try {
      console.log('value', {value});
      // First, optimistically add the message to the UI
      // Ensure the message object has the correct structure for the reducer
      const messageData = {
        conversationId: conversationId,
        messageId: value.messageId,
        message: value.message,
        contentType: value.contentType,
        attachments: value.attachments,
        createdAt: value.createdAt,
        senderId: value.senderId,
      };
      dispatch(onSendMessage(messageData));
      
      // Then send it to the API
      await dispatch(sendMessage(conversationId, value));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px',}}>
      {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={displayParticipants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          <ChatMessageList conversation={conversation} conversationKey={conversationId} />

          <Divider />

          <ChatMessageInput
            conversationId={conversationId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new || isAdminUserChatMonitor}
          />
        </Stack>

        {mode === 'DETAIL' && <ChatRoom conversation={conversation} participants={displayParticipants} />}
      </Box>
    </Stack>
  );
}
