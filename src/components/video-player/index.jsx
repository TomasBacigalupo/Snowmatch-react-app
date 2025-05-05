import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, CircularProgress, alpha } from '@mui/material';

const VideoPlayer = ({ url }) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: '56.25%', // 16:9 aspect ratio
        backgroundColor: '#000',
        overflow: 'hidden',
        '&:hover .react-player__play-icon': {
          opacity: 1,
        },
      }}
    >
      {!isReady && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha('#000', 0.1),
          }}
        >
          <CircularProgress 
            size={40} 
            sx={{ 
              color: 'primary.main',
              opacity: 0.7 
            }} 
          />
        </Box>
      )}
      <ReactPlayer
        url={`https://s3.amazonaws.com/snowmatchimages/videos/${url}`}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        controls
        playing={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReady={() => setIsReady(true)}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
        light={!isReady}
        playIcon={
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: alpha('#000', 0.5),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: alpha('#000', 0.7),
              },
            }}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderLeft: '20px solid white',
                marginLeft: '4px',
              }}
            />
          </Box>
        }
      />
    </Box>
  );
};

export default VideoPlayer; 