import React, { useState, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import ReactPlayer from 'react-player'

export default function VideoTrimmer({ videoUrl, onTrim }) {
    const videoRef = useRef(null);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(30); // Default max duration 30 seconds
    const [maxDuration, setMaxDuration] = useState(30);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
                setMaxDuration(videoRef.current.duration);
                if (videoRef.current.duration < 30) {
                    setEndTime(videoRef.current.duration);
                }
            };
        }
    }, [videoUrl]);

    const handleTrim = () => {
        onTrim(startTime, endTime);
    };

    return (
        <Box>
            <ReactPlayer url={videoUrl} ref={videoRef}  width="100%" controls />
        </Box>
    );
}