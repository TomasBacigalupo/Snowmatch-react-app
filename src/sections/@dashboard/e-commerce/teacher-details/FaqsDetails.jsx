import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';
import useLocales from 'src/hooks/useLocales';
import { ProductFaqsList } from 'src/sections/faqs';

const FaqsDetails = ({id}) => {
    const { translate } = useLocales();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Grid container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)} >
                <Grid item xs={12} py={3}>
                    <Typography variant="h4" px={3} gutterBottom>
                        Preguntas frecuentes
                    </Typography>
                    <ProductFaqsList id={id}/>
                </Grid>
            </Grid>
        </>

    );
};

export default FaqsDetails;