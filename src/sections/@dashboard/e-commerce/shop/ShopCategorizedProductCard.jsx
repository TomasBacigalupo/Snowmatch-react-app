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

const ShopCategorizedProductCard = ({ level, product }) => {
    const id = product?.id;
    const price = product?.price ?? 0;
    const name = product?.name;
    const description = product?.description;
    const title = name;
    const capacity = 5;
    const time = 3;
    const color = getColor(level);
    const { user } = useAuth();
    const isTeacher = user?.role === 'TEACHER';
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();
    const linkTo = isTeacher ? PATH_DASHBOARD.eCommerce.viewSchoolProduct(id) : PATH_GUEST.viewProduct(id);

    const AnimatedContainer = styled(Paper)(({ level }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        position: 'relative',
        background: getColor(level),
        borderRadius: '16px',
        overflow: 'hidden',
        maxWidth: '100%',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200%',
            height: '100%',
            background: level === 'gold' ? `linear-gradient(135deg, transparent 10%, white 50%, transparent 90%)` : `linear-gradient(135deg, transparent 100%, white 50%, transparent 100%)`,
            animation: level === 'gold' ? `${movingShineAnimation} 3s linear 1 forwards` : "none",
        },
    }));

    return (
        <AnimatedContainer level={level} onClick={() => {
            trackExperience(product)
            navigate(linkTo)
        }}>
            <Box style={{ width: '100%' }}>
                <Box display='flex' style={{ width: '100%' }} justifyContent='space-between' alignItems='flex-start'>
                    <Box sx={{ maxWidth: '70%' }}>
                        <Typography 
                            variant={isMobile ? "h2" : "h4"} 
                            fontSize={isMobile ? 22 : 16} 
                            gutterBottom 
                            color={getTextColor(level)}
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
                    </Box>
                    <Typography 
                        variant={isMobile ? "h3" : "h4"} 
                        textAlign='end' 
                        color={getTextColor(level)}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {fCurrency(price)}
                        <Typography component='span' variant='body2' color={'disabled'}>
                            /{time}hs
                        </Typography>
                    </Typography>
                </Box>
                <Typography 
                    variant="body2" 
                    gutterBottom 
                    color={getTextColor(level)}
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {description}
                </Typography>
                <Box display='flex' flexDirection='row' position='absolute' right={16} bottom={10}>
                    <Icon component={Person} fontSize="small" sx={{ color: getTextColor(level) }} />
                    <Typography variant="body2" marginLeft="5px" color={getTextColor(level)}>1 - {capacity}</Typography>
                </Box>
            </Box>
        </AnimatedContainer>
    );
};

export default ShopCategorizedProductCard;
