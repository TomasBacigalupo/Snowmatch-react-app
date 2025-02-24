import React from "react";
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
import { Close as CloseIcon, EmojiEvents as CrownIcon } from "@mui/icons-material";

// Datos del leaderboard
const leaderboardData = [
  { rank: 1, name: "Lorenzo Rutkoski", time: "1:14", speed: "41.1 km/h", date: "7 Oct 2020", avatar: "/path-to-avatar" },
  { rank: 2, name: "Emanuel Comita", time: "1:24", speed: "36.2 km/h", date: "2 Dec 2018", avatar: "/path-to-avatar" },
  { rank: 3, name: "Federico Curual", time: "1:25", speed: "35.8 km/h", date: "13 Jul 2019", avatar: "/path-to-avatar" },
  { rank: 4, name: "Cristian D'Alfonso", time: "1:27", speed: "35 km/h", date: "18 Nov 2018", avatar: "/path-to-avatar" },
  { rank: 5, name: "Flor Rainelli", time: "1:28", speed: "34.6 km/h", date: "17 Jun 2019", avatar: "/path-to-avatar" },
  { rank: 87, name: "Tomas Bacigalupo", time: "2:10", speed: "23.4 km/h", date: "8 Oct 2024", avatar: "/path-to-avatar", isUser: true },
];

export default function LeaderBoardRightDrawer({ open, onClose, onOpen }) {
  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      PaperProps={{
        sx: {
          width: "100vw",
          maxWidth: "100vw",
          padding: 2,
        },
      }}
    >
      {/* Encabezado con filtros */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Leaderboards</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={1} mt={2} justifyContent="center">
        <Chip label="All-Time" color="primary" variant="filled" />
        <Chip label="All-Time (Men)" variant="outlined" />
        <Chip label="All-Time (Women)" variant="outlined" />
        <Chip label="This Year" variant="outlined" />
      </Stack>

      {/* Mejor tiempo destacado */}
      <Box mt={3} textAlign="center">
        <Avatar src={leaderboardData[0].avatar} sx={{ width: 80, height: 80, mx: "auto" }} />
        <Typography variant="h4" fontWeight="bold">{leaderboardData[0].time}</Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CrownIcon sx={{ color: "gold", mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">{leaderboardData[0].name}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Lista del leaderboard */}
      <List>
        {leaderboardData.map((athlete, index) => (
          <React.Fragment key={athlete.rank}>
            <ListItem
              sx={{
                backgroundColor: athlete.isUser ? "rgba(255, 165, 0, 0.2)" : "transparent",
                borderRadius: athlete.isUser ? 2 : 0,
              }}
            >
              <Typography variant="h6" sx={{ width: 30, fontWeight: athlete.rank === 1 ? "bold" : "normal" }}>
                {athlete.rank}
              </Typography>
              <ListItemAvatar>
                <Avatar src={athlete.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={athlete.name}
                secondary={`${athlete.time} • ${athlete.speed}`}
              />
              <Typography variant="body2" color="text.secondary">{athlete.date}</Typography>
            </ListItem>
            {index < leaderboardData.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {/* Sección de mejora personal */}
      <Box mt={2} textAlign="center" p={2} sx={{ backgroundColor: "#f7f7f7", borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Top 34%</strong> - Take <strong>13s</strong> off to move up <strong>35 spots</strong>
        </Typography>
      </Box>
    </SwipeableDrawer>
  );
}