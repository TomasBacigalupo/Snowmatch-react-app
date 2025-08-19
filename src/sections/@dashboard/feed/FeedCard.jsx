import { Avatar, Box, Button, Card, CardContent, Stack, Switch, Typography, CircularProgress, IconButton, Drawer } from "@mui/material";
import { useState, useRef, useEffect, Fragment } from "react";
import { useDispatch } from 'react-redux';
import { likeVideo } from 'src/redux/slices/video';
import useAuth from 'src/hooks/useAuth';
import VideoPlayer from 'src/components/video-player';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Login from 'src/pages/auth/Login';

import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function FeedCard({ video, setSelectedVideo, onInstructorClick }) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [shouldLoad, setShouldLoad] = useState(false);
    const videoRef = useRef(null);
    const cardRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [buffering, setBuffering] = useState(false);
    const [bufferedPercent, setBufferedPercent] = useState(0);
    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [isLiked, setIsLiked] = useState(video.likedByCurrentUser || false);
    const [likesCount, setLikesCount] = useState(video.likesCount || 0);
    const [isLiking, setIsLiking] = useState(false);
    const [showDoubleClickHeart, setShowDoubleClickHeart] = useState(false);
    const [doubleClickPosition, setDoubleClickPosition] = useState({ x: 0, y: 0 });
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    // Reset video states when analytics mode changes
    const handleAnalyticsToggle = () => {
        const newAnalyticsEnabled = !analyticsEnabled;
        setAnalyticsEnabled(newAnalyticsEnabled);
        
        // Reset all video states
        setIsLoading(true);
        setIsPlaying(false);
        setHasError(false);
        setBuffering(false);
        setBufferedPercent(0);
        
        // Update the video URL
        const newVideoUrl = newAnalyticsEnabled 
            ? `${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${video.videoUrl}.mp4`
            : `${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`;
        
        setCurrentVideoUrl(newVideoUrl);
        
        // Reload the video with new URL
        if (videoRef.current) {
            console.log('Reloading video with new URL:', newVideoUrl);
            videoRef.current.src = newVideoUrl;
            videoRef.current.load();
        }
    };

    // Intersection Observer to detect when card is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // Add a small delay to start loading
                        setTimeout(() => setShouldLoad(true), 100);
                    } else {
                        // When video goes out of view, pause it
                        if (videoRef.current && !videoRef.current.paused) {
                            videoRef.current.pause();
                            setIsPlaying(false);
                        }
                        setIsVisible(false);
                    }
                });
            },
            {
                rootMargin: '100px', // Start loading 100px before the video comes into view
                threshold: 0.1
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    // Update like state when video prop changes
    useEffect(() => {
      setIsLiked(video.likedByCurrentUser || false);
      setLikesCount(video.likesCount || 0);
    }, [video.likedByCurrentUser, video.likesCount]);

    // Handle like button click
    const handleLikeClick = async () => {
      if (isLiking) return; // Prevent multiple clicks while processing
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        setLoginModalOpen(true);
        return;
      }
      
      // Toggle like status
      const newLikedStatus = !isLiked;
      const previousLikedStatus = isLiked;
      const previousLikesCount = likesCount;
      
      // Set loading state
      setIsLiking(true);
      
      // Optimistically update local state for immediate UI feedback
      setIsLiked(newLikedStatus);
      if (newLikedStatus) {
        setLikesCount(prev => prev + 1);
      } else {
        setLikesCount(prev => Math.max(0, prev - 1));
      }
      
      try {
        // Dispatch Redux action to update backend and global state
        await dispatch(likeVideo(video.id, newLikedStatus));
      } catch (error) {
        // Revert optimistic update on error
        console.error('Failed to like video:', error);
        setIsLiked(previousLikedStatus);
        setLikesCount(previousLikesCount);
      } finally {
        // Clear loading state
        setIsLiking(false);
      }
    };

    // Handle double-click to like
    const handleDoubleClick = (event) => {
      // Only allow double-click like when video is not already liked
      if (!isLiked && !isLiking) {
        // Check if user is authenticated
        if (!isAuthenticated) {
          setLoginModalOpen(true);
          return;
        }
        
        // Get click position relative to video
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        setDoubleClickPosition({ x, y });
        setShowDoubleClickHeart(true);
        
        // Auto-hide heart after animation
        setTimeout(() => setShowDoubleClickHeart(false), 1000);
        
        // Trigger like action
        handleLikeClick();
      }
      // If video is already liked, do nothing (silent)
    };

    // Handle video loading and autoplay for mobile
    useEffect(() => {
        if (shouldLoad && videoRef.current) {
            const video = videoRef.current;
            let loadTimeout;
            
            const handleCanPlay = () => {
                console.log('Video can play - loading complete');
                clearTimeout(loadTimeout);
                setIsLoading(false);
                setHasError(false);
                
                // For mobile, try to autoplay muted
                if (video.paused) {
                    console.log('Attempting to autoplay video');
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log('Autoplay successful');
                                setIsPlaying(true);
                            })
                            .catch((error) => {
                                console.log('Autoplay prevented:', error);
                                // This is normal on mobile, user needs to interact
                                setIsPlaying(false);
                            });
                    }
                }
            };

            const handleCanPlayThrough = () => {
                console.log('Video can play through - fully buffered');
                clearTimeout(loadTimeout);
                setIsLoading(false);
                setHasError(false);
            };

            const handleLoadedData = () => {
                console.log('Video loaded data - ready to play');
                clearTimeout(loadTimeout);
                setIsLoading(false);
                setHasError(false);
                
                // Try to autoplay as soon as we have enough data
                if (video.paused && video.readyState >= 2) { // HAVE_CURRENT_DATA
                    console.log('Attempting to autoplay with buffered data');
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                console.log('Autoplay successful with buffered data');
                                setIsPlaying(true);
                            })
                            .catch((error) => {
                                console.log('Autoplay prevented with buffered data:', error);
                                setIsPlaying(false);
                            });
                    }
                } else {
                    // If autoplay is prevented, just show the thumbnail
                    setIsPlaying(false);
                }
            };

            const handleProgress = () => {
                // Check if we have enough buffered data to start playing
                if (video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                    const currentTime = video.currentTime;
                    const duration = video.duration || 0;
                    
                    // Calculate buffered percentage
                    if (duration > 0) {
                        const bufferedPercent = (bufferedEnd / duration) * 100;
                        setBufferedPercent(bufferedPercent);
                        console.log(`Buffered: ${bufferedPercent.toFixed(1)}%`);
                    }
                    
                    // If we have at least 2 seconds buffered or 10% of the video, we can start
                    const minBuffered = Math.min(2, duration * 0.1);
                    
                    if (bufferedEnd - currentTime >= minBuffered && video.paused && !isPlaying) {
                        console.log('Enough buffered data, attempting to play');
                        setBuffering(false);
                        const playPromise = video.play();
                        if (playPromise !== undefined) {
                            playPromise
                                .then(() => {
                                    console.log('Playback started with buffered data');
                                    setIsPlaying(true);
                                })
                                .catch((error) => {
                                    console.log('Playback failed with buffered data:', error);
                                });
                        }
                    } else if (bufferedEnd - currentTime < minBuffered) {
                        setBuffering(true);
                    }
                }
            };

            const handleError = (e) => {
                console.error('Video error:', e);
                console.error('Video error details:', video.error);
                console.error('Video src:', video.src);
                console.error('Current video URL:', currentVideoUrl);
                console.error('Analytics enabled:', analyticsEnabled);
                clearTimeout(loadTimeout);
                setIsLoading(false);
                setHasError(true);
                
                // Log specific error information
                if (video.error) {
                    switch (video.error.code) {
                        case 1:
                            console.error('MEDIA_ERR_ABORTED: The video download was aborted');
                            break;
                        case 2:
                            console.error('MEDIA_ERR_NETWORK: A network error occurred');
                            break;
                        case 3:
                            console.error('MEDIA_ERR_DECODE: The video is corrupted or not supported');
                            break;
                        case 4:
                            console.error('MEDIA_ERR_SRC_NOT_SUPPORTED: The video format is not supported');
                            break;
                        default:
                            console.error('Unknown video error');
                    }
                }
            };

            const handleLoadStart = () => {
                console.log('Video load started');
                setIsLoading(true);
                setHasError(false);
                
                // Set a timeout to detect if video doesn't load
                loadTimeout = setTimeout(() => {
                    console.error('Video load timeout - taking too long');
                    if (isLoading) {
                        setIsLoading(false);
                        setHasError(true);
                    }
                }, 15000); // 15 seconds timeout
            };

            const handleLoadedMetadata = () => {
                console.log('Video metadata loaded');
                // Try to start playing as soon as we have metadata
                if (video.readyState >= 1) { // HAVE_METADATA
                    console.log('Metadata loaded, checking if we can start playback');
                    handleLoadedData();
                }
            };

            const handleWaiting = () => {
                console.log('Video waiting for data');
                setBuffering(true);
            };

            const handlePlaying = () => {
                console.log('Video playing');
                setBuffering(false);
                setIsPlaying(true);
            };

            const handleStalled = () => {
                console.log('Video stalled');
                setBuffering(true);
            };

            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('canplaythrough', handleCanPlayThrough);
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('progress', handleProgress);
            video.addEventListener('error', handleError);
            video.addEventListener('loadstart', handleLoadStart);
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('waiting', handleWaiting);
            video.addEventListener('playing', handlePlaying);
            video.addEventListener('stalled', handleStalled);

            return () => {
                clearTimeout(loadTimeout);
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('canplaythrough', handleCanPlayThrough);
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('progress', handleProgress);
                video.removeEventListener('error', handleError);
                video.removeEventListener('loadstart', handleLoadStart);
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('waiting', handleWaiting);
                video.removeEventListener('playing', handlePlaying);
                video.removeEventListener('stalled', handleStalled);
            };
        }
    }, [shouldLoad, isLoading, isPlaying]);

    // Handle app visibility changes (pause videos when app goes to background)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && videoRef.current && !videoRef.current.paused) {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Debug logging for video URLs
    useEffect(() => {
        if (shouldLoad) {
            const videoUrl = analyticsEnabled 
                ? `${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${video.videoUrl}.mp4`
                : `${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`;
            
            console.log('Video URL:', videoUrl);
            console.log('Analytics enabled:', analyticsEnabled);
            console.log('Video object:', video);
            console.log('Environment variables:', {
                REACT_APP_VIDEO_BUCKET_URL: process.env.REACT_APP_VIDEO_BUCKET_URL,
                REACT_APP_VIDEO_ANALIZED_BUCKET_URL: process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL
            });
        }
    }, [shouldLoad, analyticsEnabled, video.videoUrl]);

    // Initialize video URL when component loads or video changes
    useEffect(() => {
        const initialVideoUrl = analyticsEnabled 
            ? `${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${video.videoUrl}.mp4`
            : `${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`;
        
        setCurrentVideoUrl(initialVideoUrl);
        console.log('Initial video URL set:', initialVideoUrl);
    }, [video.videoUrl, analyticsEnabled]);

    const handleVideoLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleVideoError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                        })
                        .catch((error) => {
                            console.error('Play failed:', error);
                        });
                }
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleVideoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const video = e.target;
        
        // Enter fullscreen
        if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen();
        } else if (video.requestFullscreen) {
            video.requestFullscreen();
        }
    };

    const getCommentScores = (comments) => {
        if (!comments?.length) return { aiScore: null, humanScore: null };
    
        const aiComment = comments.find(comment => comment.aiComment);
        const humanComment = comments.find(comment => !comment.aiComment);
    
        return {
          aiScore: aiComment?.score || null,
          humanScore: humanComment?.score || null
        };
      };

    return (
      <>
        <Card 
          ref={cardRef}
          key={video.id} 
          sx={{ 
            mb: 1,
            borderRadius: 0,
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
              <Avatar 
                src={video.user.imageS3} 
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {video.user.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.75rem'
                  }}
                >
                  {new Date(video.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <AnalyticsIcon 
                  sx={{ 
                    fontSize: '1.2rem',
                    color: 'black',
                    opacity: analyticsEnabled ? 1 : 0.5
                  }} 
                />
                <Switch
                  size="small"
                  checked={analyticsEnabled}
                  onChange={handleAnalyticsToggle}
                />
              </Stack>
            </Stack>

            <Box sx={{ position: 'relative' }}>
              {/* Placeholder when video is not loaded yet */}
              {!shouldLoad && (
                <Box
                  sx={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Loading video...
                  </Typography>
                </Box>
              )}

              {/* Loading indicator */}
              {shouldLoad && isLoading && !hasError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    zIndex: 1,
                    gap: 2,
                  }}
                >
                  <CircularProgress 
                    size={60} 
                    variant={buffering ? "determinate" : "indeterminate"}
                    value={buffering ? bufferedPercent : undefined}
                  />
                  {buffering && (
                    <Typography variant="caption" color="text.secondary">
                      Buffering... {bufferedPercent.toFixed(0)}%
                    </Typography>
                  )}
                </Box>
              )}

              {/* Error state */}
              {shouldLoad && hasError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    zIndex: 1,
                    gap: 2,
                    p: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" align="center">
                    Error loading {analyticsEnabled ? 'analyzed' : 'original'} video
                  </Typography>
                  <Typography variant="caption" color="text.secondary" align="center" sx={{ fontSize: '0.7rem' }}>
                    URL: {currentVideoUrl}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      setHasError(false);
                      setIsLoading(true);
                      if (videoRef.current) {
                        videoRef.current.load();
                      }
                    }}
                  >
                    Retry
                  </Button>
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => {
                      // Try switching to the other video type
                      handleAnalyticsToggle();
                    }}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    Try {analyticsEnabled ? 'original' : 'analyzed'} version
                  </Button>
                </Box>
              )}

              {/* Video element - only render when shouldLoad is true */}
              {shouldLoad && (
                <video
                  key={currentVideoUrl} // Force re-render when URL changes
                  ref={videoRef}
                  src={currentVideoUrl || (analyticsEnabled 
                    ? `${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${video.videoUrl}.mp4`
                    : `${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`
                  )}
                  poster={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`} // Use the thumbnail from bucket
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    WebkitPlaysInline: true,
                    playsInline: true
                  }}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  x5-video-player-type="h5"
                  x5-video-player-fullscreen="false"
                  onLoadedData={handleVideoLoad}
                  onError={handleVideoError}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={handleVideoClick}
                  onDoubleClick={handleDoubleClick}
                />
              )}

              {/* Double-click heart animation overlay */}
              {showDoubleClickHeart && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: doubleClickPosition.y - 50,
                    left: doubleClickPosition.x - 50,
                    zIndex: 10,
                    animation: 'heartBeat 1s ease-out forwards',
                    '@keyframes heartBeat': {
                      '0%': {
                        transform: 'scale(0) rotate(0deg)',
                        opacity: 0,
                      },
                      '50%': {
                        transform: 'scale(1.2) rotate(0deg)',
                        opacity: 1,
                      },
                      '100%': {
                        transform: 'scale(1) rotate(0deg)',
                        opacity: 0,
                      },
                    },
                  }}
                >
                  <FavoriteIcon
                    sx={{
                      fontSize: '100px',
                      color: 'error.main',
                      filter: 'drop-shadow(0 0 10px rgba(244, 67, 54, 0.8))',
                    }}
                  />
                </Box>
              )}



              {/* Thumbnail overlay when video is paused and loaded */}
              {shouldLoad && !isLoading && !isPlaying && !hasError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 1,
                  }}
                />
              )}
              
              {/* Play Button - Only show when paused and video is loaded */}
              {shouldLoad && !isLoading && !isPlaying && !hasError && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    onClick={handlePlayPause}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      width: 60,
                      height: 60,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>
              )}
              
              {video.videoComments && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'space-between',
                    px: 2,
                  }}
                >
                  {(() => {
                    const { aiScore, humanScore } = getCommentScores(video.videoComments);
                    const aiComment = video.videoComments.find(comment => comment.aiComment);
                    const humanComment = video.videoComments.find(comment => !comment.aiComment);
                    return (
                      <>
                        {aiScore !== null && (
                          <Box
                            sx={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '30px',
                              px: 2,
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                            onClick={() => {
                              if (aiComment?.user?.id) {
                                window.location.href = `/match/teacher/${aiComment.user.id}`;
                              }
                            }}
                          >
                            <Avatar
                              src="/assets/avatars/snow-ai.png"
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                              <Typography
                                sx={{
                                  color: 'text.primary',
                                  fontSize: '1.1rem',
                                  fontWeight: 600,
                                }}
                              >
                                Snow: {aiScore}
                              </Typography>
                              <Typography
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  opacity: 0.8,
                                }}
                              >
                                pts
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {humanScore !== null && (
                          <Box
                            onClick={() => {
                              if (humanComment?.user?.id) {
                                window.location.href = `/match/teacher/${humanComment.user.id}`;
                              }
                            }}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '30px',
                              px: 2,
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              cursor: 'pointer',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.95)',
                              }
                            }}
                          >
                            <Avatar
                              src={humanComment?.user.imageS3}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                              <Typography
                                sx={{
                                  color: 'text.primary',
                                  fontSize: '1.1rem',
                                  fontWeight: 600,
                                }}
                              >
                                {humanComment?.user.name}: {humanScore}
                              </Typography>
                              <Typography
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  opacity: 0.8,
                                }}
                              >
                                pts
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </>
                    );
                  })()}
                </Box>
              )}
            </Box>

            <Box sx={{ p: 0 }}>
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  mt: 0,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 2,
                  justifyContent: 'space-between',
                  px: 1
                }}
              >
                <Button
                  disabled={isLiking}
                  startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleLikeClick}
                  sx={{
                    color: isLiked ? 'error.main' : 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    px: 2,
                    transition: 'all 0.2s ease-in-out',
                    opacity: isLiking ? 0.6 : 1,
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                      transform: isLiking ? 'scale(1)' : 'scale(1.05)',
                    },
                    '&:disabled': {
                      cursor: 'not-allowed',
                    },
                  }}
                                  >
                    <Typography
                      key={likesCount}
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        transform: 'scale(1)',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      {likesCount}
                    </Typography>
                  </Button>
                <Button
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={() => setSelectedVideo(video)}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2">
                      Comments
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        transition: 'all 0.2s ease-in-out',
                        transform: 'scale(1)',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      ({video.videoComments?.length || 0})
                    </Typography>
                  </Stack>
                </Button>
                <Button
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'SnowMatch',
                        text: 'Check out SnowMatch - Your Skiing Performance App!',
                        url: window.location.origin
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.origin);
                      // You might want to add a toast notification here
                    }
                  }}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    minWidth: 'auto',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Share App
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Login Modal */}
        <Drawer
          anchor="bottom"
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: 'auto',
              maxHeight: '40vh',
              minHeight: '300px',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 6, borderRadius: 3, bgcolor: 'grey.300' }} />
          </Box>
          <Login fromModal={true} />
        </Drawer>
      </>
    );
}