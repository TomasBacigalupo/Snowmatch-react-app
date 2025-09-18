/**
 * MapboxTrack component for displaying ski activity tracks
 * Uses Mapbox GL JS for rendering GPS tracks with segment colors
 */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography, CircularProgress } from '@mui/material';
import { MAPBOX_API } from '../../config';

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_API;

// Component to fit map bounds to track
const FitBounds = ({ map, bounds }) => {
  useEffect(() => {
    if (map && bounds.north !== bounds.south && bounds.east !== bounds.west) {
      const boundsObj = new mapboxgl.LngLatBounds(
        [bounds.west, bounds.south],
        [bounds.east, bounds.north]
      );
      map.fitBounds(boundsObj, { padding: 50 });
    }
  }, [map, bounds]);
  
  return null;
};

export const MapboxTrack = ({
  samples,
  segments = [],
  height = 400,
  showSegmentColors = true,
  fitBounds = true,
  className,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bounds, setBounds] = useState({
    north: 0,
    south: 0,
    east: 0,
    west: 0,
  });

  // Calculate bounds from samples
  useEffect(() => {
    if (samples.length === 0) {
      setIsLoading(false);
      return;
    }

    const lats = samples.map(s => s.lat);
    const lngs = samples.map(s => s.lng);

    const newBounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };

    setBounds(newBounds);
    setIsLoading(false);
  }, [samples]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: samples.length > 0 ? [samples[0].lng, samples[0].lat] : [0, 0],
      zoom: 13,
      pitch: 45,
      bearing: -20,
    });

    map.current.on('load', () => {
      setIsLoading(false);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update track when samples change
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded() || samples.length === 0) {
      return;
    }

    // Remove existing sources and layers
    if (map.current.getSource('track')) {
      map.current.removeLayer('track');
      map.current.removeSource('track');
    }

    // Group samples by segment for colored polylines
    const getSegmentPolylines = () => {
      if (!showSegmentColors || segments.length === 0) {
        return [{
          samples: samples,
          color: '#1976d2',
          segment: null,
        }];
      }

      const polylines = [];
      let currentSegmentId = null;
      let currentSamples = [];

      samples.forEach(sample => {
        if (sample.segmentId !== currentSegmentId) {
          // Save previous segment
          if (currentSamples.length > 0) {
            const segment = segments.find(s => s.id === currentSegmentId);
            polylines.push({
              samples: currentSamples,
              color: getSegmentColor(segment?.kind),
              segment: segment || null,
            });
          }

          // Start new segment
          currentSegmentId = sample.segmentId || null;
          currentSamples = [sample];
        } else {
          currentSamples.push(sample);
        }
      });

      // Add final segment
      if (currentSamples.length > 0) {
        const segment = segments.find(s => s.id === currentSegmentId);
        polylines.push({
          samples: currentSamples,
          color: getSegmentColor(segment?.kind),
          segment: segment || null,
        });
      }

      return polylines;
    };

    const getSegmentColor = (kind) => {
      switch (kind) {
        case 'DOWNHILL':
          return '#d32f2f'; // Red for downhill
        case 'UPHILL':
          return '#2e7d32'; // Green for uphill
        default:
          return '#1976d2'; // Blue for unknown
      }
    };

    const polylines = getSegmentPolylines();

    // Create GeoJSON for each segment
    polylines.forEach((polyline, index) => {
      const coordinates = polyline.samples.map(sample => [sample.lng, sample.lat]);
      
      const geojson = {
        type: 'Feature',
        properties: {
          color: polyline.color,
          segment: polyline.segment,
        },
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      };

      // Add source
      map.current.addSource(`track-${index}`, {
        type: 'geojson',
        data: geojson,
      });

      // Add layer
      map.current.addLayer({
        id: `track-${index}`,
        type: 'line',
        source: `track-${index}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': polyline.color,
          'line-width': 4,
          'line-opacity': 0.8,
        },
      });
    });

    // Fit bounds if requested
    if (fitBounds && bounds.north !== bounds.south && bounds.east !== bounds.west) {
      const boundsObj = new mapboxgl.LngLatBounds(
        [bounds.west, bounds.south],
        [bounds.east, bounds.north]
      );
      map.current.fitBounds(boundsObj, { padding: 50 });
    }
  }, [samples, segments, showSegmentColors, fitBounds, bounds]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={height}
        className={className}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading map...
        </Typography>
      </Box>
    );
  }

  if (samples.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={height}
        className={className}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No track data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={className} sx={{ height, width: '100%' }}>
      <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />
      {fitBounds && <FitBounds map={map.current} bounds={bounds} />}
    </Box>
  );
};

// Lazy-loaded version to reduce bundle size
export const LazyMapboxTrack = (props) => {
  const [MapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    // Dynamically import the map component
    import('./MapboxTrack').then(module => {
      setMapComponent(() => module.MapboxTrack);
    });
  }, []);

  if (!MapComponent) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={props.height || 400}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading map component...
        </Typography>
      </Box>
    );
  }

  return <MapComponent {...props} />;
};
