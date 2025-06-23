import { Drawer, Box, IconButton, Typography, Stack, Divider } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacher } from 'src/redux/slices/admin';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

export default function ClientDetailsDrawer({ open, onClose, client }) {
  const dispatch = useDispatch();
  const { teacher } = useSelector((state) => state.admin);
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied to clipboard!', { variant: 'success' });
  };

  useEffect(() => {
    if (client?.id) {
      dispatch(getTeacher(client.id));
    }
  }, [dispatch, client?.id]);
  if (!teacher) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      PaperProps={{
        sx: { 
          width: { 
            xs: '100%', 
            sm: 600,
            md: 800 
          },
          '& .MuiDrawer-paper': {
            width: { 
              xs: '100%', 
              sm: 600,
              md: 800 
            },
            boxSizing: 'border-box',
          },
        },
      }}
      BackdropProps={{
        onClick: onClose,
        sx: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5">Client Details</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Name</Typography>
            <Typography variant="body1">{teacher.name}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Email</Typography>
            <Typography variant="body1">{teacher.email}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
            <Typography variant="body1">{teacher.cellphone}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Credits</Typography>
            <Typography variant="body1">{teacher.proCheckCredits}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">State</Typography>
            <Typography variant="body1">{teacher.state}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Role</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Notification Token</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1">{teacher.notificationToken}</Typography>
              <IconButton 
                size="small" 
                onClick={() => handleCopyToClipboard(teacher.notificationToken)}
                sx={{ ml: 1 }}
              >
                <Iconify icon="eva:copy-fill" width={20} height={20} />
              </IconButton>
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Country Code</Typography>
            <Typography variant="body1">{teacher.countryCode}</Typography>
          </Box>
          {/* Add more client details as needed */}
        </Stack>
      </Box>
    </Drawer>
  );
} 