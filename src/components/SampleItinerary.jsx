import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Iconify from './Iconify';

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(12, 0),
  background: '#ffffff',
  position: 'relative',
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: { xs: 20, md: '50%' },
    top: 0,
    bottom: 0,
    width: 3,
    background: '#e9ecef',
    transform: { xs: 'none', md: 'translateX(-50%)' },
    zIndex: 1,
  },
}));

const HorizontalTimelineContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const HorizontalItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  minWidth: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#1890FF',
    border: '3px solid #ffffff',
    boxShadow: '0 0 0 3px #e9ecef',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },
}));

const TimelineCard = styled(Card)(({ theme, isMobile, isLeft, isHorizontal }) => ({
  position: 'relative',
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  background: '#ffffff',
  border: '1px solid #f0f0f0',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  maxWidth: { xs: '100%', md: isHorizontal ? 320 : 400 },
  marginLeft: { xs: 60, md: isHorizontal ? 'auto' : (isLeft ? 'auto' : 0) },
  marginRight: { xs: 0, md: isHorizontal ? 'auto' : (isLeft ? 0 : 'auto') },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    border: '1px solid #1890FF',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: { xs: -40, md: isLeft ? -20 : 'auto' },
    right: { xs: 'auto', md: isLeft ? 'auto' : -20 },
    top: 20,
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#1890FF',
    border: '3px solid #ffffff',
    boxShadow: '0 0 0 3px #e9ecef',
    zIndex: 2,
    display: isHorizontal ? 'none' : 'block',
  },
}));

const DayChip = styled(Chip)(({ theme }) => ({
  background: '#1890FF',
  color: 'white',
  fontWeight: 700,
  fontSize: '0.8rem',
  height: 28,
  '& .MuiChip-label': {
    px: 1.5,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8f9fa',
  color: '#1890FF',
  fontSize: 24,
  border: '2px solid #e9ecef',
  transition: 'all 0.3s ease-in-out',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#000000',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: '#666666',
  maxWidth: 700,
  margin: '0 auto',
  fontSize: '1.2rem',
  lineHeight: 1.6,
  fontWeight: 400,
}));

const SampleItinerary = ({ itinerary }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCardClick = (day) => {
    setSelectedDay(day);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDay(null);
  };

  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <SectionTitle variant="h2">
            Itinerario sugerido
          </SectionTitle>
          <SectionSubtitle variant="h5">
            Un ejemplo de cómo podría ser tu viaje perfecto
          </SectionSubtitle>
        </Box>

        {isMobile ? (
          <TimelineContainer>
            <Grid container spacing={0}>
              {itinerary.map((day, index) => (
                <Grid 
                  item 
                  xs={12} 
                  md={6} 
                  key={index}
                  sx={{ 
                    display: 'flex',
                    justifyContent: { xs: 'flex-start', md: index % 2 === 0 ? 'flex-end' : 'flex-start' },
                    pr: { xs: 0, md: index % 2 === 0 ? 4 : 0 },
                    pl: { xs: 0, md: index % 2 === 0 ? 0 : 4 },
                  }}
                >
                  <TimelineCard 
                    isMobile={isMobile}
                    isLeft={index % 2 === 0}
                    onClick={() => handleCardClick(day)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <DayChip label={`Día ${day.day}`} />
                        <IconWrapper>
                          <Iconify icon={day.icon} />
                        </IconWrapper>
                      </Stack>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#000000',
                          fontSize: '1.1rem',
                          mb: 1,
                        }}
                      >
                        {day.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666666',
                          lineHeight: 1.5,
                          fontSize: '0.9rem',
                        }}
                      >
                        {day.description.substring(0, 100)}...
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#1890FF',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          display: 'block',
                          mt: 1,
                        }}
                      >
                        Click para ver detalles →
                      </Typography>
                    </CardContent>
                  </TimelineCard>
                </Grid>
              ))}
            </Grid>
          </TimelineContainer>
        ) : (
          <HorizontalTimelineContainer>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 3,
                background: '#e9ecef',
                transform: 'translateY(-50%)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {itinerary.map((day, index) => {
                const isAbove = index % 2 === 0;
                return (
                  <HorizontalItem key={index}>
                    <Box sx={{ position: 'relative', zIndex: 3, ...(isAbove ? { mb: 8 } : { mt: 8 }) }}>
                      <TimelineCard 
                        isHorizontal
                        onClick={() => handleCardClick(day)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <DayChip label={`Día ${day.day}`} />
                            <IconWrapper>
                              <Iconify icon={day.icon} />
                            </IconWrapper>
                          </Stack>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              color: '#000000',
                              fontSize: '1.1rem',
                              mb: 1,
                            }}
                          >
                            {day.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#666666',
                              lineHeight: 1.5,
                              fontSize: '0.9rem',
                            }}
                          >
                            {day.description.substring(0, 100)}...
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#1890FF',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              display: 'block',
                              mt: 1,
                            }}
                          >
                            Click para ver detalles →
                          </Typography>
                        </CardContent>
                      </TimelineCard>
                    </Box>
                  </HorizontalItem>
                );
              })}
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-150%)' }}>
              <Typography variant="caption" sx={{ color: '#999999', fontWeight: 600 }}>
                Inicio
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-150%)' }}>
              <Typography variant="caption" sx={{ color: '#999999', fontWeight: 600 }}>
                Fin
              </Typography>
            </Box>
          </HorizontalTimelineContainer>
        )}

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#999999',
              fontStyle: 'italic',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            * Este es un itinerario de ejemplo. Las actividades y horarios se pueden personalizar según tus preferencias y disponibilidad.
          </Typography>
        </Box>

        {/* Modal para detalles */}
        <Dialog 
          open={openModal} 
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }
          }}
        >
          {selectedDay && (
            <>
              <DialogTitle sx={{ 
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <IconWrapper>
                  <Iconify icon={selectedDay.icon} />
                </IconWrapper>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#000000' }}>
                    Día {selectedDay.day}: {selectedDay.title}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ pt: 2 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666666',
                    mb: 3,
                    lineHeight: 1.6,
                    fontSize: '1rem',
                  }}
                >
                  {selectedDay.description}
                </Typography>
                {selectedDay.activities && (
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#000000',
                        mb: 2,
                      }}
                    >
                      Actividades del día:
                    </Typography>
                    <Stack spacing={1.5}>
                      {selectedDay.activities.map((activity, actIndex) => (
                        <Typography 
                          key={actIndex} 
                          variant="body2" 
                          sx={{ 
                            color: '#1890FF', 
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: 1,
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef',
                          }}
                        >
                          <Iconify 
                            icon="eva:checkmark-circle-2-fill" 
                            sx={{ 
                              color: '#10b981', 
                              fontSize: 16,
                              flexShrink: 0,
                            }} 
                          />
                          {activity}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button 
                  onClick={handleCloseModal}
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </RootStyle>
  );
};

export default SampleItinerary; 