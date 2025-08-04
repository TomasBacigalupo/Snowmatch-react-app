import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import { Card, Container, Box, Typography, Button, IconButton } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getConversations, getContacts } from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow, ChatConversationList } from '../../sections/@dashboard/chat';
import Iconify from '../../components/Iconify';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationKey } = useParams();
  const {user} = useAuth();
  
  const { conversations, activeConversationId } = useSelector((state) => state.chat);
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    // Si hay un conversationKey en la URL, mostrar el chat window
    if (conversationKey) {
      setShowChatWindow(true);
    } else {
      setShowChatWindow(false);
    }
  }, [conversationKey]);

  const handleBackToList = () => {
    if(user.role === 'STUDENT'){
      navigate(PATH_GUEST.chat);
    }else{
      navigate(PATH_DASHBOARD.chat.root);
    
    }
    setShowChatWindow(false);
  };

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.byId[conversationId];
    if (conversation) {
      if(user.role === 'STUDENT'){
        navigate(PATH_GUEST.chatView(conversation.conversationKey));
      }else{
        navigate(PATH_DASHBOARD.chat.view(conversation.conversationKey));
      }
    }
  };

  const handleNewConversation = () => {
    navigate(PATH_DASHBOARD.chat.new);
  };

  if (showChatWindow) {
    return (
      <Page title="Chat">
         <Card sx={{ height: '100vh', display: 'flex' }}>
            <ChatWindow />
          </Card>
      </Page>
    );
  }

  return (
    <Page title="Chat">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <Card sx={{ height: {xs:'100vh', md:'72vh'} , display: 'flex' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Conversaciones</Typography>
              <IconButton 
                onClick={handleNewConversation}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <Iconify icon="eva:edit-fill" width={20} height={20} />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <ChatConversationList
                conversations={conversations}
                isOpenSidebar={true}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
              />
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
