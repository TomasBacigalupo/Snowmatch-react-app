import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';

// ----------------------------------------------------------------------

ShopTeacherList.propTypes = {
  teachers: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function ShopTeacherList({ teachers, loading }) {
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
      {(loading ? [...Array(12)] : teachers).map((teacher, index) =>
        teacher ? <ShopTeacherCard key={teacher.id} teacher={teacher} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
