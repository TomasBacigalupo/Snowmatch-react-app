import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton, Box } from '@mui/material';
import Iconify from 'src/components/Iconify';
import useLocales from 'src/hooks/useLocales';

const Policies = () => {
    const {translate} = useLocales();
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Grid container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                <Grid item xs={10} pl={3} pt={3} pb={3}>
                    <Typography variant="h4" gutterBottom>
                    {translate('policy.title')}
                    </Typography>
                    <Typography variant="body1" paragraph>
                    {translate('policy.helper')}
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
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box', width: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                        borderTopRightRadius: '12px',
                    }
                }}
            >
                <Box mt={1}>
                    <IconButton onClick={() => setOpen(false)}>
                        <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                    </IconButton>
                </Box>
                <Grid p={2} spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h3" gutterBottom>
                            {translate('policy.title')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                        {translate('policy.strict')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" paragraph>
                        {translate('policy.strictDescription')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" paragraph>
                        {translate('policy.strictDescriptionRefound')}
                        </Typography>
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
};

export default Policies;