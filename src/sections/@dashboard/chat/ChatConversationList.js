import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { List, Box, Typography, Button, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../routes/paths';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
import Iconify from '../../../components/Iconify';
//
import ChatConversationItem from './ChatConversationItem';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  onSelectConversation: PropTypes.func,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  userRole: PropTypes.string,
  PremiumBanner: PropTypes.elementType,
  sx: PropTypes.object,
};

export default function ChatConversationList({ 
  conversations, 
  isOpenSidebar, 
  activeConversationId, 
  onSelectConversation,
  isLoading = false,
  error = null,
  userRole,
  PremiumBanner,
  sx, 
  ...other 
}) {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const {user} = useAuth();

  const handlePremiumSubscription = () => {
    const message = translate('chat.premium.message', {
      userName: user?.name || translate('general.form.name'),
      userEmail: user?.email || 'No disponible',
      userRole: user?.role || 'No disponible',
      date: new Date().toLocaleDateString()
    });

    const url = `https://wa.me/5492944263223?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSelectConversation = (conversationId) => {
    console.log('conversationId', conversationId);
    
    // Si se pasa una función onSelectConversation, usarla
    if (onSelectConversation) {
      onSelectConversation(conversationId);
      return;
    }
    
    // Comportamiento original para compatibilidad
    const conversation = conversations.byId[conversationId]; 
    if(user.role === 'STUDENT'){
      navigate(PATH_GUEST.chatView(conversation.conversationId));
    }else{
      navigate(PATH_DASHBOARD.chat.view(conversation.conversationId));
    }
  };

  const loading = isLoading;
  const hasConversations = conversations.allIds.length > 0;
  const isEmpty = !loading && !hasConversations && !error;

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Iconify icon="eva:alert-circle-outline" width={48} height={48} sx={{ color: 'error.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {translate('chat.error.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {translate('chat.error.message')}
        </Typography>
        <Button 
          variant="contained" 
          onClick={handlePremiumSubscription}
          sx={{ 
            bgcolor: 'black', 
            color: 'white',
            '&:hover': { 
              bgcolor: 'grey.800' 
            }
          }}
        >
          {translate('chat.premium.subscribe')}
        </Button>
      </Box>
    );
  }

  // Show empty state
  if (isEmpty) {
    // Show custom banner for teachers
    if (userRole === 'TEACHER' && PremiumBanner) {
      return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <PremiumBanner />
        </Box>
      );
    }

    // Show default empty state for other users
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Iconify icon="eva:message-circle-outline" width={48} height={48} sx={{ color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {translate('chat.empty.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {translate('chat.empty.message')}
        </Typography>
        <Button 
          variant="contained" 
          onClick={handlePremiumSubscription}
          sx={{ 
            bgcolor: 'black', 
            color: 'white',
            '&:hover': { 
              bgcolor: 'grey.800' 
            }
          }}
        >
          {translate('chat.premium.subscribe')}
        </Button>
      </Box>
    );
  }

  // Show loading or conversations
  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : conversations.allIds).map((conversationId, index) =>
        conversationId ? (
          <ChatConversationItem
            key={conversationId}
            isOpenSidebar={isOpenSidebar}
            conversation={conversations.byId[conversationId]}
            isSelected={activeConversationId === conversationId}
            onSelectConversation={() => handleSelectConversation(conversationId)}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
