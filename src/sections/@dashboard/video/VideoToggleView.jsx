import PropTypes from 'prop-types';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import useLocales from 'src/hooks/useLocales';

const VideoToggleView = ({ videos, tab, onTabChange }) => {
  const { translate } = useLocales();

  if (!videos?.length) {
    return null;
  }

  return (
    <>
      <ToggleButtonGroup
        color="primary"
        value={tab}
        exclusive
        onChange={onTabChange}
        aria-label="Platform"
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          backgroundColor: 'white',
          justifyContent: 'space-between',
          border: 'none',
          '& .MuiToggleButtonGroup-grouped': {
            border: 'none !important',
            mx: 0,
            position: 'relative',
            padding: '4px 0',
            color: "#212B36",
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: (theme) => theme.palette.primary.main,
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease',
            },
            '&.Mui-selected': {
              pointerEvents: 'none',
              cursor: 'default',
              color: "#212B36",
            },
            '&:hover': {
              color: "#212B36",
            }
          },
        }}
      >
        <ToggleButton
          value="profile"
          disableRipple
          sx={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '1rem',
            backgroundColor: 'transparent !important',
            transition: 'color 0.2s ease',
            pb: 0,
            color: "#212B36" + ' !important',
            '&:hover': {
              backgroundColor: 'transparent',
              color: "#212B36",
            },
            '&::before': {
              transformOrigin: 'right !important',
            },
            '&.Mui-selected::before': {
              transform: 'scaleX(1) !important',
              transformOrigin: 'right !important',
            },
            '&:not(.Mui-selected)::before': {
              transform: 'scaleX(0) !important',
              transformOrigin: 'right !important',
            }
          }}
        >
          {translate('videoCoachScreen.profile')}
        </ToggleButton>
        <ToggleButton
          value="uploaded"
          disableRipple
          sx={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '1rem',
            backgroundColor: 'transparent !important',
            transition: 'color 0.2s ease',
            color: "#212B36" + ' !important',
            '&:hover': {
              backgroundColor: 'transparent',
              color: "#212B36",
            },
            '&::before': {
              transformOrigin: 'left !important',
            },
            '&.Mui-selected::before': {
              transform: 'scaleX(1) !important',
              transformOrigin: 'left !important',
            },
            '&:not(.Mui-selected)::before': {
              transform: 'scaleX(0) !important',
              transformOrigin: 'left !important',
            }
          }}
        >
          {translate('videoCoachScreen.uploaded_videos')}
        </ToggleButton>
      </ToggleButtonGroup>
      
      {tab !== 'profile' && (
        <Box
          sx={{
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        />
      )}
    </>
  );
};

VideoToggleView.propTypes = {
  videos: PropTypes.array,
  tab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default VideoToggleView; 