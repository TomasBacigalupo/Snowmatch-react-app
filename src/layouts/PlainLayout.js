import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import NavbarVertical from './dashboard/navbar/NavbarVertical';
import LabelBottomNavigation from './dashboard/navbar/LabelBottomNavigation';
import { useState } from 'react';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'fixed', // Ensure it stays visible when scrolling
  padding: theme.spacing(1),
  zIndex: 1, // Ensure it appears on top of other elements
  display: 'flex',
  alignItems: 'center',
  paddingTop: 'env(safe-area-inset-top)',
  backgroundColor: theme.palette.background.default, // Set background to avoid transparency issues
}));

const ContentStyle = styled('div')(({ theme }) => ({
  paddingTop: 'env(safe-area-inset-top)', // Leave space for the fixed header
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(12) // Adjust for larger screens if needed
  }
}));

// ----------------------------------------------------------------------

export default function PlainLayout() {
  const [open, setOpen] = useState(false);
  
  return (
    <ContentStyle>
      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} isGuest={true} />
      <Outlet />
      <LabelBottomNavigation/>
    </ContentStyle>

  );
}