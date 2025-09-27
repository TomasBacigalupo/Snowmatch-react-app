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
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow, ChatConversationList } from '../../sections/@dashboard/chat';
import Iconify from '../../components/Iconify';
import PremiumSubscriptionBanner from '../../components/PremiumSubscriptionBanner';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const {user} = useAuth();
  
  const { conversations, activeConversationId, isLoading, error } = useSelector((state) => state.chat);
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    dispatch(getConversations());
    // dispatch(getContacts());
  }, [dispatch]);

  useEffect(() => {
    // Si hay un conversationKey en la URL, mostrar el chat window
    if (conversationId) {
      setShowChatWindow(true);
    } else {
      setShowChatWindow(false);
    }
  }, [conversationId]);

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
        navigate(PATH_GUEST.chatView(conversation.conversationId));
      }else{
        navigate(PATH_DASHBOARD.chat.view(conversation.conversationId));
      }
    }
  };

  const handleNewConversation = () => {
    navigate(PATH_DASHBOARD.chat.new);
  };

  if (showChatWindow) {
    return (
      <Page title={translate('chat.title')}>
         <Card sx={{ height: { xs: 'calc(100dvh - 104px)', md: 'calc(100dvh - 132px)' }, display: 'flex' }}>
            <ChatWindow />
          </Card>
      </Page>
    );
  }

  return (
    <Page title={translate('chat.title')}>
      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ pt: 'env(safe-area-inset-top)' }}>
        <HeaderBreadcrumbs
          heading={translate('chat.title')}
          links={[{ name: translate('menu.dashboard'), href: PATH_DASHBOARD.root }, { name: translate('chat.title') }]}
        />
        <Card sx={{ height: { xs: 'calc(100dvh - 104px)', md: 'calc(100dvh - 132px)' }, display: 'flex' }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">{translate('chat.conversations')}</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>

              <ChatConversationList
                conversations={conversations}
                isOpenSidebar={true}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                isLoading={isLoading}
                error={error}
                userRole={user?.role}
                PremiumBanner={PremiumSubscriptionBanner}
              />
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
