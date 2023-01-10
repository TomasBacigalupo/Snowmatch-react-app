import PropTypes from 'prop-types';
// @mui
import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useEffect } from 'react';
import { SkeletonProductItem } from '../../../../components/skeleton';
// Teacher Card
import ShopTeacherCard from './ShopTeacherCard';
import PendingTeacherCard from './PendingTeacherCard';
import MemberTeacherCard from './MemberTeacherCard';
import { useDispatch, useSelector } from 'react-redux';
import useLocales from 'src/hooks/useLocales';
import { closeFireModal, fireTeacher, hireTeacher } from 'src/redux/slices/business';
import { DialogAnimate } from 'src/components/animate';
import { LoadingButton } from '@mui/lab';
import HoverButton from 'src/components/HoverButton';
import Iconify from 'src/components/Iconify';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

PendingTeacherList.propTypes = {
  teachers: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  isPending: PropTypes.bool,
};

export default function PendingTeacherList({ teachers, loading, isPending = false }) {

  const { selectedTeacher, isOpenFireModal, isLoadingModal, isOpenHireModal, success, error } = useSelector((state) => state.business);
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseFireModal = () => {
    dispatch(closeFireModal());
  };

  const handleFireTeacher = () => {
    dispatch(fireTeacher(selectedTeacher))
  };

  const handleCloseHireModal = () => {
    dispatch(closeFireModal());
  };

  const handleHireTeacher = () => {
    dispatch(hireTeacher(selectedTeacher))
  };

  useEffect(() => {
    if (success != null) {
      enqueueSnackbar(translate(success));
    }
  }, [success]);

  useEffect(() => {
    if (error != null) {
      enqueueSnackbar(error, { variant: "error" });
    }
  }, [error]);

  return (
    <>
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
        {(loading ? [...Array(4)] : teachers).map((teacher, index) =>
        (
          (isPending ? <PendingTeacherCard key={teacher?.id || index} teacher={teacher} />
            : <MemberTeacherCard key={teacher?.id || index} teacher={teacher} />)
        )
        )}
      </Box>

      <DialogAnimate open={isOpenFireModal} onClose={handleCloseFireModal}>
        <DialogTitle>{translate("business.fire_teacher_title", { name: selectedTeacher?.name + ' ' + selectedTeacher?.lastname })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate("business.fire_teacher_message", { name: selectedTeacher?.name + ' ' + selectedTeacher?.lastname })}</DialogContentText>
        </DialogContent>
        <DialogActions>

          <Box sx={{ flexGrow: 1 }} />

          <HoverButton

            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => handleCloseFireModal()}
          >
            {translate("business.cancel")}
          </HoverButton>

          <LoadingButton onClick={() => handleFireTeacher()} variant="contained" color={"error"} loading={isLoadingModal} sx={{ ':hover': {} }}>
            {translate("business.fire")}
          </LoadingButton>

        </DialogActions>
      </DialogAnimate>

      <DialogAnimate open={isOpenHireModal} onClose={handleCloseHireModal}>
        <DialogTitle>{translate("business.Hire_teacher_title", { name: selectedTeacher?.name + ' ' + selectedTeacher?.lastname })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate("business.hire_teacher_message", { name: selectedTeacher?.name + ' ' + selectedTeacher?.lastname })}</DialogContentText>
        </DialogContent>
        <DialogActions>

          <Box sx={{ flexGrow: 1 }} />

          <HoverButton

            size="medium"
            color="primary"
            variant="outlined"
            onClick={() => handleCloseHireModal()}
          >
            {translate("business.cancel")}
          </HoverButton>

          <LoadingButton onClick={() => handleHireTeacher()} variant="contained" color={"error"} loading={isLoadingModal} sx={{ ':hover': {} }}>
            {translate("business.hire")}
          </LoadingButton>

        </DialogActions>
      </DialogAnimate>
    </>
  );
}
