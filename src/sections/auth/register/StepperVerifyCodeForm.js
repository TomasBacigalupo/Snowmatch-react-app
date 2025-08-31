import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { OutlinedInput, Stack, Box, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import axios from '../../../utils/axios';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function StepperVerifyCodeForm({ onVerificationSuccess }) {
  const { testVerification } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifying, setIsVerifying] = useState(false);

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required'),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  };

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const values = watch();

  useEffect(() => {
    document.addEventListener('paste', handlePasteClipboard);
    return () => {
      document.removeEventListener('paste', handlePasteClipboard);
    };
  }, []);

  const handleBlur = async (attributes, event) => {
    try {
      setIsVerifying(true);
      const code = Object.values(attributes).join(''); 

      const response = await axios.put('/api/userPersonalDataVerification/registrationNumericCode/'+code);

      if(response.status === 200){
        enqueueSnackbar('¡Verificación exitosa!', { variant: 'success' });
        
        // Test verification and call success callback
        testVerification((success) => {
          if (success) {
            if (onVerificationSuccess) {
              onVerificationSuccess();
            }
          } else {
            enqueueSnackbar('Email no verificado', { variant: 'warning' });
          }
        });
      } else {
        enqueueSnackbar("Algo salió mal, por favor intenta de nuevo", { 
          variant: 'error',
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error al verificar el código", { 
        variant: 'error',
        autoHideDuration: 5000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasteClipboard = (event) => {
    let data = event?.clipboardData?.getData('Text') || '';
    data = data.split('');

    [].forEach.call(document.querySelectorAll('#field-code'), (node, index) => {
      node.value = data[index];
      const fieldIndex = `code${index + 1}`;
      setValue(fieldIndex, data[index]);
    });
  };

  const handleChangeWithNextField = (event, handleChange) => {
    const { maxLength, value, name } = event.target;
    const fieldIndex = name.replace('code', '');
    const fieldIntIndex = Number(fieldIndex);

    if (value.length >= maxLength) {
      if (fieldIntIndex < 6) {
        const nextfield = document.querySelector(`input[name=code${fieldIntIndex + 1}]`);
        if (nextfield !== null) {
          nextfield.focus();
        }
      } else {
        handleChange(event);
        const field = document.querySelector(`input[name=code${fieldIntIndex}]`);
        field.blur();
        return;
      }
    }
    handleChange(event);
  };

  const handleResendCode = async () => {
    try {
      await axios.post('/api/userPersonalDataVerification/verificationEmail');
      enqueueSnackbar('Código reenviado exitosamente', { variant: 'success' });
    } catch (error) {
      console.error('Error resending code:', error);
      enqueueSnackbar('Error al reenviar el código', { variant: 'error' });
    }
  };

  return (
    <Box>
      <form onBlur={handleSubmit(handleBlur)}>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          {Object.keys(values).map((name, index) => (
            <Controller
              key={name}
              name={`code${index + 1}`}
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  id="field-code"
                  autoFocus={index === 0}
                  placeholder="-"
                  onChange={(event) => handleChangeWithNextField(event, field.onChange)}
                  inputProps={{
                    maxLength: 1,
                    sx: {
                      p: 0,
                      textAlign: 'center',
                      width: { xs: 36, sm: 56 },
                      height: { xs: 36, sm: 56 },
                    },
                    inputMode: 'numeric'
                  }}
                />
              )}
            />
          ))}
        </Stack>
      </form>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ¿No recibiste el código?
        </Typography>
        <Button 
          variant="text" 
          onClick={handleResendCode}
          disabled={isVerifying}
          sx={{ textTransform: 'none' }}
        >
          Reenviar código
        </Button>
      </Box>
    </Box>
  );
} 