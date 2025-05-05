import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
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
        {comments.map((comment) => (
          <Box key={comment.id} sx={{ mb: 3 }}>
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
                mt: 1,
                color: 'text.secondary',
                fontSize: '0.875rem',
                lineHeight: 1.6,
              }}
            >
              {comment.comment}
            </Markdown>
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
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { ref, inView } = useInView();

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
    <Box sx={{ maxWidth: 680, mx: 'auto', py: 1, backgroundColor: 'lightgray' }}>
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
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}
                >
                  {video.user.name} {video.user.lastname}
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
            </Stack>

            <Box sx={{ position: 'relative' }}>
            <Box sx={{ position: 'relative' }}>
              <video
                src={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                }}
                autoPlay
                muted
                loop
                playsInline
                defaultMuted
              />
            </Box>
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
