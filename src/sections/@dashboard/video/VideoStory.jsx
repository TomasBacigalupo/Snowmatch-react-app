import React, { useState, useEffect, useRef } from "react";
import { Box, LinearProgress } from "@mui/material";

export default function VideoStory({ videos }){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    //const videoRef = useRef(null);
    const duration = 5000; // Duration per story in ms

    // Handle video progress
    // useEffect(() => {
    //     setProgress(0);
    //     const interval = setInterval(() => {
    //         setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    //     }, duration / 100);

    //     return () => clearInterval(interval);
    // }, [currentIndex]);

    // Auto-next when video ends
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (currentIndex < videos?.length - 1) {
    //             setCurrentIndex(currentIndex + 1);
    //         }
    //     }, duration);

    //     return () => clearTimeout(timer);
    // }, [currentIndex, videos]);

    const handleClick = () => {
        // setCurrentIndex(currentIndex + 1);
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
            }}
            onClick={handleClick}
        >
            {/* <video
                ref={videoRef}
                src={videos[currentIndex]}
                autoPlay
                muted
                playsInline
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            /> */}
            {videos?.length > 0 && <video
                src={videos[currentIndex]}
                width="100%"
                height="300px"
                controls
                playsInline
                disablePictureInPicture
                autoPlay={true}
                style={{
                    borderRadius: '12px',
                    objectFit: 'cover',
                    display: 'block',
                    backgroundColor: 'black'
                }}
            ></video>}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 0,
                    width: "100%",
                    px: 2,
                }}
            >
                {/* <LinearProgress variant="determinate" value={progress} /> */}
            </Box>
        </Box>
    );
};