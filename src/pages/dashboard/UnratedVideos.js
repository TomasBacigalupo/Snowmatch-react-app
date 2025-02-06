import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, SwipeableDrawer, Box, TextField, Rating, Avatar, ListItemAvatar, Paper, IconButton, Divider } from '@mui/material';
import { FormProvider, RHFEditor } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { GridCloseIcon } from '@mui/x-data-grid';

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

  const handleSubmitRating = () => {
    // Implement rating submission logic here
    console.log('Rating video with id:', selectedVideo.id, 'Rating:', rating, 'Comment:', comment);
    handleCloseDrawer();
  };

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
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    content: Yup.string().min(1000).required('Content is required'),
    cover: Yup.mixed().required('Cover is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    content: '',
    cover: null,
    tags: ['Logan'],
    publish: true,
    comments: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ['Logan'],
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
        {mockUnratedVideos.map((video) => (
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
            {/* Contenedor de avatar + texto en la misma fila */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  src={video.thumbnail}
                  alt={video.title}
                  sx={{ width: 120, height: 120, borderRadius: 2 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={video.title}
                secondary={`Uploaded on: ${video.uploadDate}`}
                sx={{
                  marginLeft: 2,
                  '& .MuiTypography-root': {
                    fontWeight: 600,
                  },
                }}
              />
            </Box>

            {/* Botón en la esquina inferior derecha */}
            <Box sx={{ position: 'absolute', right: 20, bottom: 20, display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
              <Button fullWidth variant="contained" color="primary" onClick={() => handleRate(video)}>
                Rate
              </Button>
            </Box>
          </Paper>
        ))}
      </List>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onOpen={() => { }}
        PaperProps={{
          sx: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            paddingTop:'env(safe-area-inset-top)'
          },
        }}
      >

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mx={1}
          mb={0}
          px={2}
          py={1}
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "1px solid #ddd",
            zIndex: 10,
          }}
        >
          {/* Contenedor para centrar el video */}
          <Box flexGrow={1} display="flex" justifyContent="center">
            ReviewVideo
          </Box>

          {/* Botón de cierre alineado a la derecha */}
          <IconButton edge="end" color="inherit" onClick={handleCloseDrawer} aria-label="close">
            <GridCloseIcon />
          </IconButton>
        </Box>

        {/* Divider para efecto Airbnb */}

        <FormProvider methods={methods} onSubmit={handleSubmit(() => { })}>


          <Box ref={drawerContentRef} sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            {selectedVideo && (
              <>
                <Typography variant="h6" gutterBottom>
                  {selectedVideo.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar alt={selectedVideo.uploadedBy} src={selectedVideo.avatarUrl} sx={{ mr: 2 }} />
                  <Typography variant="body1">
                    Uploaded by {selectedVideo.uploadedBy}
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: 2 }}>
                  <video style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} controls>
                    <source src={selectedVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
                <RHFEditor simple={true} name="content1" />
                <Rating
                  name="video-rating"
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitRating}
                  sx={{ py:2, mt: 2 }}
                  fullWidth
                >
                  Submit Rating
                </Button>
              </>
            )}
          </Box>
        </FormProvider>
      </SwipeableDrawer>
    </Container>
  );
}