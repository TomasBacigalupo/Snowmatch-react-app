import React, { useState, useEffect, useRef } from "react";
import { Box, LinearProgress } from "@mui/material";

const videos = [
  "/assets/videos/balance1/mini-movment-1.mov",
  "/assets/videos/balance1/minimovement2.mov",
  "/assets/videos/balance1/minimovement3.mov",
];

const StoryPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const durationRef = useRef(5000); // Default 5 seconds if metadata not loaded

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, durationRef.current / 100);

    if (progress >= 100) {
      goToNextStory();
    }

    return () => clearInterval(interval);
  }, [progress]);

  const goToNextStory = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Restart from the first story
    }
    setProgress(0);
  };

  const handleVideoEnd = () => goToNextStory();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "300px",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius:"16px",
        mb:2,
        overflow: "hidden",
        minHeight: "220px"
      }}
      onClick={goToNextStory}
    >
      <video
        key={currentIndex}
        ref={videoRef}
        src={videos[currentIndex]}
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        onLoadedMetadata={(e) => {
          durationRef.current = (e.target).duration * 1000;
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius:"16px"
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          padding: "0 16px",
          display: 'flex',
          gap: '4px'
        }}
      >
        {videos.map((_, index) => (
          <LinearProgress
            key={index}
            variant="determinate"
            value={index < currentIndex ? 100 : index === currentIndex ? progress : 0}
            sx={{
              height: 4,
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default StoryPlayer;