import React, { useCallback, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/Iconify';
import Button from '@mui/material/Button';
import SelectDates from './SelectDates';
import { addCart } from 'src/redux/slices/teachers';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import useLocales from 'src/hooks/useLocales';

const MobileSelectDays = ({ teacher, isOpen, closeFather, isRange }) => {
    const { translate } = useLocales();
    const [open, setOpen] = React.useState(isOpen);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmitSelectedDates = useCallback((dates) => {
        dates.forEach((date) => {
            let lessonTime = "MORNING"
            let price = 0
            let bookingPrice = 0
            if (new Date(date).getHours() === 14) {
                lessonTime = "AFTERNOON"
                price = 180
                bookingPrice = 18
            }
            if (new Date(date).getHours() === 9) {
                lessonTime = "MORNING"
                price = 180
                bookingPrice = 18
            }
            if (new Date(date).getHours() === 8) {
                lessonTime = "ALL_DAY"
                price = 300
                bookingPrice = 30
            }
            const requestEvent = {
                price: price,
                bookingPrice: bookingPrice,
                people: 1,
                lessonTime: lessonTime,
                date: date,
                resort: 'Catedral'
            };
            dispatch(addCart({
                teacher: teacher,
                event: requestEvent
            }))

            navigate('hire');
        })
    })

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

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
                        {teacher?.level >= 3 && teacher.resort === 'Cerro Catedral' ? '$180' : 'Contactár'}
                    </Typography>
                    <Typography variant="body" width='100%'>
                        {teacher?.level >= 3 && teacher.resort === 'Cerro Catedral' && translate('checkout.halfDay3Hours')}
                    </Typography>
                </Grid>
                <Grid item xs={6} px={2} py={3}>
                    <Button variant='contained' sx={{ p: 2 }} fullWidth onClick={() => setOpen(true)}>
                        {translate('checkout.selectDays')}
                    </Button>
                </Grid>
            </Grid>

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
                        <Typography variant="h4">
                            {translate('checkout.selectDays')}
                        </Typography>
                        <Typography variant="body">
                            {translate('checkout.selectDaysDescription')}
                        </Typography>
                    </Grid>
                    <SelectDates
                        isRange={isRange}
                        handleClose={() => {
                            if(closeFather){
                                closeFather()
                            }
                            setOpen(false)}}
                        onSubmit={handleSubmitSelectedDates}
                    />
                </Grid>
            </Drawer>
        </>

    );
};

export default MobileSelectDays;