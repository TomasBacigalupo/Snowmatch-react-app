import { Box, Button, Card, CardMedia, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import VideoReviewedBottomSheet from "./VideoReviewedBottomSheet";
import { m } from "framer-motion"; // Add smooth animations
import { ArrowForward, CheckCircleOutline } from "@mui/icons-material"; // For the arrow icon
import useLocales from "src/hooks/useLocales";
import UploadedVideoCard from "./UploadedVideoCard";

const LastVideo = ({ video }) => {
    const { translate } = useLocales();
    const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'processing':
                return {
                    color: '#f7c744',
                    text: translate('lastVideo.aiStatus.processing')
                };
            case 'awaiting_ai_check':
                return {
                    color: '#f7c744',
                    text: translate('lastVideo.aiStatus.pending')
                };
            case 'ai_completed':
                return {
                    color: '#34c759',
                    text: translate('lastVideo.aiStatus.completed')
                };
            default:
                return {
                    color: '#06c',
                    text: translate('lastVideo.proCheck.pending')
                };
        }
    };

    const statusInfo = getStatusInfo(video.status);

    return (
        <Box
            component={m.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
                width: '100%',
                px: 2,
                pb: 3,
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.5rem',
                        mb: 0.5,
                        mt: 2
                    }}
                >
                    {translate('lastVideo.title')}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: '#86868b',
                        fontSize: '0.95rem'
                    }}
                >
                    {translate('lastVideo.subtitle')}
                </Typography>
            </Box>

            <UploadedVideoCard
                video={video}
                setIsVideoDetailOpen={setIsVideoDetailOpen}
            />

            <VideoReviewedBottomSheet
                open={isVideoDetailOpen}
                onClose={() => setIsVideoDetailOpen(false)}
                onOpen={() => setIsVideoDetailOpen(true)}
                selectedVideo={video}
            />
        </Box>
    );
};

export default LastVideo;