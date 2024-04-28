import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
import { SchoolMemberCard } from '.';
import { useEffect, useState } from 'react';
import { ShopProductCard } from '../shop';
import SchoolNotLinkedDialog from './SchoolNotLinkedDialog';
import product from 'src/redux/slices/product';
//

// ----------------------------------------------------------------------

SchoolDetailsProductList.propTypes = {
    products: PropTypes.array,
    loading: PropTypes.bool,
    siteUrl: PropTypes.string,
};

export default function SchoolDetailsProductList({ products, loading, siteUrl }) {
    const [open, setOpen] = useState(false);
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 3,
                overflowX: 'scroll',
                WebkitOverflowScrolling: 'touch',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            {/* <SchoolNotLinkedDialog open={open} onClose={()=> setOpen(false)} siteUrl={siteUrl}/> */}
            <Box
                sx={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridGap: 3,
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                    },
                    py: 1,
                }}
            >
                {(loading ? [...Array(12)] : products).map((product, index) =>
                    product ? (
                        <ShopProductCard key={index} product={product} />
                    ) : (
                        <SkeletonProductItem key={index} />
                    )
                )}
            </Box>
        </Box>
    );
}

