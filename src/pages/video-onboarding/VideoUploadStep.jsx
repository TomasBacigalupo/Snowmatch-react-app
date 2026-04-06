import PropTypes from 'prop-types';
import { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Button, 
  Card, 
  CardContent,
  Alert,
  CircularProgress,
  LinearProgress,
  Slider
} from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../components/Iconify';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const VideoUploadStep = forwardRef(({ validateField }, ref) => {
  const { setValue, watch } = useFormContext();
  const { translate } = useLocales();
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(30);
  const [isUploading, setIsUploading] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const isUploadingRef = useRef(false);
  const fileSelectionTimeoutRef = useRef(null);

  const handleFileSelect = useCallback(async () => {
    try {
      setError(null);
      setIsUploading(true);
      isUploadingRef.current = true;

      // Clear any existing timeout
      if (fileSelectionTimeoutRef.current) {
        clearTimeout(fileSelectionTimeoutRef.current);
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';

      const resetLoading = () => {
        if (fileSelectionTimeoutRef.current) {
          clearTimeout(fileSelectionTimeoutRef.current);
        }
        setIsUploading(false);
        isUploadingRef.current = false;
      };

      input.onchange = async (event) => {
        if (fileSelectionTimeoutRef.current) {
          clearTimeout(fileSelectionTimeoutRef.current);
        }

        const picked = event.target.files[0];
        console.log('File selected:', picked);

        if (!picked) {
          resetLoading();
          return;
        }

        try {
          console.log('Processing video file...');

          if (videoPreviewUrl) {
            URL.revokeObjectURL(videoPreviewUrl);
          }

          const videoUrl = URL.createObjectURL(picked);
          console.log('Video URL created:', videoUrl);

          setVideoPreviewUrl(videoUrl);
          setSelectedFile(picked);
          setValue('videoFile', picked);

          setVideoDuration(60);
          setTrimEnd(30);
          setValue('videoDuration', 60);

          console.log('Video loaded successfully');
          resetLoading();
        } catch (err) {
          console.error('Error processing video:', err);
          setError(translate('videoOnboarding.upload.selectionError'));
          resetLoading();
        }
      };

      input.oncancel = () => {
        resetLoading();
      };

      window.addEventListener('focus', () => {
        fileSelectionTimeoutRef.current = setTimeout(() => {
          if (isUploadingRef.current) {
            console.log('File selection cancelled or timed out');
            resetLoading();
          }
        }, 500);
      }, { once: true });

      input.click();

    } catch (error) {
      console.error('Error selecting video:', error);
      setError(translate('videoOnboarding.upload.selectionError') + ' ' + error.message);
      setIsUploading(false);
      isUploadingRef.current = false;
    }
  }, [setValue, translate, videoPreviewUrl]);

  const handleTrimVideo = useCallback(async () => {
    if (!videoPreviewUrl || !selectedFile) return;

    try {
      setIsTrimming(true);
      setError(null);

      try {
        const video = document.createElement('video');
        video.src = videoPreviewUrl;

        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.getContext('2d');

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          setValue('trimStart', trimStart);
          setValue('trimEnd', trimEnd);
          setValue('trimmedVideo', selectedFile);

          const trimmedDuration = trimEnd - trimStart;
          setVideoDuration(trimmedDuration);

          console.log(`Video trimmed from ${trimStart}s to ${trimEnd}s (${trimmedDuration}s total)`);
        });

        video.load();
      } catch (browserTrimError) {
        console.error('Browser video trimming error:', browserTrimError);
        setError(translate('videoOnboarding.upload.browserTrimError'));
      }

    } catch (error) {
      console.error('Error trimming video:', error);
      setError(translate('videoOnboarding.upload.trimError') + ' ' + error.message);
    } finally {
      setIsTrimming(false);
    }
  }, [videoPreviewUrl, selectedFile, trimStart, trimEnd, setValue, translate]);

  const handleSliderChange = useCallback((event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;

    const [start, end] = newValue;
    const maxDuration = 30; // Maximum 30 seconds

    // Ensure the duration doesn't exceed 30 seconds
    if (end - start > maxDuration) {
      if (activeThumb === 0) {
        // If moving the start thumb, adjust the end
        setTrimStart(start);
        setTrimEnd(Math.min(start + maxDuration, videoDuration));
      } else {
        // If moving the end thumb, adjust the start
        setTrimEnd(end);
        setTrimStart(Math.max(end - maxDuration, 0));
      }
    } else {
      if (activeThumb === 0) {
        setTrimStart(start);
      } else {
        setTrimEnd(end);
      }
    }
  }, [videoDuration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const needsTrimming = videoDuration > 30;

  // Listen for video metadata loaded event
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && videoPreviewUrl) {
      const handleLoadedMetadata = () => {
        const duration = videoElement.duration;
        console.log('Video metadata loaded from DOM element, duration:', duration);
        if (duration && duration > 0) {
          setVideoDuration(duration);
          setTrimEnd(Math.min(30, duration));
          setValue('videoDuration', duration);
        }
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Try to get duration if already loaded
      if (videoElement.duration && videoElement.duration > 0) {
        handleLoadedMetadata();
      }

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoPreviewUrl, setValue]);

  // Cleanup video preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      // Clear any pending timeouts
      if (fileSelectionTimeoutRef.current) {
        clearTimeout(fileSelectionTimeoutRef.current);
      }
    };
  }, [videoPreviewUrl]);

  // Expose trim method to parent component
  useImperativeHandle(ref, () => ({
    trimVideo: handleTrimVideo,
    needsTrimming: needsTrimming,
    isTrimming: isTrimming
  }), [handleTrimVideo, needsTrimming, isTrimming]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <m.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <m.div variants={item}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              {translate('videoOnboarding.upload.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {translate('videoOnboarding.upload.subtitle')} 
            </Typography>
          </Box>
        </m.div>

        {/* Error Display */}
        {error && (
          <m.div variants={item}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </m.div>
        )}

        {/* Upload Section */}
        <m.div variants={item}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={3}>
                {!selectedFile ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {translate('videoOnboarding.upload.selectVideo')}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleFileSelect}
                      disabled={isUploading}
                      startIcon={isUploading ? <CircularProgress size={20} /> : <Iconify icon="eva:video-fill" />}
                      sx={{
                        textTransform: 'none',
                      }}
                    >
                      {isUploading ? translate('videoOnboarding.upload.selecting') : translate('videoOnboarding.upload.selectVideo')}
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      {translate('videoOnboarding.upload.selectFromGallery')}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {translate('videoOnboarding.upload.videoSelected')}
                    </Typography>
                    
                    {/* Video Preview */}
                    <Box sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      minHeight: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <video
                        ref={videoRef}
                        src={videoPreviewUrl}
                        controls
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>


                    {/* Trimming Section */}
                    {needsTrimming && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {translate('videoOnboarding.upload.trimSection')}
                        </Typography>
                        
                        <Box sx={{ px: 2 }}>
                          <Slider
                            value={[trimStart, trimEnd]}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            valueLabelFormat={formatTime}
                            min={0}
                            max={videoDuration}
                            step={0.1}
                            sx={{ mb: 2 }}
                          />
                          
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {translate('videoOnboarding.upload.startTime')} {formatTime(trimStart)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {translate('videoOnboarding.upload.endTime')} {formatTime(trimEnd)}
                            </Typography>
                          </Stack>
                        </Box>

                      </Box>
                    )}

                    {/* Change Video Button */}
                    <Button
                      variant="text"
                      onClick={handleFileSelect}
                      disabled={isUploading}
                      startIcon={<Iconify icon="eva:refresh-fill" />}
                    >
                      {translate('videoOnboarding.upload.changeVideo')}
                    </Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </m.div>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <m.div variants={item}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                {translate('videoOnboarding.upload.processing')} {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          </m.div>
        )}
      </m.div>
    </Box>
  );
});

VideoUploadStep.propTypes = {
  validateField: PropTypes.func, // Optional - validation will happen on form submission
};

VideoUploadStep.displayName = 'VideoUploadStep';

export default VideoUploadStep;
