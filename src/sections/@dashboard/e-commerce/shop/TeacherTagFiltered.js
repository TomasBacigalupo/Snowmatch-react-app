import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
// components
import Iconify from '../../../../components/Iconify';

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
  onResetAll: PropTypes.func,
};

export default function TeacherTagFiltered({
  filters,
  isShowReset,
  onRemoveGender,
  onRemoveCategory,
  onRemoveDiscipline,
  onRemoveRating,
  onRemoveLanguage,
  onResetAll
}) {
  const theme = useTheme();

  const { gender, category, discipline, rating, language } = filters;

  return (
    <RootStyle>
      {gender.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Gender:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {gender.map((_gender) => (
              <Chip
                key={_gender}
                label={_gender}
                size="small"
                onDelete={() => onRemoveGender(_gender)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}

      
    {discipline.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Discipline:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {discipline.map((_discipline) => (
              <Chip
                key={_discipline}
                label={_discipline}
                size="small"
                onDelete={() => onRemoveDiscipline(_discipline)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}
      {category.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Category:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {category.map((_category) => (
              <Chip
                key={_category}
                label={_category}
                size="small"
                onDelete={() => onRemoveCategory(_category)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}
      {language.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Category:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {language.map((_language) => (
              <Chip
                key={_language}
                label={_language}
                size="small"
                onDelete={() => onRemoveLanguage(_language)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}

      {rating && (
        <WrapperStyle>
          <LabelStyle>Rating:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={sentenceCase(rating)} onDelete={onRemoveRating} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          Clear All
        </Button>
      )}
    </RootStyle>
  );
}
