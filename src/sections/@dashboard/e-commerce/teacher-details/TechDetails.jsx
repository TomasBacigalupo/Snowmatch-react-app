import React from 'react';
import Typography from '@mui/material/Typography';
import { Grid, IconButton, Box } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { useTranslation } from 'react-i18next';

const TechDetails = ({ id, product }) => {
    const { t } = useTranslation();

    const getSkiLevel = (id, product ) => {
        if(id === 143 || id === 144 || id === 145){
            return t(`product.${id}.skiLevel`);
        }
        return t(`skiLevel.${product?.studentLevel}`);
    }
    const iconData = [
        { icon: 'mdi:ski', label: t(`product.skiLevel`), description: getSkiLevel(id, product ) },
        { icon: 'mdi:account-group', label: t(`product.totalStudents`), description: t(`totalStudents`) },
        { icon: 'mdi:map-marker', label: t(`product.meetingPoint`), description: t(`meetingPoint.${product?.resort}`) },
    ];

    return (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
            {iconData.map((item, index) => (
                <Grid item xs={12} md={12} key={index}>
                    <Grid container alignItems="flex-start" justifyContent='center'>
                        <Grid item xs={1} justifyContent='flex-end'>
                            <Box width='100%' display='flex' justifyContent='flex-end'>
                                <IconButton>
                                    <Iconify icon={item.icon} width={28} height={28} />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item container direction='column' xs={9} ml={1}>
                            <Typography component="h3" variant="h6" textAlign="start" mt={1}>
                                {item.label}
                            </Typography>
                            <Typography component="p" variant="body2" textAlign="start">
                                {item.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export default TechDetails;
