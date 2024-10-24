import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, SwipeableDrawer, Box, TextField, Rating, Avatar } from '@mui/material';

// This would typically come from your backend
const mockUnratedVideos = [
  { id: 1, title: 'Beginner Ski Lesson', uploadDate: '2023-05-07', videoUrl: 'https://example.com/video1.mp4', uploadedBy: 'John Doe' },
  { id: 2, title: 'Intermediate Snowboarding', uploadDate: '2023-05-08', videoUrl: 'https://example.com/video2.mp4', uploadedBy: 'Jane Smith' },
  { id: 3, title: 'Expert Tricks', uploadDate: '2023-05-09', videoUrl: 'https://example.com/video3.mp4', uploadedBy: 'Alice Johnson' },
];

export default function UnratedVideos() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Unrated Videos
      </Typography>
      <List>
        {mockUnratedVideos.map((video) => (
          <ListItem key={video.id}>
            <ListItemText
              primary={video.title}
              secondary={`Uploaded on: ${video.uploadDate}`}
            />
            <ListItemSecondaryAction>
              <Button variant="contained" color="primary" onClick={() => handleRate(video)}>
                Rate
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
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
          },
        }}
      >
        <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
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
              <TextField
                label="Comment"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mt: 2 }}
              />
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
                sx={{ mt: 2 }}
                fullWidth
              >
                Submit Rating
              </Button>
            </>
          )}
        </Box>
      </SwipeableDrawer>
    </Container>
  );
}