import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';

const TimeDetails = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Grid container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                <Grid item xs={12} p={3}>
                    <Typography variant="h4" gutterBottom>
                        Normas de la Clase
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Este instructor ofrece los siguientes horarios para sus clases:<br />
                        Mañana: 9:30am - 12:30pm <br />
                        Tarde: 2:30pm - 5:30pm <br />
                        Día: 9:30am - 5:30pm
                    </Typography>
                    <Button onClick={() => setOpen(true)} sx={{
                        padding: '0px',
                        color: 'black',
                        textDecoration: 'underline',
                        '&:hover': {
                            textDecoration: 'none', // Remove underline on hover if desired
                        },
                    }}>
                        Más información
                    </Button>
                </Grid>
            </Grid>

            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', height: '100%' } }}
            >
                <Grid>
                    <Grid item xs={12} p={2}>
                        <IconButton onClick={() => setOpen(false)}>
                            <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Typography variant="h4" gutterBottom>
                            Normas de la Clase
                        </Typography>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Typography variant="h6" paragraph>
                            Turno Mañana: 9:30am - 12:30pm.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            El profesor va a estar esperandote el dia de tu clase en el punto de encuentro a las 9:30am. Si llegas tarde, el profesor esperará 15 minutos y luego se irá. No se hará reembolso.
                        </Typography>
                        <Typography variant="h6" paragraph>
                            Turno Tarde: 2:30pm - 5:30pm.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            El profesor va a estar esperandote el dia de tu clase en el punto de encuentro a las 2:30pm. Si llegas tarde, el profesor esperará 15 minutos y luego se irá. No se hará reembolso.
                        </Typography>
                        <Typography variant="h6" paragraph>
                            Día Completo: 9:30am - 5:30pm.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            El profesor va a estar esperandote el dia de tu clase en el punto de encuentro a las 9:30am. Si llegas tarde, el profesor esperará 15 minutos y luego se irá. No se hará reembolso.
                            Esta modalidad cuenta con un recreo para almorzar de 1 hora. El profesor te va a indicar el horario del mismo.
                        </Typography>
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
};

export default TimeDetails;