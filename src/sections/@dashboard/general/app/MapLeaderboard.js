import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Avatar, Button } from '@mui/material';
import { styled } from '@mui/system';
import mapImage from '../../../../assets/map.png'; // Update with your actual path
import { dispatch, useSelector } from 'src/redux/store';
import { getLeaderBoard } from 'src/redux/slices/video';
import { EmojiEvents as CrownIcon } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  marginTop: '10px',
  borderRadius: '0'
}));

const ImageBox = styled(Box)({
  height: 200,
  backgroundImage: `url(${mapImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
});


const MapLeaderboard = () => {
  const { leaders } = useSelector(state => state.video)
  useEffect(() => {
    dispatch(getLeaderBoard("GENERAL"))
  }, [])
  return (
    <StyledCard>
      {leaders && leaders.length > 0 && <Box mt={3} textAlign="center">
        <Avatar src={""} sx={{ width: 80, height: 80, mx: "auto" }} />
        <Typography variant="h4" fontWeight="bold">{leaders[0].score}</Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CrownIcon sx={{ color: "gold", mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">{leaders[0].user.name}</Typography>
        </Box>
      </Box>}
      <CardContent>
        <Typography variant="h4" fontWeight="bold">
          Leaderboard
        </Typography>
        <Typography variant="p4" color="text.secondary">
          See how other skiers are doing
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default MapLeaderboard;
