import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';
import useLocales from 'src/hooks/useLocales';

const TimeDetails = () => {
    const { translate } = useLocales();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Grid container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                <Grid item xs={12} pl={2} pt={2} pb={3}>
                    <Typography component="h2" variant="h4" gutterBottom>
                        {translate('lessonTime.title')}
                    </Typography>
                    <Typography component="p" variant="body1" paragraph>
                    {translate('lessonTime.morningTime')}<br />
                            {translate('lessonTime.afternoonTime')}<br />
                            {translate('lessonTime.allDayTime')}
                    </Typography>
                    <Button onClick={() => setOpen(true)} sx={{
                        padding: '0px',
                        color: 'black',
                        textDecoration: 'underline',
                        '&:hover': {
                            textDecoration: 'none', // Remove underline on hover if desired
                        },
                    }}>
                        {translate('lessonTime.moreInfo')} 
                    </Button>
                </Grid>
            </Grid>

            <Drawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ '& .MuiDrawer-paper':  { boxSizing: 'border-box', width: '100%', height: '100%', paddingTop: 'env(safe-area-inset-top)' } }}
            >
                <Grid>
                    <Grid item xs={12} p={2}>
                        <IconButton onClick={() => setOpen(false)}>
                            <Iconify icon={'ic:round-arrow-back-ios'} width={20} height={20} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Typography variant="h4" gutterBottom>
                            {translate('lessonTime.title')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} p={2}>
                        <Typography variant="h6" paragraph>
                            {translate('lessonTime.morningTime')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {translate('lessonTime.morningTimeDescription')}
                        </Typography>
                        <Typography variant="h6" paragraph>
                            {translate('lessonTime.afternoonTime')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {translate('lessonTime.afternoonTimeDescription')}
                        </Typography>
                        <Typography variant="h6" paragraph>
                            {translate('lessonTime.allDayTime')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {translate('lessonTime.allDayTimeDescrpition')}
                        </Typography>
                    </Grid>
                </Grid>
            </Drawer>
        </>

    );
};

export default TimeDetails;