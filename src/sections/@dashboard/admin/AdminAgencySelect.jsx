import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getAgencies } from 'src/redux/slices/agency';

AdminAgencySelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default function AdminAgencySelect({
  value,
  onChange,
  label = 'Agencia',
  fullWidth = true,
}) {
  const dispatch = useDispatch();
  const { agencies, agenciesLoading } = useSelector((state) => state.agency);
  const rows = Array.isArray(agencies) ? agencies : [];
  const normalizedValue = value == null || value === '' ? '' : Number(value);

  useEffect(() => {
    if (!rows.length && !agenciesLoading) {
      dispatch(getAgencies());
    }
  }, [dispatch, rows.length, agenciesLoading]);

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={normalizedValue}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === '' ? null : Number(next));
        }}
      >
        <MenuItem value="">
          <em>Sin agencia</em>
        </MenuItem>
        {rows.map((agency) => (
          <MenuItem key={agency.id} value={agency.id}>
            {agency.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
