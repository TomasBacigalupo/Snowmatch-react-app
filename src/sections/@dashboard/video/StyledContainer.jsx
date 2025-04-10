import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f7',
    margin: '0 -16px 0 -16px', // Negative margin to extend background
    pt: '0px',
    mt: '0px',
    '& > *:not(:last-child)': {
        marginBottom: '12px', // Spacing between white cards
    },
    '& .white-card': { // Class for white background elements
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
    }
}));

const StyledContainer = ({ children }) => {
    return <StyledBox>{children}</StyledBox>;
};

export default StyledContainer; 