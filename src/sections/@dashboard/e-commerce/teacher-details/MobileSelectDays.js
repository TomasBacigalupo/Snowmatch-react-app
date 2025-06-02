import React, { useCallback, useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Box, Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';
import SelectDates from './SelectDates';
import { addCart, calculatePrice, calculateRequestedPrice } from 'src/redux/slices/teachers';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import useLocales from 'src/hooks/useLocales';
import { useSelector } from 'src/redux/store';
import { fCurrency } from 'src/utils/formatNumber';
import { Hidden, Dialog } from '@mui/material';
import { useTheme } from '@mui/system';

const MobileSelectDays = ({ product, teacher, isOpen, closeFather, isRange }) => {
    const { translate } = useLocales();
    const { filters } = useSelector((state) => state.teachers);
    const { from, to } = filters;
    const [open, setOpen] = React.useState(isOpen);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isIndependant = teacher?.resorts?.includes('Cerro Catedral');
    const handleSubmitSelectedDates = useCallback((dates) => {
        if (!product && !isRange && isIndependant) {
            dates.forEach((date) => {
                let lessonTime = "MORNING"
                let price = 0
                if (new Date(date).getHours() === 14) {
                    lessonTime = "AFTERNOON"
                    price = calculateRequestedPrice(teacher, 1, "AFTERNOON")
                }
                if (new Date(date).getHours() === 9) {
                    lessonTime = "MORNING"
                    price = calculateRequestedPrice(teacher, 1, "MORNING")
                }
                if (new Date(date).getHours() === 8) {
                    lessonTime = "ALL_DAY"
                    price = calculateRequestedPrice(teacher, 1, "FULL_DAY")
                }
                const requestEvent = {
                    price: price,
                    people: 1,
                    lessonTime: lessonTime,
                    date: date,
                    resort: 'Cerro Catedral',
                    teacherId: teacher.id
                };
                dispatch(addCart({
                    teacher: teacher,
                    event: requestEvent
                }))

                navigate('hire');
            })
        } else if (product) {
            dates.forEach((date) => {
                let lessonTime = "MORNING"
                let price = 0
                if (new Date(date).getHours() === 14) {
                    lessonTime = "AFTERNOON"
                    price = calculatePrice(product, 1, "AFTERNOON")
                }
                if (new Date(date).getHours() === 9) {
                    lessonTime = "MORNING"
                    price = calculatePrice(product, 1, "MORNING")
                }
                if (new Date(date).getHours() === 8) {
                    lessonTime = "ALL_DAY"
                    price = calculatePrice(product, 1, "FULL_DAY")
                }
                const requestEvent = {
                    price: price,
                    people: 1,
                    lessonTime: lessonTime,
                    date: date,
                    resort: 'Cerro Catedral'
                };
                dispatch(addCart({
                    product: product,
                    event: requestEvent
                }))
                navigate('hire');
            })
        } else {
            dates.forEach((date) => {
                let lessonTime = "MORNING"
                let price = 0
                if (new Date(date).getHours() === 14) {
                    lessonTime = "AFTERNOON"
                    price = 0
                }
                if (new Date(date).getHours() === 9) {
                    lessonTime = "MORNING"
                    price = 0
                }
                if (new Date(date).getHours() === 8) {
                    lessonTime = "ALL_DAY"
                    price = 0
                }
                const requestEvent = {
                    price: price,
                    people: 1,
                    lessonTime: lessonTime,
                    date: date,
                    resort: 'Cerro Catedral'
                };
                dispatch(addCart({
                    product: product,
                    event: requestEvent
                }))
                navigate('hire');
            })
        }

    })
    //calculate total days between to and from
    const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24));
    const [borderColor, setBorderColor] = useState('black');
    const theme = useTheme();

    const handleClick = (day) => {
        const phoneNumber = '5492944263223';
        const message = encodeURIComponent('Quiero participar de la clinica el ' + day);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappUrl, '_blank');
    };

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    return (
        <>
            <Hidden smUp>
                <Grid
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: '#fff',
                        borderTopLeftRadius: '12px',
                        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
                        zIndex: 999,
                    }}
                    container justifyContent={'center'} alignItems={'center'} onClick={() => setOpen(true)}>
                    <Grid item xs={6} pl={2} pt={1} pb={1} justifyContent='center' textAlign='left'>
                        <Typography component="p" variant="h4" width='100%'>
                            {isIndependant && !product && fCurrency(calculateRequestedPrice(teacher, totalDays, 'MORNING'))}
                            {product && fCurrency(calculatePrice(product, totalDays, 'MORNING'))}
                            {!isIndependant && !product && 'Contactar'}
                        </Typography>
                        <Typography component="p" variant="body" width='100%'>
                            {(isIndependant || product) && translate('checkout.halfDay3Hours')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} px={2} py={3}>
                        <Button variant='contained' sx={{ p: 2 }} fullWidth onClick={() => setOpen(true)}>
                            {translate('checkout.selectDays')}
                        </Button>
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden smDown>
                <Grid
                    sx={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                        my: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.12)',
                            transform: 'translateY(-2px)'
                        }
                    }}
                    px={2}
                    pb={2}
                    container 
                    spacing={2}
                    alignItems="center">
                    <Grid item xs={12}>
                        <Typography 
                            component="h3" 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600,
                                mb: 1,
                                color: 'text.primary'
                            }}>
                            Reserva tu clase
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 1
                        }}>
                            <Typography 
                                component="p" 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: 'primary.main'
                                }}>
                                {isIndependant && !product && fCurrency(calculateRequestedPrice(teacher, totalDays, 'MORNING'))}
                                {product && fCurrency(calculatePrice(product, totalDays, 'MORNING'))}
                                {!isIndependant && !product && 'Contactar'}
                            </Typography>
                            <Typography 
                                component="p" 
                                variant="body1"
                                sx={{ 
                                    color: 'text.secondary'
                                }}>
                                {(isIndependant || product) && translate('checkout.halfDay3Hours')}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Button 
                            variant='contained' 
                            size="large"
                            fullWidth 
                            onClick={() => setOpen(true)}
                            sx={{ 
                                py: 2,
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
                                }
                            }}>
                            {translate('checkout.selectDays')}
                        </Button>
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden smUp>
                <Drawer
                    anchor="bottom"
                    open={open}
                    onClose={() => {
                        setOpen(false)
                        if (closeFather) {
                            closeFather()
                        }
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box', width: '100%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                            borderTopRightRadius: '12px'
                        }
                    }}
                >
                    {product?.id === 155 ? (
                        <Grid>
                            <Grid item xs={12} p={2}>
                                <IconButton onClick={() => {
                                    setOpen(false)
                                    if (closeFather) {
                                        closeFather()
                                    }
                                }}>
                                    <Iconify icon={'ic:round-close'} width={20} height={20} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} p={2} pb={0} mb={0}>
                                <Typography component="p" variant="h4">
                                    {translate('checkout.selectDays')}
                                </Typography>
                                <Typography component="p" variant="body">
                                    Seleccioná los horarios disponibles para tener tu clínica
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Box
                                    margin={2}
                                    padding={3}
                                    borderRadius={2}
                                    border={2}
                                    borderColor={borderColor}
                                    onClick={() => handleClick('12 de Septiembre de 9:30 a 12:30')}
                                ><Typography component="p" variant="h4">
                                        12 de Septiembre
                                    </Typography>
                                    <Typography component="p" variant="body">
                                        De 9:30hs a 12:30hs
                                    </Typography>
                                </Box>
                                <Box onClick={() => handleClick('13 de Septiembre de 9:30 a 12:30')} margin={2} padding={3} borderRadius={2} border={3} borderColor='black'>
                                    <Typography component="p" variant="h4">
                                        13 de Septiembre
                                    </Typography>
                                    <Typography component="p" variant="body">
                                        De 9:30hs a 12:30hs
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    ) :
                        <Grid>
                            <Grid item xs={12} p={2}>
                                <IconButton onClick={() => {
                                    setOpen(false)
                                    if (closeFather) {
                                        closeFather()
                                    }
                                }}>
                                    <Iconify icon={'ic:round-close'} width={20} height={20} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} p={2} pb={0} mb={0}>
                                <Typography component="p" variant="h4">
                                    {translate('checkout.selectDays')}
                                </Typography>
                                <Typography component="p" variant="body">
                                    {translate('checkout.selectDaysDescription')}
                                </Typography>
                            </Grid>
                            <SelectDates
                                product={product}
                                isRange={isRange}
                                handleClose={() => {
                                    if (closeFather) {
                                        closeFather()
                                    }
                                    setOpen(false)
                                }}
                                onSubmit={handleSubmitSelectedDates}
                            />
                        </Grid>

                    }

                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Dialog
                    anchor="bottom"
                    open={open}
                    onClose={() => {
                        setOpen(false)
                        if (closeFather) {
                            closeFather()
                        }
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box', width: '33%', paddingBottom: 2, borderTopLeftRadius: '12px',  // Adjust the value as needed
                            borderTopRightRadius: '12px'
                        }
                    }}
                >
                    <Grid>
                        <Grid item xs={12} p={2}>
                            <IconButton onClick={() => {
                                setOpen(false)
                                if (closeFather) {
                                    closeFather()
                                }
                            }}>
                                <Iconify icon={'ic:round-close'} width={20} height={20} />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} p={2} pb={0} mb={0}>
                            <Typography component="p" variant="h4">
                                {translate('checkout.selectDays')}
                            </Typography>
                            <Typography component="p" variant="body">
                                {translate('checkout.selectDaysDescription')}
                            </Typography>
                        </Grid>
                        <SelectDates
                            product={product}
                            isRange={isRange}
                            handleClose={() => {
                                if (closeFather) {
                                    closeFather()
                                }
                                setOpen(false)
                            }}
                            onSubmit={handleSubmitSelectedDates}
                        />
                    </Grid>
                </Dialog>
            </Hidden>
        </>

    );
};

export default MobileSelectDays;