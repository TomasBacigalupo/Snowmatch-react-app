import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Box, List, Button, Rating, Avatar, ListItem, Pagination, Typography, CircularProgress } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { useDispatch, useSelector } from 'src/redux/store';
import { getRates } from 'src/redux/slices/rates';

// ----------------------------------------------------------------------

TeacherDetailsReviewList.propTypes = {
  teacher: PropTypes.object,
};

export default function TeacherDetailsReviewList({ teacher }) {

  const {rates, isLoading, totalPages} = useSelector((state) => state.rates)
  const dispatch = useDispatch()
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(getRates(teacher.id, page, 5))
  }, [dispatch, page])

  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      {isLoading && <CircularProgress/>}
      {rates.length === 0 && (
        <Typography>No reviews for this PRO</Typography>
      )}
      {!isLoading &&(
        <List disablePadding>
          {rates.map((rate) => (
            <ReviewItem key={rate.id} review={rate} />
          ))}
        </List>
      )}
      {!isLoading && rates.length !== 0 &&
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination 
          count={totalPages}
        onChange={(event, page) =>{
          setPage(page-1)
        }}
        page={page+1}
        color="primary" />
      </Box>
      }
      
    </Box>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ review }) {

  const { raterName, raterLastname, rateDate, comment,  imageLink, isPurchased, stars } = review;

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 0, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' },
          }}
        >
          <Avatar
            src={imageLink}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 },
            }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>
              {raterName + " " + raterLastname}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(rateDate)}
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={stars} precision={0.1} readOnly />

          {isPurchased && (
            <Typography
              variant="caption"
              sx={{
                my: 1,
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
              }}
            >
              <Iconify icon={'ic:round-verified'} width={16} height={16} />
              &nbsp;Verified purchase
            </Typography>
          )}

          <Typography variant="body2">{comment}</Typography>
        </div>
      </ListItem>
    </>
  );
}
