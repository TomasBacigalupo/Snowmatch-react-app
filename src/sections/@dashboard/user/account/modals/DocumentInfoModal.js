import PropTypes from 'prop-types';

// @mui
import { Box, Stack, Button, TextField, Typography, IconButton, Dialog, createStyles } from '@mui/material';
import { LoadingButton } from '@mui/lab';

DocumentInfoModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    certificateImageLink: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string
}

export default function DocumentInfoModal({ isOpen, onClose, certificateImageLink, description, status }) {

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
                    {status === 'NEEDS_VERIFICATION' && <Typography variant='body1'>
                        This document is under verification process of SnowMatch.pro
                    </Typography> }
                    {description && <Typography variant='body2'>
                        {description}
                    </Typography>}
                    <Stack direction='row' spacing={2} justifyContent='center' >
                        <img style={styles.image} src={certificateImageLink}/>
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

const styles = createStyles({
    image: {
        maxWidth: '300px',
        borderRadius: '8px'
    }
})