import PropTypes from 'prop-types';
// @mui
import { Box, Typography } from '@mui/material';
// components
import { SkeletonProductItem, SkeletonProductCategory } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';
import { get, orderBy } from 'lodash';
import ShopStandardProductCard from './ShopStandardProductCard';
import useLocales from 'src/hooks/useLocales';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProductsByBusinessId } from 'src/redux/slices/business';
import ShopCategorizedProductCard from './ShopCategorizedProductCard';
import { fCurrency } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

ShopStandardProducts.propTypes = {
    teachers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function ShopStandardProducts({ loading }) {
    const { translate } = useLocales();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.business);
    useEffect(() => {
        dispatch(getProductsByBusinessId(13));
    }, []);
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                },
            }}
        >
            {loading && products && <SkeletonProductCategory />}
            {loading && products && <SkeletonProductCategory />}
            {loading && products && <SkeletonProductCategory />}

            {!loading && <ShopCategorizedProductCard
                product={products.find(product => product.id === 143)}
                level='gold'
            />}
            {!loading && <ShopCategorizedProductCard
                product={products.find(product => product.id === 144)}
                level='silver' />}
            {!loading && <ShopCategorizedProductCard
                product={products.find(product => product.id === 145)}
                level='bronze'
            />}
            <Typography variant='h5'>Experiencias</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                }}
            >
                {loading ? [...Array(5)].map((product, index) => <SkeletonProductItem key={index} />) : products.filter(product => ![143, 144, 145].includes(product.id)).map((product, index) =>
                    product ? <ShopStandardProductCard key={index} standardProduct={product} /> : <SkeletonProductItem key={index} />
                )}
            </Box>

        </Box>
    );
}