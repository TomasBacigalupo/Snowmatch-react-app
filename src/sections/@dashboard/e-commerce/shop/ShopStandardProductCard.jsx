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
import { fCurrency } from 'src/utils/formatNumber';
import { useTranslation } from 'react-i18next';
import { trackExperience } from 'src/services/facebook';
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
    const { t } = useTranslation();

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
        return price
    }

    const hasDiscount = totalDays > 100

    return (
        <Box onClick={() => {
            trackExperience(standardProduct)
            navigate(linkTo)
        }}>
            <Box sx={{ position: 'relative' }}>
                <Image alt={name} src={src}
                    ratio="1/1" onError={() => setSrc('/assets/notFound.jpeg')} sx={{ borderRadius: '10px' }} />
            </Box>
            <Stack sx={{ pt: 1 }}>
                <Stack direction="row" spacing={0.5}>
                    <Typography variant='h5' component="span" >
                        {name}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant='body2'>{t(`product.${id}.descriptionPreview`)}</Typography>
                </Stack>
                {/* Persons */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="mdi:account-group" width={20} height={20} />
                    <Typography component="span" sx={{ color: 'text.disabled', }}>
                        {ageFrom} - {ageTo} años
                    </Typography>
                </Stack>
                <Stack spacing={0}>
                    <Stack direction="col" spacing={0.5}>
                        {hasDiscount && <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                            {fCurrency(price)}
                        </Typography>}
                        <Typography variant="subtitle1">
                            {fCurrency(calculatePriceWithDiscount(price))} <Typography component="span" >
                                /3hs
                            </Typography>
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}
