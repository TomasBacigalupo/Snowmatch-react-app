import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function BecomePro() {
    return (
        <Box>
            <Typography variant="h4" align="center" paragraph>
                1. Hacete SnowMatch Pro
            </Typography>
            <Typography align="center" sx={{ color: 'text.secondary', mb: 3 }}>
                Completá el formulario y hacete SnowMatch PRO
            </Typography>
            <List>
                <ListItem sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Cargá una foto de tu título o de tu credencial AADIDESS" />
                </ListItem>
                <ListItem sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Completá tu perfil con datos relevantes para que tus clientes de conozcan " />
                </ListItem>
                <ListItem sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Subí una foto de perfil (cuanto mejor sea más ventas vas a conseguir)" />
                </ListItem>
            </List>
        </Box>
    );
}
