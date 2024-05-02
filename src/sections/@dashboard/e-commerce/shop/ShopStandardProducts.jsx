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
        console.log(products);
    }, []);
    useEffect(() => {
        console.log(products);
    }, [products]);
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
            {(loading ? [...Array(1)] : [{
                name: translate("standardProduct.title.couples"),
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: translate("standardProduct.description.couples"),
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 2,
                price: 130,
                priceBefore: 150
            }, {
                name: "Amigos",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu grupo de amigos y quieren aprender juntos, esta es la opción para ustedes",
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 6,
                price: 130,
                priceBefore: 150
            }, {
                name: "Familia",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu familia y quieren aprender juntos, esta es la opción para ustedes",
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 4,
                price: 130,
                priceBefore: 150
            }, {
                name: "Iniciantes",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu familia y quieren aprender juntos, esta es la opción para ustedes",
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 4,
                price: 130,
                priceBefore: 150
            }, {
                name: "Niños",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu familia y quieren aprender juntos, esta es la opción para ustedes",
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 4,
                price: 130,
                priceBefore: 150
            }, {
                name: "FreeStyle",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu familia y quieren aprender juntos, esta es la opción para ustedes",
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 4,
                price: 130,
                priceBefore: 150
            }, {
                name: "Avanzados",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu familia y quieren aprender juntos, esta es la opción para ustedes",
                resorts: ["resort1", "resort2"],
                id: 1,
                people: 4,
                price: 130,
                priceBefore: 150
            }]).map((product, index) =>
                product ? <ShopStandardProductCard key={index} standardProduct={product} /> : <SkeletonProductItem key={index} />
            )}
        </Box>
    );
}