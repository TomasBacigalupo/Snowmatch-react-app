/**
 * Map component for displaying ski activity tracks
 * Uses react-leaflet for rendering GPS tracks with segment colors
 */

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, CircularProgress } from '@mui/material';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit map bounds to track
const FitBounds = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds.north !== bounds.south && bounds.east !== bounds.west) {
      const leafletBounds = L.latLngBounds(
        [bounds.south, bounds.west],
        [bounds.north, bounds.east]
      );
      map.fitBounds(leafletBounds, { padding: [20, 20] });
    }
  }, [bounds, map]);
  
  return null;
};

export const MapTrack = ({
  samples,
  segments = [],
  height = 400,
  showSegmentColors = true,
  fitBounds = true,
  className,
}) => {
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

  const formatSegmentInfo = (segment) => {
    const duration = segment.endedAt 
      ? (segment.endedAt - segment.startedAt) / 1000 
      : 0;
    
    return `
      <div>
        <strong>${segment.kind}</strong><br/>
        Distance: ${(segment.distanceM / 1000).toFixed(2)} km<br/>
        Duration: ${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}<br/>
        Max Speed: ${(segment.maxSpeedMs * 3.6).toFixed(1)} km/h<br/>
        ${segment.ascentM > 0 ? `Ascent: ${segment.ascentM.toFixed(0)}m<br/>` : ''}
        ${segment.descentM > 0 ? `Descent: ${segment.descentM.toFixed(0)}m` : ''}
      </div>
    `;
  };

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

  const polylines = getSegmentPolylines();

  return (
    <Box className={className} sx={{ height, width: '100%' }}>
      <MapContainer
        center={[samples[0]?.lat || 0, samples[0]?.lng || 0]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {fitBounds && <FitBounds bounds={bounds} />}
        
        {polylines.map((polyline, index) => {
          const positions = polyline.samples.map(sample => [sample.lat, sample.lng]);
          
          return (
            <Polyline
              key={index}
              positions={positions}
              color={polyline.color}
              weight={4}
              opacity={0.8}
            >
              {polyline.segment && (
                <Popup>
                  <div dangerouslySetInnerHTML={{ __html: formatSegmentInfo(polyline.segment) }} />
                </Popup>
              )}
            </Polyline>
          );
        })}
      </MapContainer>
    </Box>
  );
};

// Lazy-loaded version to reduce bundle size
export const LazyMapTrack = (props) => {
  const [MapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    // Dynamically import the map component
    import('./MapTrack').then(module => {
      setMapComponent(() => module.MapTrack);
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
