import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import useLocales from 'src/hooks/useLocales';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------



TeacherTagFiltered.propTypes = {
  filters: PropTypes.object,
  isShowReset: PropTypes.bool,
  onRemoveGender: PropTypes.func,
  onRemoveCategory: PropTypes.func,
  onRemoveDiscipline: PropTypes.func,
  onRemoveRating: PropTypes.func,
  onRemoveLanguage: PropTypes.func,
  onRemoveRange: PropTypes.func,
  onRemoveResort: PropTypes.func,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func
};

export default function TeacherTagFiltered({
  filters,
  isShowReset,
  onRemoveGender,
  onRemoveCategory,
  onRemoveDiscipline,
  onRemoveRating,
  onRemoveLanguage,
  onRemoveRange,
  onRemoveResort,
  onResetAll,
  onOpen
}) {
  const theme = useTheme();
  const {translate} = useLocales()
  const dispatch = useDispatch();
  const { gender, category, discipline, rating, language, from, to, resort } = filters;


  return (
    <RootStyle>
      {gender?.length > 0 && (
        <Stack direction="row" flexWrap="wrap">
          {gender.map((_gender) => (
            <Chip
              key={_gender}
              variant='outlined'
              label={_gender}
              size="small"
              onDelete={() => onRemoveGender(_gender)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      )}

      
    {discipline?.length > 0 && (
        <Stack direction="row" flexWrap="wrap" >
          {discipline.map((_discipline) => (
            <Chip
              key={_discipline}
              label={_discipline}
              size="small"
              variant='outlined'
              onDelete={() => onRemoveDiscipline(_discipline)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      )}
      {category?.length > 0 && (
        <Stack direction="row" flexWrap="wrap" >
          {category.map((_category) => (
            <Chip
              variant='outlined'
              key={_category}
              label={_category}
              size="small"
              onDelete={() => onRemoveCategory(_category)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      )}
      {language?.length > 0 && (
        <Stack direction="row" flexWrap="wrap" >
          {language.map((_language) => (
            <Chip
              key={_language}
              label={_language}
              variant='outlined'
              size="small"
              onDelete={() => onRemoveLanguage(_language)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      )}

      {rating && (
        <Stack direction="row" flexWrap="wrap" >
          <Chip size="small" label={sentenceCase(rating)} onDelete={onRemoveRating} sx={{ m: 0.5 }} />
        </Stack>
      )}

      {from && to && (
        <Stack direction="row" flexWrap="wrap" >
          <Chip variant='outlined' size="small" label={from.getDate() + "/" + (from.getMonth() + 1) + "/" + from.getFullYear() + "-" + to.getDate() + "/" + (to.getMonth() + 1) + "/" + to.getFullYear()} sx={{ m: 0.5 }} onClick={onOpen}/>
        </Stack>
      )}

      {resort && (
        <Stack direction="row" flexWrap="wrap" >
          <Chip variant='outlined' size="small" label={resort} onDelete={onRemoveResort} sx={{ m: 0.5 }} />
        </Stack>
      )}


      {/* {isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-delete'} />}>
        </Button>
      )} */}
    </RootStyle>
  );
}
