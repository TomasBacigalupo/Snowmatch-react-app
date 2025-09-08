import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from "@mui/material";
import { Geolocation } from '@capacitor/geolocation';
import { useTranslation } from "react-i18next";
import useLocales from "src/hooks/useLocales";
import mapboxgl from 'mapbox-gl';

export default function LocationStep({ onNext, onBack, onLocationSelect, setLatitude, setLongitude }) {
    const { translate } = useLocales();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Initialize Mapbox when location is available
    useEffect(() => {
        if (currentLocation) {
            initializeMap(currentLocation);
        }
    }, [currentLocation]);

    const getCurrentLocation = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Request permissions
            const permissions = await Geolocation.requestPermissions();
            if (permissions.location !== 'granted') {
                throw new Error('Location permission denied');
            }

            // Get current position
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 300000
            });

            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            setCurrentLocation(location);
            setSelectedLocation(location);
            onLocationSelect(location);
            setLatitude(location.latitude);
            setLongitude(location.longitude);
            setLoading(false);
            
        } catch (err) {
            console.error('Error getting location:', err);
            setError('No se pudo obtener tu ubicación. Por favor, selecciona manualmente en el mapa.');
            // Set a default location (Bariloche, Argentina)
            const defaultLocation = { latitude: -41.1335, longitude: -71.3103 };
            setCurrentLocation(defaultLocation);
            setSelectedLocation(defaultLocation);
            onLocationSelect(defaultLocation);
        } finally {
            setLoading(false);
        }
    };

    const initializeMap = (location) => {
        if (!mapRef.current) return;
        
        // Set Mapbox access token
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFjaWdhbHVwb3RvbWFzIiwiYSI6ImNtODFwZmEwbTE5dW8ya3FicjM2eTU1c3YifQ.q9iT0kD12yBODVDEc1XqNQ';
        
        // Create map with outdoors style
        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [location.longitude, location.latitude],
            zoom: 15,
            pitch: 45,
            bearing: -20,
            cooperativeGestures: false,
            touchZoomRotate: false
        });
        
        map.touchZoomRotate.enable();
        mapInstanceRef.current = map;

        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.style.width = '32px';
        markerElement.style.height = '40px';
        markerElement.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 24 16 24s16-13.5 16-24c0-8.837-7.163-16-16-16z" fill="#FF0000"/>
                <circle cx="16" cy="16" r="8" fill="white"/>
                <circle cx="16" cy="16" r="4" fill="#FF0000"/>
            </svg>
        `)}")`;
        markerElement.style.backgroundSize = 'contain';
        markerElement.style.backgroundRepeat = 'no-repeat';
        markerElement.style.cursor = 'pointer';

        // Create draggable marker
        const marker = new mapboxgl.Marker({
            element: markerElement,
            draggable: true
        })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);

        markerRef.current = marker;

        // Update location when marker is dragged
        marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            const newLocation = {
                latitude: lngLat.lat,
                longitude: lngLat.lng
            };
            setSelectedLocation(newLocation);
            onLocationSelect(newLocation);
        });

        // Update location when map is clicked
        map.on('click', (e) => {
            const newLocation = {
                latitude: e.lngLat.lat,
                longitude: e.lngLat.lng
            };
            marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
            setSelectedLocation(newLocation);
            onLocationSelect(newLocation);
        });

        // Add terrain when map loads
        map.on('load', () => {
            map.addSource('mapbox-dem', {
                type: 'raster-dem',
                url: 'mapbox://mapbox.terrain-rgb',
                tileSize: 512
            });
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        });
    };

    const handleUseCurrentLocation = () => {
        if (currentLocation) {
            setSelectedLocation(currentLocation);
            onLocationSelect(currentLocation);
            if (markerRef.current) {
                markerRef.current.setLngLat([currentLocation.longitude, currentLocation.latitude]);
            }
        }
    };

    return (
        <Box my={2} display="flex" height='100%' flexDirection="column">
            <Box mb={2}>
                <Typography variant="h5" gutterBottom>
                    {translate('course.exercise.selectLocation')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Selecciona la ubicación donde grabaste tu video. Esto nos ayuda a dar mejores correcciones.
                </Typography>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Obteniendo tu ubicación...
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ flex: 1, minHeight: 300, mb: 2 }}>
                <div
                    ref={mapRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 8,
                        border: '1px solid #e0e0e0'
                    }}
                />
            </Box>


            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    px: 2,
                    marginBottom: 'env(safe-area-inset-bottom)',
                    zIndex: 1000,
                    backgroundColor: 'background.paper'
                }}
            >
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        if (currentLocation) {
                            handleUseCurrentLocation();
                        }
                        onNext();
                    }}
                    disabled={!currentLocation}
                    sx={{ 
                        py: 2,
                        backgroundColor: 'black',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }
                    }}
                >
                    Continuar
                </Button>
            </Box>
        </Box>
    );
}