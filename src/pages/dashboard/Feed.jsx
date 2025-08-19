import { useState, useEffect, useCallback, useRef } from 'react';
import { Gesture } from '@capacitor/core';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Stack,
  Divider,
  Chip,
  IconButton,
  Button,
  SwipeableDrawer,
  Switch,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Markdown from 'src/components/Markdown';
import CloseIcon from '@mui/icons-material/Close';
import Page from 'src/components/Page';
import FeedCard from 'src/sections/@dashboard/feed/FeedCard';
import InstructorDetailsDrawer from 'src/sections/@dashboard/feed/InstructorDetailsDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { addVideoComment, fetchFeedVideos } from 'src/redux/slices/video';
import useAuth from 'src/hooks/useAuth';

const safeSliceMarkdown = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  let sliced = text.slice(0, length);
  return sliced.substring(0, sliced.lastIndexOf(" ")) + "...";
};

const CommentsDrawer = ({ open, onClose, comments, videoId, onCommentAdded }) => {
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();

  const toggleComment = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log('Submitting comment:', newComment.trim());
      await dispatch(addVideoComment(videoId, newComment.trim()));
      setNewComment('');
      console.log('Comment submitted successfully, calling onCommentAdded');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always show the drawer if it's open, even if there are no comments
  if (!open) return null;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          minHeight: '30vh',
          maxHeight: '90vh',
          height: 'auto',
          overflow: 'auto',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Comments
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ maxHeight: 'calc(90vh - 80px)', overflow: 'auto', pb: 'env(safe-area-inset-bottom)' }}>
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
            <Box key={comment.id}>
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    src={comment.aiComment ? "/assets/avatars/snow-ai.png" : comment.user.imageS3}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {comment.aiComment ? "Snow" : `${comment.user.name} ${comment.user.lastname}`}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {comment.proCheckComment && (
                        <Chip
                          label="Pro"
                          size="small"
                          color="primary"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                      {comment.aiComment && (
                        <Chip
                          label="AI"
                          size="small"
                          color="secondary"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
                <Box sx={{ mt: 1 }}>
                  <Markdown
                    components={{
                      h1: (props) => <Typography variant="body1" {...props} />,
                      h2: (props) => <Typography variant="body1" {...props} />,
                      h3: (props) => <Typography variant="body1" {...props} />,
                      h4: (props) => <Typography variant="body1" {...props} />,
                      h5: (props) => <Typography variant="body1" {...props} />,
                      h6: (props) => <Typography variant="body1" {...props} />,
                      ul: (props) => <ul style={{ listStyleType: 'disc', marginLeft: '1px' }} {...props} />,
                      li: (props) => <li style={{ fontSize: '14px', marginLeft: '1px', marginTop: '5px' }} {...props} />,
                    }}
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {expandedComments[comment.id]
                      ? comment.comment
                      : safeSliceMarkdown(comment.comment, 100)}
                  </Markdown>
                  {comment.comment.length > 100 && (
                    <Button
                      onClick={() => toggleComment(comment.id)}
                      sx={{
                        mt: 1,
                        textTransform: 'none',
                        color: 'primary.main',
                        fontSize: '0.875rem',
                        p: 0,
                        minWidth: 'auto',
                        '&:hover': {
                          background: 'none',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {expandedComments[comment.id] ? 'Show less' : 'Read more'}
                    </Button>
                  )}
                </Box>
              </Box>
              {index < comments.length - 1 && (
                <Divider
                  sx={{
                    mb: 3,
                    opacity: 0.5,
                    '&::before, &::after': {
                      borderColor: 'divider',
                    }
                  }}
                />
              )}
            </Box>
          ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No comments yet. Be the first to comment!
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Comment Input Section */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Add a comment
          </Typography>
          
          {isAuthenticated ? (
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Post'
                )}
              </Button>
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please log in to comment
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  // TODO: Navigate to login page or show login modal
                  console.log('Navigate to login');
                }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Log In
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

const Feed = () => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  
  // Get videos from Redux store
  const videos = useSelector((state) => state.video.videos);
  const dispatch = useDispatch();
  
  // Get selectedVideo from Redux based on selectedVideoId
  const selectedVideo = videos.find(v => v.id === selectedVideoId);
  
  // Debug: Log videos changes
  useEffect(() => {
    console.log('Videos updated in Redux:', videos);
  }, [videos]);
  
  // Debug: Log selectedVideo changes
  useEffect(() => {
    console.log('SelectedVideo updated:', selectedVideo);
  }, [selectedVideo]);
  
  // Debug: Log selectedVideoId changes
  useEffect(() => {
    console.log('SelectedVideoId changed:', selectedVideoId);
  }, [selectedVideoId]);

  

  const handleFullscreen = (event) => {
    const video = event.target;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  const refreshFeed = useCallback(async () => {
    try {
      setRefreshing(true);
      setPage(0);
      setHasMore(true);
      const newVideos = await dispatch(fetchFeedVideos(0, 5));
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setPage(1);
      }
    } catch (error) {
      enqueueSnackbar('Error refreshing feed', { variant: 'error' });
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        currentY.current = 0;
        container.style.transition = 'none';
      }
    };

    const handleTouchMove = (e) => {
      if (startY.current === 0) return;

      const deltaY = e.touches[0].clientY - startY.current;
      if (deltaY > 0) {
        e.preventDefault();
        currentY.current = Math.min(deltaY * 0.5, 100);
        container.style.transform = `translateY(${currentY.current}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (startY.current === 0) return;

      container.style.transition = 'transform 0.3s ease-out';
      if (currentY.current > 50) {
        container.style.transform = 'translateY(60px)';
        refreshFeed();
      } else {
        container.style.transform = 'translateY(0)';
      }

      startY.current = 0;
      currentY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshFeed]);

  const fetchVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const newVideos = await dispatch(fetchFeedVideos(page, 5));

      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      enqueueSnackbar('Error loading videos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, dispatch, enqueueSnackbar]);

  const handleLoadMore = () => {
    fetchVideos();
  };

  // Load initial videos on component mount
  useEffect(() => {
    if (videos.length === 0 && !loading && !refreshing) {
      fetchVideos();
    }
  }, [videos.length, loading, refreshing, fetchVideos]);

  return (
    <Page title="Feed">
      <Box
        ref={containerRef}
        sx={{
          maxWidth: 680,
          mx: 'auto',
          py: 1,
          backgroundColor: loading ? '' : '#f7f7f7',
          position: 'relative',
          minHeight: '100vh',
          touchAction: 'pan-y'
        }}
      >
        {refreshing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60px',
              zIndex: 1,
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
        {videos.map((video) => (
          <FeedCard 
            key={video.id} 
            video={video} 
            setSelectedVideo={(video) => setSelectedVideoId(video?.id || null)}
            onInstructorClick={setSelectedInstructor}
          />
        ))}

        {/* Load More Button */}
        {hasMore && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loading}
              sx={{
                minWidth: 120,
                height: 40,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                'Load More'
              )}
            </Button>
          </Box>
        )}

        {/* No more videos message */}
        {!hasMore && videos.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center' }}
            >
              No more videos to load
            </Typography>
          </Box>
        )}

        <CommentsDrawer
          open={!!selectedVideo}
          onClose={() => setSelectedVideoId(null)}
          comments={selectedVideo?.videoComments}
          videoId={selectedVideo?.id}
          onCommentAdded={() => {
            console.log('onCommentAdded called, no need to update selectedVideo - it will auto-update from Redux');
          }}
        />

        <InstructorDetailsDrawer
          open={!!selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          instructor={selectedInstructor}
        />
      </Box>
    </Page>
  );
};

export default Feed;
