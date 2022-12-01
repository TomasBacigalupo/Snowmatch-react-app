import PropTypes from 'prop-types';

// @mui
import { Box, Stack, Button, TextField, Typography, IconButton, Dialog } from '@mui/material';
import { LoadingButton } from '@mui/lab';

DocumentInfoModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    certificateImageLink: PropTypes.string
}

export default function DocumentInfoModal({ isOpen, onClose, certificateImageLink }) {

    return (
        <Dialog open={isOpen}>
            <Box
                sx={{
                    padding: 3,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                }}
            >
                <Stack spacing={3}>
                    <Typography variant="subtitle1">Document uploaded Information</Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <img src={certificateImageLink}/>
                    </Stack>

                    <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                        <LoadingButton type="submit" variant="contained" onClick={onClose}>
                            Close
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Box>
        </Dialog>

    )

}