import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';
import SelectDates from './SelectDates';

const MobileSelectDays = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Grid
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: '#fff', // Set your desired background color
                    borderTopLeftRadius: '12px',
                    boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
                    zIndex: 999, // Ensure the grid is above other elements
                }}
                container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                <Grid item xs={6} pl={2} pt={1} pb={1} justifyContent='center' textAlign='left'>
                    <Typography variant="h4" width='100%'>
                        $50
                    </Typography>
                    <Typography variant="body" width='100%'>
                        Medio día 3 horas
                    </Typography>

                </Grid>
                <Grid item xs={6} px={2} py={3}>
                    <Button variant='contained' sx={{p:2}} fullWidth onClick={() => setOpen(true)}>
                        Seleccionar Días
                    </Button>
                </Grid>
            </Grid>

            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                        borderTopRightRadius: '12px'
                    }
                }}
            >
                <Grid>
                    <Grid item xs={12} p={2}>
                        <IconButton onClick={() => setOpen(false)}>
                            <Iconify icon={'ic:round-close'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} p={2} pb={0} mb={0}>
                        <Typography variant="h4">
                            Selecciona tus días de clases
                        </Typography>
                        <Typography variant="body">
                            Elige los días que quieras tener clases con este instructor.
                        </Typography>
                    </Grid>
                    <SelectDates handleClose={() => setOpen(false)} />
                </Grid>
            </Drawer>
        </>

    );
};

export default MobileSelectDays;