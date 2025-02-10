import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/IosShare';
import { Share } from '@capacitor/share';


const ShareButton = ({ teacherName }) => {
  const current_location = window.location.href;  
  const shareData = {
    title: `Vení a esquiar con ${teacherName}!`,
    text: `Vení a esquiar con ${teacherName}!`,
    url: `https://snowmatch.pro${current_location.split('localhost')[1]}`,
    dialogTitle: 'Share with buddies',
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        //await navigator.share(shareData);
        await Share.share(shareData);
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      console.error('Web Share API is not supported in your browser.');
    }
  };
  
  return (
    <IconButton onClick={handleShare} style={shareButtonStyle}>
      <ShareIcon />
    </IconButton>
  );
};

ShareButton.propTypes = {
  teacherName: PropTypes.string.isRequired,
};

const shareButtonStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.25)', // Grey background with some transparency
  color: '#fff', // White color for the icon
  borderRadius: '50%', // Fully rounded
  padding: '8px', // Padding to make it a bit bigger and circular
  cursor: 'pointer',
};

export default ShareButton;
