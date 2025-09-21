import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Avatar, Typography, AvatarGroup, IconButton } from '@mui/material';
// router
import { useNavigate } from 'react-router-dom';
// redux
import { useSelector } from '../../../redux/store';
// utils
import { fToNow } from '../../../utils/formatTime';
// hooks
import useAuth from '../../../hooks/useAuth';
// components
import Iconify from '../../../components/Iconify';
import BadgeStatus from '../../../components/BadgeStatus';
// routes
import { PATH_GUEST, PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
}));

// ----------------------------------------------------------------------

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array.isRequired,
};

export default function ChatHeaderDetail({ participants }) {
  const isGroup = participants.length > 1;
  const navigate = useNavigate();
  const { isStudent } = useAuth();

  const handleBack = () => {
    if (isStudent) {
      navigate(PATH_GUEST.chat);
    } else {
      navigate(PATH_DASHBOARD.chat.root);
    }
  };

  return (
    <RootStyle>
      <IconButton onClick={handleBack} sx={{ mr: 1 }}>
        <Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />
      </IconButton>
      
      {isGroup ? <GroupAvatar participants={participants} /> : <OneAvatar participants={participants} />}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton>
        <Iconify icon="eva:phone-fill" width={20} height={20} />
      </IconButton>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

OneAvatar.propTypes = {
  participants: PropTypes.array.isRequired,
};

function OneAvatar({ participants }) {
  const participant = [...participants][0];
  const { onlineUsers } = useSelector((state) => state.chat);
  
  // Check if user is online from WebSocket data
  const isOnline = onlineUsers[participant?.id]?.isOnline || false;
  const status = isOnline ? 'online' : (participant?.status || 'offline');

  if (participant === undefined) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={participant.avatar} alt={participant.name} />
        <BadgeStatus status={status} sx={{ position: 'absolute', right: 2, bottom: 2 }} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{participant.name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {isOnline 
            ? 'Online' 
            : participant.status !== 'offline' 
              ? capitalCase(participant.status) 
              : fToNow(participant.lastActivity || '')
          }
        </Typography>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

GroupAvatar.propTypes = {
  participants: PropTypes.array.isRequired,
};

function GroupAvatar({ participants }) {
  return (
    <div>
      <AvatarGroup
        max={3}
        sx={{
          mb: 0.5,
          '& .MuiAvatar-root': { width: 32, height: 32 },
        }}
      >
        {participants.map((participant) => (
          <Avatar key={participant.id} alt={participant.name} src={participant.avatar} />
        ))}
      </AvatarGroup>
      <Link variant="body2" underline="none" component="button" color="text.secondary" onClick={() => {}}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {participants.length} persons
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </Box>
      </Link>
    </div>
  );
}
