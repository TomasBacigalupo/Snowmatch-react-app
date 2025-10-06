import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Card, 
  CardContent,
  Button,
  Alert,
  Chip,
  LinearProgress,
  Drawer
} from '@mui/material';
import { m } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import Login from '../auth/Login';

// ----------------------------------------------------------------------

VideoReviewStep.propTypes = {
  validateField: PropTypes.func.isRequired,
};

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const getReviewOptions = (translate) => [
  {
    id: 'ai_analysis',
    name: translate('videoOnboarding.review.aiAnalysis.name'),
    description: translate('videoOnboarding.review.aiAnalysis.description'),
    icon: '/assets/avatars/snow-ai.png',
    color: '#1976d2',
    time: translate('videoOnboarding.review.aiAnalysis.time')
  },
  {
    id: 'certified_instructor',
    name: translate('videoOnboarding.review.certifiedInstructor.name'),
    description: translate('videoOnboarding.review.certifiedInstructor.description'),
    icon: 'eva:person-fill',
    color: '#1976d2',
    time: translate('videoOnboarding.review.certifiedInstructor.time')
  }
];

export default function VideoReviewStep({ validateField }) {
  const { setValue, watch } = useFormContext();
  const { isAuthenticated } = useAuth();
  const { translate } = useLocales();
  const [selectedOption, setSelectedOption] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingOption, setPendingOption] = useState(null);
  
  const reviewOptions = getReviewOptions(translate);

  const handleOptionSelect = useCallback((optionId) => {
    if (!isAuthenticated) {
      // Store the option and show login modal
      setPendingOption(optionId);
      setLoginModalOpen(true);
      return;
    }
    
    // User is authenticated, proceed with selection
    setSelectedOption(optionId);
    setValue('reviewType', optionId);
    validateField('reviewType', optionId);
  }, [isAuthenticated, setValue, validateField]);

  // Handle successful login
  const handleLoginSuccess = useCallback(() => {
    setLoginModalOpen(false);
    if (pendingOption) {
      setSelectedOption(pendingOption);
      setValue('reviewType', pendingOption);
      validateField('reviewType', pendingOption);
      setPendingOption(null);
    }
  }, [pendingOption, setValue, validateField]);

  // Listen for authentication changes
  useEffect(() => {
    if (isAuthenticated && pendingOption) {
      handleLoginSuccess();
    }
  }, [isAuthenticated, pendingOption, handleLoginSuccess]);

  const handleContinue = useCallback(async () => {
    setIsProcessing(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically redirect to next step or complete the process
      console.log('Selected review type:', selectedOption);
      
    } catch (error) {
      console.error('Error processing selection:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedOption]);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
      <m.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <m.div variants={item}>
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }} gutterBottom>
              {translate('videoOnboarding.review.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ px: { xs: 2, sm: 0 } }}>
              {translate('videoOnboarding.review.subtitle')}
            </Typography>
          </Box>
        </m.div>

        {/* Review Options */}
        <m.div variants={container}>
          <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ maxWidth: 600, mx: 'auto', px: { xs: 1, sm: 0 } }}>
            {reviewOptions.map((option) => (
              <m.div key={option.id} variants={item}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedOption === option.id ? `2px solid ${option.color}` : '1px solid #e0e0e0',
                    '&:hover': {
                      border: `2px solid ${option.color}`,
                      boxShadow: 2
                    }
                  }}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={{ xs: 2, sm: 3 }} 
                      alignItems={{ xs: 'center', sm: 'center' }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          width: { xs: 80, sm: 100 },
                          height: { xs: 80, sm: 100 },
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: option.id === 'ai_analysis' ? 'transparent' : option.id === 'certified_instructor' ? 'transparent' : option.color,
                          color: 'white',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        {option.id === 'ai_analysis' ? (
                          <Box
                            component="img"
                            src={option.icon}
                            alt="Snow AI"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : option.id === 'certified_instructor' ? (
                          <Stack direction="row" spacing={-1}>
                            {[
                              '/assets/avatars/avatar_1.png',
                              '/assets/avatars/avatar_2.png',
                              '/assets/avatars/avatar_3.png'
                            ].map((avatar, index) => (
                              <Box
                                key={index}
                                component="img"
                                src={avatar}
                                alt={`Instructor ${index + 1}`}
                                sx={{
                                  width: { xs: 32, sm: 40 },
                                  height: { xs: 32, sm: 40 },
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }}
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Iconify icon={option.icon} sx={{ fontSize: { xs: 40, sm: 50 } }} />
                        )}
                      </Box>

                      {/* Info */}
                      <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                          {option.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
                          {option.description}
                        </Typography>
                        <Stack 
                          direction="row" 
                          alignItems="center" 
                          spacing={1} 
                          justifyContent={{ xs: 'center', sm: 'flex-start' }}
                        >
                          <Iconify icon="eva:clock-fill" sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {option.time}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Select Button */}
                      <Button
                        variant={selectedOption === option.id ? "contained" : "outlined"}
                        size="medium"
                        sx={{
                          minWidth: { xs: 140, sm: 120 },
                          width: { xs: '100%', sm: 'auto' },
                          backgroundColor: selectedOption === option.id ? option.color : 'transparent',
                          borderColor: option.color,
                          color: selectedOption === option.id ? 'white' : option.color,
                          '&:hover': {
                            backgroundColor: selectedOption === option.id ? option.color : option.color + '20'
                          }
                        }}
                      >
                        {selectedOption === option.id ? translate('videoOnboarding.review.selected') : translate('videoOnboarding.review.select')}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </Stack>
        </m.div>

        {/* Login Modal */}
        <Drawer
          anchor="bottom"
          open={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              height: '90vh',
              maxHeight: '90vh',
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 40, height: 6, borderRadius: 3, bgcolor: 'grey.300' }} />
          </Box>
          <Login fromModal={true} />
        </Drawer>
      </m.div>
    </Box>
  );
}
