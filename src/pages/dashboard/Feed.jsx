import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
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
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../utils/axios';
import Markdown from 'src/components/Markdown';
import CloseIcon from '@mui/icons-material/Close';
import Page from 'src/components/Page';
import FeedCard from 'src/sections/@dashboard/feed/FeedCard';
import InstructorDetailsDrawer from 'src/sections/@dashboard/feed/InstructorDetailsDrawer';

const safeSliceMarkdown = (text, length) => {
  if (!text) return "";
  if (text.length <= length) return text;
  let sliced = text.slice(0, length);
  return sliced.substring(0, sliced.lastIndexOf(" ")) + "...";
};

const CommentsDrawer = ({ open, onClose, comments }) => {
  const [expandedComments, setExpandedComments] = useState({});

  const toggleComment = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  if (!comments?.length) return null;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh',
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
        {comments.map((comment, index) => (
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
        ))}
      </Box>
    </SwipeableDrawer>
  );
};

const Feed = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { ref, inView } = useInView();
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  

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
      setVideos([]);
      setHasMore(true);
      const response = await axiosInstance.get('/api/videos/feed?page=0');
      const newVideos = response.data;
      setVideos(newVideos);
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
  }, [enqueueSnackbar]);

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
      const response = await axiosInstance.get(`/api/videos/feed?page=${page}`);
      const newVideos = response.data;

      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => [...prev, ...newVideos]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      enqueueSnackbar('Error loading videos', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, enqueueSnackbar]);

  useEffect(() => {
    if (inView) {
      fetchVideos();
    }
  }, [inView, fetchVideos]);

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
        {refreshing || loading && (
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
            setSelectedVideo={setSelectedVideo}
            onInstructorClick={setSelectedInstructor}
          />
        ))}

        <Box
          ref={ref}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1,
          }}
        >
          {loading && !refreshing && <CircularProgress size={24} />}
        </Box>

        <CommentsDrawer
          open={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          comments={selectedVideo?.videoComments}
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
