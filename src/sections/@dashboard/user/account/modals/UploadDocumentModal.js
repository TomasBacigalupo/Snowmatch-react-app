import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { RHFUploadSingleFile } from 'src/components/hook-form';
import { useState } from 'react';
import { FormProvider } from 'src/components/hook-form';
//form
import { useForm } from 'react-hook-form';

// @mui
import { Box, Stack, Button, Typography, Dialog } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// redux
import { updateLoggedUser, uploadCertificatePicture } from 'src/redux/slices/teachers';
import { useDispatch } from 'src/redux/store'
import useAuth from 'src/hooks/useAuth';

UploadDocumentModal.propTypes = {
    isOpen: PropTypes.bool,
    onCancel: PropTypes.func,
    name: PropTypes.string
}

export default function UploadDocumentModal({ isOpen, onCancel, name }) {

    const methods = useForm();
    const [loading, setLoading] = useState(false)
    const { updateUser, user } = useAuth()
    const dispatch = useDispatch()
    const {
        setValue,
        handleSubmit
    } = methods

    const onSubmit = data => {
        setLoading(true)
        dispatch(uploadCertificatePicture(data.certificate, name, (uploaded) => {
            if (uploaded) {
                const document = {
                    name: name,
                    state: 'NEEDS_VERIFICATION'
                }
                user.documents = [...user.documents, document]
                updateUser(user)
            }
            dispatch(updateLoggedUser((updatedUser) => updateUser(updatedUser)))
            setLoading(false)
            onCancel()
        }))
    }

    const handleDrop = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setValue(
                    'certificate',
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                );
            }
        },
        [setValue]
    );

    return (
        <Dialog open={isOpen}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        padding: 3,
                        borderRadius: 1,
                        bgcolor: 'background.neutral',
                    }}
                >
                    <Stack spacing={3}>
                        <Typography variant="subtitle1">Add new document</Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <RHFUploadSingleFile
                                name="certificate"
                                accept="image/*"
                                maxSize={16000000}
                                onDrop={handleDrop} />
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                            <Button color="inherit" variant="outlined" onClick={onCancel}>
                                Cancel
                            </Button>
                            <LoadingButton
                                loading={loading}
                                type="submit"
                                variant="contained"
                                onClick={() => { }}>
                                Save Change
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Box>
            </FormProvider>
        </Dialog>
    )
}