import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopTeacherCard from './ShopTeacherCard';
import SchoolCard from './SchoolCard';

// ----------------------------------------------------------------------

SchoolCardList.propTypes = {
  businesses: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function SchoolCardList({ businesses, loading }) {
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
      {(loading ? [...Array(12)] : businesses).map((business, index) =>
        business ? <SchoolCard key={business.id} business={business} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
