import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import { useState } from "react";
import VideoReviewedBottomSheet from "./VideoReviewedBottomSheet";


const LastVideo = ({ video }) => {
    const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);

    return (
        <Box m={2} width='100%'>
            <Typography variant="h5">Last upload video</Typography>
            <Card sx={{ marginTop: 2, maxWidth: 345, display: 'flex', flexDirection: 'row', maxHeight: "120px" }}>
                <CardMedia
                    component="img"
                    image={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${video.videoUrl}.jpg`}
                    alt="Video Thumbnail"
                    sx={{ width: '140px', height: 'auto', objectFit: 'cover' }}
                />
                <Box sx={{ flex: 1, padding: '10px' }}>
                    <Typography variant="body2" color="text.secondary">
                        Estado: {video.status === 'awaiting_ai_check' ? 'Esperando AI Check' : 'Esperando ProCheck'}
                    </Typography>
                    <Button variant='outlined' size="small" color="primary" onClick={() => setIsVideoDetailOpen(true)}>
                        Solicitar ProCheck
                    </Button>
                </Box>
            </Card>

            <VideoReviewedBottomSheet
                open={isVideoDetailOpen}
                onClose={() => setIsVideoDetailOpen(false)}
                onOpen={() => setIsVideoDetailOpen(true)}
                selectedVideo={video}
            />
        </Box>

    )

}

export default LastVideo;