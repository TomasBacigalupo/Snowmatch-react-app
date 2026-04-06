import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, Avatar, Typography, IconButton, Box, Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useSwipeable } from "react-swipeable";
import Markdown from "src/components/Markdown";
import VideoReviewedBottomSheet from "./VideoReviewedBottomSheet";
import useLocales from "src/hooks/useLocales";

const safeSliceMarkdown = (text, length) => {
    if (!text) return "";
    if (text.length <= length) return text;
    let sliced = text.slice(0, length);
    return sliced.substring(0, sliced.lastIndexOf(" ")) + "..."; // Corta en el último espacio
};
const LatestTips = ({ video }) => {
    const { translate } = useLocales();
    const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const transformedVideos = useMemo(
        () =>
            video?.videoComments?.map((comment) => ({
                video,
                comment,
            })) || [],
        [video]
    );

    const count = transformedVideos.length;

    useEffect(() => {
        if (count === 0) {
            setIndex(0);
            return;
        }
        setIndex((prev) => Math.min(prev, count - 1));
    }, [count]);

    const handleNext = () => {
        if (count === 0) return;
        setIndex((prev) => (prev + 1) % count);
    };

    const handleBack = () => {
        if (count === 0) return;
        setIndex((prev) => (prev - 1 + count) % count);
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handleBack,
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    const handleReadMore = (video) => {
        setSelectedVideo(video)
        setIsVideoDetailOpen(true)
    }

    const { video: slideVideo, comment } = transformedVideos[index] || {};

    return (
        <Box
            sx={{
                borderRadius: '0px',
                mx: -2, // Negative margin to extend background
                px: 2, // Padding to maintain content alignment
                mt: 2, // Top margin for separation from previous components
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderRadius: '0px',
                    backgroundColor: '#fff',
                    p: 2,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: '#1d1d1f'
                    }}
                >
                    {translate('latestTips.title')}
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        borderRadius: '0px',
                        '& .MuiIconButton-root': {
                            color: '#86868b',
                            '&:hover': {
                                color: '#1d1d1f',
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            }
                        }
                    }}
                >
                    <IconButton onClick={handleBack} size="small" disabled={count <= 1}>
                        <ChevronLeft />
                    </IconButton>
                    <IconButton onClick={handleNext} size="small" disabled={count <= 1}>
                        <ChevronRight />
                    </IconButton>
                </Box>
            </Box>

            {count > 0 && slideVideo && (
                <Box
                    {...swipeHandlers}
                    sx={{
                        overflow: 'visible',
                        borderRadius: '0px',
                        pb: 0,
                        height: 'fit-content',
                        touchAction: 'pan-y',
                    }}
                >
                    <Card
                        key={slideVideo.id}
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: '0px',
                            pb: 0,
                            height: '100%',
                            '& .MuiCardContent-root': {
                                height: '100%',
                                pb: 0,
                            },
                        }}
                    >
                        <CardContent
                            sx={{
                                px: 2,
                                pt: 2,
                                pb: 0,
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={1.5}>
                                <Avatar
                                    src={slideVideo?.reviewer?.imageLink}
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        mr: 1.5,
                                        border: '2px solid #fff',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    }}
                                />
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                            color: '#1d1d1f',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {slideVideo?.reviewer?.name}
                                    </Typography>
                                </Box>
                            </Box>

                            <Markdown
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
                                sx={{
                                    mb: 3,
                                    color: '#424245',
                                    fontSize: '0.925rem',
                                    lineHeight: 1.4,
                                }}
                            >
                                {safeSliceMarkdown(comment, 100)}
                            </Markdown>

                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => handleReadMore(slideVideo)}
                                sx={{
                                    textTransform: 'none',
                                    mt: 1,
                                }}
                            >
                                {translate('latestTips.readMore')}
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            )}

            {isVideoDetailOpen && <VideoReviewedBottomSheet
                open={isVideoDetailOpen}
                onClose={() => setIsVideoDetailOpen(false)}
                onOpen={() => setIsVideoDetailOpen(true)}
                selectedVideo={selectedVideo}
            />}
        </Box>
    );
};

export default LatestTips;