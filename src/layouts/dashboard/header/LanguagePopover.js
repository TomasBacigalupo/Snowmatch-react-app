import { useState } from 'react';
// @mui
import { Avatar, MenuItem, Stack } from '@mui/material';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Image from '../../../components/Image';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const { allLang, currentLang, onChangeLang } = useLocales();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const getIcon = (ln) => {
    switch(ln){
      case 'es':
        return 'flag:ar-4x3'
      case 'en':
        return 'flag:us-4x3'
      case 'pt':
        return 'flag:br-4x3'
    }
    return ''
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          marginRight:'10px',
          ...(open && { bgcolor: 'action.selected' }),
          backgroundColor: ''
        }}
      >
        <Avatar><Iconify icon={getIcon(currentLang.value)} /></Avatar>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {allLang.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => {
                onChangeLang(option.value);
                handleClose();
              }}
            >
              <Iconify icon={getIcon(option.value)} sx={{mr:1}}/>
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
