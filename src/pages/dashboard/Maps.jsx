import { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Geolocation } from '@capacitor/geolocation';
import mapboxgl from 'mapbox-gl';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// Lista de centros de esquí
const skiResorts = [
  { name: 'Catedral', lat: -41.1702, lon: -71.4382 },
  { name: 'Chapelco', lat: -40.198216494081464, lon: -71.32010252317177 },
  { name: 'Lago Hermoso', lat: -40.34986674870071, lon: -71.46031637963252 },
  { name: 'Bayo', lat: -40.75497782808232, lon: -71.5929616152734 },
  { name: 'Laderas', lat: -41.78598510421467, lon: -71.57539604152416 },
  { name: 'Castor', lat: -54.72276373438249, lon: -68.01870963322949 },
  { name: 'La Hoya', lat: -42.820635640352464, lon: -71.25692021353754 }
];

// Función para calcular distancia entre dos coordenadas (Haversine)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
};

export default function Maps() {
  const { themeStretch } = useSettings();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    // Configurar Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiYmFjaWdhbHVwb3RvbWFzIiwiYSI6ImNtODFwZmEwbTE5dW8ya3FicjM2eTU1c3YifQ.q9iT0kD12yBODVDEc1XqNQ'; // Sustituye con tu clave de Mapbox

    const fetchLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Encontrar el centro de esquí más cercano
        let closestResortIndex = 0;
        let minDistance = Infinity;

        skiResorts.forEach((resort, index) => {
          const distance = getDistance(latitude, longitude, resort.lat, resort.lon);
          if (distance < minDistance) {
            minDistance = distance;
            closestResortIndex = index;
          }
        });

        setSelectedTab(closestResortIndex);
      } catch (error) {
        console.error('Error obteniendo la ubicación:', error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    // Configuración específica para Android/iOS
    if (typeof (DeviceMotionEvent) !== 'undefined' &&
      typeof (DeviceMotionEvent).requestPermission === 'function') {
      (DeviceMotionEvent)
        .requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', () => { });
          }
        });
    }
  }, []);


  useEffect(() => {
    const resort = skiResorts[selectedTab];
    const mapContainer = document.getElementById('map-container');

    if (mapContainer) {
      const map = new mapboxgl.Map({
        container: mapContainer,
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [resort.lon, resort.lat],
        zoom: 14,
        pitch: 45,
        bearing: -20,
        cooperativeGestures: false,
        touchZoomRotate: false
      });
      map.touchZoomRotate.enable();
      

      // Agregar marcador para el centro de esquí seleccionado
      // new mapboxgl.Marker().setLngLat([resort.lon, resort.lat]).addTo(map);

      map.on("load", () => {
        // Add terrain
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.terrain-rgb',
          tileSize: 512
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // Add ski pistes and lifts source
        map.addSource('ski-data', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-streets-v8'
        });

        // Medios de elevación
        map.addLayer({
          id: 'ski-lifts',
          type: 'line',
          source: 'ski-data',
          'source-layer': 'road',
          filter: ['==', ['get', 'class'], 'aerialway'],
          paint: {
            'line-color': '#000000',
            'line-width': 3,
            'line-dasharray': [2, 2]
          }
        });

        // Pistas de esquí
        map.addLayer({
          id: 'ski-runs',
          type: 'line',
          source: 'ski-data',
          'source-layer': 'road',
          filter: ['==', ['get', 'class'], 'ski'],
          paint: {
            'line-color': [
              'match',
              ['get', 'difficulty'],
              'easy', '#00FF00',        // Verde para principiantes
              'intermediate', '#0000FF', // Azul para intermedios
              'advanced', '#FF0000',    // Rojo para avanzados
              'expert', '#000000',      // Negro para expertos
              '#808080'                 // Gris por defecto si no coincide
            ],
            'line-width': 3
          }
        });
      });
      
    }
  }, [selectedTab]);

  return (
    <Page title="Maps">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        {/* Tabs de los centros de esquí */}
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          centered
          variant="scrollable"
          scrollButtons="auto"
        >
          {skiResorts.map((resort, index) => (
            <Tab key={index} label={resort.name} />
          ))}
        </Tabs>
      </Container>

      {/* Contenedor principal para el mapa */}
      <Box id="map-container" style={{ width: '100%', height: '100dvh' }}></Box>
    </Page>
  );
}