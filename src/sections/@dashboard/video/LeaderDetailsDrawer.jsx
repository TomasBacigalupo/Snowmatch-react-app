import React from 'react';
import {
    Box,
    SwipeableDrawer,
    Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReactPlayer from "react-player";
import MobileHeader from "src/components/MobileHeader";
import Markdown from "src/components/Markdown";
import VideoAnalyticsChart from "./VideoAnalyticsChart";
import { safeSliceMarkdown } from './utils'; // Move the utility function to a separate file

const MarkdownComponents = {
    h1: (props) => <Typography variant="body1" {...props} />,
    h2: (props) => <Typography variant="body1" {...props} />,
    h3: (props) => <Typography variant="body1" {...props} />,
    h4: (props) => <Typography variant="body1" {...props} />,
    h5: (props) => <Typography variant="body1" {...props} />,
    h6: (props) => <Typography variant="body1" {...props} />,
    ul: (props) => <ul style={{ listStyleType: 'disc', marginLeft: '1px' }} {...props} />,
    li: (props) => <li style={{ fontSize: '14px', marginLeft: '1px', marginTop: '5px' }} {...props} />,
};

const VideoPreview = ({ videoUrl, onPlay }) => (
    <Box
        position="relative"
        width="100%"
        maxHeight="300px"
        sx={{ cursor: "pointer" }}
        onClick={onPlay}
    >
        <Box
            component="img"
            src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${videoUrl}.jpg`}
            alt="Video Thumbnail"
            sx={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
            }}
        />
        <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <PlayArrowIcon sx={{ fontSize: 40, color: "white" }} />
        </Box>
    </Box>
);

export default function LeaderDetailsDrawer({ 
    selectedLeader,
    open,
    onClose,
    onOpen,
    isPlayingAnalized,
    setIsPlayingAlaized 
}) {
    return (
        <SwipeableDrawer
            anchor="right"
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                sx: {
                    height: '100%',
                    maxHeight: '100%',
                    paddingTop: 'env(safe-area-inset-bottom)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                    width: '100vw',
                    maxWidth: '100%',
                },
            }}
        >
            <MobileHeader onBack={onClose} title={selectedLeader?.user?.name} />
            <Box
                sx={{
                    width: '100vw',
                    maxWidth: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                }}
            >
                {selectedLeader && (
                    <Box mb={2} px={2}>
                        {!isPlayingAnalized ? (
                            <VideoPreview 
                                videoUrl={selectedLeader.videoUrl}
                                onPlay={() => setIsPlayingAlaized(true)}
                            />
                        ) : (
                            <ReactPlayer
                                url={`${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${selectedLeader?.videoUrl}.mp4`}
                                playing={isPlayingAnalized}
                                controls
                                style={{ maxHeight: '300px', maxWidth: '100%', }}
                                onPause={() => setIsPlayingAlaized(false)}
                                onPlay={() => setIsPlayingAlaized(true)}
                            />
                        )}
                        
                        {selectedLeader?.analysisData && (
                            <VideoAnalyticsChart turnData={selectedLeader.analysisData} />
                        )}
                        
                        {selectedLeader?.aiComment && (
                            <Markdown components={MarkdownComponents}>
                                {safeSliceMarkdown(selectedLeader.aiComment, 145)}
                            </Markdown>
                        )}
                    </Box>
                )}
            </Box>
        </SwipeableDrawer>
    );
} 