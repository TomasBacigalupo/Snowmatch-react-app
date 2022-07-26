import PropTypes from 'prop-types';
// @mui
import { Box, Button, Grid, Card, Link, Avatar, IconButton, Typography, InputAdornment, Modal, DialogActions, DialogTitle, DialogContent } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import InputStyle from '../../../../components/InputStyle';
import SocialsButton from '../../../../components/SocialsButton';
import SearchNotFound from '../../../../components/SearchNotFound';
import Label from 'src/components/Label';
import { useState } from 'react';
import LightboxModal from 'src/components/LightboxModal';
import { DialogAnimate } from 'src/components/animate';
import ThemeColorPresets from 'src/components/ThemeColorPresets';
import { Theme } from '@fullcalendar/react';
import SocialButtonsDiscounts from 'src/components/SocialButtonsDiscounts';

// ----------------------------------------------------------------------

ProfileFriends.propTypes = {
  friends: PropTypes.array,
  findFriends: PropTypes.string,
  onFindFriends: PropTypes.func,
};

export default function ProfileFriends({ friends, findFriends, onFindFriends }) {
  const friendFiltered = applyFilter(friends, findFriends);
  const [open, setOpen] = useState(false)
  const [discount, setDiscount] = useState(null)
  const isNotFound = friendFiltered.length === 0;

  return (
    <Box sx={{ mt: 5 }}>
      <InputStyle
        stretchStart={240}
        value={findFriends}
        onChange={(event) => onFindFriends(event.target.value)}
        placeholder="Find clients..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 5 }}
      />

      <Grid container spacing={3}>
        {friendFiltered.map((friend) => (
          <Grid key={friend.id} item xs={12} md={4}>
            <FriendCard
              friend={friend}
              onClick={() => {
                setDiscount(friend)
                setOpen(true)
              }} />
          </Grid>
        ))}
      </Grid>

      {isNotFound && (
        <Box sx={{ mt: 5 }}>
          <SearchNotFound searchQuery={findFriends} />
        </Box>
      )}

      <DialogAnimate open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Discount Details</DialogTitle>
        <DialogContent>
          <br></br>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              Salpa brinda un 40% de descuento en tu compra mediante su plataforma web con cualquier medio de pago.
              El codigo de descuento se puede usar por una sola vez, no lo compartas!
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpen(false)}>Get Cupon</Button>
        </DialogActions>
      </DialogAnimate>

    </Box>
  );
}

// ----------------------------------------------------------------------

FriendCard.propTypes = {
  friend: PropTypes.object,
};

function FriendCard({ friend, onClick }) {
  const { name, role, avatarUrl } = friend;
  return (
    <Card
      onClick={onClick}
      sx={{
        py: 5,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Label
        variant="filled"
        color='error'
        sx={{
          top: 16,
          right: 16,
          zIndex: 9,
          position: 'absolute',
          textTransform: 'uppercase',
        }}
      >
        40% OFF
      </Label>
      <Avatar alt={name} src={'/assets/salpa.png'} sx={{ width: 90, height: 90, mb: 3, color: 'white' }} />
      <Link variant="subtitle1" color="text.primary">
        {name}
      </Link>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        {role}
      </Typography>

      <SocialButtonsDiscounts initialColor />

      <IconButton sx={{ top: 8, right: 8, position: 'absolute' }}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>
    </Card>
  );
}
// ----------------------------------------------------------------------

function applyFilter(array, query) {
  if (query) {
    return array.filter((friend) => friend.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  return array;
}
