import React from 'react';
import { Paper, Typography, Box, Icon, useTheme, useMediaQuery } from '@mui/material';
import { Person } from '@mui/icons-material';
import { fCurrency } from 'src/utils/formatNumber';
import { PATH_DASHBOARD, PATH_GUEST } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import { styled, keyframes } from '@mui/system';
import { trackExperience } from 'src/services/facebook';
import useAuth from 'src/hooks/useAuth';
const getColor = (level) => {
    switch (level) {
        case 'bronze':
            return '#b87333'; // Adjusted bronze color
        case 'silver':
            return '#c0c0c0'; // Silver color
        case 'gold':
            return 'black'; // Gold color
        default:
            return '#000000'; // Default color
    }
};

const getTextColor = (level) => {
    switch (level) {
        case 'bronze':
            return 'black'; // Adjusted bronze color
        case 'silver':
            return 'black'; // Silver color
        case 'gold':
            return '#ffd700'; // Gold color
        default:
            return 'black'; // Default color
    }
};

const getSecondColor = (level) => {
    switch (level) {
        case 'bronze':
            return '#b87333'; // Adjusted bronze color
        case 'silver':
            return '#e1e1e1'; // Silver color
        case 'gold':
            return 'black'; // Gold color
        default:
            return '#000000'; // Default color
    }
};

const movingShineAnimation = keyframes`
    0% {
        transform: translateX(-150%);
    }
    100% {
        transform: translateX(100%);
    }
`;

const ShopCategorizedProductAvatarCard = ({ level, product, avatar = '/assets/avatars/chona-con-niño.jpg', time = 3 }) => {
    const id = product?.id;
    const price = product?.price ?? 0;
    const name = product?.name;
    const description = product?.description;
    const title = name;
    const capacity = 5;
    const { user } = useAuth();
    const isTeacher = user?.role === 'TEACHER';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const linkTo = isTeacher ? PATH_DASHBOARD.eCommerce.viewSchoolProduct(id) : PATH_GUEST.viewProduct(id);

    const AnimatedContainer = styled(Paper)(({ level }) => ({
        display: 'flex',
        alignItems: 'flex-start',
        padding: '8px',
        position: 'relative',
        background: 'white',
        borderRadius: '16px',
        border: '1px solid black',
        overflow: 'hidden',
        maxWidth: '100%',
        gap: '8px',
        height: isMobile ? '80px' : '105px',
    }));

    return (
        <AnimatedContainer level={level} onClick={() => {
            trackExperience(product)
            navigate(linkTo)
        }}>
            <img
                src={avatar}
                alt={name}
                style={{
                    width: isMobile ? 64 : 80,
                    height: isMobile ? 64 : 80,
                    objectFit: 'cover',
                    borderRadius: '8px'
                }}
            />
            <Box style={{ width: '100%' }}>
                <Box display='flex' style={{ width: '100%' }} justifyContent='space-between' alignItems='flex-start'>
                    <Box sx={{ maxWidth: '70%' }}>
                        <Box display='flex' alignItems='flex-start' gap={1}>
                            <Typography 
                                variant={isMobile ? "h2" : "h4"} 
                                fontSize={isMobile ? 22 : 16} 
                                color="black"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {title}
                            </Typography>
                            <Box display='flex' alignItems='center' sx={{ mt: 0.5 }}>
                                <Icon component={Person} fontSize="small" sx={{ color: 'black' }} />
                                <Typography variant="body2" marginLeft="5px" color="black">1 - {capacity}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Typography 
                        variant="h5" 
                        textAlign='end' 
                        color="black"
                        sx={{ 
                            whiteSpace: 'nowrap',
                            fontSize: isMobile ? 18 : 16
                        }}
                    >
                        {fCurrency(price)}
                    </Typography>
                </Box>
                <Typography 
                    variant="body2" 
                    gutterBottom 
                    color="black"
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mt: 0.5
                    }}
                >
                    {time}hs - {description}
                </Typography>
            </Box>
        </AnimatedContainer>
    );
};

export default ShopCategorizedProductAvatarCard;
