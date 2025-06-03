import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import NavbarVertical from './dashboard/navbar/NavbarVertical';
import LabelBottomNavigation from './dashboard/navbar/LabelBottomNavigation';
import { useState } from 'react';
import useResponsive from 'src/hooks/useResponsive';
import NavbarHorizontal from './dashboard/navbar/NavbarHorizontal';
import MainFooter from './main/MainFooter';
import MainHeader from './main/MainHeader';
import NavbarHorizontalWithSearch from './dashboard/navbar/NavbarHorizontalWithSearch';
import MainHeaderWithSearch from './main/MainHeaderWithSearch';

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
  paddingTop: {xs: 'env(safe-area-inset-top)', md:'0px'}, // Leave space for the fixed header
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(12) // Adjust for larger screens if needed
  },
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(20) // Adjust for larger screens if needed
  }
}));

// ----------------------------------------------------------------------

export default function PlainLayout() {
  const isDesktop = useResponsive('up', 'lg');
  const [open, setOpen] = useState(false);
  
  return (
    <ContentStyle>
      {isDesktop && <MainHeaderWithSearch/>}
      {!isDesktop && <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} isGuest={true} />}
      {isDesktop && <NavbarHorizontalWithSearch isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} isGuest={true} />}
      <Outlet />
      {!isDesktop && <LabelBottomNavigation/>}
      {isDesktop && <MainFooter/>}
    </ContentStyle>

  );
}