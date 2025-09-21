/**
 * MapboxTrack component for displaying ski activity tracks
 * Uses Mapbox GL JS for rendering GPS tracks with segment colors
 */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography, CircularProgress } from '@mui/material';
import { MAPBOX_API } from '../../config';

// Set Mapbox access token - fallback to hardcoded token if config is not available
mapboxgl.accessToken = MAPBOX_API || 'pk.eyJ1IjoiYmFjaWdhbHVwb3RvbWFzIiwiYSI6ImNtODFwZmEwbTE5dW8ya3FicjM2eTU1c3YifQ.q9iT0kD12yBODVDEc1XqNQ';

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
  samples = [],
  segments = [],
  height = 400,
  showSegmentColors = true,
  fitBounds = true,
  className,
  useTestData = false,
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

  // Generate test data if requested
  const getTestData = () => {
    if (!useTestData) return { samples, segments };
    
    // Generate a test track around Chapelco ski resort
    const centerLat = -40.198216494081464;
    const centerLng = -71.32010252317177;
    const testSamples = [];
    const testSegments = [
      {
        id: 'segment-1',
        kind: 'DOWNHILL',
        startedAt: Date.now() - 300000,
        endedAt: Date.now() - 150000,
        distanceM: 2000,
        maxSpeedMs: 15,
        ascentM: 0,
        descentM: 300,
      },
      {
        id: 'segment-2', 
        kind: 'UPHILL',
        startedAt: Date.now() - 150000,
        endedAt: Date.now() - 60000,
        distanceM: 1500,
        maxSpeedMs: 5,
        ascentM: 250,
        descentM: 0,
      },
      {
        id: 'segment-3',
        kind: 'DOWNHILL',
        startedAt: Date.now() - 60000,
        endedAt: Date.now(),
        distanceM: 1800,
        maxSpeedMs: 18,
        ascentM: 0,
        descentM: 280,
      }
    ];

    // Generate GPS samples along the track
    for (let i = 0; i < 100; i++) {
      const t = i / 99;
      let lat, lng;
      
      if (t < 0.33) {
        // First downhill segment
        const segmentT = t / 0.33;
        lat = centerLat + (segmentT * 0.01);
        lng = centerLng + (segmentT * 0.01);
      } else if (t < 0.66) {
        // Uphill segment
        const segmentT = (t - 0.33) / 0.33;
        lat = centerLat + 0.01 + (segmentT * -0.008);
        lng = centerLng + 0.01 + (segmentT * 0.005);
      } else {
        // Final downhill segment
        const segmentT = (t - 0.66) / 0.34;
        lat = centerLat + 0.002 + (segmentT * 0.008);
        lng = centerLng + 0.015 + (segmentT * -0.01);
      }
      
      testSamples.push({
        id: `test-sample-${i}`,
        lat: lat + (Math.random() - 0.5) * 0.0001, // Add some GPS noise
        lng: lng + (Math.random() - 0.5) * 0.0001,
        altM: 1000 + Math.random() * 500,
        speedMs: Math.random() * 20,
        accuracyM: 5 + Math.random() * 10,
        ts: Date.now() - (100 - i) * 3000,
        segmentId: t < 0.33 ? 'segment-1' : t < 0.66 ? 'segment-2' : 'segment-3',
      });
    }

    return { samples: testSamples, segments: testSegments };
  };

  // Calculate bounds from samples
  useEffect(() => {
    const { samples: effectiveSamples } = getTestData();
    
    if (effectiveSamples.length === 0) {
      setIsLoading(false);
      return;
    }

    const lats = effectiveSamples.map(s => s.lat);
    const lngs = effectiveSamples.map(s => s.lng);

    const newBounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };

    setBounds(newBounds);
    setIsLoading(false);
  }, [samples, useTestData]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const { samples: effectiveSamples } = getTestData();

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: effectiveSamples.length > 0 ? [effectiveSamples[0].lng, effectiveSamples[0].lat] : [-71.32010252317177, -40.198216494081464],
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
  }, [useTestData]);

  // Update track when samples change
  useEffect(() => {
    const { samples: effectiveSamples, segments: effectiveSegments } = getTestData();
    
    if (!map.current || !map.current.isStyleLoaded() || effectiveSamples.length === 0) {
      return;
    }

    // Remove existing sources and layers
    if (map.current.getSource('track')) {
      map.current.removeLayer('track');
      map.current.removeSource('track');
    }

    // Group samples by segment for colored polylines
    const getSegmentPolylines = () => {
      if (!showSegmentColors || effectiveSegments.length === 0) {
        return [{
          samples: effectiveSamples,
          color: '#1976d2',
          segment: null,
        }];
      }

      const polylines = [];
      let currentSegmentId = null;
      let currentSamples = [];

      effectiveSamples.forEach(sample => {
        if (sample.segmentId !== currentSegmentId) {
          // Save previous segment
          if (currentSamples.length > 0) {
            const segment = effectiveSegments.find(s => s.id === currentSegmentId);
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
        const segment = effectiveSegments.find(s => s.id === currentSegmentId);
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
  }, [samples, segments, showSegmentColors, fitBounds, bounds, useTestData]);

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

  const { samples: effectiveSamples } = getTestData();
  
  if (effectiveSamples.length === 0) {
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
