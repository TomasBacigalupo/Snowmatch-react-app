import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Divider, Collapse, Box } from '@mui/material';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import TeacherDetailsReviewList from './TeacherDetailsReviewList';
import TeacherDetailsReviewOverview from './TeacherDetailsReviewOverview';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router';
import { dispatch } from 'src/redux/store';
import { setRequestedRoute } from 'src/redux/slices/config';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

TeacherDetailsMobileReview.propTypes = {
    teacher: PropTypes.object,
    openForm: PropTypes.bool
};

export default function TeacherDetailsMobileReview({ teacher, openForm = false }) {
    const [reviewBox, setReviewBox] = useState(openForm);
    const navigate = useNavigate()
    const { isStudent } = useAuth()

    const handleOpenReviewBox = () => {
        if (isStudent) {
            setReviewBox((prev) => !prev);
        } else {
            dispatch(setRequestedRoute(`/match/teacher/${teacher.id}`))
            navigate('review')
        }

    };

    const handleCloseReviewBox = () => {
        setReviewBox(false);
    };

    return (
        <>
            <TeacherDetailsReviewOverview teacher={teacher} onOpen={handleOpenReviewBox} />

            {/* Review Form */}
            {/* <Collapse in={reviewBox}>
        <ProductDetailsReviewForm onClose={handleCloseReviewBox} id="move_add_review" teacherId={teacher.id}/>
        <Divider />
      </Collapse> */}

            {/* <TeacherDetailsReviewList teacher={teacher} /> */}
            <Box sx={{ pt: 3, px: 2, pb: 2 }}>

                <Button variant='outlined' fullWidth={true}>Mostrár más reviews</Button>
            </Box>
        </>
    );
}
