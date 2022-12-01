import { Controller, useForm } from 'react-hook-form';
// @mui
import { MobileDatePicker } from '@mui/lab';
import { Grid, Card, Stack, Button, TextField, Typography } from '@mui/material';
//
import { FormProvider, RHFMultiCheckbox, RHFSelect } from 'src/components/hook-form';
import { FILTER_CATEGORY_OPTIONS, FILTER_DISCIPLINE_OPTIONS, FILTER_RESORT_OPTIONS } from '../@dashboard/e-commerce/shop/ShopFilterSidebar';
import { useDispatch } from 'react-redux';
import { filterTeachers } from 'src/redux/slices/teachers';
import { useNavigate } from 'react-router';
import Iconify from 'src/components/Iconify';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import useLocales from 'src/hooks/useLocales';
import StylesButton from 'src/components/StylesButton';
import HoverButton from 'src/components/HoverButton';


export default function HomeFilterTeachers() {


    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const {translate} = useLocales()



    const defaultValues = {
        resort: '',
        from: new Date(),
        to: new Date().getMonth() == 11 ? new Date(new Date().getFullYear() + 1, 0, 1) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        gender: [],
        category: [],
        language: [],
        discipline: []
    };

    const methods = useForm({
        defaultValues,
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting, isValid },
    } = methods;

    const values = watch();

    const onSubmitSchools = () => {
        try {
            dispatch(filterTeachers(values))
            navigate('/match')
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmitIndependent = () => {
        try {
            dispatch(filterTeachers(values))
            navigate('/match/independent')
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = () => {
        dispatch(filterTeachers(values))
        if(values.resort === "Cerro Catedral"){
            navigate('/match/independent')
        }else{
            navigate('/match')
        }
            
    } 

    return (
        <>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={9} justifyContent='center'>
                        <Typography variant="h5" sx={{ color: 'common.white' }}> {translate("landingPRO.find")} </Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Card sx={{ p: 3 }}>
                            <Grid container spacing={2} alignItems='center'>
                                <Grid item xs={12}>
                                    <RHFSelect name="resort" label={translate("filter.resort")} placeholder="Resort">
                                        <option value="" />
                                        {FILTER_RESORT_OPTIONS.map((country) => (
                                            <optgroup label={country.category}>
                                                {country.resorts.sort().map(r => (
                                                    <option key={r} value={r}>
                                                        {r}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </RHFSelect>
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="from"
                                        control={control}
                                        render={({ field }) => (
                                            <MobileDatePicker
                                                {...field}
                                                label={translate("landingPRO.start_date")}
                                                inputFormat="dd/MM/yyyy"
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <Controller
                                        name="to"
                                        control={control}
                                        render={({ field }) => (
                                            <MobileDatePicker
                                                {...field}
                                                label={translate("landingPRO.end_date")}
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
                                </Grid>
                                <Grid item xs={6}>
                                    <RHFMultiCheckbox name="category" options={FILTER_CATEGORY_OPTIONS} sx={{ width: 1 }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <HoverButton fullWidth type="submit" variant="contained" size="large" startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}>
                                    {translate("landingPRO.match")}
                                    </HoverButton>
                                </Grid>

                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </FormProvider>
        </>
    );
}