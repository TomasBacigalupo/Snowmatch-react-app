import { Box, Card, Grid, Button, Typography, createStyles, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/Iconify';
import DocumentInfoModal from './modals/DocumentInfoModal';
import UploadDocumentModal from './modals/UploadDocumentModal';
import { useState } from 'react'

CertificateItem.prototype = {
    title: PropTypes.string,
    imageLink: PropTypes.string,
    status: PropTypes.string,
    certificateImageLink: PropTypes.string,
    onUpload: PropTypes.func
}

export default function CertificateItem({ title, imageLink, status, certificateImageLink, onUpload }) {
    
    const [open, setOpen] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)
    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    return (
        <>
            <UploadDocumentModal
                isOpen={open}
                onCancel={() => setOpen(false)}
                onSubmit={onUpload}
                name={title}
            />
            <DocumentInfoModal
                isOpen={infoOpen}
                certificateImageLink={certificateImageLink}
                onClose={() => { setInfoOpen(false) }}
            />
            <Box style={mobile ? styles.certContainerMobile : styles.certContainer}>
                <Card sx={styles.card}>
                    <Grid container>
                        <Grid item xs={mobile??4}>
                            <img style={styles.image} src={imageLink} />
                        </Grid>
                        <Grid item xs={mobile ?? 4}>
                            <Typography style={styles.title} variant="h4">{title}</Typography>
                        </Grid>
                        <Grid item xs={mobile ?? 4}>
                            {status === 'VERIFIED' || status === 'NEEDS_VERIFICATION' && (
                                <Button style={styles.button} color='success' size="small" startIcon={<Iconify icon={'material-symbols:cloud-done'} />} onClick={() => setInfoOpen(true)}>
                                    Info
                                </Button>
                            )}
                            {status === 'NO_DATA' || status === undefined && (
                                <Button style={styles.button} size="small" startIcon={<Iconify icon={'material-symbols:cloud-upload'} />} onClick={() => setOpen(true)}>
                                    Upload
                                </Button>
                            )}

                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </>
    )
}

const styles = createStyles({
    image: {
        height: '50px'
    },
    title: {
        marginTop: '6px',
        paddingRight: '8px',
        paddingLeft: '8px'
    },
    button: {
        marginTop: '9px',
        paddingRight: '8px',
        paddingLeft: '8px'
    },
    card: {
        padding: '16px'
    },
    certContainer: {
        padding: '16px',
    },
    certContainerMobile: {
        padding: '16px',
        width: '100%'
    }
})