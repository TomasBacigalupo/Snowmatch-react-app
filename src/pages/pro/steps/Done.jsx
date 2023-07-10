import { Box, Typography } from '@mui/material';

export default function Done() {
    return (
        <Box mb={4}>
            <Typography variant="h4" align="center" paragraph>
                3. Informá a la escuela
            </Typography>
            <Typography align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                Una vez que confirmes una clase, no olvidés informarle a un coordinador de la escuela.
            </Typography>
        </Box>
    );
}
