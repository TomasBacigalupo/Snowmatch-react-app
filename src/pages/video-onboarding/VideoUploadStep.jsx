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

// Import video handling dependencies
import { Camera } from '@capacitor/camera';
import { VideoPicker } from '@coderpradp/capacitor-plugin-video-picker';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor';

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

      // Check if we're in a mobile environment (Capacitor)
      const isMobile = window.Capacitor && window.Capacitor.isNativePlatform();

      if (isMobile) {
        // Mobile environment - use Capacitor plugins
        try {
          console.log('Requesting camera permissions...');
          await Camera.requestPermissions();
          
          console.log('Opening video picker...');
          const videos = await VideoPicker.pick();
          const file = videos.files[0];
          console.log('Mobile video selected:', file);

          if (!file) {
            setError(translate('videoOnboarding.upload.noVideoSelected'));
            setIsUploading(false);
            isUploadingRef.current = false;
            return;
          }

          const videoUrl = file.webPath;
          console.log('Mobile video URL:', videoUrl);
          
          // Set video immediately
          setVideoPreviewUrl(videoUrl);
          setSelectedFile(file);
          setValue('videoFile', file);
          
          // Set default values first (will be updated when metadata loads)
          setVideoDuration(60);
          setTrimEnd(30);
          setValue('videoDuration', 60);
          
          console.log('Mobile video loaded successfully');
          setIsUploading(false);
          isUploadingRef.current = false;

        } catch (mobileError) {
          console.error('Mobile video picker error:', mobileError);
          setError(translate('videoOnboarding.upload.galleryError'));
          setIsUploading(false);
          isUploadingRef.current = false;
          return;
        }
      } else {
        // Browser environment - use HTML file input
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
          
          const selectedFile = event.target.files[0];
          console.log('File selected:', selectedFile);
          
          if (!selectedFile) {
            resetLoading();
            return;
          }

          try {
            console.log('Processing video file...');
            
            // Clean up previous URL if exists
            if (videoPreviewUrl) {
              URL.revokeObjectURL(videoPreviewUrl);
            }

            const videoUrl = URL.createObjectURL(selectedFile);
            console.log('Video URL created:', videoUrl);
            
            // Set preview immediately so user sees something
            setVideoPreviewUrl(videoUrl);
            setSelectedFile(selectedFile);
            setValue('videoFile', selectedFile);
            
            // Set default values first (will be updated when metadata loads)
            setVideoDuration(60);
            setTrimEnd(30);
            setValue('videoDuration', 60);
            
            console.log('Video loaded successfully');
            resetLoading();
          } catch (error) {
            console.error('Error processing video:', error);
            setError(translate('videoOnboarding.upload.selectionError'));
            resetLoading();
          }
        };

        // Handle cancel case
        input.oncancel = () => {
          resetLoading();
        };
        
        // Set a timeout to detect if the user closed the dialog without selecting
        // This handles cases where oncancel is not supported
        window.addEventListener('focus', () => {
          fileSelectionTimeoutRef.current = setTimeout(() => {
            // Check if we're still in uploading state
            // If onchange was called, resetLoading() would have been called and isUploadingRef would be false
            if (isUploadingRef.current) {
              console.log('File selection cancelled or timed out');
              resetLoading();
            }
          }, 500);
        }, { once: true });
        
        input.click();
      }

    } catch (error) {
      console.error('Error selecting video:', error);
      setError(translate('videoOnboarding.upload.selectionError') + ' ' + error.message);
      setIsUploading(false);
      isUploadingRef.current = false;
    } finally {
      // Set isUploading to false for mobile
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        setIsUploading(false);
        isUploadingRef.current = false;
      }
    }
  }, [setValue, translate, videoPreviewUrl]);

  const handleTrimVideo = useCallback(async () => {
    if (!videoPreviewUrl || !selectedFile) return;

    try {
      setIsTrimming(true);
      setError(null);

      // Check if we're in a mobile environment (Capacitor)
      const isMobile = window.Capacitor && window.Capacitor.isNativePlatform();
      
      if (isMobile) {
        // Mobile environment - use VideoEditor plugin
        try {
          const trimmedVideo = await VideoEditor.trim(videoPreviewUrl, trimStart, trimEnd);
          
          if (trimmedVideo) {
            setValue('trimmedVideo', trimmedVideo);
            setSelectedFile(trimmedVideo);
            setVideoPreviewUrl(trimmedVideo.webPath || trimmedVideo);
            
            // Update duration for trimmed video
            const video = document.createElement('video');
            video.src = trimmedVideo.webPath || trimmedVideo;
            video.addEventListener('loadedmetadata', () => {
              setVideoDuration(video.duration);
            });
          }
        } catch (mobileTrimError) {
          console.error('Mobile video trimming error:', mobileTrimError);
          setError(translate('videoOnboarding.upload.mobileTrimError'));
        }
      } else {
        // Browser environment - use canvas-based trimming (simplified)
        try {
          const video = document.createElement('video');
          video.src = videoPreviewUrl;
          
          video.addEventListener('loadedmetadata', () => {
            // For browser, we'll create a trimmed version using canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Create a new video element for the trimmed version
            const trimmedVideoElement = document.createElement('video');
            
            // For now, we'll just update the trim values and show a message
            // In a real implementation, you'd use MediaRecorder API or similar
            setValue('trimStart', trimStart);
            setValue('trimEnd', trimEnd);
            setValue('trimmedVideo', selectedFile); // Use original file with trim markers
            
            // Update duration to trimmed duration
            const trimmedDuration = trimEnd - trimStart;
            setVideoDuration(trimmedDuration);
            
            // Show success message
            console.log(`Video trimmed from ${trimStart}s to ${trimEnd}s (${trimmedDuration}s total)`);
          });
          
          video.load();
        } catch (browserTrimError) {
          console.error('Browser video trimming error:', browserTrimError);
          setError(translate('videoOnboarding.upload.browserTrimError'));
        }
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
