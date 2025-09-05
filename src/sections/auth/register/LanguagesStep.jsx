import PropTypes from 'prop-types';

// @mui
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
// framer motion
import { m } from 'framer-motion';
// hooks
import useLocales from 'src/hooks/useLocales';
// components
import Iconify from '../../../components/Iconify';
import { useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------

const LanguageCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected
    ? `2px solid #000000`
    : `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: selected ? '#f5f5f5' : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
    borderColor: selected ? '#000000' : theme.palette.grey[400],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const mainLanguages = [
  {
    id: 'ENGLISH',
    label: 'Inglés',
    description: 'English',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'FRENCH',
    label: 'Francés',
    description: 'Français',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'SPANISH',
    label: 'Español',
    description: 'Español',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'PORTUGUESE',
    label: 'Portugués',
    description: 'Português',
    icon: 'mdi:flag',
    color: '#000000'
  }
];

const additionalLanguages = [
  {
    id: 'GERMAN',
    label: 'Alemán',
    description: 'Deutsch',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'ITALIAN',
    label: 'Italiano',
    description: 'Italiano',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'RUSSIAN',
    label: 'Ruso',
    description: 'Русский',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'CHINESE',
    label: 'Chino',
    description: '中文',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'JAPANESE',
    label: 'Japonés',
    description: '日本語',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'KOREAN',
    label: 'Coreano',
    description: '한국어',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'ARABIC',
    label: 'Árabe',
    description: 'العربية',
    icon: 'mdi:flag',
    color: '#000000'
  },
  {
    id: 'DUTCH',
    label: 'Holandés',
    description: 'Nederlands',
    icon: 'mdi:flag',
    color: '#000000'
  }
];

LanguagesStep.propTypes = {
  // Add any props if needed in the future
};

export default function LanguagesStep() {
  const { translate } = useLocales();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { watch, setValue } = useFormContext();
  const selectedLanguages = watch('languages') || [];

  const handleLanguageClick = (languageId) => {
    const currentLanguages = selectedLanguages;
    if (currentLanguages.includes(languageId)) {
      setValue('languages', currentLanguages.filter(id => id !== languageId));
    } else {
      setValue('languages', [...currentLanguages, languageId]);
    }
  };

  const renderLanguageCard = (language) => {
    const isSelected = selectedLanguages.includes(language.id);

    return (
      <Grid item xs={6} sm={4} md={3} key={language.id}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LanguageCard
            selected={isSelected}
            onClick={() => handleLanguageClick(language.id)}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Iconify
                icon={language.icon}
                sx={{
                  fontSize: 32,
                  color: isSelected ? '#000000' : language.color,
                  mb: 1,
                  transition: 'all 0.3s ease'
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: isSelected ? '#000000' : 'text.primary',
                  mb: 0.5
                }}
              >
                {language.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isSelected ? '#000000' : 'text.secondary',
                  fontSize: '0.75rem'
                }}
              >
                {language.description}
              </Typography>
            </CardContent>
          </LanguageCard>
        </m.div>
      </Grid>
    );
  };

  return (
    <m.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
{translate('registerForm.languages.title')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            maxWidth: 600,
            mx: 'auto'
          }}
        >
{translate('registerForm.languages.subtitle')}
        </Typography>
      </Box>

      {/* Main Languages Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2
          }}
        >
{translate('registerForm.languages.mainLanguages')}
        </Typography>
        <Grid container spacing={2}>
          {mainLanguages.map(renderLanguageCard)}
        </Grid>
      </Box>

      {/* Additional Languages Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 2
          }}
        >
{translate('registerForm.languages.additionalLanguages')}
        </Typography>
        <Grid container spacing={2}>
          {additionalLanguages.map(renderLanguageCard)}
        </Grid>
      </Box>

      {/* Tips Section */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Box sx={{ p: 3, bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Iconify
              icon="eva:bulb-fill"
              sx={{
                fontSize: 20,
                color: '#000000',
                mr: 2,
                mt: 0.2
              }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000000', mb: 1 }}>
{translate('registerForm.languages.tips.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                • <strong>{translate('registerForm.languages.tips.selectAll')}</strong><br />
                • <strong>{translate('registerForm.languages.tips.includeNative')}</strong><br />
                • <strong>{translate('registerForm.languages.tips.addLater')}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>
      </m.div>
    </m.div>
  );
} 