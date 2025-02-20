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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Unrated Videos
      </Typography>
      <List>
        {videosToReview?.map((video) => (
          <Paper
            key={video.id}
            elevation={3}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              padding: 2,
              borderRadius: 2,
              border: '1px solid #ddd',
              marginBottom: 2,
              minHeight: 150, // Ajusta según necesidad
            }}
          >
            {/*  "comment": "Postura para velocidad: Si buscas más velocidad, inclina el cuerpo hacia adelante y mantén los esquís paralelos y bien alineados.",
    "course": "BUMPS",
    "id": 11,
    "reviewed": true,
    "score": 67.0,
    "userId": 9,
    "videoUrl": "9-8a1f2faa-039b-4940-b504-094b7d6bcdc9" */}
            {/* Contenedor de avatar + texto en la misma fila */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <video
                src={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px', // Equivalent to `rounded-xl` in Tailwind (12px)
                }}
                autoPlay
                muted
                loop
                playsInline
                defaultMuted
              />

            </Box>
            <ListItemText
              primary={video.course}
              secondary={`Uploaded by: ${video.user.name}`}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: 600,
                },
              }}
            />
            {/* Botón en la esquina inferior derecha */}
            <Button fullWidth variant="contained" color="primary" onClick={() => handleRate(video)}>
              Rate
            </Button>
          </Paper>
        ))}
      </List>
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onOpen={() => { }}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            height: '100%',
            maxHeight: '100%',
            paddingTop: 'env(safe-area-inset-bottom)',
            width: '100vw',
            maxWidth: '100%',
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          mt={2}
          mx={2}
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "2px solid #EBEBEB",
            zIndex: 10,
          }}

        >

          {/* Botón de cierre - Alineado a la izquierda */}
          <Box mr="auto">
            <IconButton edge="start" color="inherit" onClick={handleCloseDrawer} aria-label="close">
              <ArrowBack />
            </IconButton>
          </Box>

          {/* Título del curso - Centrado basado en su propio tamaño */}
          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 600,
              color: "#222222" // Color oscuro como Airbnb 
            }}
          >
            Rate Video
          </Typography>
        </Box>




        {/* Divider para efecto Airbnb */}

        <FormProvider methods={methods} onSubmit={handleSubmit(handleSubmitRating)}>

          <Box ref={drawerContentRef} sx={{ flex: 1, p: 2, overflow: 'auto' }}>
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
                <Box mb={2}>
                  {!isPlaying ? (
                    <Box
                      position="relative"
                      width="100%"
                      maxHeight="300px"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setIsPlaying(true)}
                    >
                      {/* Thumbnail Image */}
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
                      {/* Play Button Overlay */}
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
                      style={{ maxHeight: '300px', maxWidth: '100%', }}
                      onPause={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                    />
                  )}
                </Box>
                <RHFSlider valueLabelDisplay="on" label="Score" name="score" />
                <RHFEditor simple={true} name="comment" />
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={loading}
                  sx={{ ':hover': { color: '#3399FF' }, py: 2, mt: 2 }}>
                  Review
                </LoadingButton>
              </>
            )}
          </Box>
        </FormProvider>
      </SwipeableDrawer>
    </Container>
  );
}