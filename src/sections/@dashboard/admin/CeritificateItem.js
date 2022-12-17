import { Typography, Grid, Card } from '@mui/material';
import PropTypes from 'prop-types';
import Image from 'src/components/Image';

CertificateItem.propTypes = {
    link: PropTypes.string,
    name: PropTypes.string,
    state: PropTypes.string
}

export default function CertificateItem({link, name, state}){
    return (
        <Card>
            <Grid container spacing={3}  alignItems='center' style={{ padding: '8px' }}>
                <Grid item xs={12} container>
                    <Grid item xs={6}>
                        <Image src={link} ratio="1/1"/>
                    </Grid>
                    <Grid item xs={6} container>
                        <Grid item xs={6} >
                            <Typography>{name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>{state}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
        
    )
}