import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Slider, FormControl, FormLabel, Box } from '@mui/material';
import Typography from 'src/theme/overrides/Typography';

// ----------------------------------------------------------------------

RHFSlider.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
};

export default function RHFSlider({ name, label, min = 0, max = 100, step = 1, ...other }) {
    const { control } = useFormContext();

    return (
        <FormControl fullWidth>
            {label && <FormLabel>{label}</FormLabel>}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Slider
                        {...field}
                        value={field.value || min} // Default to min value if undefined
                        onChange={(_, value) => field.onChange(value)}
                        min={min}
                        max={max}
                        step={step}
                        aria-label="Always visible"
                        {...other}
                    />
                )}
            />
        </FormControl>
    );
}