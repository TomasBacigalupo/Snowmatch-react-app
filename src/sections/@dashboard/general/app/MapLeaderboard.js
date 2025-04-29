import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { styled } from '@mui/system';
import mapImage from '../../../../assets/map.png'; // Update with your actual path

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
    return (
      <StyledCard>
        <ImageBox>
        </ImageBox>
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
  