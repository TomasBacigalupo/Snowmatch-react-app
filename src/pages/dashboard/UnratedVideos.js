import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, SwipeableDrawer, Box, TextField, Rating, Avatar, ListItemAvatar, Paper, IconButton, Divider } from '@mui/material';
import { FormProvider, RHFEditor, RHFTextField, RHFSlider } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { GridCloseIcon } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'src/redux/store';
import { getVideosToReview, reviewVideo } from 'src/redux/slices/video';
import { LoadingButton } from '@mui/lab';
import ReactPlayer from 'react-player';
import { ArrowBack } from '@mui/icons-material';
import VideoReviewDrawer from 'src/components/VideoReviewDrawer';
import { RateReview } from '@mui/icons-material';
import { CheckCircle } from '@mui/icons-material';

// This would typically come from your backend
const mockUnratedVideos = [
  { id: 1, title: 'Beginner Ski Lesson', uploadDate: '2023-05-07', videoUrl: 'https://example.com/video1.mp4', preview: "https://example.com/video1.mp4", uploadedBy: 'John Doe' },
  { id: 2, title: 'Intermediate Snowboarding', uploadDate: '2023-05-08', videoUrl: 'https://example.com/video2.mp4', uploadedBy: 'Jane Smith' },
  { id: 3, title: 'Expert Tricks', uploadDate: '2023-05-09', videoUrl: 'https://example.com/video3.mp4', uploadedBy: 'Alice Johnson' },
];

export default function UnratedVideos() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const drawerContentRef = useRef(null);
  const dispatch = useDispatch()
  const { videosToReview, isLoadingReview } = useSelector((state) => state.video);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats] = useState({
    videosReviewed: 24,
    videosRemaining: videosToReview?.length || 0,
    contributionRank: "Silver Reviewer"
  });

  useEffect(() => {
    dispatch(getVideosToReview());
  }, [dispatch]);

  const [isScrolled, setIsScrolled] = useState(false);


  const handleRate = (video) => {
    setSelectedVideo(video);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedVideo(null);
    setRating(0);
    setComment('');
  };

  const handleSubmitRating = (data) => {
    setLoading(true)
    dispatch(reviewVideo({
      id: selectedVideo.id,
      comment: data.comment,
      score: data.score,
      reviewed: true,
      goodAspects: data.goodAspects,
      errors: data.badAspects,
      toImprove: data.howToImprove
    }))
  };

  useEffect(() => {
    if (!isLoadingReview) {
      setLoading(false)
      handleCloseDrawer()
    }
  }, [isLoadingReview])

  useEffect(() => {
    const handleDrawerScroll = () => {
      if (drawerContentRef.current) {
        setIsScrolled(drawerContentRef.current.scrollTop > 0);
      }
    };

    if (drawerContentRef.current) {
      drawerContentRef.current.addEventListener("scroll", handleDrawerScroll);
    }

    return () => {
      if (drawerContentRef.current) {
        drawerContentRef.current.removeEventListener("scroll", handleDrawerScroll);
      }
    };
  }, [drawerOpen]);

  const NewBlogSchema = Yup.object().shape({
    comment: Yup.string().required('Leave a comment'),
    score: Yup.number().required('dejale un puntaje al video')
  });

  const defaultValues = {
    comment: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
  } = methods;

  const score = watch("score")

  return (
    <Container maxWidth="lg">
      {/* New Header Section */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6, 
        pt: 4,
        pb: 3,
        borderBottom: '1px solid #eee'
      }}>
        <Typography variant="h4" gutterBottom>
          Rate Student Videos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Help improve skiing education by reviewing student techniques. Your expertise makes a difference!
        </Typography>
        
        {/* Stats Bar */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4,
          mt: 3 
        }}>
          <Box>
            <Typography variant="h6">{stats.videosReviewed}</Typography>
            <Typography variant="body2" color="text.secondary">Videos Reviewed</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{stats.videosRemaining}</Typography>
            <Typography variant="body2" color="text.secondary">Pending Reviews</Typography>
          </Box>
          <Box>
            <Typography variant="h6">{stats.contributionRank}</Typography>
            <Typography variant="body2" color="text.secondary">Your Rank</Typography>
          </Box>
        </Box>
      </Box>

      {/* Improved Video Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
        mb: 4 
      }}>
        {videosToReview?.map((video) => (
          <Paper
            key={video.id}
            elevation={2}
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
          >
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
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                p: 2,
                color: 'white'
              }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {video.course}
                </Typography>
                <Typography variant="body2">
                  By {video.user.name}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Skill Level: {video.skillLevel || 'Intermediate'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration: {video.duration || '2:30'}
              </Typography>
              
              <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                onClick={() => handleRate(video)}
                sx={{ 
                  mt: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
                startIcon={<RateReview />}
              >
                Provide Feedback
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Empty State */}
      {(!videosToReview || videosToReview.length === 0) && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          color: 'text.secondary' 
        }}>
          <CheckCircle sx={{ fontSize: 60, mb: 2, color: 'success.main' }} />
          <Typography variant="h6">All Caught Up!</Typography>
          <Typography variant="body2">
            You've reviewed all available videos. Check back later for more.
          </Typography>
        </Box>
      )}

      {/* Existing VideoReviewDrawer */}
      <VideoReviewDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        selectedVideo={selectedVideo}
        loading={loading}
        methods={methods}
        onSubmit={handleSubmit(handleSubmitRating)}
      />
    </Container>
  );
}