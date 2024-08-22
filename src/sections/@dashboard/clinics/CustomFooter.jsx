// src/components/CustomFooter.js

import { Box, Typography, Stack, Link, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterStyle = styled('footer')(({ theme }) => ({
    padding: theme.spacing(3, 2),
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: 'auto', // Ensures footer sticks to the bottom
    paddingBottom: theme.spacing(0),
}));

export default function CustomFooter() {
    return (
        <FooterStyle>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'© '}
                        <Link color="inherit" href="https://snowmatch.pro/">
                            SnowMatch
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'. Todos los derechos reservados.'}
                    </Typography>
                </Stack>
        </FooterStyle>
    );
}