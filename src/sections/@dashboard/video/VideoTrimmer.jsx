import React, { useState, useRef, useEffect } from "react";
import { Box, Slider, Typography, Stack, styled } from "@mui/material";
import ReactPlayer from 'react-player';

// Estilos personalizados
const ThumbnailContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '30px',
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  overflow: 'hidden',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing'
  }
}));

const SelectionWindow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  backgroundColor: 'rgba(25, 118, 210, 0.2)',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: '4px',
  zIndex: 10,
  cursor: 'move',
}));

export default function VideoTrimmer({ videoUrl, isLoading }) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderValue, setSliderValue] = useState([0, 30]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  
  // Manejar la duración del video
  const handleDuration = (duration) => {
    setTotalDuration(duration);
    setSliderValue([0, Math.min(30, duration)]);
  };
  
  // Seguimiento del progreso actual del video
  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
    
    // Si está reproduciendo y sale del rango, volver al inicio
    if (playing && state.playedSeconds >= sliderValue[1]) {
      playerRef.current?.seekTo(sliderValue[0]);
    }
  };
  
  // Control del slider
  const handleSliderChange = (event, newValue) => {
    // Asegurarse de que el rango no exceda 30 segundos
    if (newValue[1] - newValue[0] > 30) {
      // Si se mueve el extremo derecho, ajustar según la duración máxima
      if (newValue[1] !== sliderValue[1]) {
        newValue[1] = newValue[0] + 30;
      } else {
        newValue[0] = newValue[1] - 30;
      }
    }
    setSliderValue(newValue);
  };
  
  // Reproducir la selección
  const handlePlaySelection = () => {
    playerRef.current?.seekTo(sliderValue[0]);
    setPlaying(true);
  };
  
  // Pausar el video
  const handlePause = () => {
    setPlaying(false);
  };
  
  // Convertir segundos a formato MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Eventos de arrastre en la vista de miniaturas
  const handleMouseDown = (e) => {
    if (containerRef.current) {
      setIsDragging(true);
      setDragStartX(e.clientX);
    }
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - dragStartX;
    const deltaRatio = deltaX / containerWidth;
    const durationDelta = deltaRatio * totalDuration;
    
    // Calcular nuevos valores, manteniendo la duración de 30 segundos
    let newStart = Math.max(0, sliderValue[0] + durationDelta);
    let newEnd = newStart + (sliderValue[1] - sliderValue[0]);
    
    // Ajustar si excede la duración total
    if (newEnd > totalDuration) {
      newEnd = totalDuration;
      newStart = Math.max(0, newEnd - (sliderValue[1] - sliderValue[0]));
    }
    
    setSliderValue([newStart, newEnd]);
    setDragStartX(e.clientX);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Eventos para touch devices
  const handleTouchStart = (e) => {
    if (containerRef.current) {
      setIsDragging(true);
      setDragStartX(e.touches[0].clientX);
    }
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.touches[0].clientX - dragStartX;
    const deltaRatio = deltaX / containerWidth;
    const durationDelta = deltaRatio * totalDuration;
    
    let newStart = Math.max(0, sliderValue[0] + durationDelta);
    let newEnd = newStart + (sliderValue[1] - sliderValue[0]);
    
    if (newEnd > totalDuration) {
      newEnd = totalDuration;
      newStart = Math.max(0, newEnd - (sliderValue[1] - sliderValue[0]));
    }
    
    setSliderValue([newStart, newEnd]);
    setDragStartX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Efecto para agregar/remover event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);
  
  return (
    <Box>
      <ReactPlayer 
        ref={playerRef}
        url={videoUrl} 
        width="100%" 
        height="200px"
        controls
        playing={playing}
        onDuration={handleDuration}
        onProgress={handleProgress}
        onPause={handlePause}
        progressInterval={100}
      />
      
      {!isLoading && <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecciona los mejores 30 segundos
        </Typography>
        
        {/* Contenedor de la línea de tiempo */}
        <ThumbnailContainer 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Barra de progreso completa */}
          <Box sx={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, #e0e0e0, #f5f5f5)'
          }} />
          
          {/* Indicador de tiempo actual */}
          {playing && (
            <Box sx={{
              position: 'absolute',
              height: '100%',
              width: '2px',
              backgroundColor: 'error.main',
              left: `${(currentTime / totalDuration) * 100}%`,
              zIndex: 15
            }} />
          )}
          
          {/* Ventana de selección */}
          <SelectionWindow 
            sx={{ 
              left: `${(sliderValue[0] / totalDuration) * 100}%`,
              width: `${((sliderValue[1] - sliderValue[0]) / totalDuration) * 100}%`
            }}
          />
          
          {/* Marcas de tiempo */}
          {[...Array(Math.ceil(totalDuration / 5))].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                height: '10px',
                width: '1px',
                backgroundColor: 'grey.500',
                left: `${(i * 5 / totalDuration) * 100}%`,
                bottom: 0
              }}
            />
          ))}
        </ThumbnailContainer>
        
        {/* Slider para selección precisa */}
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => formatTime(value)}
          min={0}
          max={totalDuration}
          step={0.1}
          sx={{ mt: 1 }}
        />
        
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 1 }}>
          <Typography variant="body2">
            {formatTime(sliderValue[0])}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            Duración: {Math.round(sliderValue[1] - sliderValue[0])} segundos
          </Typography>
          <Typography variant="body2">
            {formatTime(sliderValue[1])}
          </Typography>
        </Stack>
      </Box>}
    </Box>
  );
}