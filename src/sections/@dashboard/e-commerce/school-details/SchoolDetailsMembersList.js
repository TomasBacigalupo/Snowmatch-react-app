import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
import { SchoolMemberCard } from '.';
import { useEffect } from 'react';
//

// ----------------------------------------------------------------------

SchoolDetailsMembersList.propTypes = {
  teachers: PropTypes.array,
  loading: PropTypes.bool,
};

export default function SchoolDetailsMembersList({ teachers, loading }) {

    useEffect(() => {
        console.log(teachers)
      }, [ teachers]);
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
      {(loading? [...Array(12)] : teachers).map((teacher, index) =>
        teacher ? <SchoolMemberCard key={teacher.id} teacher={teacher} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
