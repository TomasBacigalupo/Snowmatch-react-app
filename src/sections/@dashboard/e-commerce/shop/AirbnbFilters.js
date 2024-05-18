import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Star, StarBorder, Grade, GradeOutlined, GradeTwoTone } from '@mui/icons-material';
import { useDispatch, useSelector } from 'src/redux/store';
import { setLevel } from 'src/redux/slices/teachers';

const AirbnbFilters = () => {
    const { filters } = useSelector((state) => state.teachers);
    const dispatch = useDispatch();
    const { level } = filters;
    const filtersOptions = [
        { name: 'Super Instructores', icon: <Star />, level: 5 },
        { name: 'Cracks', icon: <StarBorder />, level: 4 },
        { name: 'Profesionales', icon: <Grade />, level: 3 },
        { name: 'Certificados', icon: <GradeOutlined />, level: 2 },
    ];
    return (
        <Box sx={{ display: 'flex', overflowX: 'auto', padding: '8px 0', scrollbarWidth: 'none' }}>
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
