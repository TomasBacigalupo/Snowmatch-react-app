import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';

const Policies = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Grid container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                <Grid item xs={10} pl={3} pt={3} pb={3}>
                    <Typography variant="h4" gutterBottom>
                        Plotica de Cancelación
                    </Typography>
                    <Typography variant="body1" paragraph>
                            Antes de hacer la reserva, asegurate de que la política de cancelación del instructor te convenga.
                        </Typography>
                </Grid>
                <Grid item xs={2} p={3}>
                    <IconButton onClick={() => setOpen(true)}>
                        <Iconify icon={'ic:round-arrow-forward-ios'} width={20} height={20} />
                    </IconButton>
                </Grid>
            </Grid>

            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                borderTopRightRadius: '12px'}}}
            >
                <Grid>
                    <Grid item xs={12} p={2}>
                        <IconButton onClick={() => setOpen(false)}>
                            <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} p={2}>

                        <Typography variant="h4" gutterBottom>
                            Plotica de Cancelación
                        </Typography>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Typography variant="body1" paragraph>
                            Antes de hacer la reserva, asegurate de que la política de cancelación del instructor te convenga.
                        </Typography>
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
};

export default Policies;