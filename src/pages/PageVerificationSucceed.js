import { m } from 'framer-motion';
import { Link as RouterLink, useParams} from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Container, CircularProgress} from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets
import VerifyEmailIllustration from 'src/assets/illustration_email_verify';
// hooks
import { useState, useEffect } from 'react';
import axios from '../utils/axios';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function PageVerificationSucceed() {
    const { token } = useParams()
    const [loading, setLoading] = useState(true);

    useEffect(()=>{handleVerify()},[])

    const handleVerify = async () => {
        const response = axios.put(`/api/userPersonalDataVerification/registration/${token}`);
        setLoading(false)
    }

    return (
        <Page title="Email verification" sx={{ height: 1 }}>
            <RootStyle>
                <Container component={MotionContainer}>
                    <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
                        <m.div variants={varBounce().in}>
                            <Typography variant="h3" paragraph>
                                Email verified Successfully
                            </Typography>
                        </m.div>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Thanks for verifying your email.
                        </Typography>

                        <m.div variants={varBounce().in}>
                            <VerifyEmailIllustration success={true} sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
                        </m.div>
                        {loading && (
                            <CircularProgress />
                        )}
                    </Box>
                </Container>
            </RootStyle>
        </Page>
    );
}
