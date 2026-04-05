import Pusher from 'pusher-js';
import axios from '../utils/axios';
import { dispatch } from '../redux/store';
import { 
  onSendMessage, 
  setTypingIndicator, 
  setUserOnline, 
  setUserOffline, 
  incrementUnreadCount, 
  markMessagesAsRead,
  setWebSocketStatus 
} from '../redux/slices/chat';

// Helper function to normalize timestamps to UTC
const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return new Date().toISOString();
  
  // If it's a number, check if it's a valid Unix timestamp
  if (typeof timestamp === 'number') {
    // Unix timestamps are typically 10 or 13 digits (seconds or milliseconds)
    // Small numbers like "8" are likely message IDs, not timestamps
    if (timestamp > 1000000000) {
      // Convert to milliseconds if needed
      const ms = timestamp > 10000000000 ? timestamp : timestamp * 1000;
      return new Date(ms).toISOString();
    }
    // If it's a small number, it's not a valid timestamp
    return new Date().toISOString();
  }
  
  // If it's a string without timezone, append Z to treat as UTC
  if (typeof timestamp === 'string') {
    // Check if it looks like an ISO datetime
    if (timestamp.includes('T')) {
      // Add Z if no timezone specified
      if (!timestamp.includes('Z') && !/[+-]\d{2}:?\d{2}$/.test(timestamp)) {
        return timestamp + 'Z';
      }
      return timestamp;
    }
    
    // If it doesn't look like a datetime, use current time
    return new Date().toISOString();
  }
  
  // Fallback to current time
  return new Date().toISOString();
};

// Pusher Configuration
const PUSHER_CONFIG = {
  key: process.env.REACT_APP_PUSHER_KEY || 'your-pusher-app-key',
  cluster: process.env.REACT_APP_PUSHER_CLUSTER || 'us2',
  encrypted: true,
  forceTLS: true,
};

class WebSocketService {
  constructor() {
    this.pusher = null;
    this.currentConversation = null;
    this.currentUser = null;
    this.typingTimers = new Map();
    this.isTyping = false;
    this.channel = null;
    
    this.init();
  }

  async init() {
    try {
      // Initialize Pusher
      this.pusher = new Pusher(PUSHER_CONFIG.key, {
        cluster: PUSHER_CONFIG.cluster,
        encrypted: PUSHER_CONFIG.encrypted,
        forceTLS: PUSHER_CONFIG.forceTLS,
        authEndpoint: '/api/websocket/auth',
        auth: {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
          },
        },
      });

      // Set up connection event handlers
      this.pusher.connection.bind('connected', () => {
        console.log('✅ WebSocket connected');
        dispatch(setWebSocketStatus(true));
      });

      this.pusher.connection.bind('error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        dispatch(setWebSocketStatus(false));
      });

      this.pusher.connection.bind('disconnected', () => {
        console.log('⚠️ WebSocket disconnected');
        dispatch(setWebSocketStatus(false));
      });

      // Get current user info
      await this.getCurrentUser();
      
      // Set up user status tracking
      this.setupUserStatusTracking();

    } catch (error) {
      console.error('❌ Error initializing WebSocket service:', error);
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get('/api/websocket/auth');
      if (response.data && response.data.user) {
        this.currentUser = response.data.user;
        console.log('✅ WebSocket authenticated for user:', this.currentUser.userName || this.currentUser.id);
      }
    } catch (error) {
      console.error('❌ Error getting current user:', error);
    }
  }

  // Subscribe to a conversation channel
  subscribeToConversation(conversationKey) {
    try {
      // Unsubscribe from previous conversation
      if (this.currentConversation && this.channel) {
        this.unsubscribeFromConversation();
      }

      this.currentConversation = conversationKey;
      const channelName = `conversation-${conversationKey}`;
      this.channel = this.pusher.subscribe(channelName);

      // Bind event handlers
      this.channel.bind('message', (data) => this.handleNewMessage(data));
      this.channel.bind('typing', (data) => this.handleTypingIndicator(data));
      this.channel.bind('message-read', (data) => this.handleMessageRead(data));
      this.channel.bind('user-online', (data) => this.handleUserOnline(data));
      this.channel.bind('user-offline', (data) => this.handleUserOffline(data));

      console.log(`📡 Subscribed to conversation: ${conversationKey}`);
      
      // Mark user as online
      this.updateUserStatus(true);

    } catch (error) {
      console.error('❌ Error subscribing to conversation:', error);
    }
  }

  // Unsubscribe from current conversation
  unsubscribeFromConversation() {
    if (this.channel) {
      this.pusher.unsubscribe(this.channel.name);
      this.channel = null;
      this.currentConversation = null;
      
      // Stop typing indicator
      this.stopTyping();
      
      console.log('📡 Unsubscribed from conversation');
    }
  }

  // Handle new message received via WebSocket
  handleNewMessage(messageData) {
    console.log('📨 New message received:', messageData);
    console.log('📨 Timestamp from WebSocket:', messageData.timestamp);
    console.log('📨 CreatedAt from WebSocket:', messageData.createdAt);
    console.log('📨 Message senderId:', messageData.senderId, 'Type:', typeof messageData.senderId);
    console.log('📨 Current user ID:', this.currentUser?.id, 'Type:', typeof this.currentUser?.id);

    // Don't show our own messages (they're already in UI)
    // Convert both to strings for comparison to handle type mismatches
    const messageSenderId = String(messageData.senderId);
    const currentUserId = String(this.currentUser?.id || '');
    
    if (messageSenderId === currentUserId && currentUserId !== '') {
      console.log('📨 Ignoring own message from WebSocket');
      return;
    }

    console.log('📨 Processing message from another user');

    // Normalize the timestamp
    const normalizedTimestamp = normalizeTimestamp(messageData.timestamp || messageData.createdAt);
    console.log('📨 Normalized timestamp:', normalizedTimestamp);

    // Add message to Redux store
    const messagePayload = {
      conversationId: messageData.conversationKey,
      messageId: messageData.id,
      message: messageData.message,
      contentType: messageData.contentType || 'text',
      attachments: messageData.attachments || [],
      createdAt: normalizedTimestamp,
      senderId: messageData.senderId,
    };

    console.log('📨 Message payload to Redux:', messagePayload);
    dispatch(onSendMessage(messagePayload));

    // Increment unread count
    dispatch(incrementUnreadCount({ conversationKey: messageData.conversationKey }));

    // Play notification sound
    this.playNotificationSound();
  }

  // Handle typing indicator
  handleTypingIndicator(typingData) {
    // Don't show our own typing indicator
    if (typingData.userId === this.currentUser?.id) {
      return;
    }

    dispatch(setTypingIndicator({
      conversationKey: this.currentConversation,
      userId: typingData.userId,
      userName: typingData.userName,
      isTyping: typingData.isTyping,
    }));
    
    console.log(`${typingData.userName} is ${typingData.isTyping ? 'typing' : 'not typing'}`);
  }

  // Handle message read receipts
  handleMessageRead(readData) {
    console.log('👁️ Message read:', readData);
    
    dispatch(markMessagesAsRead({
      conversationKey: readData.conversationKey,
      userId: readData.userId,
    }));
  }

  // Handle user online status
  handleUserOnline(userData) {
    console.log('🟢 User online:', userData.userName);
    
    dispatch(setUserOnline({
      userId: userData.userId,
      userName: userData.userName,
      timestamp: userData.timestamp,
    }));
  }

  // Handle user offline status
  handleUserOffline(userData) {
    console.log('🔴 User offline:', userData.userName);
    
    dispatch(setUserOffline({
      userId: userData.userId,
      timestamp: userData.timestamp,
    }));
  }

  // Send typing indicator
  sendTypingIndicator(conversationKey, isTyping) {
    if (!conversationKey || !this.currentUser) return;

    // Clear existing timer
    if (this.typingTimers.has(conversationKey)) {
      clearTimeout(this.typingTimers.get(conversationKey));
    }

    if (isTyping && !this.isTyping) {
      this.isTyping = true;
      
      // Send typing event to backend
      axios.post('/api/websocket/typing', {
        conversationKey,
        userId: this.currentUser.id,
        userName: this.currentUser.userName || this.currentUser.email,
        isTyping: true,
      }).catch(error => {
        console.error('❌ Error sending typing indicator:', error);
      });

      // Set timer to stop typing after 1 second of inactivity
      const timer = setTimeout(() => {
        this.stopTyping();
      }, 1000);
      
      this.typingTimers.set(conversationKey, timer);
    }
  }

  // Stop typing indicator
  stopTyping() {
    if (this.isTyping && this.currentConversation && this.currentUser) {
      this.isTyping = false;
      
      axios.post('/api/websocket/typing', {
        conversationKey: this.currentConversation,
        userId: this.currentUser.id,
        userName: this.currentUser.userName || this.currentUser.email,
        isTyping: false,
      }).catch(error => {
        console.error('❌ Error stopping typing indicator:', error);
      });
    }

    // Clear all typing timers
    this.typingTimers.forEach(timer => clearTimeout(timer));
    this.typingTimers.clear();
  }

  // Update user online/offline status
  async updateUserStatus(isOnline) {
    if (!this.currentUser) return;

    try {
      await axios.post('/api/websocket/user-status', {
        userId: this.currentUser.id,
        isOnline,
      });
    } catch (error) {
      console.error('❌ Error updating user status:', error);
    }
  }

  // Setup user status tracking
  setupUserStatusTracking() {
    // Mark as online when page loads
    window.addEventListener('load', () => {
      this.updateUserStatus(true);
    });

    // Mark as offline when page unloads
    window.addEventListener('beforeunload', () => {
      this.updateUserStatus(false);
      this.stopTyping();
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateUserStatus(false);
      } else {
        this.updateUserStatus(true);
      }
    });
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // Create audio element for notification sound
      const audio = new Audio('/assets/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
      });
    } catch (error) {
      console.log('Notification sound not available');
    }
  }


  // Disconnect WebSocket
  disconnect() {
    if (this.pusher) {
      this.updateUserStatus(false);
      this.stopTyping();
      this.unsubscribeFromConversation();
      this.pusher.disconnect();
      this.pusher = null;
    }
  }

  // Get current connection state
  getConnectionState() {
    return this.pusher ? this.pusher.connection.state : 'disconnected';
  }

  // Check if connected
  isConnected() {
    return this.pusher && this.pusher.connection.state === 'connected';
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
