import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
  SwipeableDrawer,
  Stack,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { IconButtonAnimate } from '../../../components/animate';
import MobileHeader from 'src/components/MobileHeader';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getNotifications, readNotifications } from 'src/redux/slices/notifications';
// hooks
import useAuth from '../../../hooks/useAuth';
import { useEffect } from 'react';
import Logo from 'src/components/Logo';
import useLocales from 'src/hooks/useLocales';
import { color } from '@mui/system';


// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const { translate } = useLocales();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { notifications } = useSelector(state => state.notifications);
  const totalUnread = notifications.filter((item) => item.unread === true).length;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    dispatch(readNotifications());
  };

  useEffect(() => {
    dispatch(getNotifications(user?.email));
  }, [dispatch, user?.email]);

  const renderEmptyState = () => (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100%',
        py: 8,
        px: 2
      }}
    >
      <Iconify
        icon="mdi:snowflake"
        sx={{
          width: 80,
          height: 80,
          color: 'primary.main',
          opacity: 0.3
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {translate('notifications.empty.title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {translate('notifications.empty.description')}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <>
      <Badge badgeContent={totalUnread} color="error">
      <Iconify onClick={handleOpen} icon="hugeicons:notification-02" width={26} height={26} />
      </Badge>

      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            height: '100%',
            maxHeight: '100%',
            paddingTop: 'env(safe-area-inset-bottom)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            width: '100vw',
            maxWidth: '100%',
          },
        }}
      >
        <MobileHeader
          onBack={handleClose}
          title={translate("notifications.title")}
          action={
            totalUnread > 0 && (
              <Tooltip title={translate("notifications.mark_all_read")}>
                <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                  <Iconify icon="eva:done-all-fill" width={20} height={20} />
                </IconButtonAnimate>
              </Tooltip>
            )
          }
        />

        <Box
          sx={{
            width: '100vw',
            maxWidth: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          {notifications.length > 0 ? (
            <Scrollbar sx={{ height: { xs: '100%', sm: 'auto' } }}>
              {totalUnread > 0 && (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                      {translate("notifications.new_title")}
                    </ListSubheader>
                  }
                >
                  {notifications.filter(n => n.unread).map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </List>
              )}

              {totalUnread < notifications.length && (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                      {translate("notifications.old_title")}
                    </ListSubheader>
                  }
                >
                  {notifications.filter(n => !n.unread).map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
                </List>
              )}
            </Scrollbar>
          ) : (
            renderEmptyState()
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnread: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { translate } = useLocales()
  const { avatar, title, notifier } = renderContent(notification, translate);
  const { cellphone, countryCode } = notifier;

  const handleContactWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?phone=+${countryCode}${cellphone}`, '_blank');
  }

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnread && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={handleContactWhatsApp}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            {notification.createdAt && <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />}
            {notification.createdAt && fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification, translate) {
  const title = (
    <Typography variant="subtitle2">
      {`${notification.notifier.name} ${notification.notifier.lastname}`}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {translate("notifications.description.hired")}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={`${notification.notifier.name} ${notification.notifier.lastname}`}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'snowMatch') {
    return {
      avatar: (
        <Logo sx={{ height: '30px' }} />
      ),
      title,
    };
  }
  return {
    avatar: notification?.avatar ? <img alt={notification.title} src={notification?.notifier?.imageLink} /> : null,
    title,
    notifier: notification?.notifier
  };
}
