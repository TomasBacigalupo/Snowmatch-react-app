import { Controller, useForm } from 'react-hook-form';
import { Grid, Typography, Box, Chip, useTheme } from '@mui/material';
import { FormProvider } from 'src/components/hook-form';
import { FILTER_CATEGORY_OPTIONS } from '../@dashboard/e-commerce/shop/ShopFilterSidebar';
import { useDispatch } from 'react-redux';
import { filterTeachers } from 'src/redux/slices/teachers';
import { useNavigate } from 'react-router';
import useLocales from 'src/hooks/useLocales';
import HoverButton from 'src/components/HoverButton';
import React from 'react';

export default function HomeLearnToSki() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { translate, currentLang } = useLocales();
  const theme = useTheme();

  const defaultValues = {
    category: ["Ski", "SnowBoard"],
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7))
  };

  const methods = useForm({
    defaultValues
  });

  const { watch, control } = methods;
  const values = watch();

  const goToInstructors = () => {
    dispatch(filterTeachers({
      gender: [],
      category: values.category,
      discipline: values.category,
      language: [],
      rating: '',
      from: values.from,
      to: values.to,
      resort: ''
    }));
    const lng = currentLang?.value || 'es';
    navigate(`/${lng}/all-teachers`);
  };

  const goToVideoCoach = () => {
    const lng = currentLang?.value || 'es';
    navigate(`/${lng}/video-coach`);
  };

  return (
    <FormProvider methods={methods} onSubmit={(e) => e.preventDefault()}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} justifyContent='center'>
          <Typography
            variant="h4"
            component='h1'
            sx={{
              fontSize: { xs: '3.5rem', md: '6rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: 'center',
            }}
          >
            <Box component="span" sx={{ color: 'white' }}>
              Take your skiing to the{' '}
            </Box>
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              next level
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} justifyContent='center'>
          <Typography
            variant="h5"
            component='h2'
            sx={{
              color: '#000000',
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 400,
              lineHeight: 1.4,
              mb: 1
            }}
          >
            Elegí cómo querés empezar: con un instructor o con videocorrecciones.
          </Typography>
        </Grid>

        <Grid item xs={12} md={12}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, width: '100%' }}>
                {FILTER_CATEGORY_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    variant="outlined"
                    clickable
                    onClick={() => {
                      const currentValue = field.value || [];
                      const newValue = currentValue.includes(option)
                        ? currentValue.filter(item => item !== option)
                        : [...currentValue, option];
                      field.onChange(newValue);
                    }}
                    sx={{
                      flex: 1,
                      height: '48px',
                      border: (field.value || []).includes(option) ? '1px solid #000000' : '1px solid #cccccc',
                      borderRadius: 1,
                      fontWeight: 500,
                      color: '#000000',
                      backgroundColor: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        color: '#000000',
                      },
                      '& .MuiChip-label': {
                        width: '100%',
                        textAlign: 'center',
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <HoverButton fullWidth variant="contained" size="large" onClick={goToInstructors}>
                {translate('landingPRO.search')} instructor
              </HoverButton>
            </Grid>
            <Grid item xs={12} md={6}>
              <HoverButton fullWidth variant="outlined" size="large" onClick={goToVideoCoach}>
                Videocorrecciones
              </HoverButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
}


