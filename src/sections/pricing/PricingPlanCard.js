import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Button, Typography, Box, Stack } from '@mui/material';
// components
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(3),
  [theme.breakpoints.up(414)]: {
    padding: theme.spacing(5),
  },
}));

// ----------------------------------------------------------------------

PricingPlanCard.propTypes = {
  index: PropTypes.number,
  card: PropTypes.object,
};

export default function PricingPlanCard({ card, index }) {
  const { subscription, icon, price, caption, lists, labelAction } = card;

  return (
    <RootStyle>

      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        {subscription}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mb: 1 }}>
        <Typography variant="h2" sx={{ mx: 1 }}>
          {price === 0 ? 'Free' : price}
        </Typography>
        {index != 2 ? (
          <Typography
            gutterBottom
            component="span"
            variant="subtitle2"
            sx={{
              alignSelf: 'flex-end',
              color: 'text.secondary',
            }}
          >
            USD/mes
          </Typography>
        ) : (
          ''
        )}
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          mb: 1
        }}
      >
        {index === 0 &&
          
          'Acuerdo con instructores'
        }
        {index === 1 &&
          'Hasta 10 instructores' 
        }
        {index === 2 && 
          'Instructores ilimitados' 
        }

      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'primary.main',
          textTransform: 'capitalize',
        }}
      >
        {index === 0 ?
          'Instructores ilimitados' :
          ''
        }
        {index === 1 ?
          '+20 USD por instructor extra' :
          ''
        }
        {index === 2 ?
          'Gestiona tu escuela con snowmatch' :
          ''
        }
      </Typography>

      <Box sx={{ width: 80, height: 80, mt: 3 }}>{icon}</Box>

      <Stack component="ul" spacing={2} sx={{ my: 5, width: 1 }}>
        {lists.map((item) => (
          <Stack
            key={item.text}
            component="li"
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ typography: 'body2', color: item.isAvailable ? 'text.primary' : 'text.disabled' }}
          >
            <Iconify icon={item.isAvailable ? 'eva:checkmark-fill' : 'radix-icons:cross-2'} sx={{ width: 20, height: 20 }} />
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>

      <Button onClick={() => {
        const plan = subscription;
        const message = `Me gustaría usar el plan ${plan} en mi centro de esqui`;
        const whatsappUrl = `https://wa.me/5492944367197?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }} fullWidth size="large" variant="contained" >
        {labelAction}
      </Button>
    </RootStyle>
  );
}
