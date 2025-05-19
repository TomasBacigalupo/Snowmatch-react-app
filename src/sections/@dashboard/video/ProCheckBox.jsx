import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import useAuth from "src/hooks/useAuth";
import VideoCallIcon from '@mui/icons-material/VideoCall';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate } from 'react-router-dom';
import useLocales from "src/hooks/useLocales";
import { useState } from 'react';
import VideoUploadBottomSheet from './VideoUploadBottomSheet';
import Iconify from 'src/components/Iconify';
import ExcerciseBottomSheet from "./ExcerciseBottomSheet";

const ProCheckBox = ({ hasVideos = false, hasUnreviewedVideos = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { translate } = useLocales();
    const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);

    const handleActionClick = () => {
        if (!user) {
            navigate('/auth/login');
            return;
        }
        setIsUploadSheetOpen(true);
    };

    const handleAskForCredits = () => {
        // write to our whats app saying that the user wants to buy credits
        const message = `Hola, me gustaría comprar créditos para ProCheck.`;
        const url = `https://wa.me/542944263223?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    return (
        <>
            <Paper
                sx={{
                    borderRadius: '0px',
                    p: 3,
                    background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
                }}
            >
                {/* Header Section with Credits */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <img
                                    src="/logo/proCheck.png"
                                    alt="ProCheck Credits"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        marginRight: '8px',
                                        marginLeft: '-4px'
                                    }}
                                />
                                <Typography variant="h5">
                                    {translate('procheck.credits.title')}
                                </Typography>
                            </Box>
                            <Typography variant="body2">
                                {translate('procheck.credits.subtitle')}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            borderRadius: 3,
                            py: 1.5,
                            px: 3,
                            minWidth: '60px',
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: '3.5rem',
                                lineHeight: 1,
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            {!user ? 1 :
                                user?.proCheckCredits || 0}
                        </Typography>
                    </Box>
                </Box>

                {/* Action Section */}
                <Stack spacing={2}>
                    <Typography variant="body2">
                        {translate(user?.proCheckCredits > 0
                            ? 'procheck.credits.use_credits'
                            : 'procheck.credits.purchase_credits'
                        )}
                    </Typography>

                    {/* {!hasVideos ? (
                        <Button
                            variant="contained"
                            startIcon={<VideoCallIcon />}
                            fullWidth
                            onClick={handleActionClick}
                            sx={{
                                textTransform: 'none',
                                color: 'white',
                            }}
                        >
                            {translate('procheck.actions.get_first_correction')}
                        </Button>
                    ) : hasUnreviewedVideos ? (
                        <Button
                            variant="contained"
                            startIcon={<RateReviewIcon />}
                            fullWidth
                            onClick={handleActionClick}
                            sx={{
                                py: 1.5,
                                bgcolor: user?.proCheckCredits > 0 ? 'primary.main' : 'grey.400',
                                '&:hover': { bgcolor: user?.proCheckCredits > 0 ? 'primary.dark' : 'grey.500' }
                            }}
                            disabled={user?.proCheckCredits <= 0}
                        >
                            {translate('procheck.actions.get_procheck')}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            startIcon={<VideoCallIcon />}
                            fullWidth
                            onClick={handleActionClick}
                            sx={{
                                py: 1.5,
                                bgcolor: 'primary.main',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            {translate('procheck.actions.upload_new')}
                        </Button>
                    )} */}

                    {user?.proCheckCredits <= 0 && (
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={handleAskForCredits}
                            sx={{ 
                                py: 1.5,
                                borderColor: 'black',
                                color: 'black',
                                '&:hover': {
                                    borderColor: 'black',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            {translate('procheck.actions.buy_credits')}
                        </Button>
                    )}
                </Stack>
            </Paper>

            {/* Add VideoUploadBottomSheet */}
            <ExcerciseBottomSheet
                open={isUploadSheetOpen}
                onClose={() => setIsUploadSheetOpen(false)}
                onOpen={() => setIsUploadSheetOpen(true)}
                demoUrl="/assets/videos/tomianalisis.mov"
                course="GENERAL"
                level="GENERAL"
            />
        </>
    );
};

export default ProCheckBox;