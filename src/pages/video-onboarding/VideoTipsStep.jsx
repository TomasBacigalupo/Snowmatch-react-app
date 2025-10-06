import { Box, Typography, Stack, Card, CardContent, Alert } from '@mui/material';
import { m } from 'framer-motion';
import Iconify from '../../components/Iconify';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

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

const getTips = (translate) => [
  {
    icon: 'eva:target-fill',
    title: translate('videoOnboarding.tips.tip1.title'),
    description: translate('videoOnboarding.tips.tip1.description'),
    color: '#FF6B6B'
  },
  {
    icon: 'eva:zoom-in-fill',
    title: translate('videoOnboarding.tips.tip2.title'),
    description: translate('videoOnboarding.tips.tip2.description'),
    color: '#4ECDC4'
  },
  {
    icon: 'eva:layers-fill',
    title: translate('videoOnboarding.tips.tip3.title'),
    description: translate('videoOnboarding.tips.tip3.description'),
    color: '#45B7D1'
  }
];

export default function VideoTipsStep() {
  const { translate } = useLocales();
  const tips = getTips(translate);
  
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <m.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <m.div variants={item}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              {translate('videoOnboarding.tips.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              {translate('videoOnboarding.tips.subtitle')}
            </Typography>
          </Box>
        </m.div>

        {/* Important Notice */}
        <m.div variants={item}>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            <Typography variant="body2">
              {translate('videoOnboarding.tips.remember')}
            </Typography>
          </Alert>
        </m.div>

        {/* Tips Grid */}
        <m.div variants={container}>
          <Stack spacing={3}>
            {tips.map((tip, index) => (
              <m.div key={index} variants={item}>
                <Card 
                  sx={{ 
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={3} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: tip.color,
                          color: 'white',
                          flexShrink: 0
                        }}
                      >
                        <Iconify icon={tip.icon} sx={{ fontSize: 28 }} />
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {tip.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tip.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </m.div>
            ))}
          </Stack>
        </m.div>

        {/* Bottom Message */}
        <m.div variants={item}>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              {translate('videoOnboarding.tips.ready')}
            </Typography>
          </Box>
        </m.div>
      </m.div>
    </Box>
  );
}
