import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack, Tooltip, Rating } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import { useSelector } from 'src/redux/store';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Iconify from 'src/components/Iconify';
import useLocales from 'src/hooks/useLocales';
// ----------------------------------------------------------------------

ShopStandardProductCard.propTypes = {
    teacher: PropTypes.object,
};

export default function ShopStandardProductCard({ teacher }) {
    const { name, lastname, imageLink, information, email, resorts, id, eventsList, stars } = teacher;
    const { filters } = useSelector(state => state.teachers)
    const navigate = useNavigate();
    const [src, setSrc] = useState(imageLink)
    const {translate} = useLocales()

    const { isTeacher } = useAuth()
    const linkTo = isTeacher ? PATH_DASHBOARD.eCommerce.viewTeacher(id) : PATH_GUEST.viewTeacher(id);

    const getResortToShow = () => {
        if (resorts && resorts?.length > 1) {
            if (resorts?.find(r => r === filters.resort)) {
                return filters.resort
            }
        }
        return resorts[0]
    }

    return (
        <Card onClick={() => navigate(linkTo)}>
            <Box sx={{ position: 'relative' }}>
                <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} />
            </Box>


            <Stack spacing={2} sx={{ p: 3 }}>
                <Stack direction="row" spacing={0.5}>
                    <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                        $USD 150
                    </Typography>
                    <Typography variant="subtitle1"> $USD 130</Typography>
                    
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                   {information}
                </Stack>
                {/* Persons */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="mdi:account-group" width={20} height={20} />
                    <Typography component="span" sx={{ color: 'text.disabled', }}>
                        1-5
                    </Typography>
                </Stack>
                
            </Stack>
        </Card>
    );
}
