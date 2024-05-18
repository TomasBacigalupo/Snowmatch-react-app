import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Icon, Grid } from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';
import { padding } from '@mui/system';
import { fCurrency } from 'src/utils/formatNumber';
import { PATH_GUEST } from 'src/routes/paths';
import { useNavigate } from 'react-router';

const ShopCategorizedProductCard = ({level, product}) => {
    const id = product?.id;
    const price = product?.price ?? 0;
    const name = product?.name;
    const description = 'Clase de esquí';
    const title = name;
    const capacity = 5;
    const time = 3;
    const getColor = (level) => {
        switch (level) {
            case 'bronze':
                return '#b87333'; // Adjusted bronze color
            case 'silver':
                return '#c0c0c0'; // Color plata
            case 'gold':
                return '#ffd700'; // Color oro
            default:
                return '#000000'; // Color por defecto
        }
    };

    const color = getColor(level);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setAnimate(true);
    }, []);

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        paddingTop: '8px',
        paddingBottom: '16px',
        paddingRight: '8px',
        paddingLeft: '8px',
        background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`, // Gradient background with more metallic shades
        boxShadow: `0px 2px 2px rgba(0, 0, 0, 0.2)`, // Slightly increased box shadow for depth
        position: 'relative', // Required for absolute positioning of time and capacity
        animation: animate ? '8s rotate linear infinite' : 'none', // Animation conditionally applied
    };

    const medalStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: color,
        marginRight: '16px',
    };

    const iconContainerStyle = {
        position: 'absolute',
        bottom: '5px',
        left: '5px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    };
    const linkTo = PATH_GUEST.viewProduct(id);
    const navigate = useNavigate();
    

    return (
        <Paper style={containerStyle} onClick={() => navigate(linkTo)}>
            <Box style={{ width: '100%' }}>
                <Box display='flex' style={{ width: '100%' }} justifyContent='space-between' alignItems='flex-start'>
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            {title}
                        </Typography>
                    </Box>

                    <Typography variant="h3" textAlign='end'>
                        {fCurrency(price)}
                        <Typography component='span' variant='body2' color={'disabled'}>
                            /{time}hs
                        </Typography>
                    </Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                    {description}
                </Typography>
                <Box display='flex' flexDirection='row' position='absolute' right={10} bottom={5}>
                    <Icon component={Person} fontSize="small" />
                    <Typography variant="body2" marginLeft="5px">1 - {capacity}</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default ShopCategorizedProductCard;

