import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  getOptionLabel: PropTypes.func,
  renderOption: PropTypes.func,
  groupBy: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  freeSolo: PropTypes.bool,
  filterOptions: PropTypes.func,
};

export default function RHFAutocomplete({ 
  name, 
  options = [], 
  getOptionLabel,
  renderOption,
  groupBy,
  label,
  placeholder,
  multiple = false,
  freeSolo = false,
  filterOptions,
  ...other 
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          groupBy={groupBy}
          multiple={multiple}
          freeSolo={freeSolo}
          filterOptions={filterOptions}
          onChange={(event, newValue) => field.onChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error?.message}
              fullWidth
            />
          )}
          {...other}
        />
      )}
    />
  );
} 