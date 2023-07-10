import { m } from 'framer-motion';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Container, Typography, Button } from '@mui/material';
// components
import { useState } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import BecomePro from './BecomePro';
import MatchClients from './MatchClients';
import Done from './Done';
import { MotionViewport, varFade } from 'src/components/animate';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(15),
    },
}));



// ----------------------------------------------------------------------

export default function ChapelcoStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);



    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };
    const steps = [
        {
            label: '1. Hacete SnowMatch Pro',
            component: <BecomePro />,
        },
        {
            label: '2. Matchea con Clientes',
            component: <MatchClients />,
        },
        {
            label: '3. Listo',
            component: <Done />,
        },
    ];

    return (
        <RootStyle>
            <Container component={MotionViewport}>
                <Box
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <m.div variants={varFade().inLeft}>
                        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
                            SnowMatch
                        </Typography>
                    </m.div>
                    <m.div variants={varFade().inRight}>
                        <Typography variant="h3" align="center" paragraph>
                            ¿Cómo funciona?
                        </Typography>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={index}>
                                    <StepLabel>{step.label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Box m={2} p={2}>
                            <Box>
                                {steps[activeStep].component}
                                <Box
                                    display="flex"
                                    justifyContent={activeStep !== 0 ? 'space-between' : 'center'}
                                >
                                    {activeStep !== 0 && (
                                        <Button variant="outlined" onClick={handleBack}>
                                            Atrás
                                        </Button>
                                    )}
                                    {activeStep !== steps.length - 1 ? (
                                        <Button variant="contained" onClick={handleNext}>
                                            Sigiente
                                        </Button>)
                                        :
                                        (
                                            <Button variant="contained" href='https://snowmatch.pro/auth/register'>
                                                Hacerme SnowMatch
                                            </Button>
                                        )}
                                </Box>
                            </Box>
                        </Box>
                    </m.div>
                </Box>
            </Container>
        </RootStyle>
    );
}