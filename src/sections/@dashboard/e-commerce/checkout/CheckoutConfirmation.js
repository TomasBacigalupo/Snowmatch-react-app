import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Grid, Card, Button, Typography, Avatar, Link, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/teachers';
// _mock_
import { _addressBooks } from '../../../../_mock';
// components
import Label from '../../../../components/Label';
//
import CheckoutSummary from './CheckoutSummary';
// calendar
import {
    CalendarStyle,
} from 'src/sections/@dashboard/calendar'

import useResponsive from 'src/hooks/useResponsive';
import { nullableTypeAnnotation } from '@babel/types';
import ShopTeacherCard from '../shop/ShopTeacherCard';
import EventCard from '../../user/cards/EventCard';
import EventConfirmCard from './EventConfirmCard';
// ----------------------------------------------------------------------

FriendCard.propTypes = {
    friend: PropTypes.object,
};

function FriendCard({ friend, onClick, events }) {
    console.log({friend})
    const { name, imageLink, lastname } = friend;
    return (
        <Card
            onClick={onClick}
            sx={{
                py: 3,
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Avatar alt={name} src={imageLink} sx={{ width: 90, height: 90, mb: 3, color: 'white' }} />
            <Link variant="subtitle1" color="text.primary">
                {`${name} ${lastname}`}
            </Link>
            {events.map(event=> <Typography>
                Lesson:
            </Typography>)}

        </Card>
    );
}

// ----------------------------------------------------------------------

export default function CheckoutConfirmation() {
    //
    const isDesktop = useResponsive('up', 'sm');
    const dispatch = useDispatch();
    const { checkout } = useSelector((state) => state.teachers);
    console.log({checkout})
    const { total, discount, subtotal, teacher, events } = checkout;
    //
    const [open, setOpen] = useState(false);
    const [selectedEvent,setSelectedEvent] = useState(null)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNextStep = () => {
        dispatch(onNextStep());
    };

    const handleBackStep = () => {
        dispatch(onBackStep());
    };

    const handleCreateBilling = (value) => {
        dispatch(createBilling(value));
    };

    return (
        <>
            <Grid container spacing={3} alignItems='flex-start'>
                <Grid item xs={12} md={8} container spacing={3}>
                    <Grid item xs={12} >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {teacher && <ShopTeacherCard teacher={teacher}/>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <Card>
                            <CalendarStyle>
                                <FullCalendar
                                    weekends
                                    events={events.map((e, idx) =>({
                                        id: idx,
                                        title: `$${e.price}`,
                                        ...e,
                                        color: '#3399FF'
                                    }))}
                                    rerenderDelay={10}
                                    initialDate={events[0].date}
                                    initialView={'dayGridMonth'}
                                    dayMaxEventRows={3}
                                    eventDisplay="block"
                                    headerToolbar={false}
                                    allDayMaintainDuration
                                    eventResizableFromStart
                                    eventClick={(arg) => {
                                        const idx = arg.event.id
                                        setOpen(true)
                                        setSelectedEvent(events[idx])
                                    }}
                                    height={isDesktop ? 720 : 'auto'}
                                    plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                                />
                            </CalendarStyle>
                        </Card>
                    </Grid>
                </Grid>
                

                <Grid item xs={12} md={4} container spacing={1} alignItems='flex-start'>
                    <Grid item xs={12}>
                        <CheckoutSummary  total={total} discount={discount} />
                    </Grid>
                    
                    <Grid item xs={6} md={6}>
                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color='error'
                            disabled={events.length === 0}
                            onClick={handleBackStep}
                        >
                            back
                        </Button>
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            disabled={events.length === 0}
                            onClick={handleNextStep}
                        >
                            Confirm
                        </Button>
                    </Grid>
                </Grid>
                
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Event Requested</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 1, mt: 3 }}>
                        <Typography  sx={{ display: 'inline-block', minWidth: '100px' }}>Price: </Typography>
                        <Typography variant='body2' sx={{ display: 'inline-block' }}>{selectedEvent?.price}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography  sx={{ display: 'inline-block', minWidth: '100px' }}>Attendees: </Typography>
                        <Typography variant='body2' sx={{ display: 'inline-block' }}>{selectedEvent?.people}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography  sx={{ display: 'inline-block', minWidth: '100px' }}>Level: </Typography>
                        <Typography variant='body2' sx={{ display: 'inline-block' }}>{selectedEvent?.level}</Typography>
                    </Box>
                    <Box>
                        <Typography  sx={{ display: 'inline-block', minWidth: '100px' }}>Discipline: </Typography>
                        <Typography variant='body2' sx={{ display: 'inline-block' }}>{selectedEvent?.discipline}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

// ----------------------------------------------------------------------

AddressItem.propTypes = {
    address: PropTypes.object,
    onNextStep: PropTypes.func,
    onCreateBilling: PropTypes.func,
};

function AddressItem({ address, onNextStep, onCreateBilling }) {
    const { receiver, fullAddress, addressType, phone, isDefault } = address;

    const handleCreateBilling = () => {
        onCreateBilling(address);
        onNextStep();
    };

    return (
        <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1">{receiver}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    &nbsp;({addressType})
                </Typography>
                {isDefault && (
                    <Label color="info" sx={{ ml: 1 }}>
                        Default
                    </Label>
                )}
            </Box>
            <Typography variant="body2" gutterBottom>
                {fullAddress}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {phone}
            </Typography>

            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    position: { sm: 'absolute' },
                    right: { sm: 24 },
                    bottom: { sm: 24 },
                }}
            >
                {!isDefault && (
                    <Button variant="outlined" size="small" color="inherit">
                        Delete
                    </Button>
                )}
                <Box sx={{ mx: 0.5 }} />
                <Button variant="outlined" size="small" onClick={handleCreateBilling}>
                    Deliver to this Address
                </Button>
            </Box>
        </Card>
    );
}
