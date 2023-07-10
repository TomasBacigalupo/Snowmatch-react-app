import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export default function MatchClients() {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" paragraph>
                2. Matcheá con clientes 
            </Typography>
            <Typography sx={{ mb: 3 }}>
                Encontrá clientes y establecé conexiones para tus clases
            </Typography>
            <List>
                <ListItem sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Una vez que seas SnowMatch PRO habrá clientes que comenzarán a requerir tus clases" />
                </ListItem>
                <ListItem sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Cuando un nuevo cliente solicite una clase podrás aceptar o rechazar la solicitud (si aceptás, el cliente podrá ver tus datos de contacto)" />
                </ListItem>
                <ListItem sx={{ textAlign: 'center' }}>
                    <ListItemText primary="Por último, coordiná los detalles de la clase" />
                </ListItem>
            </List>
        </Box>
    );
}

