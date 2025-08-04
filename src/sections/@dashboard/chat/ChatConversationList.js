import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { List } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../routes/paths';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
//
import ChatConversationItem from './ChatConversationItem';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  onSelectConversation: PropTypes.func,
  sx: PropTypes.object,
};

export default function ChatConversationList({ 
  conversations, 
  isOpenSidebar, 
  activeConversationId, 
  onSelectConversation,
  sx, 
  ...other 
}) {
  const navigate = useNavigate();
  const {user} = useAuth();

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
      navigate(PATH_GUEST.chatView(conversation.conversationKey));
    }else{
      navigate(PATH_DASHBOARD.chat.view(conversation.conversationKey));
    }
  };

  const loading = !conversations.allIds.length;

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
