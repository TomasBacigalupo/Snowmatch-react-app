import { Avatar, Box, Button, Card, CardContent, Stack, Switch, Typography } from "@mui/material";
import { useState } from "react";
import VideoPlayer from 'src/components/video-player';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';

import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function FeedCard({ video, setSelectedVideo, onInstructorClick }) {
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const getCommentScores = (comments) => {
        if (!comments?.length) return { aiScore: null, humanScore: null };
    
        const aiComment = comments.find(comment => comment.aiComment);
        const humanComment = comments.find(comment => !comment.aiComment);
    
        return {
          aiScore: aiComment?.score || null,
          humanScore: humanComment?.score || null
        };
      };
    return (
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
              <Stack direction="row" spacing={1} alignItems="center">
                <AnalyticsIcon 
                  sx={{ 
                    fontSize: '1.2rem',
                    color: 'black',
                    opacity: analyticsEnabled[video.id] ? 1 : 0.5
                  }} 
                />
                <Switch
                  size="small"
                  checked={analyticsEnabled}
                  onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
                />
              </Stack>
            </Stack>

            <Box sx={{ position: 'relative' }}>
              <video
                src={analyticsEnabled 
                  ? `${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${video.videoUrl}.mp4`
                  : `${process.env.REACT_APP_VIDEO_BUCKET_URL}/${video.videoUrl}`
                }
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
                    left: 0,
                    right: 0,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'space-between',
                    px: 2,
                  }}
                >
                  {(() => {
                    const { aiScore, humanScore } = getCommentScores(video.videoComments);
                    const aiComment = video.videoComments.find(comment => comment.aiComment);
                    const humanComment = video.videoComments.find(comment => !comment.aiComment);
                    return (
                      <>
                        {aiScore !== null && (
                          <Box
                            sx={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '30px',
                              px: 2,
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                            onClick={() => {console.log("click"); onInstructorClick(aiComment?.user)}}
                          >
                            <Avatar
                              src="/assets/avatars/snow-ai.png"
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                              <Typography
                                sx={{
                                  color: 'text.primary',
                                  fontSize: '1.1rem',
                                  fontWeight: 600,
                                }}
                              >
                                Snow: {aiScore}
                              </Typography>
                              <Typography
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  opacity: 0.8,
                                }}
                              >
                                pts
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        {humanScore !== null && (
                          <Box
                            onClick={() => onInstructorClick(humanComment?.user)}
                            sx={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              backdropFilter: 'blur(8px)',
                              borderRadius: '30px',
                              px: 2,
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              cursor: 'pointer',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.95)',
                              }
                            }}
                          >
                            <Avatar
                              src={humanComment?.user.imageS3}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                              <Typography
                                sx={{
                                  color: 'text.primary',
                                  fontSize: '1.1rem',
                                  fontWeight: 600,
                                }}
                              >
                                {humanComment?.user.name}: {humanScore}
                              </Typography>
                              <Typography
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  opacity: 0.8,
                                }}
                              >
                                pts
                              </Typography>
                            </Box>
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
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'SnowMatch',
                        text: 'Check out SnowMatch - Your Skiing Performance App!',
                        url: window.location.origin
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.origin);
                      // You might want to add a toast notification here
                    }
                  }}
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Share App
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
    )
}