import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';
import ShopOtherTeacherCard from './ShopOtherTeacherCard';

// ----------------------------------------------------------------------

ShopOtherTeacherList.propTypes = {
    teachers: PropTypes.array.isRequired,
    loading: PropTypes.bool,
};

export default function ShopOtherTeacherList({ teachers, loading }) {
    return (
        <Box
            sx={{
                display: 'grid',
                gap: 2,
                overflowX: 'auto',
                py: 2,
                px: 1,
                gridTemplateColumns: '100%',
                gridAutoColumns: '100%',
                gridAutoFlow: 'column',
            }}
        >
            {(loading ? [...Array(12)] : teachers).map((teacher, index) =>
                teacher ? (
                    <ShopOtherTeacherCard teacher={teacher} />
                ) : (
                    <SkeletonProductItem key={index} />
                )
            )}
        </Box>
    );
}
