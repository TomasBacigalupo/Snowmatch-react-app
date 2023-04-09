import * as Yup from 'yup';
import { Card, Container, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Page from "src/components/Page";
import useLocales from "src/hooks/useLocales";
import { PATH_DASHBOARD } from "src/routes/paths";
import { yupResolver } from '@hookform/resolvers/yup';

export default function Prices() {
    const { translate } = useLocales()

    const PriceSchema = Yup.object().shape({
        // Privadas medio día
        privateHalfOneLow: Yup.number().required(),
        privateHalfTowLow: Yup.number().required(),
        privateHalfThreeLow: Yup.number().required(),
        privateHalfFourLow: Yup.number().required(),
        privateHalfOneMed: Yup.number().required(),
        privateHalfTowMed: Yup.number().required(),
        privateHalfThreeMed: Yup.number().required(),
        privateHalfFourMed: Yup.number().required(),
        privateHalfOneHigh: Yup.number().required(),
        privateHalfTowHigh: Yup.number().required(),
        privateHalfThreeHigh: Yup.number().required(),
        privateHalfFourHigh: Yup.number().required(),

        //Privadas dia completo
        privateOneLow: Yup.number().required(),
        privateTowLow: Yup.number().required(),
        privateThreeLow: Yup.number().required(),
        privateFourLow: Yup.number().required(),
        privateOneMed: Yup.number().required(),
        privateTowMed: Yup.number().required(),
        privateThreeMed: Yup.number().required(),
        privateFourMed: Yup.number().required(),
        privateOneHigh: Yup.number().required(),
        privateTowHigh: Yup.number().required(),
        privateThreeHigh: Yup.number().required(),
        privateFourHigh: Yup.number().required()

    })

    const methods = useForm({ resolver: yupResolver(PriceSchema) })
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = async (data) => { }

    return (
        <Page title={translate("prices.prices")}>
            <Container>
                <HeaderBreadcrumbs
                    heading={translate("breadcrumb.prices")}
                    links={[
                        { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
                        { name: translate("breadcrumb.profile"), href: PATH_DASHBOARD.user.root },
                        { name: translate("breadcrumb.prices") },
                    ]}
                />
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Card sx={{ px: 3, py: 2, my: 2 }}>
                        <Typography variant='h3'>Privadas Medio Dia</Typography>
                        <Grid container spacing={1} width='100%'>
                            <Grid item xs={12}>
                                <Typography>Una persona</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfOneLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfOneMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfOneHigh" label='Alta' />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Dos personas</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfTowLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfTowMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfTowHigh" label='Alta' />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Tres personas</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfThreeLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfThreeMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfThreeHigh" label='Alta' />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Cuatro personas</Typography>
                            </Grid>
                            
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfFourLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfFourMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateHalfFourHigh" label='Alta' />
                            </Grid>
                        </Grid>
                    </Card>
                    <Card sx={{ px: 3, py: 2 }}>
                        <Typography variant='h3'>Privadas Dia Completo</Typography>
                        <Grid container spacing={1} width='100%'>
                            <Grid item xs={12}>
                                <Typography>Una persona</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privatfOneLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateOneMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateOneHigh" label='Alta' />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Dos personas</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateTowLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateTowMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateTowHigh" label='Alta' />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Tres personas</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateThreeLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateThreeMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateThreeHigh" label='Alta' />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Cuatro personas</Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <RHFTextField name="privateFourLow" label='Baja' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateFourMed" label='Media' />
                            </Grid>
                            <Grid item xs={4}>
                                <RHFTextField name="privateFourHigh" label='Alta' />
                            </Grid>
                        </Grid>
                    </Card>
                </FormProvider>
            </Container>
        </Page>
    )
}