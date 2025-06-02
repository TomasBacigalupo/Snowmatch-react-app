import { SwipeableDrawer, Box, IconButton, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';
import {
  TeacherDetailsCarousel,
  TeacherDetailsSummary,
  TeacherDetailsMobileCalendar,
  TeacherDetailsMobileReview,
  MobileSelectDays,
  Policies,
  TimeDetails
} from '../../@dashboard/e-commerce/teacher-details';
import useLocales from 'src/hooks/useLocales';

export default function InstructorDetailsDrawer({ open, onClose, instructor }) {
  const [isOpen, setIsOpen] = useState(false);
  const { translate } = useLocales();

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

        <TeacherDetailsCarousel teacher={{ images: [instructor?.imageLink], name: instructor?.name }} />
        
        <Box sx={{ mt: 2 }}>
          <TeacherDetailsSummary
            teacher={instructor}
            cart={[]}
            onAddCart={() => {}}
            onGotoStep={() => {}}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography component="h2" variant="body1" children={instructor.information} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography component="h3" variant="body1" children={instructor.description} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Divider />
        </Box>

        <Box mt={3}>
          <Box px={2} pt={2}>
            <Typography component="p" variant="h4" gutterBottom>
              {translate('teacherDetails.ocupation.title')}
            </Typography>
            <Typography component="p" variant="body1" paragraph>
              {translate('teacherDetails.ocupation.description')}
            </Typography>
          </Box>
          <Box onClick={() => setIsOpen(true)}>
            <TeacherDetailsMobileCalendar teacher={instructor} />
          </Box>
        </Box>

        <Box mx={2}>
          <Divider />
        </Box>

        <TeacherDetailsMobileReview teacher={instructor} />

        <Box mx={2}>
          <Divider />
        </Box>

        <Policies />

        <Box mx={2}>
          <Divider />
        </Box>

        <TimeDetails />

        <MobileSelectDays teacher={instructor} isOpen={isOpen} closeFather={() => setIsOpen(false)} />
      </Box>
    </SwipeableDrawer>
  );
} 