import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';
import useLocales from 'src/hooks/useLocales';
import Markdown from 'src/components/Markdown';

const DescriptionDetails = ({ id }) => {
    const { translate } = useLocales();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Grid container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                <Grid item xs={12} p={3}>
                    <Markdown children={`${translate(`product.${id}.description`).slice(0, 200)}...`} />
                    <Button onClick={() => setOpen(true)} sx={{
                        padding: '0px',
                        color: 'black',
                        textDecoration: 'underline',
                        '&:hover': {
                            textDecoration: 'none', // Remove underline on hover if desired
                        },
                    }}>
                        {translate('product.readMore')}
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
                            <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Typography variant="h4" gutterBottom>
                            {translate('product.descriptionTitle')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Markdown children={translate(`product.${id}.description`)} />
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
};

export default DescriptionDetails;