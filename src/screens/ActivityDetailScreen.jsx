/**
 * Activity Detail Screen - Shows detailed information about a specific ski activity
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
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  Directions,
  Speed,
  Timer,
  TrendingDown,
  TrendingUp,
  Delete,
} from '@mui/icons-material';
import { skiRecorderDB } from '../lib/db/sqlite';
import { speedMsToKmh } from '../lib/geo/haversine';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const ActivityDetailScreen = ({
  activityId,
  onBack,
}) => {
  const [activity, setActivity] = useState(null);
  const [segments, setSegments] = useState([]);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadActivityData();
  }, [activityId]);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database if needed
      if (!(await skiRecorderDB.isInitialized())) {
        await skiRecorderDB.initialize();
      }
      
      // Load activity, segments, and samples in parallel
      const [activityData, segmentsData, samplesData] = await Promise.all([
        skiRecorderDB.getActivity(activityId),
        skiRecorderDB.getSegmentsByActivity(activityId),
        skiRecorderDB.getSamplesByActivity(activityId),
      ]);

      if (!activityData) {
        throw new Error('Activity not found');
      }

      setActivity(activityData);
      setSegments(segmentsData);
      setSamples(samplesData);
    } catch (err) {
      console.error('Failed to load activity data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async () => {
    if (!activity) return;
    
    try {
      await skiRecorderDB.deleteActivity(activity.id);
      setShowDeleteDialog(false);
      onBack?.();
    } catch (err) {
      console.error('Failed to delete activity:', err);
      setError('Failed to delete activity');
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const getSegmentColor = (kind) => {
    switch (kind) {
      case 'DOWNHILL': return 'error';
      case 'UPHILL': return 'success';
      default: return 'default';
    }
  };

  const getSegmentIcon = (kind) => {
    switch (kind) {
      case 'DOWNHILL': return <TrendingDown />;
      case 'UPHILL': return <TrendingUp />;
      default: return <Timer />;
    }
  };

  const getSegmentText = (kind) => {
    switch (kind) {
      case 'DOWNHILL': return 'Bajada';
      case 'UPHILL': return 'Subida/Lift';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando detalles de la actividad...
        </Typography>
      </Container>
    );
  }

  if (error || !activity) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">
            {error ? 'Error' : 'Actividad no encontrada'}
          </Typography>
        </Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'La actividad solicitada no existe'}
        </Alert>
        <Button variant="contained" onClick={onBack}>
          Volver a la lista
        </Button>
      </Container>
    );
  }

  const duration = activity.endedAt ? activity.endedAt - activity.startedAt : 0;
  const downhillSegments = segments.filter(s => s.kind === 'DOWNHILL');
  const uphillSegments = segments.filter(s => s.kind === 'UPHILL');

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" component="h1">
            Detalles de la Actividad
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formatDate(activity.startedAt)}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => setShowDeleteDialog(true)} color="error">
            <Delete />
          </IconButton>
        </Box>
      </Box>

      {/* Activity Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumen de la Actividad
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Directions color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {(activity.totalDistanceM / 1000).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                km recorridos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Speed color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {speedMsToKmh(activity.maxSpeedMs).toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                km/h máximo
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Timer color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {formatDuration(duration)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                duración total
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <TrendingDown color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="error.main">
                {activity.totalDescentM.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                m de descenso
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Stats */}
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Velocidad promedio: <strong>{speedMsToKmh(activity.avgSpeedMs).toFixed(1)} km/h</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Ascenso total: <strong>{activity.totalAscentM.toFixed(0)} m</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Tiempo bajando: <strong>{formatDuration(activity.downhillTimeMs)}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Tiempo subiendo: <strong>{formatDuration(activity.uphillTimeMs)}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {activity.notes && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Notas
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: 'italic', p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              "{activity.notes}"
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Segmentos" />
          <Tab label="Puntos GPS" />
        </Tabs>
      </Box>

      {/* Segments Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Segmentos de la Actividad ({segments.length} total)
        </Typography>
        
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingDown color="error" />
                <Typography variant="h6">Bajadas</Typography>
              </Box>
              <Typography variant="h4" color="error.main">
                {downhillSegments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDuration(downhillSegments.reduce((sum, s) => sum + (s.endedAt ? s.endedAt - s.startedAt : 0), 0))} total
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp color="success" />
                <Typography variant="h6">Subidas/Lifts</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {uphillSegments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDuration(uphillSegments.reduce((sum, s) => sum + (s.endedAt ? s.endedAt - s.startedAt : 0), 0))} total
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <List>
          {segments.map((segment, index) => {
            const segmentDuration = segment.endedAt ? segment.endedAt - segment.startedAt : 0;
            return (
              <React.Fragment key={segment.id}>
                <ListItem>
                  <Card sx={{ width: '100%' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          {getSegmentIcon(segment.kind)}
                          <Box>
                            <Typography variant="h6">
                              {getSegmentText(segment.kind)} #{index + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(segment.startedAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={getSegmentText(segment.kind)}
                          color={getSegmentColor(segment.kind)}
                        />
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Distancia
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {(segment.distanceM / 1000).toFixed(2)} km
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Duración
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDuration(segmentDuration)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            Vel. Máx
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {speedMsToKmh(segment.maxSpeedMs).toFixed(1)} km/h
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="body2" color="text.secondary">
                            {segment.kind === 'DOWNHILL' ? 'Descenso' : 'Ascenso'}
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {segment.kind === 'DOWNHILL' ? segment.descentM.toFixed(0) : segment.ascentM.toFixed(0)} m
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </ListItem>
                {index < segments.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      </TabPanel>

      {/* GPS Points Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Puntos GPS ({samples.length} total)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Cada punto representa una lectura GPS durante la actividad
        </Typography>

        <Paper elevation={1} sx={{ maxHeight: 400, overflow: 'auto' }}>
          <List dense>
            {samples.slice(0, 100).map((sample, index) => (
              <ListItem key={sample.id || index}>
                <ListItemText
                  primary={`Punto #${index + 1}`}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {formatDate(sample.ts)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Lat: {sample.lat.toFixed(6)}, Lng: {sample.lng.toFixed(6)}
                      </Typography>
                      {sample.altM && (
                        <Typography variant="caption" display="block">
                          Altitud: {sample.altM.toFixed(1)} m
                        </Typography>
                      )}
                      {sample.speedMs && (
                        <Typography variant="caption" display="block">
                          Velocidad: {speedMsToKmh(sample.speedMs).toFixed(1)} km/h
                        </Typography>
                      )}
                      {sample.accuracyM && (
                        <Typography variant="caption" display="block">
                          Precisión: {sample.accuracyM.toFixed(1)} m
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
            {samples.length > 100 && (
              <ListItem>
                <ListItemText
                  primary={`... y ${samples.length - 100} puntos más`}
                  secondary="Solo se listan los primeros 100 puntos"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </TabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Eliminar Actividad</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteActivity} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
