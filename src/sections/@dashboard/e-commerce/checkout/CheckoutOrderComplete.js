import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  Fade,
  Alert,
  Snackbar
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { resetCart } from '../../../../redux/slices/teachers';
import { getConversationId } from '../../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
import { DialogAnimate } from '../../../../components/animate';
// assets
import { OrderCompleteIllustration } from '../../../../assets';
import useLocales from 'src/hooks/useLocales';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const DialogStyle = styled(DialogAnimate)(({ theme }) => ({
  '& .MuiDialog-paper': {
    margin: 0,
    [theme.breakpoints.up('md')]: {
      maxWidth: 'calc(100% - 48px)',
      maxHeight: 'calc(100% - 48px)',
    },
  },
}));

// ----------------------------------------------------------------------

export default function CheckoutOrderComplete({ ...other }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { translate } = useLocales();
  const { user } = useAuth();

  const { paymentId, booking } = useSelector(state => state.bookings);
  const { filters } = useSelector(state => state.teachers);

  // Determinar si es Catedral o otro resort
  const isCatedral = booking?.resort === 'Cerro Catedral' || filters?.resort === 'Cerro Catedral';

  const handleResetStep = () => {
    dispatch(resetCart());
    navigate(PATH_GUEST.protips);
  };

  const handleMessage = async () => {
    try {
      if (!booking?.teacher?.id || !user?.id) {
        console.error('Missing teacher or user ID');
        return;
      }

      // Get conversation key from API
      const conversationId = await dispatch(getConversationId(user.id, booking.teacher.id));
      
      if (conversationId) {
        // Navigate to chat
        navigate(`/match/chat/${conversationId}`);
      } else {
        console.error('Failed to get conversation ID');
        // Fallback to home page
        navigate('/');
      }
    } catch (error) {
      console.error('Error getting conversation ID:', error);
      // Fallback to home page
      navigate('/');
    }
  };

  return (
    <DialogStyle fullScreen {...other}>
      <Box sx={{ p: 4, maxWidth: 480, margin: 'auto' }}>

        {/* Header simple */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <OrderCompleteIllustration sx={{ height: 200, my: 4 }} />

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              {translate('completeOrder.bookingSuccess')}
            </Typography>

            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
              {isCatedral
                ? translate('completeOrder.contactSchool')
                : translate('completeOrder.contactTeacherAndPay')
              }
            </Typography>

            {/* Badge de estado para reservas no-Catedral */}
            {!isCatedral && (
              <Chip
                label="Esperando confirmación"
                color="warning"
                icon={<Iconify icon="eva:clock-fill" />}
                sx={{ mb: 2 }}
              />
            )}
          </Box>
        </Fade>

        {/* Información importante - La parte que te gustó */}
        <Fade in timeout={1500}>
          <Card sx={{ p: 3, backgroundColor: 'grey.50', mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              💡 {translate('completeOrder.importantInformation')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              {isCatedral
                ? translate('completeOrder.importantInformationSchool')
                : translate('completeOrder.importantInformationTeacher')
              }
            </Typography>
          </Card>
        </Fade>

        {/* Botones de acción */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          spacing={2}
        >
          
          <Button
            color="inherit"
            onClick={() => navigate('/match/lessons')}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
            variant="outlined"
            size="large"
          >
            {translate('completeOrder.bookings')}
          </Button>

          <Button
            variant="contained"
            onClick={handleMessage}
            size="large"
            startIcon={<Iconify icon={'eva:message-circle-fill'} />}
          >
            {translate('completeOrder.message')}
          </Button>
        </Stack>
      </Box>
    </DialogStyle>
  );
}
