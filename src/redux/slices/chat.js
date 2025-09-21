import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

function objFromArray(array, key = 'id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

// Helper function to parse dates consistently - ignoring timezone
function parseDate(dateString) {
  if (!dateString) return new Date(0);
  
  // If it's already a Date object, return it
  if (dateString instanceof Date) return dateString;
  
  // If it's a string, try to parse it
  if (typeof dateString === 'string') {
    // If it's just a date (YYYY-MM-DD), add time
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString + 'T00:00:00');
    }
    
    // For ISO strings, parse as local time to avoid timezone issues
    if (dateString.includes('T') || dateString.includes('Z')) {
      // Remove timezone info and parse as local time
      const localDateString = dateString.replace(/[+-]\d{2}:?\d{2}$/, '').replace('Z', '');
      return new Date(localDateString);
    }
    
    // For other date strings, parse normally
    return new Date(dateString);
  }
  
  return new Date(0);
}

const initialState = {
  isLoading: false,
  error: null,
  contacts: { byId: {}, allIds: [] },
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
  participants: [],
  recipients: [],
  typingUsers: {}, // Track typing indicators per conversation
  onlineUsers: {}, // Track online status per user
  unreadCounts: {}, // Track unread messages per conversation
  webSocketConnected: false, // WebSocket connection status
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts);
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;

      state.conversations.byId = objFromArray(conversations);
      state.conversations.allIds = Object.keys(state.conversations.byId);
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        // Sort messages by createdAt timestamp (oldest to newest)
        if (conversation.messages && conversation.messages.length > 0) {
          conversation.messages.sort((a, b) => {
            const dateA = parseDate(a.createdAt);
            const dateB = parseDate(b.createdAt);
            return dateA - dateB;
          });
        }
        
        state.conversations.byId[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
        if (!state.conversations.allIds.includes(conversation.id)) {
          state.conversations.allIds.push(conversation.id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const conversation = action.payload;
      const { conversationId, messageId, message, contentType, attachments, createdAt, senderId } = conversation;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId,
      };

      // Use activeConversationId if conversationId is not found in byId
      const targetConversationId = state.conversations.byId[conversationId] ? conversationId : state.activeConversationId;
      
      if (targetConversationId && state.conversations.byId[targetConversationId]) {
        // Check if message already exists to avoid duplicates
        const existingMessageIndex = state.conversations.byId[targetConversationId].messages.findIndex(
          (msg) => msg.id === messageId
        );
        
        if (existingMessageIndex === -1) {
          // Add new message
          state.conversations.byId[targetConversationId].messages.push(newMessage);
        } else {
          // Update existing message (in case of optimistic update)
          state.conversations.byId[targetConversationId].messages[existingMessageIndex] = newMessage;
        }
        
        // Sort messages by createdAt timestamp (oldest to newest) after adding new message
        state.conversations.byId[targetConversationId].messages.sort((a, b) => {
          const dateA = parseDate(a.createdAt);
          const dateB = parseDate(b.createdAt);
          return dateA - dateB;
        });
      }
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },

    // TYPING INDICATORS
    setTypingIndicator(state, action) {
      const { conversationKey, userId, userName, isTyping } = action.payload;
      
      if (!state.typingUsers[conversationKey]) {
        state.typingUsers[conversationKey] = {};
      }
      
      if (isTyping) {
        state.typingUsers[conversationKey][userId] = {
          userId,
          userName,
          timestamp: new Date().toISOString(),
        };
      } else {
        delete state.typingUsers[conversationKey][userId];
      }
    },

    // USER ONLINE/OFFLINE STATUS
    setUserOnline(state, action) {
      const { userId, userName, timestamp } = action.payload;
      state.onlineUsers[userId] = {
        userId,
        userName,
        isOnline: true,
        lastSeen: timestamp || new Date().toISOString(),
      };
    },

    setUserOffline(state, action) {
      const { userId, timestamp } = action.payload;
      if (state.onlineUsers[userId]) {
        state.onlineUsers[userId] = {
          ...state.onlineUsers[userId],
          isOnline: false,
          lastSeen: timestamp || new Date().toISOString(),
        };
      }
    },

    // UNREAD MESSAGES
    incrementUnreadCount(state, action) {
      const { conversationKey } = action.payload;
      if (!state.unreadCounts[conversationKey]) {
        state.unreadCounts[conversationKey] = 0;
      }
      state.unreadCounts[conversationKey] += 1;
    },

    resetUnreadCount(state, action) {
      const { conversationKey } = action.payload;
      state.unreadCounts[conversationKey] = 0;
    },

    // MESSAGE READ RECEIPTS
    markMessagesAsRead(state, action) {
      const { conversationKey, userId } = action.payload;
      const conversation = state.conversations.byId[conversationKey];
      
      if (conversation && conversation.messages) {
        conversation.messages.forEach(message => {
          if (message.senderId !== userId && !message.readBy) {
            message.readBy = message.readBy || [];
            if (!message.readBy.includes(userId)) {
              message.readBy.push(userId);
            }
          }
        });
      }
    },

    // WEBSOCKET CONNECTION STATUS
    setWebSocketStatus(state, action) {
      state.webSocketConnected = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { 
  addRecipients, 
  onSendMessage, 
  resetActiveConversation,
  setTypingIndicator,
  setUserOnline,
  setUserOffline,
  incrementUnreadCount,
  resetUnreadCount,
  markMessagesAsRead,
  setWebSocketStatus
} = slice.actions;

// ----------------------------------------------------------------------

export function getContacts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/contacts');
      dispatch(slice.actions.getContactsSuccess(response.data.contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversations() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/conversations');
      dispatch(slice.actions.getConversationsSuccess(response.data.conversations));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/conversation', {
        params: { conversationKey },
      });
      dispatch(slice.actions.getConversationSuccess(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.get('/api/chat/conversation/mark-as-seen', {
        params: { conversationId },
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/participants', {
        params: { conversationKey },
      });
      dispatch(slice.actions.getParticipantsSuccess(response.data.participants));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function sendMessage(conversationKey, message) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      // Send message to API
      const response = await axios.post('/api/chat/message', {
        conversationKey,
        message: message.message,
        contentType: message.contentType || 'text',
        attachments: message.attachments || [],
      });

      // If API call is successful, update the local state
      if (response.data.success) {
        const messageData = {
          conversationId: conversationKey,
          messageId: response.data.messageId || message.messageId,
          message: message.body,
          contentType: message.contentType || 'text',
          attachments: message.attachments || [],
          createdAt: response.data.createdAt || new Date().toISOString().replace(/[+-]\d{2}:?\d{2}$/, ''),
          senderId: response.data.senderId || '8864c717-587d-472a-929a-8e5f298024da-0', // Default sender ID
        };

        dispatch(slice.actions.onSendMessage(messageData));
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.error('Error sending message:', error);
    }
  };
}

// ----------------------------------------------------------------------

export function getConversationKey(user1Id, user2Id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/chat/conversation-key', {
        user1Id,
        user2Id,
      });

      console.log(response.data);
      
      
      return response?.data?.conversationKey;
     
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.error('Error getting conversation key:', error);
      return null;
    }
  };
}
