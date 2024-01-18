import { CastForEducationOutlined, Label } from "@mui/icons-material";
import { CardHeader, CardBody, Row, Col, FormGroup, Input, Box, Card, Typography, Grid, IconButton, Drawer, Button, Divider } from "@mui/material";
import { set } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "src/components/Iconify";

const CheckoutGuests = () => {
    const { t } = useTranslation();
    const [guests, setGuests] = useState(1);
    const [children, setChildren] = useState(0);
    const [adults, setAdults] = useState(1);
    const [open, setOpen] = useState(false);

    const handleAddGuests = () => {
        setGuests(guests + 1)
    }

    const handleRemoveGuests = () => {
        if (guests > 1) {
            setGuests(guests - 1)
        }
    }

    const handleAddAdults = () => {
        setAdults(adults + 1)
    }

    const handleRemoveAdults = () => {
        if (adults > 0) {
            setAdults(adults - 1)
        }
    }

    const handleAddChildren = () => {
        setChildren(children + 1)
    }

    const handleRemoveChildren = () => {
        if (children > 0) {
            setChildren(children - 1)
        }
    }

    const handleSave = () => {
        setGuests(adults + children)
        setOpen(false)
    }

    return (
        
            <Card sx={{ p: 3, borderRadius: '0px' }}>
                <Grid container spacing={2} justifyContent='space-between'>
                    <Grid item xs={12}>
                        <Typography variant="h6" >
                            Información del grupo
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="body" sx={{ mb: 3 }}>
                                Esquiadores
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                {guests} esquiadores
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} justifyContent='flex-end'>
                        <Box display='flex' justifyContent='flex-end'>
                            <Button onClick={() => setOpen(true)} width='fit-content'>Editar</Button>
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
                            Esquiadores
                        </Typography>
                    </Box>
                    <Divider />
                    <Grid container p={2} spacing={3} alignItems='center'>
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                Las clases de esquí son para grupos de hasta 4 personas. Si son más de 4, tendra un cargo adicional por persona de 20 US.
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body" sx={{ mb: 3 }}>
                                Adultos
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                Edad más de 13 años
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
                        <Grid item xs={6}>
                            <Typography variant="body" sx={{ mb: 3 }}>
                                Niños
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3 }}>
                                De 4 a 13 años
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Box display='flex' alignItems='center' justifyContent='center' spacing={2}>
                                <IconButton
                                    disabled={children === 0}
                                    size="small"
                                    sx={{ mr: 3, border: 'solid' }}
                                    onClick={handleRemoveChildren}>
                                    <Iconify icon="ph:minus-bold" />
                                </IconButton>
                                <Typography variant="h4" sx={{ mr: 3 }}>
                                    {children}
                                </Typography>
                                <IconButton size="small" sx={{ mr: 1, border: 'solid' }} onClick={handleAddChildren}>
                                    <Iconify icon="ph:plus-bold" />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Box display='flex' justifyContent='space-between' p={2}>
                        <Button variant='outlined' color='primary' onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button variant='contained' disabled={adults + children === 0} color='primary' onClick={handleSave}>Guardar</Button>
                    </Box>
                </Drawer>
            </Card>

    );
};
export default CheckoutGuests;