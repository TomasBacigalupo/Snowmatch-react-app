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
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../utils/axios';
import VideoPlayer from 'src/components/video-player';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import Markdown from 'src/components/Markdown';
import CloseIcon from '@mui/icons-material/Close';

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
                  src={comment.user.imageS3} 
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {comment.user.name} {comment.user.lastname}
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
  const { enqueueSnackbar } = useSnackbar();
  const { ref, inView } = useInView();
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const getCommentScores = (comments) => {
    if (!comments?.length) return { aiScore: null, humanScore: null };
    
    const aiComment = comments.find(comment => comment.aiComment);
    const humanComment = comments.find(comment => !comment.aiComment);
    
    return {
      aiScore: aiComment?.score || null,
      humanScore: humanComment?.score || null
    };
  };

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
        <Card 
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
              {(() => {
                const { aiScore, humanScore } = getCommentScores(video.videoComments);
                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    {aiScore !== null && (
                      <Box
                        sx={{
                          background: 'rgba(88, 86, 214, 0.1)',
                          borderRadius: '16px',
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          border: '1px solid rgba(88, 86, 214, 0.2)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#5856D6',
                            boxShadow: '0 0 4px rgba(88, 86, 214, 0.5)',
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#5856D6',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {aiScore}
                        </Typography>
                      </Box>
                    )}
                    {aiScore !== null && humanScore !== null && (
                      <Box
                        sx={{
                          width: '1px',
                          height: '16px',
                          background: 'rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    )}
                    {humanScore !== null && (
                      <Box
                        sx={{
                          background: 'rgba(255, 59, 48, 0.1)',
                          borderRadius: '16px',
                          px: 1.5,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          border: '1px solid rgba(255, 59, 48, 0.2)',
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: '#FF3B30',
                            boxShadow: '0 0 4px rgba(255, 59, 48, 0.5)',
                          }}
                        />
                        <Typography
                          sx={{
                            color: '#FF3B30',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {humanScore}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                );
              })()}
            </Stack>

            <Box sx={{ position: 'relative' }}>
              <video
                src={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  WebkitPlaysInline: true,
                  playsInline: true
                }}
                autoPlay
                muted
                loop
                playsInline
                defaultMuted
                onClick={(e) => {
                  const video = e.target;
                  if (video.webkitEnterFullscreen) {
                    video.webkitEnterFullscreen();
                  } else if (video.requestFullscreen) {
                    video.requestFullscreen();
                  }
                }}
              />
              {video.videoComments && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  {(() => {
                    const { aiScore, humanScore } = getCommentScores(video.videoComments);
                    return (
                      <>
                        {aiScore !== null && (
                          <Box
                            sx={{
                              background: 'rgba(0, 0, 0, 0.6)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '20px',
                              padding: '8px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#5856D6',
                                boxShadow: '0 0 8px rgba(88, 86, 214, 0.5)',
                              }}
                            />
                            <Typography
                              sx={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              }}
                            >
                              AI: {aiScore}
                            </Typography>
                          </Box>
                        )}
                        {humanScore !== null && (
                          <Box
                            sx={{
                              background: 'rgba(0, 0, 0, 0.6)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '20px',
                              padding: '8px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: '#FF3B30',
                                boxShadow: '0 0 8px rgba(255, 59, 48, 0.5)',
                              }}
                            />
                            <Typography
                              sx={{
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              }}
                            >
                              Human: {humanScore}
                            </Typography>
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
                  fullWidth
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={() => setSelectedVideo(video)}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Comments
                </Button>
                <Button
                  fullWidth
                  startIcon={<ShareIcon />}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Share
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box
        ref={ref}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {loading && <CircularProgress size={24} />}
      </Box>

      <CommentsDrawer 
        open={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        comments={selectedVideo?.videoComments} 
      />
    </Box>
  );
};

export default Feed;
