import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'src/redux/store';
import { setLevel } from 'src/redux/slices/teachers';
import Iconify from 'src/components/Iconify';

const AirbnbFilters = () => {
    const { filters } = useSelector((state) => state.teachers);
    const dispatch = useDispatch();
    const { level } = filters;
    const filtersOptions = [
        { name: 'Super Instructores', icon: <Iconify icon="mdi:crown-circle-outline" />, level: 5 },
        { name: 'Cracks', icon: <Iconify icon="mdi:trophy-outline"/>, level: 4 },
        { name: 'Profesionales', icon: <Iconify icon="mdi:medal-outline" />, level: 3 },
        { name: 'Certificados', icon: <Iconify icon="ph:person-simple-ski-fill" />, level: 2 },
    ];
    return (
        <Box sx={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {filtersOptions.map((filter, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '8px',
                        margin: '0 5px',
                        backgroundColor: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#ffffff',
                        },
                    }}
                    onClick={() => dispatch(setLevel(filter.level))}
                >
                    <IconButton sx={{
                        color: `${filter.level === level ? 'primary.main' : 'disabled'}`,
                        '&:hover': {
                            backgroundColor: '#ffffff',
                        },
                    }}>
                        {filter.icon}
                    </IconButton>
                    <Typography variant="body2" textAlign="center"
                        color={`${filter.level === level ? 'primary.main' : 'disabled'}`}>
                        {filter.name}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default AirbnbFilters;
