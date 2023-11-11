import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Rating, Button, Typography, LinearProgress, Stack, Link } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { MapControlScale } from 'src/components/map';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/redux/store';
import { getRates } from 'src/redux/slices/product';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import useLocales from 'src/hooks/useLocales';


// ----------------------------------------------------------------------

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:nth-of-type(2)': {
    [theme.breakpoints.up('md')]: {
      borderLeft: `solid 1px ${theme.palette.divider}`,
      borderRight: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

// ----------------------------------------------------------------------

TeacherDetailsReviewOverview.propTypes = {
  product: PropTypes.object,
  onOpen: PropTypes.func,
};

export default function TeacherDetailsReviewOverview({ teacher, onOpen }) {

  const {translate} = useLocales()
  const { isTeacher, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar()
  const { rates, isLoading } = useSelector(state => state.rates)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getRates(teacher.id))
  }, [])

  const getStarsAvg = () => {
    if (rates?.length === 0) return 0
    return Math.floor(rates?.map(r => r.stars).reduce((total, stars) => total + stars) / rates?.length)
  }

  const getSafetyAvg = () => {
    if (rates?.length === 0) return 0
    return Math.floor(rates?.map(r => r.safety).reduce((total, safety) => total + safety) * 100 / (rates?.length * 3))
  }

  const getFunAvg = () => {
    if (rates?.length === 0) return 0
    return Math.floor(rates?.map(r => r.fun).reduce((total, fun) => total + fun) * 100 / (rates?.length * 3))
  }

  return (
    <Grid container>
      <GridStyle item xs={12} md={4}>
        <Typography variant="subtitle1" gutterBottom>
         {translate('teacherDetails.ratingAVG')}
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: getStarsAvg() > 3 ? 'success.main' : 'error.main' }}>
          {getStarsAvg()}/5
        </Typography>
        <RatingStyle readOnly value={getStarsAvg()} precision={0.1} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ({fShortenNumber(rates?.length)}
          &nbsp;reviews)
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          {[{
            name: 'Safety',
            stars: getSafetyAvg(),
          },
          {
            name: 'Fun',
            stars: getFunAvg(),
          },
          ]
            .slice(0)
            .reverse()
            .map((rate) => (
              <ProgressItem key={rate.name} name={rate.name} star={rate.stars} total={rates?.length * 3} />
            ))}
        </Stack>
      </GridStyle>
      {isTeacher &&
        <GridStyle item xs={12} md={4}>
          <Button size="large" onClick={() => {
            navigator.clipboard.writeText(`https://snowmatch.pro/match/teacher/${user.id}/review#move_add_review`);
            enqueueSnackbar('Review link copied!', { variant: 'success' });
          }} variant="outlined" startIcon={<Iconify icon={'oi:share'} />}>
            Copy my review Link
          </Button>
        </GridStyle>}
        {/* OPEN REVIEW FORM */}
      {/* {!isTeacher && <GridStyle item xs={12} md={4}>
        <Link href="#move_add_review" underline="none">
          <Button size="large" disable={isTeacher} onClick={onOpen} variant="outlined" startIcon={<Iconify icon={'eva:edit-2-fill'} />}>
            {translate('teacherDetails.write_review')}
          </Button>
        </Link>
      </GridStyle>} */}

    </Grid>
  );
}

// ----------------------------------------------------------------------

ProgressItem.propTypes = {
  star: PropTypes.object,
  total: PropTypes.number,
};

function ProgressItem({ star, total, name }) {
  const { reviewCount } = star;
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">{name}</Typography>
      <LinearProgress
        variant="determinate"
        value={star}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {fShortenNumber(total)}
      </Typography>
    </Stack>
  );
}
