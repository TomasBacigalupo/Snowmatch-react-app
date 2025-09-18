/**
 * Record Screen for the Ski Activity Recorder
 * Main interface for starting, pausing, and monitoring ski activity recording
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Fab,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Fade,
  Slide,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Save,
  Delete,
  LocationOn,
  Speed,
  Timer,
  TrendingDown,
  TrendingUp,
  RadioButtonChecked,
  RadioButtonUnchecked,
  Terrain,
  Directions,
} from '@mui/icons-material';
import { useSkiRecorder } from '../lib/recorder/useSkiRecorder';
import { 
  SpeedCard, 
  DistanceCard, 
  DurationCard, 
  VerticalCard, 
  SegmentCard,
  CurveCountCard,
  AverageSpeedCard
} from '../components/skiRecorder/StatCard';
import { LazyMapboxTrack } from '../components/skiRecorder/MapboxTrack';
import { speedMsToKmh } from '../lib/geo/haversine';

export const RecordScreen = () => {
  const theme = useTheme();
  const {
    status,
    currentActivity,
    currentSegment,
    samples,
    segments,
    metrics,
    startRecording,
    pauseRecording,
    resumeRecording,
    finishRecording,
    discardRecording,
  } = useSkiRecorder();

  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleStartRecording = async () => {
    try {
      setError(null);
      await startRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  };

  const handlePauseRecording = () => {
    try {
      pauseRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause recording');
    }
  };

  const handleResumeRecording = async () => {
    try {
      setError(null);
      await resumeRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume recording');
    }
  };

  const handleFinishRecording = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await finishRecording(notes.trim() || undefined);
      setShowFinishDialog(false);
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finish recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDiscardRecording = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await discardRecording();
      setShowDiscardDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to discard recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'recording': return 'success';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'recording': return 'Recording';
      case 'paused': return 'Paused';
      default: return 'Ready';
    }
  };

  const formatSpeed = (speedMs) => speedMsToKmh(speedMs);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: status === 'recording' 
        ? 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      transition: 'background 0.5s ease-in-out',
      py: 2
    }}>
      <Container maxWidth="lg">
        {/* Header with Status */}
        <Fade in timeout={800}>
          <Card sx={{ 
            mb: 3, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" component="h1" sx={{ 
                  fontWeight: 700,
                  color: status === 'recording' ? '#ffffff' : '#1a1a1a',
                  transition: 'color 0.3s ease-in-out'
                }}>
                  🎿 Ski Tracker
                </Typography>
                
                <Box display="flex" alignItems="center" gap={2}>
                  {status === 'recording' && (
                    <Zoom in timeout={500}>
                      <Avatar sx={{ 
                        bgcolor: '#ff4444',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)', opacity: 1 },
                          '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                          '100%': { transform: 'scale(1)', opacity: 1 }
                        }
                      }}>
                        <RadioButtonChecked />
                      </Avatar>
                    </Zoom>
                  )}
                  
                  <Chip
                    label={getStatusText()}
                    color={getStatusColor()}
                    icon={status === 'recording' ? <RadioButtonChecked /> : <LocationOn />}
                    variant="filled"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1
                    }}
                  />
                </Box>
              </Box>

              {currentActivity && (
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                  Session ID: {currentActivity.id.slice(-8).toUpperCase()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Fade>

        {/* Error Alert */}
        {error && (
          <Slide direction="down" in timeout={300}>
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Slide>
        )}

        {/* Main Control Panel */}
        <Slide direction="up" in timeout={600}>
          <Card sx={{ 
            mb: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" justifyContent="center" alignItems="center" gap={3} mb={4}>
                {status === 'idle' && (
                  <Zoom in timeout={800}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={handleStartRecording}
                      sx={{ 
                        minWidth: 200,
                        height: 60,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                        boxShadow: '0 8px 32px rgba(254, 107, 139, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(254, 107, 139, 0.4)'
                        },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      Start Recording
                    </Button>
                  </Zoom>
                )}

                {status === 'recording' && (
                  <>
                    <Zoom in timeout={500}>
                      <Button
                        variant="contained"
                        color="warning"
                        size="large"
                        startIcon={<Pause />}
                        onClick={handlePauseRecording}
                        sx={{ 
                          minWidth: 160,
                          height: 50,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Pause
                      </Button>
                    </Zoom>
                    <Zoom in timeout={700}>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<Save />}
                        onClick={() => setShowFinishDialog(true)}
                        sx={{ 
                          minWidth: 160,
                          height: 50,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Finish
                      </Button>
                    </Zoom>
                  </>
                )}

                {status === 'paused' && (
                  <>
                    <Zoom in timeout={500}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<PlayArrow />}
                        onClick={handleResumeRecording}
                        sx={{ 
                          minWidth: 160,
                          height: 50,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Resume
                      </Button>
                    </Zoom>
                    <Zoom in timeout={700}>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        startIcon={<Save />}
                        onClick={() => setShowFinishDialog(true)}
                        sx={{ 
                          minWidth: 160,
                          height: 50,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Finish
                      </Button>
                    </Zoom>
                    <Zoom in timeout={900}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="large"
                        startIcon={<Delete />}
                        onClick={() => setShowDiscardDialog(true)}
                        sx={{ 
                          minWidth: 160,
                          height: 50,
                          borderRadius: 3,
                          fontWeight: 600
                        }}
                      >
                        Discard
                      </Button>
                    </Zoom>
                  </>
                )}
              </Box>

              {/* Recording Progress */}
              {status !== 'idle' && (
                <Fade in timeout={800}>
                  <Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        Recording Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {metrics.duration > 0 ? `${(metrics.duration / 3600000).toFixed(1)}h` : 'Starting...'}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={metrics.duration > 0 ? Math.min((metrics.duration / 3600000) * 100, 100) : 0}
                      sx={{ 
                        height: 12, 
                        borderRadius: 6,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 6,
                          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
                        }
                      }}
                    />
                  </Box>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Slide>

        {/* Live Stats Grid */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in timeout={800}>
              <Box>
                <CurveCountCard curveCount={metrics.curveCount} />
              </Box>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in timeout={1000}>
              <Box>
                <AverageSpeedCard 
                  avgSpeed={formatSpeed(metrics.avgSpeed)}
                  maxSpeed={formatSpeed(metrics.maxSpeed)}
                />
              </Box>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in timeout={1200}>
              <Box>
                <DistanceCard distance={metrics.distance} />
              </Box>
            </Zoom>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Zoom in timeout={1400}>
              <Box>
                <DurationCard duration={metrics.duration} />
              </Box>
            </Zoom>
          </Grid>
        </Grid>

        {/* Additional Info Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1600}>
              <Box>
                <SegmentCard kind={metrics.currentSegmentKind} />
              </Box>
            </Zoom>
          </Grid>
          <Grid item xs={12} md={6}>
            <Zoom in timeout={1800}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LocationOn />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      GPS Samples
                    </Typography>
                  </Box>
                  <Typography variant="h3" color="primary" fontWeight={700} mb={1}>
                    {metrics.sampleCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    GPS points collected
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* Live Map */}
        {status !== 'idle' && (
          <Zoom in timeout={2000}>
            <Card sx={{ 
              mb: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <Terrain />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Live Track
                  </Typography>
                </Box>
                <LazyMapboxTrack
                  samples={samples}
                  segments={segments}
                  height={300}
                  showSegmentColors={true}
                  fitBounds={true}
                />
              </CardContent>
            </Card>
          </Zoom>
        )}

        {/* Floating Action Button for quick access */}
        {status === 'recording' && (
          <Zoom in timeout={1000}>
            <Fab
              color="error"
              aria-label="pause"
              sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: 64,
                height: 64,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)' },
                  '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)' },
                  '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)' }
                }
              }}
              onClick={handlePauseRecording}
            >
              <Pause />
            </Fab>
          </Zoom>
        )}
      </Container>

      {/* Finish Recording Dialog */}
      <Dialog 
        open={showFinishDialog} 
        onClose={() => setShowFinishDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          🎿 Finish Recording
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Add any notes about your ski session to remember this amazing run!
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Notes (optional)"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Great conditions, challenging terrain, perfect powder, etc."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#FE6B8B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FE6B8B',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setShowFinishDialog(false)} 
            disabled={isProcessing}
            variant="outlined"
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFinishRecording} 
            variant="contained" 
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Save />}
            sx={{ 
              borderRadius: 2,
              minWidth: 140,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
              }
            }}
          >
            {isProcessing ? 'Saving...' : 'Save Recording'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Discard Recording Dialog */}
      <Dialog 
        open={showDiscardDialog} 
        onClose={() => setShowDiscardDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          color: 'error.main',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          ⚠️ Discard Recording
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" color="text.primary" gutterBottom>
            Are you sure you want to discard this recording?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone and all your progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setShowDiscardDialog(false)} 
            disabled={isProcessing}
            variant="outlined"
            sx={{ borderRadius: 2, minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDiscardRecording} 
            color="error" 
            variant="contained"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <Delete />}
            sx={{ borderRadius: 2, minWidth: 120 }}
          >
            {isProcessing ? 'Discarding...' : 'Discard'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
