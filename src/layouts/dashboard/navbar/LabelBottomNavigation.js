import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import BarChartIcon from '@mui/icons-material/BarChart';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import Logo from 'src/components/Logo';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, useTheme, useMediaQuery } from '@mui/material';
import { PATH_DASHBOARD, PATH_GUEST } from 'src/routes/paths';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import VideoUploadBottomSheet from 'src/sections/@dashboard/video/VideoUploadBottomSheet';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mapping between paths and BottomNavigation values
  const getPathValue = (path) => {
    switch (path) {
      case PATH_GUEST.videoCoach:
        return 0;
      case PATH_GUEST.protips:
        return 1;
      case '/upload': // Add this manually for the Upload button as it's a special case
        return 2;
      case PATH_GUEST.root:
        return 3;
      default:
        return false;
    }
  };

  // Set the value based on the current route
  React.useEffect(() => {
    const currentValue = getPathValue(location.pathname);
    if (currentValue !== false) {
      setValue(currentValue);
    }
  }, [location.pathname]);

  return (
    <Box sx={{ pb: `calc(env(safe-area-inset-bottom) + ${isMobile ? '56px' : '16px'})`, height:'100px'}} ref={ref}>
      <CssBaseline />
      <Paper sx={{ position: 'fixed', bottom: 0, paddingBottom: '30px' + "calc(env(safe-area-inset-bottom)", left: 0, right: 0, height: '100px' }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            paddingBottom: 'env(safe-area-inset-bottom)',
            height: `0px + env(safe-area-inset-bottom)`,
          }}
        >
          <BottomNavigationAction
            label="Status"
            icon={<BarChartIcon />}
            component={RouterLink}
            to={PATH_GUEST.videoCoach}
          />
          <BottomNavigationAction
            label="Tips"
            icon={<CastForEducationIcon />}
            component={RouterLink}
            to={PATH_GUEST.protips}
          />
          <BottomNavigationAction
            onClick={() => setOpen(true)}
            label="Upload"
            icon={
              <Box marginTop={-1} paddingBottom={0.3}>
                <IconButton
                  onClick={() => setOpen(true)}
                  sx={{
                    bgcolor: '#3399ff',
                    width: 56,
                    height: 56,
                    mt: -3,
                    p: 1,
                    border: '2px solid white',
                    '&:hover': {
                      bgcolor: '#3399ff',
                    },
                  }}
                >
                  <VideoCallIcon sx={{ color: 'white', fontSize: '2rem' }} />
                </IconButton>
              </Box>
            }
          />
          <BottomNavigationAction
            label="Match"
            icon={<Logo sx={{ height: '25px', width: '25px' }} />}
            component={RouterLink}
            to={PATH_GUEST.root}
          />
          <BottomNavigationAction label="Lessons" component={RouterLink} to={PATH_GUEST.root + '/lessons'} icon={<DownhillSkiingIcon/>} />
        </BottomNavigation>
      </Paper>
      <VideoUploadBottomSheet
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
    </Box>
  );
}