import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

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
  backgroundColor: theme.palette.background.default, // Set background to avoid transparency issues
}));

const ContentStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(10), // Leave space for the fixed header
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(12) // Adjust for larger screens if needed
  }
}));

// ----------------------------------------------------------------------

export default function PlainLayout() {
  return (
    <>
      <HeaderStyle>
        <IconButton 
          onClick={() => window.history.back()} 
          sx={{
            borderRadius: '50%', // Make it circular
            width: 40, // Adjust size
            height: 40, // Adjust size
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)' // Slightly darker on hover
            }
          }}
        >
          <ArrowBackRoundedIcon fontSize="medium" />
        </IconButton>
      </HeaderStyle>
      <ContentStyle>
        <Outlet />
      </ContentStyle>
    </>
  );
}