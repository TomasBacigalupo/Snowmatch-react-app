import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
// components
import Page from 'src/components/Page';
import useLocales from 'src/hooks/useLocales';
import { useState } from 'react';
import ChapelcoStepper from './steps/ChapelcoStepper';
import { m } from 'framer-motion';
import { varFade } from 'src/components/animate';
import ChapelcoHero from './ChapelcoHero';
import { HomeAdvertisement, HomeMinimal } from 'src/sections/home';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    height: '100%',
}));


const ContentStyle = styled('div')(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.palette.background.default,
}));

const HeroStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
    zIndex: 10,
    margin: 'auto',
    textAlign: 'center',
    position: 'relative',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------


export default function ChapelcoPro() {
    const { translate } = useLocales();
    const [activeStep, setActiveStep] = useState(0);


    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    return (
        <Page title="ChapelcoPro">
            <RootStyle>
                    <ChapelcoHero/>
                <ContentStyle>
                    <ChapelcoStepper />
                    <HomeMinimal />
                    <HomeAdvertisement />
                </ContentStyle>
            </RootStyle>
        </Page>
    );
}

