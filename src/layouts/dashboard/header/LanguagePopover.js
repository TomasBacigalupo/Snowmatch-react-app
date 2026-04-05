import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const navigate = useNavigate();

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
        return 'emojione:flag-for-argentina'
      case 'en':
        return 'emojione:flag-for-united-states'
      case 'pt':
        return 'emojione:flag-for-brazil'
      case 'fr':
        return 'emojione:flag-for-france'
    }
    return ''
  }

  const handleLanguageChange = (languageValue) => {
    const path = location.pathname;
    const prefix = `/${currentLang.value}`;

    if (path === '/' || path === prefix) {
      navigate(`/${languageValue}`);
    } else if (path === `${prefix}/ai` || path.startsWith(`${prefix}/ai/`)) {
      navigate(`/${languageValue}${path.slice(prefix.length)}`);
    } else {
      onChangeLang(languageValue);
    }
    handleClose();
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && { bgcolor: 'action.selected' }),
          backgroundColor: ''
        }}
      >
        <Iconify icon={"hugeicons:internet"} />
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
              onClick={() => handleLanguageChange(option.value)}
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
