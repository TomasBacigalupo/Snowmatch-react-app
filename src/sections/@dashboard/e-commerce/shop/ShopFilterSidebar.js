import PropTypes from 'prop-types';
import React from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  TextField,
} from '@mui/material';
// config
import { NAVBAR } from '../../../../config';
// components
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { ColorManyPicker } from '../../../../components/color-utils';
import { RHFMultiCheckbox, RHFRadioGroup, RHFTextField, RHFSelect } from '../../../../components/hook-form';
import { MobileDatePicker, MobileDateRangePicker } from '@mui/lab';
import useLocales from 'src/hooks/useLocales';
import { FilterSharp } from '@mui/icons-material';
import { ContourLayer } from 'deck.gl';



// ----------------------------------------------------------------------


export const FILTER_GENDER_OPTIONS = ['Male', 'Female'];

export const FILTER_CATEGORY_OPTIONS = ['SnowBoard', 'Ski'];

export const FILTER_DISCIPLINE_OPTIONS = ['Freestyle', 'Alpine', 'Back Country'];

export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const FILTER_LANGUAGE_OPTIONS = ['Español', 'English', 'Portugues', 'Italiano']

export const FILTER_RESORT_OPTIONS = [
  { category: "Argentina", resorts: [ 'Caviahue', 'Cerro Bayo', 'Cerro Castor', 'Cerro Catedral', 'Chapelco', 'La Hoya', 'Las Leñas', 'Las Pendientes', 'Perito Moreno', 'Lago Hermoso', 'Buenos Aires'] },
  { category: "Chile", resorts: [ 'Portillo']}
]


// ----------------------------------------------------------------------

const onSelected = (selected, item) =>
  selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item];

ShopFilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isIndependant: PropTypes.bool
};

export default function ShopFilterSidebar({ isOpen, onResetAll, onOpen, onClose, isIndependant }) {
  const { control } = useFormContext();
  const { translate } = useLocales()
  return (
    <>
      <Button disableRipple color="inherit" endIcon={<Iconify icon={'ic:round-filter-list'} />} onClick={onOpen}>
        {translate('filter.filters')}
      </Button>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            {translate('filter.filters')}
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={'eva:close-fill'} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.resort')}</Typography>

              <RHFSelect name="resort" label="Resort" placeholder="Resort" disabled={isIndependant}>
                {FILTER_RESORT_OPTIONS.map((country) => (
                  <optgroup label={country.category} key={country.category}>
                    {country.resorts.sort().map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect>
            </Stack>
            {/* <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.range')}</Typography>
              <Controller
                name="from"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    label="Start date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                )}
              />

              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    label="End date"
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                      />
                    )}
                  />
                )}
              />
            </Stack> */}
            <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.gender')}</Typography>
              <RHFMultiCheckbox name="gender" options={FILTER_GENDER_OPTIONS} sx={{ width: 1 }} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.category')}</Typography>
              <RHFMultiCheckbox name="category" options={FILTER_CATEGORY_OPTIONS} sx={{ width: 1 }} />
            </Stack>


            <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.discipline')}</Typography>
              <RHFMultiCheckbox name="discipline" options={FILTER_DISCIPLINE_OPTIONS} sx={{ width: 1 }} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.languages')}</Typography>
              <RHFMultiCheckbox name="language" options={FILTER_LANGUAGE_OPTIONS} sx={{ width: 1 }} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">{translate('filter.rating')}</Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                            sx={{
                              '&:hover': { bgcolor: 'transparent' },
                            }}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '&:hover': { opacity: 0.48 },
                          ...(field?.value?.includes(item) && {
                            bgcolor: 'action.selected',
                          }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetAll}
            startIcon={<Iconify icon={'ic:round-clear-all'} />}
          >
            {translate('filter.clearAll')}
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
