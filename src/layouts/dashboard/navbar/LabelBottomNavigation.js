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
import PropTypes from 'prop-types';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MapIcon from '@mui/icons-material/Map';
import useLocales from 'src/hooks/useLocales';

LabelBottomNavigation.propTypes = {
  onOpenSidebar: PropTypes.func,
  isGuest: PropTypes.bool,
};

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState(null);
  const ref = React.useRef(null);
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { translate } = useLocales();

  // Mapping between paths and BottomNavigation values
  const getPathValue = (path) => {
    if (path?.includes("map")) {
      return 5
    }
    if (path?.includes("upload")) {
      return 0
    }
    switch (path) {
      case PATH_GUEST.videoCoach:
        return 0;
      case PATH_GUEST.training:
        return 1;
      case '/upload': // Add this manually for the Upload button as it's a special case
        return 2;
      case PATH_GUEST.independent:
        return 3;
      case PATH_GUEST.root:
        return 3;
      case PATH_GUEST.school:
        return 3;
      case PATH_DASHBOARD.eCommerce.matchIndependant:
        return 3;
      case PATH_GUEST.root + '/lessons':
        return 4
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

  if (value === null) {
    return <></>
  }
  return (
    <Box sx={{ pb: `calc(env(safe-area-inset-bottom) + ${isMobile ? '56px' : '16px'})`, height: '100px' }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            width: '100%',
            minHeight: 56,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 12px',
            },
          }}
        >
          <BottomNavigationAction
            label={translate('bottomNavigation.status')}
            icon={<BarChartIcon />}
            component={RouterLink}
            to={PATH_GUEST.videoCoach}
          />
          <BottomNavigationAction
            label={translate('bottomNavigation.academy')}
            icon={<WorkspacePremiumIcon />}
            component={RouterLink}
            to={PATH_GUEST.training}
          />
          {console.log(value)}
          <BottomNavigationAction
            label={translate('bottomNavigation.match')}
            icon={<Logo disabled={value != 3} disabledLink={true} sx={{ height: '25px', width: '25px' }} />}
            component={RouterLink}
            to={'/match/independent?resort=Cerro%20Catedral'}
          />
          <BottomNavigationAction 
            label={translate('bottomNavigation.lessons')} 
            component={RouterLink} 
            to={PATH_GUEST.root + '/lessons'} 
            icon={<DownhillSkiingIcon />} 
          />
          <BottomNavigationAction 
            label={translate('bottomNavigation.maps')} 
            component={RouterLink} 
            to={'/maps/chapelco'} 
            icon={<MapIcon />} 
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}