import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { RHFUploadSingleFile, RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { useState } from 'react';
import { UploadSingleFile } from 'src/components/upload';
import { fData } from 'src/utils/formatNumber';
import { FormProvider } from 'src/components/hook-form';
//form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Collapse, Stack, Button, TextField, Typography, IconButton, Dialog } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// redux
import { uploadCertificatePicture } from 'src/redux/slices/teachers';
import { useDispatch} from 'src/redux/store'

UploadDocumentModal.propTypes = {
    isOpen: PropTypes.bool,
    onCancel: PropTypes.func,
    name: PropTypes.string
}

export default function UploadDocumentModal({ isOpen, onCancel, name }) {

    const methods = useForm();
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const onSubmit = data => {
        setLoading(true)
        dispatch(uploadCertificatePicture(data.certificate, name, ()=> setLoading(false)))
        console.log(data);
    }
    const {
        setValue,
        control,
        handleSubmit
    } = methods
    

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
                            <RHFUploadSingleFile name="certificate" accept="image/*" maxSize={16000000} onDrop={handleDrop} />
                        </Stack>

                        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                            <Button color="inherit" variant="outlined" onClick={onCancel}>
                                Cancel
                            </Button>
                            <LoadingButton loading={loading} type="submit" variant="contained" onClick={() => { }}>
                                Save Change
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Box>
            </FormProvider>
        </Dialog>
        
    )

}