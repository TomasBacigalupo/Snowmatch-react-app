import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { OutlinedInput, Autocomplete, Box, Chip, TextField } from '@mui/material';


import { useState } from 'react'

// ----------------------------------------------------------------------

RHFMultipleSelect.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default function RHFMultipleSelect({ name, label, list, freeSolo, grouped }) {
  const { control } = useFormContext();
  if (grouped) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            value={field?.value || []}
            freeSolo={freeSolo}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => {
              if(option.title){
                return option.title
              }
              return option
              }}
            onChange={(event, newValue) => { console.log({newValue});
            
            field.onChange(newValue.map(value => {
              if(value.title){
                return value.title
              }
              return value
            })); }}
            getOptionLabel={(option) => option.title}
            options={list.sort((a,b)=>a.category-b.category)}
            id={name}
            multiple
            filterSelectedOptions
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip  label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
              />
            )}
            isOptionEqualToValue={(option, value) => {
              return option?.title === value}}
          />
        )}
      />
    )
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error }}) => (
        
         <Autocomplete
          value={field?.value || []}
          freeSolo={freeSolo}

          onChange={(event, newValue) => { field.onChange(newValue); }}

          options={[...list]}
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
