import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../../routes/paths';
// components
import Image from '../../../../components/Image';
import useAuth from 'src/hooks/useAuth';
import { useState } from 'react';
import { useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

ShopOtherTeacherCard.propTypes = {
    teacher: PropTypes.object,
};

export default function ShopOtherTeacherCard({ teacher }) {
    const { name, lastname, imageLink, resorts, id, information } = teacher;
    const { filters } = useSelector(state => state.teachers);
    const navigate = useNavigate();
    const [src, setSrc] = useState(imageLink);

    const { isTeacher } = useAuth();
    const linkTo = isTeacher ? PATH_DASHBOARD.eCommerce.viewTeacher(id) : PATH_GUEST.viewTeacher(id);

    const getResortToShow = () => {
        if (resorts && resorts?.length > 1) {
            if (resorts?.find(r => r === filters.resort)) {
                return filters.resort;
            }
        }
        return resorts[0];
    };

    return (
        <Card sx={{ width: '100%', flex: 1 }} onClick={() => navigate(linkTo)}>
            <Box sx={{ display: 'flex', height: 'fit-content' }}>
                <Box sx={{ flex: 1, maxWidth: '30%', minWidth: '30%', mr: 3 }}>
                    <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} sx={{ width: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Link to={linkTo} color="inherit" component={RouterLink}>
                            <Typography variant="subtitle2" noWrap>
                                {name + ' ' + lastname}
                            </Typography>
                        </Link>
                        {resorts && (
                            <Typography component="span" sx={{ color: 'text.secondary' }}>
                                {getResortToShow()}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Card>
    );
}
