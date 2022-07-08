import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { OutlinedInput,Autocomplete, Box, Chip, TextField } from '@mui/material';


import {useState} from 'react'

// ----------------------------------------------------------------------

RHFMultipleSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFMultipleSelect({ name,label, list, freeSolo }) {
  const { control } = useFormContext();



  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (

        <Autocomplete
          value={field?.value || []}
          freeSolo={freeSolo}
          
          onChange={(event, newValue) => {field.onChange(newValue);}}

          options = {[...list]}
          id={name}
          multiple
          filterSelectedOptions
          renderInput={(params) => (
          <TextField
            {...params}
            label={label}
          />
        )}
        />
   
      )}
    />
  );
}
