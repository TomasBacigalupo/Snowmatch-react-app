import { Typography, Grid, Card, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import Image from 'src/components/Image';
import { useState } from 'react';
import { Select } from '@mui/material';
import { useDispatch } from 'src/redux/store';
import { updateDocument } from 'src/redux/slices/admin';
import { TeacherDetailsCarousel } from 'src/sections/@dashboard/e-commerce/teacher-details'
CertificateItem.propTypes = {
    teacherId: PropTypes.number,
    link: PropTypes.string,
    name: PropTypes.string,
    state: PropTypes.string
}

export default function CertificateItem({ teacherId, link, name, state }) {

    const [loading, setLoading] = useState(false)
    const [documentState, setDocumentState] = useState(state)
    const [currentState, setCurrentState] = useState(state)
    const dispatch = useDispatch()

    const handleChange = (event) => {
        setDocumentState(event.target.value)
    }

    const onSubmit = () => {
        setLoading(true)
        dispatch(updateDocument(teacherId, name, documentState, (succ) => {
            if (succ) {
                setCurrentState(documentState)
            }
            setLoading(false);
        }))
    }

    return (
        <Card style={{ padding: '8px', marginTop: '16px' }}>
            <Grid container spacing={3} alignItems='center' style={{ padding: '8px' }}>
                <Grid item xs={12} spacing={3}>
                    <TeacherDetailsCarousel teacher={{ images: [link] }} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h5'>Edit Document State</Typography>
                </Grid>
                <Grid item xs={12} container spacing={3} justifyContent='flex-start'>
                    <Grid item xs={12} md={6}>
                        <Typography>Name: {name}</Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Select label='State' value={documentState} onChange={handleChange} fullWidth>
                            <MenuItem value='NEEDS_VERIFICATION' disabled={true}>Needs Verification</MenuItem>
                            <MenuItem value='REJECTED'>Rejected</MenuItem>
                            <MenuItem value='VERIFIED'>Verified</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <LoadingButton
                            loading={loading}
                            variant='contained'
                            disabled={currentState == documentState}
                            onClick={onSubmit}
                        >
                            Save
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Card>

    )
}