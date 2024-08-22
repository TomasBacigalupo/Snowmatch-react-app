// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, Container, Typography, InputAdornment, Button, Grid, } from '@mui/material';
// hooks
// components
// assets
import Logo from 'src/components/Logo';
import SocialsButton from 'src/components/SocialsButton';
import Page from 'src/components/Page';
import useCountdown from 'src/hooks/useCountdown';
import { ComingSoonIllustration } from 'src/assets';
import InputStyle from 'src/components/InputStyle';
import { ClinicCard } from 'src/sections/@dashboard/clinics/ClinicCard';
import MainFooter from 'src/layouts/main/MainFooter';
import CustomFooter from 'src/sections/@dashboard/clinics/CustomFooter';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',  // Updated to allow footer placement
    justifyContent: 'space-between',  // Space between content and footer
}));

const CountdownStyle = styled('div')({
    display: 'flex',
    justifyContent: 'center',
});

const SeparatorStyle = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(0, 1),
    [theme.breakpoints.up('sm')]: {
        margin: theme.spacing(0, 2.5),
    },
}));

// ----------------------------------------------------------------------

export default function ComingSoon() {
    const countdown = useCountdown(new Date('07/28/2024 19:00'));
    const clinics = [
        {
            title: "Clinica de pista",
            description: "La clínica de pista de snowmatch esta orientada a preparar a los instructores para los examenes de AADIDESS.",
            imageUrl: "https://snowmatchimages.s3.amazonaws.com/profile/clinica-ski-pista.jpg"
        },
        {
            title: "Clinica de palos",
            description: "La clínica de palos de snowmatch te va a ayudar a mejrar tu técnica y velocidad dentro del trazado.",
            imageUrl: "https://image.snowmatch.pro/profile/21"
        }
    ]

    return (
        <Page>
            <RootStyle>
                <Container>
                    <HeaderBreadcrumbs
                        heading={"Clinicas"}
                        links={[{ name: "Clinicas para instructores", href: "/dashboard/clinics" }]}
                    />
                    <Grid container spacing={2}>
                        {clinics.map((clinic, index) => (
                            <Grid item xs={12} sm={6} md={3}>
                            <ClinicCard key={index} clinic={clinic} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </RootStyle>
            <CustomFooter />
        </Page>
    );
}