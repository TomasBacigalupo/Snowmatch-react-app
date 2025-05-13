import { SwipeableDrawer, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TeacherDetailsReview from '../../@dashboard/e-commerce/teacher-details/TeacherDetailsReview';

export default function InstructorDetailsDrawer({ open, onClose, instructor }) {
  if (!instructor) return null;

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxHeight: '100vh',
          paddingTop: 'env(safe-area-inset-top)'
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Instructor Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TeacherDetailsReview teacher={instructor} />
      </Box>
    </SwipeableDrawer>
  );
} 