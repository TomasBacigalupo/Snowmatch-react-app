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
import useLocales from "src/hooks/useLocales";
import LeaderDetailsDrawer from './LeaderDetailsDrawer';

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
    const { translate } = useLocales();
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
                    <MobileHeader onBack={onClose} title={translate('leaderboard.title')} />
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
                            <Avatar src={leaders[0].user.imageS3} sx={{ width: 80, height: 80, mx: "auto" }} />
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
                                            <Avatar src={video.user.imageS3} />
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
                                {translate('leaderboard.improvement', {
                                    percent: '34',
                                    time: '13',
                                    spots: '35'
                                })}
                            </Typography>
                        </Box>
                    </Box>
                </SwipeableDrawer>
                {selectedLeader && (
                    <LeaderDetailsDrawer
                        selectedLeader={selectedLeader}
                        open={openLeaderDetails}
                        onClose={() => setOpenLeaderDetails(false)}
                        onOpen={() => setOpenLeaderDetails(true)}
                        isPlayingAnalized={isPlayingAnalized}
                        setIsPlayingAlaized={setIsPlayingAlaized}
                    />
                )}
            </>
        );
    }
    return <></>

}