import { CardHeader, CardBody, Row, Col, FormGroup, Input, Box, Card, Typography, Grid, IconButton, Drawer, Button, Divider, TextField } from "@mui/material";
import { useState } from "react";
import Iconify from "src/components/Iconify";
import useLocales from "src/hooks/useLocales";
import { changeAsignedStudents } from "src/redux/slices/bookings";
import { useDispatch, useSelector } from "src/redux/store";

const CheckoutProductShare = () => {
    const { translate } = useLocales()
    const [guests, setGuests] = useState(1);
    const [children, setChildren] = useState(0);
    const [adults, setAdults] = useState(1);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { assignedStudents } = useSelector((state) => state.bookings);


    const handleAddGuests = () => {
        setGuests(guests + 1)
    }

    const handleRemoveGuests = () => {
        if (guests > 1) {
            setGuests(guests - 1)
        }
    }

    const handleAddAdults = () => {
        dispatch(changeAsignedStudents([...assignedStudents, { name: "", lastName: "" }]))
        setAdults(adults + 1)
        dispatch(setAdults(adults + 1))
    }

    const handleRemoveAdults = () => {
        dispatch(
            changeAsignedStudents(
                assignedStudents.filter((_, i) => i !== assignedStudents.length - 1)
            )
        )
        if (adults > 0) {
            setAdults(adults - 1)
            dispatch(setAdults(adults - 1))
        }
    }

    const handleAddChildren = () => {
        setChildren(children + 1)
        dispatch(setChildren(children + 1))
    }

    const handleRemoveChildren = () => {
        if (children > 0) {
            setChildren(children - 1)
            dispatch(setChildren(children - 1))
        }
    }

    const handleSave = () => {
        setGuests(adults + children)
        setOpen(false)
    }

    const handleUpdateStudentName = (event, index) => {
        let newStudents = [...assignedStudents]
        newStudents[index] = {
            name: event.target.value,
            lastName: newStudents[index].lastName
        }
        dispatch(changeAsignedStudents(newStudents))
    }

    const handleUpdateStudentLastName = (event, index) => {
        let newStudents = [...assignedStudents]
        newStudents[index] = {
            name: newStudents[index].name,
            lastName: event.target.value
        }
        dispatch(changeAsignedStudents(newStudents))
    }
    
    const handleRemoveAssignedGuest = (index) => {
        dispatch(changeAsignedStudents(assignedStudents.filter((_, i) => i !== index)))
        dispatch(setAdults(adults - 1))
    }

    return (

        <Card sx={{ p: 3, borderRadius: '0px' }}>
            <Grid container spacing={2} justifyContent='space-between'>
                <Grid item xs={12}>
                    <Typography variant="h6" >
                        {translate('checkout.guestsTitle')}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Box>
                        <Typography variant="body" sx={{ mb: 3 }}>
                            {translate('checkout.guests')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            {guests} {translate('checkout.skiers')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} justifyContent='flex-end'>
                    <Box display='flex' justifyContent='flex-end'>
                        <Button onClick={() => setOpen(true)} width='fit-content'>{translate('checkout.edit')}</Button>
                    </Box>
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
                        marginTop: '20px',
                        paddingX: 1
                    }
                }}
            >
                <Box mt={3} display='flex' justifyContent='center' alignItems='center'>
                    <Typography variant="h6">
                        {translate('checkout.skiers')}
                    </Typography>
                </Box>
                <Divider />
                <Grid container p={2} spacing={3} alignItems='center'>
                    <Grid item xs={6}>
                        <Typography variant="body" sx={{ mb: 3 }}>
                            {translate('checkout.skiers')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Box display='flex' alignItems='center' justifyContent='center' spacing={2}>
                            <IconButton
                                disabled={adults === 0}
                                size="small"
                                sx={{ mr: 3, border: 'solid' }}
                                onClick={handleRemoveAdults}>
                                <Iconify icon="ph:minus-bold" />
                            </IconButton>
                            <Typography variant="h4" sx={{ mr: 3 }}>
                                {adults}
                            </Typography>
                            <IconButton size="small" sx={{ mr: 1, border: 'solid' }} onClick={handleAddAdults}>
                                <Iconify icon="ph:plus-bold" />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {assignedStudents.map((guest, index) => (
                            <Box display='flex' spacing={2} alignItems='center' mb={2}>
                                <Box mr={2} alignItems='center'>
                                    {index + 1}
                                </Box>
                                <Box mr={2}>
                                    <TextField
                                        name='fn'
                                        label="Nombre"
                                        value={guest.name}
                                        onChange={(event) => handleUpdateStudentName(event, index)} />
                                </Box>
                                <Box mr={1}>
                                    <TextField
                                        name='ln'
                                        label="Apellido"
                                        value={guest.lastName}
                                        onChange={(event) => handleUpdateStudentLastName(event, index)} />
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveAssignedGuest(index)}>
                                        <Iconify icon="ph:trash" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
                <Divider />
                <Box display='flex' justifyContent='space-between' p={2}>
                    <Button variant='outlined' color='primary' onClick={() => setOpen(false)}>{translate('checkout.cancel')}</Button>
                    <Button variant='contained' disabled={adults + children === 0} color='primary' onClick={handleSave}>{translate('checkout.save')}</Button>
                </Box>
            </Drawer>
        </Card>

    );
};
export default CheckoutProductShare;