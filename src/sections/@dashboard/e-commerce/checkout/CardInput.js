import React, { useState, useEffect } from 'react';
import Cards from 'react-credit-cards-2';
import { Box } from "@mui/material";
import 'react-credit-cards-2/es/styles-compiled.css';
import { RHFTextField } from 'src/components/hook-form';
import { Grid } from '@mui/material';
// @mui
import { Paper, Stack, Button, Popover, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import Iconify from 'src/components/Iconify';
import { useDispatch } from 'src/redux/store';
import { addCard } from 'src/redux/slices/teachers';
// components

export default function CardInput() {
    const dispatch  = useDispatch()
    const [isOpen, setIsOpen] = useState(null);
    const [card, setCard] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });

    useEffect(() => {
        dispatch(addCard(card))
    }, [dispatch, card])

    const handleInputChange = (evt) => {
        const { name, value } = evt.target;

        setCard((prev) => ({ ...prev, [name]: value }));
    }

    const handleInputFocus = (evt) => {
        setCard((prev) => ({ ...prev, focus: evt.target.name }));
    }

    return (
        <div id='PaymentForm'>
            <br />
            <Cards
                number={card.number}
                expiry={card.expiry}
                cvc={card.cvc}
                name={card.name}
                focused={card.focus}
            />
            <br />
            <Paper
                sx={{
                    p: 2.5,
                    mb: 2.5,
                    bgcolor: 'background.neutral',
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="subtitle1">Card Details</Typography>
                    <TextField
                        onFocus={handleInputFocus}
                        inputProps={{ maxLength: 16 }}
                        value={card.number}
                        onChange={(event) => {
                            setCard((prev) => {
                                return {
                                    ...prev,
                                    number: event.target.value
                                }
                            })
                        }}
                        fullWidth
                        size="small"
                        label="Card number" />
                    <TextField
                        onFocus={handleInputFocus}
                        value={card.name}
                        onChange={(event) => {
                            setCard((prev) => {
                                return {
                                    ...prev,
                                    name: event.target.value
                                }
                            })
                        }}
                        fullWidth
                        size="small"
                        label="Name on card"
                    />
                    <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
                        <TextField
                            onFocus={handleInputFocus}
                            value={card.expiry}
                            onChange={(event) => {
                                setCard((prev) => {
                                    return {
                                        ...prev,
                                        expiry: event.target.value
                                    }
                                })
                            }}
                            size="small"
                            label="MM/YY" />
                        <TextField
                            onFocus={handleInputFocus}
                            onChange={(event) => {
                                setCard((prev) => {
                                    return {
                                        ...prev,
                                        cvc: event.target.value
                                    }
                                })
                            }}
                            name='cvc'
                            size="small"
                            label="CVV"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" edge="end" onClick={(event) => setIsOpen(event.currentTarget)}>
                                            <Iconify icon={'eva:info-fill'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>

                    <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
                        <Stack xs={4}>
                            <TextField
                                value='DNI'
                                disabled
                                size="small"
                                label="Tipo" />
                        </Stack>
                        <Stack xs={8}>
                            <TextField
                                onChange={(event) => {
                                    setCard((prev) => {
                                        return {
                                            ...prev,
                                            dni: event.target.value
                                        }
                                    })
                                }}
                                name='dni'
                                size="small"
                                label="Numero"
                            />
                        </Stack>
                    </Stack>

                    {/* <Stack direction="row" spacing={2}>
                        <Button fullWidth onClick={onCancel}>
                            Cancel
                        </Button>

                        <Button fullWidth variant="contained" onClick={onCancel}>
                            Create
                        </Button>
                    </Stack> */}
                </Stack>
            </Paper>

            <Popover
                open={Boolean(isOpen)}
                anchorEl={isOpen}
                onClose={() => setIsOpen(null)}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        maxWidth: 200,
                    },
                }}
            >
                <Typography variant="body2" align="center">
                    Three-digit number on the back of your VISA card
                </Typography>
            </Popover>


        </div>
    )
}