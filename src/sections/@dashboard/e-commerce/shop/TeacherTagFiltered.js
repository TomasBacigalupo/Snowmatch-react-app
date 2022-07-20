import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
// components
import Iconify from '../../../../components/Iconify';
import useLocales from 'src/hooks/useLocales';

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
  onResetAll
}) {
  const theme = useTheme();
  const {translate} = useLocales()

  const { gender, category, discipline, rating, language, from, to, resort } = filters;

  return (
    <RootStyle>
      {gender?.length > 0 && (
        <WrapperStyle>
          <LabelStyle>{translate("filter.gender")}:</LabelStyle>
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

      
    {discipline?.length > 0 && (
        <WrapperStyle>
          <LabelStyle>{translate("filter.discipline")}:</LabelStyle>
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
      {category?.length > 0 && (
        <WrapperStyle>
          <LabelStyle>{translate("filter.category")}:</LabelStyle>
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
      {language?.length > 0 && (
        <WrapperStyle>
          <LabelStyle>{translate("filter.language")}:</LabelStyle>
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
          <LabelStyle>{translate("filter.rating")}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={sentenceCase(rating)} onDelete={onRemoveRating} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {from && to && (
        <WrapperStyle>
          <LabelStyle>{translate("filter.range")}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={from.getDate()+"/"+(from.getMonth()+1)+"/"+from.getFullYear()+"-"+to.getDate()+"/"+(to.getMonth()+1)+"/"+to.getFullYear()} onDelete={onRemoveRange} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {resort && (
        <WrapperStyle>
          <LabelStyle>{translate("filter.resort")}:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={resort} onDelete={onRemoveResort} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}


      {isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          {translate("filter.clearAll")}
        </Button>
      )}
    </RootStyle>
  );
}
