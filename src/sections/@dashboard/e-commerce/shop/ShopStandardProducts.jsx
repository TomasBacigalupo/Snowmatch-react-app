import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';
import { orderBy } from 'lodash';
import ShopStandardProductCard from './ShopStandardProductCard';

// ----------------------------------------------------------------------

ShopStandardProducts.propTypes = {
    teachers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function ShopStandardProducts({ teachers, loading }) {
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
                name: "Parejas",
                imageLink: "https://images.unsplash.com/photo-1612836812163-3c2c3e4d4a0b",
                information: "Si estas con tu pareja y quieren aprender juntos, esta es la opción para ustedes. No se peleen :)",
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