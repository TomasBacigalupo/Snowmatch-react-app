import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';
import { get, orderBy } from 'lodash';
import ShopStandardProductCard from './ShopStandardProductCard';
import useLocales from 'src/hooks/useLocales';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProductsByBusinessId } from 'src/redux/slices/business';

// ----------------------------------------------------------------------

ShopStandardProducts.propTypes = {
    teachers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function ShopStandardProducts({ loading }) {
    const { translate } = useLocales();
    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.business);
    useEffect(() => {
        dispatch(getProductsByBusinessId(1));
    }, []);
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                },
            }}
        >
            {loading ? [...Array(1)] : products.map((product, index) =>
                product ? <ShopStandardProductCard key={index} standardProduct={product} /> : <SkeletonProductItem key={index} />
            )}
        </Box>
    );
}