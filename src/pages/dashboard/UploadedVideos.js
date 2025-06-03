import React, { useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'src/redux/store';
import { getVideos } from 'src/redux/slices/video';
import { useSelector } from 'react-redux';
import useAuth from 'src/hooks/useAuth';

// This would typically come from your backend
const mockVideos = [
  { id: 1, title: 'Ski Lesson 1', uploadDate: '2023-05-01' },
  { id: 2, title: 'Snowboard Tutorial', uploadDate: '2023-05-03' },
  { id: 3, title: 'Advanced Techniques', uploadDate: '2023-05-05' },
];

export default function UploadedVideos() {
  const {videos} = useSelector((state) => state.video);
  const dispatch = useDispatch();
  const {user} = useAuth();
  useEffect(() => {
    user && dispatch(getVideos());
  }, [dispatch]);
  const handleDelete = (id) => {
    // Implement delete logic here
    console.log('Deleting video with id:', id);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Mi progreso
      </Typography>
      <List>
        {videos.map((video) => (
          <ListItem key={video.id}>
            <ListItemText
              primary={video.title}
              secondary={`Uploaded on: ${video.uploadDate}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(video.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}