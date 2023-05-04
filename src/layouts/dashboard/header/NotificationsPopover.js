import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// _mock_
import { _notifications } from '../../../_mock';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getNotifications, readNotifications } from 'src/redux/slices/notifications';
// hooks
import useAuth from '../../../hooks/useAuth';
import { useEffect } from 'react';
import Logo from 'src/components/Logo';
import useLocales from 'src/hooks/useLocales';


// ----------------------------------------------------------------------

export default function NotificationsPopover() {

  const [open, setOpen] = useState(null);
  const { translate } = useLocales()
  const { user } = useAuth();
  const dispatch = useDispatch();
  const wtf = useSelector((state) => state);
  const { notifications } = useSelector(state => state.notifications)
  const totalUnread = notifications.filter((item) => item.unread === true).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    // if(totalUnread > 0){
    //   handleMarkAllAsRead()
    // }
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    dispatch(readNotifications())
  };


  useEffect(() => {
    dispatch(getNotifications(user?.email));
  }, [dispatch, user?.email]);

  const N = wtf.notifications.notifications;

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnread} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{translate("notifications.title")}</Typography>
            {totalUnread > 0 && <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('notifications.new_notifications', { totalUnread })}
            </Typography>}
            {totalUnread === 0 && <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate("notifications.no_new_title")}
            </Typography>}
          </Box>

          {totalUnread > 0 && (
            <Tooltip title={translate("notifications.mark_all_read")}>
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          {totalUnread > 0 && <List
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
          </List>}
          {totalUnread < notifications.length &&
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
          </List>}
        </Scrollbar>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </MenuPopover>
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
  const { avatar, title } = renderContent(notification, translate);

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
            {notification.createdAt &&<Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />}
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
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}
