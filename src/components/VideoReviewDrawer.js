import React, { useState, useMemo } from 'react';
import { Typography, SwipeableDrawer, Box, Avatar, Modal, useTheme, useMediaQuery, Button, Tooltip, IconButton, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { FormProvider, RHFTextField, RHFSlider } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import ReactPlayer from 'react-player';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useLocales from 'src/hooks/useLocales';
import MobileHeader from './MobileHeader';

const getColorForScore = (score) => {
  if (!score) return '#000000';
  
  const normalizedScore = Math.min(Math.max(parseInt(score, 10), 0), 100);
  
  if (normalizedScore <= 50) {
    const green = Math.floor((normalizedScore / 50) * 255);
    return `#FF${green.toString(16).padStart(2, '0')}00`;
  } else {
    const red = Math.floor(((100 - normalizedScore) / 50) * 255);
    return `#${red.toString(16).padStart(2, '0')}FF00`;
  }
};

export default function VideoReviewDrawer({ 
  open, 
  onClose, 
  selectedVideo, 
  loading, 
  methods,
  onSubmit 
}) {
  const { translate } = useLocales();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const score = methods?.watch("score");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetAll = () => {
    // Reset all form fields
    methods?.reset({
      score: 0,
      goodAspects: '',
      badAspects: '',
      howToImprove: ''
    });
    
    // Reset all states
    setIsPlaying(false);
    setShowGuide(false);
    setActiveStep(0);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const steps = [
    {
      label: 'Calificar el Video',
      description: 'Dale una puntuación del 0-100 según la calidad general',
      content: (
        <Box 
          display='flex' 
          flexDirection='column' 
          alignItems='center' 
          justifyContent='center' 
          sx={{ 
            my: 4,
            minHeight: '200px',
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            width: '100%',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto'
            }}
          >
            <RHFTextField 
              name="score"
              type="number"
              variant="standard"
              defaultValue={0}
              onChange={(e) => {
                const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), 100);
                e.target.value = value;
                methods.setValue("score", value);
              }}
              inputProps={{ 
                min: 0,
                max: 100,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 3,
                style: {
                  textAlign: 'center',
                  fontSize: '64px',
                  fontWeight: 300,
                  width: '120px',
                  caretColor: '#007AFF',
                  color: getColorForScore(score || 0),
                  transition: 'color 0.3s ease',
                  padding: '16px 0'
                }
              }}
              sx={{
                '& .MuiInput-underline:before': { borderBottom: 'none' },
                '& .MuiInput-underline:after': { borderBottom: 'none' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
              }}
            />
            <Typography 
              sx={{ 
                color: '#8E8E93',
                fontSize: '17px',
                mt: 1,
                fontWeight: 400,
                textAlign: 'center'
              }}
            >
              {`${score || 0}/100 puntos`}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      label: 'Aspectos Positivos',
      description: 'Mencioná los aspectos positivos del video',
      content: (
        <RHFTextField 
          name="goodAspects" 
          label="Aspectos Positivos" 
          multiline 
          rows={4} 
          fullWidth 
          helperText="Requerido: Mencioná los aspectos positivos del video"
          sx={{
            '& .MuiInputLabel-root': {
              backgroundColor: 'white',
              px: 0.5,
              '&.Mui-focused': {
                color: 'primary.main',
              },
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      )
    },
    {
      label: 'Aspectos a Mejorar',
      description: 'Identificá las áreas que necesitan mejorar',
      content: (
        <RHFTextField 
          name="badAspects" 
          label="Aspectos a Mejorar" 
          multiline 
          rows={4} 
          fullWidth 
          helperText="Requerido: Identificá las áreas que necesitan mejorar"
          sx={{
            '& .MuiInputLabel-root': {
              backgroundColor: 'white',
              px: 0.5,
              '&.Mui-focused': {
                color: 'primary.main',
              },
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      )
    },
    {
      label: 'Sugerencias de Mejora',
      description: 'Proporcioná feedback constructivo sobre cómo mejorar',
      content: (
        <RHFTextField 
          name="howToImprove" 
          label="Cómo Mejorar" 
          multiline 
          rows={4} 
          fullWidth 
          helperText="Requerido: Proporcioná feedback constructivo sobre cómo mejorar"
          sx={{
            '& .MuiInputLabel-root': {
              backgroundColor: 'white',
              px: 0.5,
              '&.Mui-focused': {
                color: 'primary.main',
              },
            },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      )
    }
  ];

  const content = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {selectedVideo && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {selectedVideo.title}
              </Typography>
              <Tooltip title="Cómo reseñar un video">
                <IconButton onClick={() => setShowGuide(!showGuide)}>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {showGuide && (
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="subtitle2" gutterBottom>Cómo reseñar un video:</Typography>
                <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                  <li>Mirá el video con atención</li>
                  <li>Calificá el video del 0-100 según la calidad general</li>
                  <li>Mencioná los aspectos positivos del video</li>
                  <li>Identificá las áreas que necesitan mejorar</li>
                  <li>Proporcioná feedback constructivo sobre cómo mejorar</li>
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar alt={selectedVideo.user.name} src={selectedVideo.imageUrl} sx={{ mr: 2 }} />
              <Typography variant="body1">
                Subido por {selectedVideo.user.name}
              </Typography>
            </Box>
            
            {/* Video Player Section */}
            <Box mb={2}>
              {!isPlaying ? (
                <Box
                  position="relative"
                  width="100%"
                  maxHeight="300px"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setIsPlaying(true)}
                >
                  <Box
                    component="img"
                    src={`${process.env.REACT_APP_VIDEO_PREVIEW_BUCKET_URL}/${selectedVideo.videoUrl}.jpg`}
                    alt="Video Thumbnail"
                    sx={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 40, color: "white" }} />
                  </Box>
                </Box>
              ) : (
                <ReactPlayer
                  url={`${process.env.REACT_APP_VIDEO_BUCKET_URL}/${selectedVideo.videoUrl}`}
                  playing={isPlaying}
                  controls
                  style={{ maxHeight: '300px', maxWidth: '100%' }}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              )}
            </Box>

            {/* Stepper Section */}
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel>
                      <Typography variant="subtitle1">{step.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ mb: 2 }}>
                        {step.content}
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? 'Finalizar' : 'Continuar'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Atrás
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Box sx={{ p: 3 }}>
                  <Typography>¡Completaste todos los pasos!</Typography>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={loading}
                    sx={{ 
                      mt: 2,
                    }}
                  >
                    Enviar Reseña
                  </LoadingButton>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </FormProvider>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={handleClose}
        onOpen={() => {}}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            height: '100%',
            maxHeight: '100%',
            width: '100vw',
            maxWidth: '100%',
            backgroundColor: 'white',
          },
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "2px solid #EBEBEB",
            paddingTop: 'env(safe-area-inset-bottom)',
            zIndex: 10,
          }}
        >
          <MobileHeader onBack={handleClose} title={translate('video.review.title')} />
        </Box>
        {content}
      </SwipeableDrawer>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="video-review-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            backgroundColor: "white",
            borderBottom: "2px solid #EBEBEB",
            zIndex: 10,
            p: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {translate('video.review.title')}
          </Typography>
        </Box>
        {content}
      </Box>
    </Modal>
  );
} 