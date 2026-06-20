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

// Helper function to parse dates as UTC
function parseDate(dateString) {
  if (!dateString) return new Date(0);
  
  // If it's already a Date object, return it
  if (dateString instanceof Date) return dateString;
  
  // If it's a string, try to parse it
  if (typeof dateString === 'string') {
    // If it's just a date (YYYY-MM-DD), add time and treat as UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return new Date(dateString + 'T00:00:00Z');
    }
    
    // If it has T but no timezone, append Z to treat as UTC
    if (dateString.includes('T') && !dateString.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(dateString)) {
      return new Date(dateString + 'Z');
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
      state.isLoading = false;
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;
      console.log('getConversationsSuccess - conversations:', conversations);
      
      // Handle both 'id' and 'conversationId' fields for API consistency
      const conversationsWithConsistentId = conversations.map(conv => ({
        ...conv,
        conversationId: conv.conversationId || conv.id
      }));
      
      console.log('getConversationsSuccess - objFromArray result:', objFromArray(conversationsWithConsistentId, 'conversationId'));

      state.conversations.byId = objFromArray(conversationsWithConsistentId, 'conversationId');
      state.conversations.allIds = Object.keys(state.conversations.byId);
      state.isLoading = false;
      console.log('getConversationsSuccess - final state:', {
        byId: state.conversations.byId,
        allIds: state.conversations.allIds
      });
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {
        // Sort messages by createdAt timestamp
        if (conversation.messages && conversation.messages.length > 0) {
          conversation.messages.sort((a, b) => {
            const dateA = parseDate(a.createdAt);
            const dateB = parseDate(b.createdAt);
            return dateA - dateB;
          });
        }
        
        // Handle both 'id' and 'conversationId' fields for API consistency
        const conversationWithConsistentId = {
          ...conversation,
          conversationId: conversation.conversationId || conversation.id
        };
        
        state.conversations.byId[conversationWithConsistentId.conversationId] = conversationWithConsistentId;
        state.activeConversationId = conversationWithConsistentId.conversationId;
        if (!state.conversations.allIds.includes(conversationWithConsistentId.conversationId)) {
          state.conversations.allIds.push(conversationWithConsistentId.conversationId);
        }
      } else {
        state.activeConversationId = null;
      }
      state.isLoading = false;
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
      state.isLoading = false;
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
      state.isLoading = false;
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
      const { conversationId, userId, userName, isTyping } = action.payload;
      
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = {};
      }
      
      if (isTyping) {
        state.typingUsers[conversationId][userId] = {
          userId,
          userName,
          timestamp: new Date().toISOString(),
        };
      } else {
        delete state.typingUsers[conversationId][userId];
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
      const { conversationId } = action.payload;
      if (!state.unreadCounts[conversationId]) {
        state.unreadCounts[conversationId] = 0;
      }
      state.unreadCounts[conversationId] += 1;
    },

    resetUnreadCount(state, action) {
      const { conversationId } = action.payload;
      state.unreadCounts[conversationId] = 0;
    },

    // MESSAGE READ RECEIPTS
    markMessagesAsRead(state, action) {
      const { conversationId, userId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      
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
  return async (dispatch) => {
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
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/conversations');
      console.log('API Response:', response.data);
      console.log('Conversations:', response.data.conversations);
      dispatch(slice.actions.getConversationsSuccess(response.data.conversations));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(conversationId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/conversation', {
        params: { conversationId },
      });
      dispatch(slice.actions.getConversationSuccess(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAdminConversation(conversationId, { resortAdmin = false } = {}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const base = resortAdmin ? '/api/resort-admin/chat' : '/api/admin/chat';
      const response = await axios.get(`${base}/conversation`, {
        params: { conversationId },
      });
      dispatch(slice.actions.getConversationSuccess(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAdminParticipants(conversationId, { resortAdmin = false } = {}) {
  return async (dispatch) => {
    try {
      const base = resortAdmin ? '/api/resort-admin/chat' : '/api/admin/chat';
      const response = await axios.get(`${base}/participants`, {
        params: { conversationId },
      });
      dispatch(slice.actions.getParticipantsSuccess(response.data.participants));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async (dispatch) => {
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

export function getParticipants(conversationId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/chat/participants', {
        params: { conversationId },
      });
      dispatch(slice.actions.getParticipantsSuccess(response.data.participants));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function sendMessage(conversationId, message) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // Send message to API
      const response = await axios.post('/api/chat/message', {
        conversationId,
        message: message.message,
        contentType: message.contentType || 'text',
        attachments: message.attachments || [],
      });

      // No need to dispatch onSendMessage here because it's already added optimistically in ChatWindow
      // The optimistic update in ChatWindow ensures instant UI feedback
      // If the API call fails, the message will still show (could add error handling later)
      
      if (!response.data.success) {
        console.error('Failed to send message:', response.data);
      }
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.error('Error sending message:', error);
    }
  };
}

// ----------------------------------------------------------------------

export function getConversationId(user1Id, user2Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/chat/conversation', {
        user1Id,
        user2Id,
      });

      console.log(response.data);
      
      
      return response?.data?.conversationId;
     
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      console.error('Error getting conversation ID:', error);
      return null;
    }
  };
}
