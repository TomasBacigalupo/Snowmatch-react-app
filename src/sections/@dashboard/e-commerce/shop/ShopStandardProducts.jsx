import PropTypes from 'prop-types';
// @mui
import { Box, Grid, Typography } from '@mui/material';
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
import { getFreeTeachers } from 'src/redux/slices/teachers';
import ShopCategorizedProductAvatarCard from './ShopCategorizedProductAvatarCard';
import SchoolProducts from './SchoolProducts';
// ----------------------------------------------------------------------

ShopStandardProducts.propTypes = {
    teachers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function ShopStandardProducts({ loading }) {
    const { translate } = useLocales();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.business);
    const { teachers, sortBy, filters, teachersWithEvents, category, isLoading } = useSelector((state) => { return state.teachers })

    useEffect(() => {
        // prod
        dispatch(getProductsByBusinessId(13));
        //    dispatch(getProductsByBusinessId(1));
    }, []);

    useEffect(() => {
        dispatch(getFreeTeachers(filters.from, filters.to, filters.resort, 0));
        //dispatch(getTeachersWithEvents(filters));
    }, [dispatch, filters]);
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(1, 1fr)',
                },
                maxWidth: '100vw',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            {loading && products && <SkeletonProductCategory />}
            {loading && products && <SkeletonProductCategory />}
            {loading && products && <SkeletonProductCategory />}
            {!loading && filters.resort === "Cerro Catedral" && <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>{!loading && filters.resort === "Cerro Catedral" &&
                    <ShopCategorizedProductCard
                        product={products.find(product => product.id === 143)}
                        level='gold'
                    />}
                </Grid>
                <Grid item xs={12} md={6} lg={4}>{!loading && filters.resort === "Cerro Catedral" && <ShopCategorizedProductAvatarCard
                    product={products.find(product => product.id === 144)}
                    level='silver'
                    avatar='/assets/avatars/chona-con-adulto.png'
                />}
                </Grid>
                <Grid item xs={12} md={6} lg={4}> {!loading && filters.resort === "Cerro Catedral" && <ShopCategorizedProductAvatarCard
                    product={products.find(product => product.id === 145)}
                    level='bronze'
                    avatar='/assets/avatars/chona-con-niño.png'
                />}
                </Grid>
                {filters.resort === "Cerro Catedral" && <Grid item xs={12}>
                    <Typography variant='h6'>
                        Packs de SnowMatch
                    </Typography>
                </Grid>}
            </Grid>}
            {
                filters.resort === "Cerro Catedral" && <SchoolProducts products={products} isLoading={isLoading} />
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        O elegí tu pro ideal
                    </Typography>
                </Grid>
            </Grid>
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
                    maxWidth: '100%',
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                {loading ? [...Array(5)].map((product, index) => <SkeletonProductItem key={index} />) : teachers.map((teacher, index) =>
                    teacher ? <ShopTeacherCard key={index} teacher={teacher} /> : <SkeletonProductItem key={index} />
                )}
            </Box>

        </Box>
    );
}