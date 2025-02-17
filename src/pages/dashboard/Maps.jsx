import { useEffect, useState } from 'react';
import { Container, Tabs, Tab, Box } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Geolocation } from '@capacitor/geolocation';

// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// Lista de centros de esquí
const skiResorts = [
  { name: 'Catedral', map: '/assets/resorts/maps/mapa_catedral.avif', lat: -41.1702, lon: -71.4382 },
  { name: 'Chapelco', map: '/assets/resorts/maps/mapa_chapelco.avif', lat: -40.1905, lon: -71.3544 },
  { name: 'Lago Hermoso', map: '/assets/resorts/maps/mapa_lagohermoso.avif', lat: -40.2700, lon: -71.3500 },
  { name: 'Bayo', map: '/assets/resorts/maps/mapa_bayo.avif', lat: -40.7631, lon: -71.6261 },
  { name: 'Laderas', map: '/assets/resorts/maps/mapa_laderas.avif', lat: -41.6046, lon: -71.5404 },
  { name: 'Castor', map: '/assets/resorts/maps/mapa_castor.avif', lat: -54.7359, lon: -68.0591 },
  { name: 'La Hoya', map: '/assets/resorts/maps/mapa_lahoya.avif', lat: -42.8379, lon: -71.3197 }
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
        
          <TransformWrapper
            initialScale={3}
            minScale={1}
            maxScale={5}
            wheel={{ step: 0.1 }}
            pinch={{ step: 10 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Controles de zoom */}
                <div style={{
                    display: 'none',
                  position: 'none',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 8
                }}>
                  <button style={{display: 'none'}} onClick={() => zoomIn()}>➕</button>
                  <button style={{display: 'none'}} onClick={() => zoomOut()}>➖</button>
                  <button style={{display: 'none'}} onClick={() => resetTransform()}>🔄</button>
                </div>
  
                {/* Contenedor del mapa */}
                <TransformComponent
                  wrapperStyle={{
                    width: '100vw',
                    height: '80dvh',
                    overflow: 'hidden'
                  }}
                  contentStyle={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                  }}
                >
                  <img
                    src={skiResorts[selectedTab].map}
                    alt={skiResorts[selectedTab].name}
                    style={{
                     
                      width: '1500px',
                      height: 'auto',
                    }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
      </Page>
    );
  }