import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import useLocales from 'src/hooks/useLocales';
import VideoUploadBottomSheet from './VideoUploadBottomSheet';
import { useState } from 'react';
import Iconify from 'src/components/Iconify';
import ExcerciseBottomSheet from './ExcerciseBottomSheet';

const VideoDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { translate } = useLocales();
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);

  const handleUploadClick = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    // Open the upload sheet for logged-in users
    setIsUploadSheetOpen(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#f8f9fa',
        overflow: 'hidden',
      }}
    >
      {/* Video Container */}
      <Box
        sx={{
          position: 'relative',
          height: '240px',
          backgroundColor: '#000',
        }}
      >
        <video
          src={"/assets/videos/tomianalisis.mov"}
          autoPlay
          playsInline
          loop
          muted
          style={{
            objectFit: "cover",
            borderRadius: "16px 16px 0 0",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
        {/* Overlay Text */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            // background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            p: 2,
            zIndex: 1
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            {translate('videoDemo.title')}
          </Typography>
        </Box>
      </Box>

      {/* Action Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Button
          variant="contained"
          onClick={handleUploadClick}
          startIcon={
            <Iconify 
              icon="material-symbols:auto-awesome" 
              sx={{ 
                width: 22,
                height: 22,
              }} 
            />
          }
          sx={{
            textTransform: 'none',
            flex: 1,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            py: 1.5,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)',
            },
            '& .MuiButton-startIcon': {
              marginRight: 1.5
            }
          }}
        >
          {translate('videoDemo.uploadButton')}
        </Button>
      </Box>

      {/* Add VideoUploadBottomSheet */}
      <ExcerciseBottomSheet
        open={isUploadSheetOpen}
        onClose={() => setIsUploadSheetOpen(false)}
        onOpen={() => setIsUploadSheetOpen(true)}
        demoUrl="/assets/videos/tomianalisis.mov"
        course="GENERAL"
        level="GENERAL"
      />
    </Box>
  );
};

export default VideoDemo;