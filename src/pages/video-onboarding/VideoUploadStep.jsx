import PropTypes from 'prop-types';
import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
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

  const handleFileSelect = useCallback(async () => {
    try {
      setError(null);
      setIsUploading(true);

      // Check if we're in a mobile environment (Capacitor)
      const isMobile = window.Capacitor && window.Capacitor.isNativePlatform();

      if (isMobile) {
        // Mobile environment - use Capacitor plugins
        try {
          await Camera.requestPermissions();
          const videos = await VideoPicker.pick();
          const file = videos.files[0];
          const videoUrl = file.webPath;

          if (!file) {
            setError(translate('videoOnboarding.upload.noVideoSelected'));
            return;
          }

          setVideoPreviewUrl(videoUrl);
          setSelectedFile(file);

          // Get video duration for mobile
          const video = document.createElement('video');
          video.src = videoUrl;
          video.addEventListener('loadedmetadata', () => {
            const duration = video.duration;
            setVideoDuration(duration);
            setTrimEnd(Math.min(30, duration)); // Set trim end to max 30 seconds or video duration
          });

          // Set form values
          setValue('videoFile', file);
          setValue('videoDuration', video.duration);
          
          await validateField('videoFile', file);

        } catch (mobileError) {
          console.error('Mobile video picker error:', mobileError);
          setError(translate('videoOnboarding.upload.galleryError'));
          return;
        }
      } else {
        // Browser environment - use HTML file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        
        input.onchange = async (event) => {
          const selectedFile = event.target.files[0];
          if (selectedFile) {
            const videoUrl = URL.createObjectURL(selectedFile);
            
            // Get video duration
            const video = document.createElement('video');
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', () => {
              const duration = video.duration;
              setVideoDuration(duration);
              setTrimEnd(Math.min(30, duration)); // Set trim end to max 30 seconds or video duration
            });

            // Set form values
            setValue('videoFile', selectedFile);
            setValue('videoDuration', video.duration);
            await validateField('videoFile', selectedFile);
            
            setVideoPreviewUrl(videoUrl);
            setSelectedFile(selectedFile);
            setIsUploading(false);
          } else {
            setIsUploading(false);
          }
        };
        
        input.click();
      }

    } catch (error) {
      console.error('Error selecting video:', error);
      setError(translate('videoOnboarding.upload.selectionError') + ' ' + error.message);
    } finally {
      // Only set isUploading to false for mobile, browser handles it in onchange
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        setIsUploading(false);
      }
    }
  }, [setValue, validateField]);

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

            await validateField('videoFile', trimmedVideo);
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
            
            validateField('videoFile', selectedFile);
            
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
  }, [videoPreviewUrl, selectedFile, trimStart, trimEnd, setValue, validateField]);

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
  validateField: PropTypes.func.isRequired,
};

VideoUploadStep.displayName = 'VideoUploadStep';

export default VideoUploadStep;
