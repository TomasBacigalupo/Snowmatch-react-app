import * as Yup from 'yup';
import { Card, Container, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import Page from "src/components/Page";
import useLocales from "src/hooks/useLocales";
import { PATH_DASHBOARD } from "src/routes/paths";
import { yupResolver } from '@hookform/resolvers/yup';
import PrivateNewEditForm from 'src/sections/@dashboard/e-commerce/PrivateNewEditForm';

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
                <PrivateNewEditForm isEdit={false} currentProduct={null} />
            </Container>
        </Page>
    )
}