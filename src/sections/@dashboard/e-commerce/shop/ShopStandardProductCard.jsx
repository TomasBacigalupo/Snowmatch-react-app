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
    standardProduct: PropTypes.object,
};

export default function ShopStandardProductCard({ standardProduct }) {
    const { name, imageLink, description, resorts, id, people, price, ageTo, ageFrom, studentLevel } = standardProduct;
    const { filters } = useSelector(state => state.teachers)
    const { from, to } = filters;
    const navigate = useNavigate();
    const [src, setSrc] = useState(imageLink)
    const { translate } = useLocales()

    const { isTeacher } = useAuth()
    const linkTo = isTeacher ? PATH_DASHBOARD.eCommerce.viewProduct(id) : PATH_GUEST.viewProduct(id);
    const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24))
    const getResortToShow = () => {
        if (resorts && resorts?.length > 1) {
            if (resorts?.find(r => r === filters.resort)) {
                return filters.resort
            }
        }
        return resorts[0]
    }

    const calculatePriceWithDiscount = (price) => {
        if (totalDays > 2) {
            return price * 0.9
        }
        if (totalDays > 3) {
            return price * 0.8
        }
        return price
    }

    const hasDiscount = totalDays > 2

    return (
        <Card onClick={() => navigate(linkTo)}>
            {console.log('product', standardProduct)}
            {console.log('filters', filters)}
            <Box sx={{ position: 'relative' }}>
                <Image alt={name} src={src} ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} />
            </Box>


            <Stack spacing={2} sx={{ p: 3 }}>
                <Stack direction="row" spacing={0.5}>
                    <Typography variant='h5' component="span" >
                        {name}
                    </Typography>

                </Stack>
                <Stack spacing={0}>
                    <Stack direction="row" spacing={0.5}>
                        {hasDiscount && <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                            ${price}
                        </Typography>}
                        <Typography variant="subtitle1">
                            ${calculatePriceWithDiscount(price)} <Typography component="span" >
                                1/2 día
                            </Typography>
                        </Typography>
                        <Typography variant="subtitle1">
                            <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'underline' }}>
                                {`$${calculatePriceWithDiscount(price) * totalDays} total`}
                            </Typography>
                        </Typography>

                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                        {hasDiscount && <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                            ${price * 2}
                        </Typography>}
                        <Typography variant="subtitle1">
                            ${calculatePriceWithDiscount(price) * 2}<Typography component="span" > día</Typography>
                        </Typography>
                        <Typography variant="subtitle1">
                            <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'underline' }}>
                                {`$${calculatePriceWithDiscount(price) * 2 * totalDays} total`}
                            </Typography>
                        </Typography>
                    </Stack>

                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {description}
                </Stack>
                {/* Persons */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="mdi:account-group" width={20} height={20} />
                    <Typography component="span" sx={{ color: 'text.disabled', }}>
                        {ageFrom} - {ageTo} años
                    </Typography>
                </Stack>

            </Stack>
        </Card>
    );
}
