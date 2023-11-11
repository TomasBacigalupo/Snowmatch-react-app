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
import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import TeacherDetailsReview from './TeacherDetailsReview';

// ----------------------------------------------------------------------

TeacherDetailsMobileReview.propTypes = {
    teacher: PropTypes.object,
    openForm: PropTypes.bool
};

export default function TeacherDetailsMobileReview({ teacher, openForm = false }) {
    const [reviewBox, setReviewBox] = useState(openForm);
    const navigate = useNavigate()
    const { isStudent } = useAuth()

    const [open, setOpen] = React.useState(false);

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
            <TeacherDetailsReviewList teacher={teacher} horizontal={true} />

            <Box sx={{ pt: 3, px: 2, pb: 2 }}>
                <Button onClick={() => setOpen(true)} variant='outlined' fullWidth={true}>Mostrár más reviews</Button>
            </Box>
            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', height: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                        borderTopRightRadius: '12px'
                    }
                }}
            >
                <Grid>
                    <Grid item xs={12} p={2} pb={0}>
                        <IconButton onClick={() => setOpen(false)}>
                            <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                </Grid>
                <TeacherDetailsReview teacher={teacher} />
            </Drawer>
        </>
    );
}
