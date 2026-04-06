import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, IconButton, ClickAwayListener } from '@mui/material';
//
import Iconify from './Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Box)({
  position: 'relative',
});

const PickerStyle = styled('div')(({ theme }) => ({
  bottom: 40,
  overflow: 'hidden',
  position: 'absolute',
  left: theme.spacing(-2),
  boxShadow: theme.customShadows.z20,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  zIndex: theme.zIndex.modal,
}));

// ----------------------------------------------------------------------

EmojiPicker.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  setValue: PropTypes.func,
  alignRight: PropTypes.bool,
};

export default function EmojiPicker({ disabled, value, setValue, alignRight = false, ...other }) {
  const theme = useTheme();
  const [emojiPickerState, SetEmojiPicker] = useState(false);

  const emojiPicker = emojiPickerState ? (
    <Picker
      data={data}
      theme={theme.palette.mode}
      onEmojiSelect={(emoji) => setValue(value + (emoji?.native ?? ''))}
    />
  ) : null;

  const triggerPicker = (event) => {
    event.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  const handleClickAway = () => {
    SetEmojiPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <RootStyle {...other}>
        <PickerStyle
          sx={{
            ...(alignRight && {
              right: -2,
              left: 'auto !important',
            }),
          }}
        >
          {emojiPicker}
        </PickerStyle>
        <IconButton disabled={disabled} size="small" onClick={triggerPicker}>
          <Iconify icon={'eva:smiling-face-fill'} width={20} height={20} />
        </IconButton>
      </RootStyle>
    </ClickAwayListener>
  );
}
