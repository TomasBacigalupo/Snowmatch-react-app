import { useCallback, useState, useRef } from 'react';
import { Grid, Card, Button, CardHeader, Typography, Box, DialogTitle, TextField } from '@mui/material';
import { useDispatch, useSelector } from '../../../../redux/store';
import useLocales from 'src/hooks/useLocales';
import { useSnackbar } from 'notistack';
import debounce from 'lodash/debounce';

export default function CompleteUserInfo({ onUserInfoChange }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const { translate } = useLocales();
    const phoneInputRef = useRef(null);

    const handleNameChange = (event) => {
        const newName = event.target.value;
        setName(newName);
        onUserInfoChange({ name: newName, phone });
    };

    const handlePhoneChange = (event) => {
        const newPhone = event.target.value;
        setPhone(newPhone);
        onUserInfoChange({ name, phone: newPhone });
    };

    const handleNameKeyDown = (event) => {
        if (event.key === 'Enter') {
            phoneInputRef.current.focus();
        }
    };

    const handlePhoneKeyDown = (event) => {
        if (event.key === 'Enter') {
            phoneInputRef.current.blur();
        }
    };

    return (
        <Grid item xs={12} md={8}>
            <Card sx={{ p: 3, mb: 1, borderRadius: '0px' }}>
                <Typography variant="h6">
                    Información Personal
                </Typography>
                <Box mt={2}>
                    <TextField
                        fullWidth
                        required
                        label="Nombre completo"
                        value={name}
                        onChange={handleNameChange}
                        onKeyDown={handleNameKeyDown}
                        sx={{ mb: 3 }}
                        autoComplete="name"
                        type="text"
                    />

                    <TextField
                        fullWidth
                        required
                        label="Teléfono"
                        value={phone}
                        onChange={handlePhoneChange}
                        onKeyDown={handlePhoneKeyDown}
                        helperText="Incluya el código de área"
                        autoComplete="tel"
                        type="tel"
                        inputRef={phoneInputRef}
                        inputProps={{
                            pattern: "[0-9]*",
                            inputMode: "numeric"
                        }}
                    />
                </Box>
            </Card>
        </Grid>
    );
}
