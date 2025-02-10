import React from 'react';
import { styled } from '@mui/material/styles';

const HighlightedText = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold', // Make the text bold
}));

export const formatTextWithHighlight = (text) => {
  if (!text.includes('SnowMatch')) return text;

  const parts = text.split(/(SnowMatch)/g);

  return parts.map((part, index) =>
    part === 'SnowMatch' ? (
      <HighlightedText key={index}>{part}</HighlightedText>
    ) : (
      part
    )
  );
};