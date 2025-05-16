import React, { useState, useMemo } from 'react';
import { Typography, SwipeableDrawer, Box, Avatar, Modal, useTheme, useMediaQuery } from '@mui/material';
import { FormProvider, RHFTextField, RHFSlider } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import ReactPlayer from 'react-player';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import useLocales from 'src/hooks/useLocales';
import MobileHeader from './MobileHeader';

const getColorForScore = (score) => {
  if (!score) return '#000000';
  
  const normalizedScore = Math.min(Math.max(parseInt(score, 10), 0), 100);
  
  if (normalizedScore <= 50) {
    const green = Math.floor((normalizedScore / 50) * 255);
    return `#FF${green.toString(16).padStart(2, '0')}00`;
  } else {
    const red = Math.floor(((100 - normalizedScore) / 50) * 255);
    return `#${red.toString(16).padStart(2, '0')}FF00`;
  }
};

export default function VideoReviewDrawer({ 
  open, 
  onClose, 
  selectedVideo, 
  loading, 
  methods,
  onSubmit 
}) {
  const { translate } = useLocales();
  const [isPlaying, setIsPlaying] = useState(false);
  const score = methods?.watch("score");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const content = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {selectedVideo && (
          <>
            <Typography variant="h6" gutterBottom>
              {selectedVideo.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar alt={selectedVideo.user.name} src={selectedVideo.imageUrl} sx={{ mr: 2 }} />
              <Typography variant="body1">
                Uploaded by {selectedVideo.user.name}
              </Typography>
            </Box>
            
            {/* Video Player Section */}
            <Box mb={2}>
              {!isPlaying ? (
                <Box
                  position="relative"
                  width="100%"
                  maxHeight="300px"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setIsPlaying(true)}
                >
                  <Box
                    component="img"
                    src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${selectedVideo.videoUrl}.jpg`}
                    alt="Video Thumbnail"
                    sx={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                </Box>
              ) : (
                <ReactPlayer
                  url={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${selectedVideo.videoUrl}`}
                  playing={isPlaying}
                  controls
                  style={{ maxHeight: '300px', maxWidth: '100%' }}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              )}
            </Box>

            {/* Rating Section */}
            <Box 
              display='flex' 
              flexDirection='column' 
              alignItems='center' 
              justifyContent='center' 
              sx={{ 
                my: 4,
                minHeight: '200px',
                backgroundColor: '#f8f8f8',
                borderRadius: '16px',
                width: '100%',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'auto'
                }}
              >
                <RHFTextField 
                  name="score"
                  type="number"
                  variant="standard"
                  defaultValue={0}
                  onChange={(e) => {
                    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 100);
                    e.target.value = value;
                    methods.setValue("score", value);
                  }}
                  inputProps={{ 
                    min: 0,
                    max: 100,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 3,
                    style: {
                      textAlign: 'center',
                      fontSize: '64px',
                      fontWeight: 300,
                      width: '120px',
                      caretColor: '#007AFF',
                      // color: getColorForScore(score || 0),
                      transition: 'color 0.3s ease',
                      padding: '16px 0'
                    }
                  }}
                  sx={{
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                  }}
                />
                <Typography 
                  sx={{ 
                    color: '#8E8E93',
                    fontSize: '17px',
                    mt: 1,
                    fontWeight: 400,
                    textAlign: 'center'
                  }}
                >
                  {`${score || 0}/100 points`}
                </Typography>
              </Box>
            </Box>

            {/* Review Fields */}
            <Box mt={2}>
              <RHFTextField name="goodAspects" label="Good Aspects" multiline rows={3} fullWidth />
            </Box>
            <Box mt={2}>
              <RHFTextField name="badAspects" label="Bad Aspects" multiline rows={3} fullWidth />
            </Box>
            <Box mt={2}>
              <RHFTextField name="howToImprove" label="How to Improve" multiline rows={3} fullWidth />
            </Box>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              sx={{ ':hover': { color: '#3399FF' }, py: 2, mt: 2 }}
            >
              Review
            </LoadingButton>
          </>
        )}
      </Box>
    </FormProvider>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            height: '100%',
            maxHeight: '100%',
            width: '100vw',
            maxWidth: '100%',
            backgroundColor: 'white',
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "2px solid #EBEBEB",
            paddingTop: 'env(safe-area-inset-bottom)',
            zIndex: 10,
          }}
        >
          <MobileHeader onBack={onClose} title={translate('video.review.title')} />
        </Box>
        {content}
      </SwipeableDrawer>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="video-review-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "2px solid #EBEBEB",
            zIndex: 10,
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {translate('video.review.title')}
          </Typography>
        </Box>
        {content}
      </Box>
    </Modal>
  );
} 