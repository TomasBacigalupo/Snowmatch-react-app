import React, { useState } from "react";
import { Box } from "@mui/material";
import ReactPlayer from 'react-player'

export default function VideoTrimmer({ videoUrl }) {
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(30); // Default max duration 30 seconds
    
    return (
        <Box>
            <ReactPlayer url={videoUrl} width="100%" controls />
        </Box>
    );
}