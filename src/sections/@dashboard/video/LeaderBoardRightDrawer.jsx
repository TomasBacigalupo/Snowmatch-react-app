import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    SwipeableDrawer,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Button,
    Chip,
    Stack,
} from "@mui/material";
import { ArrowBack, Close as CloseIcon, EmojiEvents as CrownIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "src/redux/store";
import { getLeaderBoard } from "src/redux/slices/video";
import ReactPlayer from "react-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VideoAnalyticsChart from "./VideoAnalyticsChart";
import MobileHeader from "src/components/MobileHeader";
import Markdown from "src/components/Markdown";

// Datos del leaderboard
const leaderboardData = [
    { rank: 1, name: "Lorenzo Rutkoski", time: "1:14", speed: "41.1 km/h", date: "7 Oct 2020", avatar: "/path-to-avatar" },
    { rank: 2, name: "Emanuel Comita", time: "1:24", speed: "36.2 km/h", date: "2 Dec 2018", avatar: "/path-to-avatar" },
    { rank: 3, name: "Federico Curual", time: "1:25", speed: "35.8 km/h", date: "13 Jul 2019", avatar: "/path-to-avatar" },
    { rank: 4, name: "Cristian D'Alfonso", time: "1:27", speed: "35 km/h", date: "18 Nov 2018", avatar: "/path-to-avatar" },
    { rank: 5, name: "Flor Rainelli", time: "1:28", speed: "34.6 km/h", date: "17 Jun 2019", avatar: "/path-to-avatar" },
    { rank: 87, name: "Tomas Bacigalupo", time: "2:10", speed: "23.4 km/h", date: "8 Oct 2024", avatar: "/path-to-avatar", isUser: true },
];

const safeSliceMarkdown = (text, length) => {
    if (!text) return "";
    if (text.length <= length) return text;
    let sliced = text.slice(0, length);
    return sliced.substring(0, sliced.lastIndexOf(" ")) + "..."; // Corta en el último espacio
};

export default function LeaderBoardRightDrawer({ open, onClose, onOpen, course }) {
    const dispatch = useDispatch()
    const { leaders } = useSelector(state => state.video)
    const [selectedLeader, setSelectedLeader] = useState(null)
    const [openLeaderDetails, setOpenLeaderDetails] = useState(false)
    const [isPlayingAnalized, setIsPlayingAlaized] = useState(false)
    useEffect(() => {
        if (open) {
            dispatch(getLeaderBoard(course))
        }
    }, [open])

    useEffect(() => console.log("leaders", leaders), [leaders])
    if (leaders?.length > 0) {
        return (
            <>
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
                    <MobileHeader onBack={onClose} title="Leaderboards" />
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

                        {/* <Stack direction="row" spacing={1} mt={2} justifyContent="center">
                <Chip label="All-Time" color="primary" variant="filled" />
                <Chip label="All-Time (Men)" variant="outlined" />
                <Chip label="All-Time (Women)" variant="outlined" />
                <Chip label="This Year" variant="outlined" />
              </Stack> */}

                        {/* Mejor tiempo destacado */}
                        <Box mt={3} textAlign="center">
                            <Avatar src={leaderboardData[0].avatar} sx={{ width: 80, height: 80, mx: "auto" }} />
                            <Typography variant="h4" fontWeight="bold">{leaders[0].score}</Typography>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <CrownIcon sx={{ color: "gold", mr: 1 }} />
                                <Typography variant="subtitle1" fontWeight="bold">{leaders[0].user.name}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        {/* Lista del leaderboard */}
                        <List>
                            {leaders.map((video, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        sx={{
                                            backgroundColor: video.isUser ? "rgba(255, 165, 0, 0.2)" : "transparent",
                                            borderRadius: video.isUser ? 2 : 0,
                                        }}
                                        onClick={() => {
                                            setSelectedLeader(video)
                                            setOpenLeaderDetails(true)
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ width: 30, fontWeight: index === 1 ? "bold" : "normal" }}>
                                            {index + 1}
                                        </Typography>
                                        <ListItemAvatar>
                                            <Avatar src={video.user.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={video.user.name}
                                            secondary={`${video.score}`}
                                        />
                                        <Typography variant="body2" color="text.secondary">{video.date}</Typography>
                                    </ListItem>
                                    {index < leaders.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>

                        {/* Sección de mejora personal */}
                        <Box mt={2} textAlign="center" p={2} sx={{ backgroundColor: "#f7f7f7", borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Top 34%</strong> - Take <strong>13s</strong> off to move up <strong>35 spots</strong>
                            </Typography>
                        </Box>
                    </Box>
                </SwipeableDrawer>
                {selectedLeader &&
                    <SwipeableDrawer
                        anchor="bottom"
                        open={openLeaderDetails}
                        onClose={() => setOpenLeaderDetails(false)}
                        onOpen={() => setOpenLeaderDetails(true)}
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
                        {/* Encabezado con filtros */}
                        <MobileHeader onBack={() => setOpenLeaderDetails(false)} title={selectedLeader?.user?.name} />
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
                            {selectedLeader &&
                                <Box mb={2} px={2}>
                                    {!isPlayingAnalized ? (
                                        <Box
                                            position="relative"
                                            width="100%"
                                            maxHeight="300px"
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => setIsPlayingAlaized(true)}
                                        >
                                            {/* Thumbnail Image */}
                                            <Box
                                                component="img"
                                                src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${selectedLeader?.videoUrl}.jpg`}
                                                alt="Video Thumbnail"
                                                sx={{
                                                    width: "100%",
                                                    maxHeight: "300px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            {/* Play Button Overlay */}
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
                                    ) : (
                                        <ReactPlayer
                                            url={`${process.env.REACT_APP_VIDEO_ANALIZED_BUCKET_URL}/${selectedLeader?.videoUrl}.mp4`}
                                            playing={isPlayingAnalized}
                                            controls
                                            style={{ maxHeight: '300px', maxWidth: '100%', }}
                                            onPause={() => isPlayingAnalized(false)}
                                            onPlay={() => isPlayingAnalized(true)}
                                        />
                                    )}
                                    {selectedLeader?.analysisData && <VideoAnalyticsChart turnData={selectedLeader?.analysisData} />}
                                    {selectedLeader?.aiComment &&
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
                                        >
                                            {safeSliceMarkdown(selectedLeader?.aiComment, 145)}
                                        </Markdown>
                                    }
                                </Box>
                            }
                        </Box>
                    </SwipeableDrawer >
                }
            </>
        );
    }
    return <></>

}