import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Stack } from '@mui/material';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { RHFMultipleSelect } from '../../../components/hook-form';
// mock
import { ski_resorts } from "src/_mock";

// ----------------------------------------------------------------------

ResortDisciplines.propTypes = {
  // Add any props if needed in the future
};

export default function ResortDisciplines() {
  const { translate } = useLocales();

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Iconify icon="eva:star-fill" sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Disciplinas y Idiomas
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Define tus disciplinas deportivas e idiomas que hablas
      </Typography>
      
      <Stack spacing={3}>
        <RHFMultipleSelect 
          name="disciplines" 
          label={translate("general.form.disciplines")} 
          list={["Ski", "SnowBoard"]} 
        />
        
        <RHFMultipleSelect 
          name="speaks" 
          label={translate("general.form.languages")} 
          list={["Español", "English", "Portugues", "Italiano"]} 
        />
        
        <RHFMultipleSelect 
          name="sports" 
          label={translate("general.form.sports")} 
          list={["SKI", "SNOWBOARD"]} 
        />
        

      </Stack>
    </m.div>
  );
} 