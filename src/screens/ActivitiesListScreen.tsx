/**
 * Activities List Screen - Shows all ski tracking activities
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Fab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
} from '@mui/material';
import {
  Add,
  Directions,
  Speed,
  Timer,
  TrendingDown,
  TrendingUp,
  Visibility,
  Delete,
} from '@mui/icons-material';
import { skiRecorderDB } from '../lib/db/sqlite';
import { Activity } from '../lib/types/skiRecorder';
import { speedMsToKmh } from '../lib/geo/haversine';

interface ActivitiesListScreenProps {
  onNavigateToRecord?: () => void;
  onNavigateToDetail?: (activityId: string) => void;
}

export const ActivitiesListScreen: React.FC<ActivitiesListScreenProps> = ({
  onNavigateToRecord,
  onNavigateToDetail,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database if needed
      if (!(await skiRecorderDB.isInitialized())) {
        await skiRecorderDB.initialize();
      }
      
      const allActivities = await skiRecorderDB.getAllActivities();
      setActivities(allActivities);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await skiRecorderDB.deleteActivity(activityId);
        setActivities(activities.filter(a => a.id !== activityId));
      } catch (err) {
        console.error('Failed to delete activity:', err);
        setError('Failed to delete activity');
      }
    }
  };

  const getActivityStatus = (activity: Activity) => {
    if (!activity.endedAt) {
      return { label: 'En Progreso', color: 'warning' as const };
    }
    return { label: 'Completada', color: 'success' as const };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando actividades...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            No se pudieron cargar las actividades
          </Typography>
          <button onClick={loadActivities} style={{ marginTop: '16px' }}>
            Reintentar
          </button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          🎿 Mis Actividades de Esquí
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Revisa todas tus sesiones de esquí grabadas
        </Typography>
      </Box>

      {/* Stats Summary */}
      {activities.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Resumen Total
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {activities.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Actividades
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  {(activities.reduce((sum, a) => sum + a.totalDistanceM, 0) / 1000).toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  KM Totales
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">
                  {speedMsToKmh(activities.reduce((sum, a) => sum + a.maxSpeedMs, 0) / activities.length).toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vel. Prom. (km/h)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {formatDuration(activities.reduce((sum, a) => sum + (a.endedAt ? a.endedAt - a.startedAt : 0), 0))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tiempo Total
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Activities List */}
      {activities.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No tienes actividades grabadas aún
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comienza una nueva sesión de esquí para ver tus estadísticas aquí
          </Typography>
          <button 
            onClick={onNavigateToRecord}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Comenzar Grabación
          </button>
        </Paper>
      ) : (
        <List>
          {activities.map((activity, index) => {
            const status = getActivityStatus(activity);
            const duration = activity.endedAt ? activity.endedAt - activity.startedAt : 0;
            
            return (
              <React.Fragment key={activity.id}>
                <ListItem
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                  }}
                  onClick={() => onNavigateToDetail?.(activity.id)}
                >
                  <Card sx={{ width: '100%', mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            Sesión de Esquí #{activities.length - index}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(activity.startedAt)}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={status.label}
                            color={status.color}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteActivity(activity.id);
                            }}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Directions color="primary" fontSize="small" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Distancia
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {(activity.totalDistanceM / 1000).toFixed(2)} km
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Speed color="success" fontSize="small" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Vel. Máx
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {speedMsToKmh(activity.maxSpeedMs).toFixed(1)} km/h
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Timer color="info" fontSize="small" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Duración
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {formatDuration(duration)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <TrendingDown color="error" fontSize="small" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Descenso
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {activity.totalDescentM.toFixed(0)} m
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {activity.notes && (
                        <Box mt={2}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "{activity.notes}"
                          </Typography>
                        </Box>
                      )}

                      <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Chip
                          icon={<Visibility />}
                          label="Ver Detalles"
                          color="primary"
                          variant="outlined"
                          clickable
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
                {index < activities.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={onNavigateToRecord}
      >
        <Add />
      </Fab>
    </Container>
  );
};