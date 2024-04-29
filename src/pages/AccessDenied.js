import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
import HoverButton from 'src/components/HoverButton';
import Image from 'src/components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function AccessDenied() {
  return (
    <Page title="Access Denied" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <m.div variants={varBounce().in}>
              <Typography variant="h3" paragraph>
                Access Denied
              </Typography>
            </m.div>
            <Typography sx={{ color: 'text.secondary' }}>
              You do not have permission to access this page.
            </Typography>
            <m.div variants={varBounce().in}>
              <Image src="/assets/lock.png"/>
            </m.div>

            <HoverButton to="/" size="large" variant="outlined" component={RouterLink}>
              Go to Home
            </HoverButton>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
