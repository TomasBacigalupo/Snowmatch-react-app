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
    if (typeof (DeviceMotionEvent ) !== 'undefined' && 
        typeof (DeviceMotionEvent ).requestPermission === 'function') {
      (DeviceMotionEvent )
        .requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', () => {});
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
        cooperativeGestures: true
      });

      // Agregar marcador para el centro de esquí seleccionado
      new mapboxgl.Marker().setLngLat([resort.lon, resort.lat]).addTo(map);

      // Agregar pistas de esquí y medios de elevación desde OpenStreetMap (opcional)
      map.on("load", () => {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        map.addSource('osm-ski', {
          type: 'vector',
          url: 'mapbox://mapbox.2opop9hr'
        });
        map.on('click', 'ski-trails', (e) => {
          console.log('Propiedades de la pista:', e.features[0].properties);
        });
        // Pistas de esquí (puedes personalizar el color)
        map.addLayer({
          id: 'ski-trails',
          type: 'line',
          source: 'osm-ski',
          'source-layer': 'transportation',
          filter: ['==', 'class', 'piste'],
          paint: {
            'line-color': [
              'match',
              ['get', 'piste:difficulty'],
              '1', '#4CAF50',       // Verde - Novato
              '2', '#2196F3',       // Azul - Fácil
              '3', '#FFC107',       // Amarillo - Intermedio
              '4', '#F44336',       // Rojo - Avanzado
              '5', '#9C27B0',       // Morado - Experto
              '#000' // Valor por defecto
            ],
            'line-width': 4
          }
        });

        // Medios de elevación (ejemplo de líneas para lifts)
        map.addLayer({
          id: 'ski-lifts',
          type: 'line',
          source: 'osm-ski',
          'source-layer': 'transportation',
          filter: ['==', 'class', 'aerialway'],
          paint: {
            'line-color': '#3F51B5',
            'line-width': 3,
            'line-dasharray': [2, 2]
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
      <Box id="map-container" style={{ width: '100%', height: '300px' }}></Box>
    </Page>
  );
}