import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Avatar, Button } from '@mui/material';
import { styled } from '@mui/system';
import mapImage from '../../../../assets/map.png'; // Update with your actual path
import { dispatch, useSelector } from 'src/redux/store';
import { getLeaderBoard } from 'src/redux/slices/video';
import { EmojiEvents as CrownIcon } from "@mui/icons-material";
import useLocales from 'src/hooks/useLocales';

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
  const { translate } = useLocales();
  
  useEffect(() => {
    dispatch(getLeaderBoard("GENERAL"))
  }, [])
  return (
    <StyledCard>
      {leaders && leaders.length > 0 && <Box mt={3} textAlign="center">
        <Avatar src={leaders[0]?.user?.imageS3} sx={{ width: 80, height: 80, mx: "auto" }} />
        <Typography variant="h4" fontWeight="bold">{leaders[0].score}</Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CrownIcon sx={{ color: "gold", mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">{leaders[0].user.name}</Typography>
        </Box>
      </Box>}
      <CardContent>
        <Typography variant="h4" fontWeight="bold">
          {translate('leaderboard.title')}
        </Typography>
        <Typography variant="p4" color="text.secondary">
          {translate('leaderboard.description')}
        </Typography>
        <Box mt={3} display="flex" justifyContent="center">
          <Button 
            fullWidth
            variant="outlined" 
            color="inherit"
            sx={{ 
              borderColor: 'black',
              color: 'black',
              '&:hover': {
                borderColor: 'black',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            {translate('leaderboard.title')}
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default MapLeaderboard;
