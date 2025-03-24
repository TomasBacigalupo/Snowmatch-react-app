import React, { useState } from "react";
import { Card, CardContent, Avatar, Typography, IconButton, Box, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import Markdown from "src/components/Markdown";
import VideoReviewedBottomSheet from "./VideoReviewedBottomSheet";

const tips = [
    {
        id: 1,
        name: "Morgan Engel",
        title: "CSIA Level 4 Examiner",
        avatar: "https://via.placeholder.com/50", // Reemplaza con la URL real de la imagen
        tip: "Imagine your skis are on a set of winding train tracks. Each foot has to stay on its track otherwise you will derail. This should leave clean tracks with equal distance apart.",
    },
    {
        id: 2,
        name: "John Doe",
        title: "Professional Ski Instructor",
        avatar: "https://via.placeholder.com/50",
        tip: "Keep your knees slightly bent and your weight centered to maintain balance and control.",
    },
];
const safeSliceMarkdown = (text, length) => {
    if (!text) return "";
    if (text.length <= length) return text;
    let sliced = text.slice(0, length);
    return sliced.substring(0, sliced.lastIndexOf(" ")) + "..."; // Corta en el último espacio
};
const LatestTips = ({ videos }) => {
    const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null)

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % tips.length);
    };

    const handleBack = () => {
        setIndex((prev) => (prev - 1 + tips.length) % tips.length);
    };

    const handleReadMore = (video) => {
        setSelectedVideo(video)
        setIsVideoDetailOpen(true)
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mx={2}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "left" }}>
                    Pro Tips
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" >
                    <IconButton onClick={handleBack}>
                        <ChevronLeft />
                    </IconButton>
                    
                    <IconButton onClick={handleNext}>
                        <ChevronRight />
                    </IconButton>
                </Box>
            </Box>
            <SwipeableViews index={index} onChangeIndex={setIndex}>
                {videos.map((tip) => (
                    <CardContent key={tip.id}>
                        <Box display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
                            <Avatar src={tip?.reviewer?.imageLink} sx={{ width: 50, height: 50, mr: 1 }} />
                            <Box textAlign="left">
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {tip?.reviewer?.name}
                                </Typography>
                            </Box>
                        </Box>
                        <Markdown
                            mb={1}
                            components={{
                                h1: (props) => <Typography variant="body1" {...props} />,
                                h2: (props) => <Typography variant="body1" {...props} />,
                                h3: (props) => <Typography variant="body1" {...props} />,
                                h4: (props) => <Typography variant="body1" {...props} />,
                                h5: (props) => <Typography variant="body1" {...props} />,
                                h6: (props) => <Typography variant="body1" {...props} />,
                                ul: (props) => <ul style={{ listStyleType: 'disc', marginLeft: '1px' }} {...props} />,
                                li: (props) => <li style={{ fontSize: '14px', marginLeft: '1px', marginTop: '5px' }} {...props} />,
                            }}
                        >
                            {safeSliceMarkdown(tip?.comment, 100)}
                        </Markdown>
                        <Button mt={1} variant="outlined" fullWidth onClick={(tip) => handleReadMore(tip)}>Read More</Button>
                    </CardContent>
                ))}
            </SwipeableViews>
            {/* Indicador de Dots */}
            <Box display="flex" justifyContent="center" alignItems="center" my={2}>
                {tips.map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: i === index ? "primary.main" : "gray",
                            mx: 0.5,
                            transition: "background-color 0.3s ease",
                        }}
                    />
                ))}
            </Box>
            <VideoReviewedBottomSheet
                open={isVideoDetailOpen}
                onClose={() => setIsVideoDetailOpen(false)}
                onOpen={() => setIsVideoDetailOpen(true)}
                selectedVideo={selectedVideo}
            />
        </Box>
    );
};

export default LatestTips;