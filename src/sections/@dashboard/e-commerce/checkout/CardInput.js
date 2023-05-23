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
import useLocales from 'src/hooks/useLocales';
// components

export default function CardInput() {
    const { translate } = useLocales()
    const dispatch = useDispatch()
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
                    bgcolor: 'background.neutral',
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="subtitle1">{translate('cardInput.title')}</Typography>
                    <TextField
                        name="Card number"
                        onFocus={handleInputFocus}
                        inputProps={{ maxLength: 19 }}
                        value={card.number}
                        onChange={(event) => {
                            const input = event.target.value;
                            const formattedInput = input
                                .replace(/\D/g, '') // Remove non-numeric characters
                                .replace(/(.{4})/g, '$1 ') // Add a space after every 4 characters
                                .trim(); // Remove any trailing spaces

                            setCard((prev) => {
                                return {
                                    ...prev,
                                    number: formattedInput
                                };
                            });
                        }}
                        fullWidth
                        size="small"
                        label={translate('cardInput.number')} />
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
                        label={translate('cardInput.name')}
                        name="Name on card"
                    />
                    <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
                        <Box display='flex' width='100%'>
                            <Box flex='1'>
                                <TextField
                                    onFocus={handleInputFocus}
                                    value={card.expiry}
                                    onChange={(event) => {
                                        const { value } = event.target;
                                        let formattedValue = value;

                                        // Remove non-digit characters
                                        formattedValue = formattedValue.replace(/\D/g, '');

                                        // Add slash (/) after the second digit if necessary
                                        if (formattedValue.length > 2) {
                                            formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
                                        }

                                        setCard((prev) => {
                                            return {
                                                ...prev,
                                                expiry: formattedValue
                                            };
                                        });
                                    }}
                                    inputProps={{
                                        maxLength: 5,
                                        pattern: "\\d{2}/\\d{2}",
                                        inputMode: "numeric"
                                    }}
                                    size="small"
                                    placeholder={translate('cardInput.expiry')}
                                    label={translate('cardInput.expiry')}
                                    name="Expiry date"
                                     />
                            </Box>

                            <Box flex='2' ml={2}>
                                <TextField
                                    fullWidth
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
                            </Box>
                        </Box>
                    </Stack>

                    <Stack direction={{ xs: 'row', sm: 'row' }} spacing={2}>
                        <Box display='flex' width='100%'>
                            <Box flex='1'>
                                <TextField
                                    fullWidth
                                    value='DNI'
                                    disabled
                                    size="small"
                                    label={translate('cardInput.type')} />
                            </Box>
                            <Box flex='2' ml={2}>
                                <TextField
                                    fullWidth
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
                                    label={translate('cardInput.id')}
                                />
                            </Box>
                        </Box>
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
                    {translate('cardInput.explain')}
                </Typography>
            </Popover>


        </div>
    )
}