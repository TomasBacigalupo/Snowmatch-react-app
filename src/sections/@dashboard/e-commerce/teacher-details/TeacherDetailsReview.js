import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Divider, Collapse } from '@mui/material';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import TeacherDetailsReviewList from './TeacherDetailsReviewList';
import TeacherDetailsReviewOverview from './TeacherDetailsReviewOverview';

// ----------------------------------------------------------------------

TeacherDetailsReview.propTypes = {
  teacher: PropTypes.object,
};

export default function TeacherDetailsReview({ teacher }) {
  console.log("review", teacher);  
  const [reviewBox, setReviewBox] = useState(false);
  const { rates } = teacher.rates;

  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  return (
    <>
      <TeacherDetailsReviewOverview teacher={teacher} onOpen={handleOpenReviewBox} />

      <Divider />

      <Collapse in={reviewBox}>
        <ProductDetailsReviewForm onClose={handleCloseReviewBox} id="move_add_review" />
        <Divider />
      </Collapse>

      <TeacherDetailsReviewList teacher={teacher} />
    </>
  );
}
