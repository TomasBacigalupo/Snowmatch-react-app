import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, TextField, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useLocales from 'src/hooks/useLocales';


// ----------------------------------------------------------------------


const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

// ----------------------------------------------------------------------

export default function CalendarSelector({ onFilter, filter, filterOptions}) {
  const {translate} = useLocales()

  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>

    <TextField
      fullWidth
      select
      label={translate('filter.filters')}
      value={filter.value}
      onChange={onFilter}
      SelectProps={{
        MenuProps: {
          sx: { '& .MuiPaper-root': { maxHeight: 260 } },
        },
      }}
      sx={{
        maxWidth: { sm: 240 },
        textTransform: 'capitalize',
      }}
    >
      {filterOptions.map((option) => (
        <MenuItem
          key={option.key}
          value={option.value}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
          }}
        >
          {option.value}
        </MenuItem>
      ))}
    </TextField>
  </Stack>
  );
}
