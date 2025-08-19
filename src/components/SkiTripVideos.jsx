import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Chip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from './Iconify';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: '#fafafa',
  position: 'relative',
}));

const VideoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 20,
  background: '#ffffff',
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    border: '1px solid #e0e0e0',
    '& .play-button': {
      transform: 'scale(1.1)',
      backgroundColor: 'rgba(24, 144, 255, 0.9)',
    },
  },
}));

const VideoThumbnail = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
  },
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  zIndex: 2,
  backgroundColor: 'rgba(24, 144, 255, 0.8)',
  color: 'white',
  width: 60,
  height: 60,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(24, 144, 255, 0.9)',
    transform: 'scale(1.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#000000',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: '#666666',
  maxWidth: 700,
  margin: '0 auto',
  fontSize: '1.2rem',
  lineHeight: 1.6,
  fontWeight: 400,
}));

const VideoDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    maxWidth: '90vw',
    maxHeight: '90vh',
    width: 'auto',
    height: 'auto',
  },
}));

const SkiTripVideos = ({ videos, destination }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <SectionTitle variant="h2">
            Videos de {destination}
          </SectionTitle>
          <SectionSubtitle variant="h5">
            Descubre la experiencia de esquiar en este destino increíble
          </SectionSubtitle>
        </Box>

        <Grid container spacing={4}>
          {videos.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <VideoCard onClick={() => handleVideoClick(video)}>
                <VideoThumbnail
                  sx={{
                    backgroundImage: `url(${video.thumbnail})`,
                  }}
                >
                  <PlayButton className="play-button">
                    <PlayArrowIcon sx={{ fontSize: 30 }} />
                  </PlayButton>
                </VideoThumbnail>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#000000',
                          fontSize: '1.1rem',
                          mb: 1,
                        }}
                      >
                        {video.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666666',
                          lineHeight: 1.5,
                          fontSize: '0.9rem',
                        }}
                      >
                        {video.description}
                      </Typography>
                    </Box>
                    {video.duration && (
                      <Chip
                        label={video.duration}
                        size="small"
                        sx={{
                          backgroundColor: '#1890FF',
                          color: 'white',
                          fontWeight: 600,
                          alignSelf: 'flex-start',
                        }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </VideoCard>
            </Grid>
          ))}
        </Grid>

        <VideoDialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            {selectedVideo && (
              <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
                <video
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    borderRadius: 16,
                  }}
                >
                  <source src={selectedVideo.url} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
                <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#000000', mb: 1 }}>
                    {selectedVideo.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666666' }}>
                    {selectedVideo.description}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
        </VideoDialog>
      </Container>
    </RootStyle>
  );
};

export default SkiTripVideos; 