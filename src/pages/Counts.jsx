import { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { m } from 'framer-motion';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

const flip = keyframes`
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
`;

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)',
  padding: theme.spacing(8, 2),
}));

const BoardContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
  borderRadius: '20px',
  padding: theme.spacing(6, 8),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
  border: '3px solid #3a3a3a',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%, rgba(0, 0, 0, 0.3) 100%)',
    borderRadius: '20px',
    pointerEvents: 'none',
  },
}));

const FlipDigitContainer = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  margin: theme.spacing(0, 1),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(0, 0.5),
  },
}));

const FlipDigit = styled(Box)(({ theme, isFlipping }) => ({
  position: 'relative',
  width: '140px',
  height: '180px',
  perspective: '1000px',
  [theme.breakpoints.down('md')]: {
    width: '100px',
    height: '140px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '70px',
    height: '100px',
  },
  '& .flip-card': {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    animation: isFlipping ? `${flip} 0.6s ease-in-out` : 'none',
  },
}));

const FlipPanel = styled(Box)(({ theme, isTop }) => ({
  position: 'absolute',
  width: '100%',
  height: '50%',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
  border: '2px solid #0a0a0a',
  boxShadow: isTop 
    ? 'inset 0 3px 6px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)'
    : 'inset 0 -3px 6px rgba(0, 0, 0, 0.5), 0 -2px 4px rgba(0, 0, 0, 0.3)',
  ...(isTop ? {
    top: 0,
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    borderBottom: '1px solid #2a2a2a',
  } : {
    bottom: 0,
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
    borderTop: '1px solid #2a2a2a',
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isTop 
      ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)'
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.02) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
}));

const DigitText = styled(Typography)(({ theme, isTop }) => ({
  position: 'absolute',
  width: '100%',
  textAlign: 'center',
  color: '#ffffff',
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: 700,
  fontSize: '154px',
  lineHeight: 1,
  textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.8)',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    fontSize: '90px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '75px',
  },
  ...(isTop ? {
    top: '10px',
  } : {
    bottom: '10px',
  }),
}));

const Divider = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  width: '20px',
  textAlign: 'center',
  color: '#666666',
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: 700,
  fontSize: '100px',
  lineHeight: '180px',
  userSelect: 'none',
  [theme.breakpoints.down('md')]: {
    fontSize: '80px',
    lineHeight: '140px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '50px',
    lineHeight: '100px',
    width: '10px',
  },
}));

const MetalPlate = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(135deg, #c0c0c0 0%, #808080 50%, #c0c0c0 100%)',
  padding: theme.spacing(0.5, 3),
  borderRadius: '4px',
  border: '1px solid #606060',
  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 4px rgba(0, 0, 0, 0.4)',
}));

const Screw = styled(Box)(() => ({
  position: 'absolute',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 30% 30%, #888 0%, #444 60%, #222 100%)',
  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.2)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '8px',
    height: '1.5px',
    background: '#222',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(90deg)',
    width: '8px',
    height: '1.5px',
    background: '#222',
  },
}));

// ----------------------------------------------------------------------

function FlipNumber({ digit, isFlipping }) {
  return (
    <FlipDigit isFlipping={isFlipping}>
      <Box className="flip-card">
        {/* Top half */}
        <FlipPanel isTop={true}>
          <DigitText isTop={true}>{digit}</DigitText>
        </FlipPanel>
        
        {/* Bottom half */}
        <FlipPanel isTop={false}>
          <DigitText isTop={false}>{digit}</DigitText>
        </FlipPanel>
      </Box>
    </FlipDigit>
  );
}

export default function Counts() {
  const [count, setCount] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [flippingDigits, setFlippingDigits] = useState({ hundreds: false, tens: false, ones: false });

  useEffect(() => {
    const fetchVideoCount = async () => {
      try {
        const response = await axios.get('/api/videos/count');
        setTotalVideos(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching video count:', error);
        setTotalVideos(160); // Valor por defecto en caso de error
      }
    };

    fetchVideoCount();
  }, []);

  useEffect(() => {
    if (totalVideos === 0) return; // Esperar a que se cargue el total

    // Animar el contador de 0 al total de videos
    const duration = 4000; // 4 segundos
    const steps = totalVideos;
    const stepDuration = duration / steps;

    let currentStep = 0;
    let lastCount = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        const newCount = Math.min(currentStep, totalVideos);
        
        // Detectar qué dígitos cambian
        const prevHundreds = Math.floor(lastCount / 100);
        const prevTens = Math.floor((lastCount % 100) / 10);
        const prevOnes = lastCount % 10;
        const newHundreds = Math.floor(newCount / 100);
        const newTens = Math.floor((newCount % 100) / 10);
        const newOnes = newCount % 10;
        
        setFlippingDigits({
          hundreds: prevHundreds !== newHundreds,
          tens: prevTens !== newTens,
          ones: prevOnes !== newOnes,
        });
        
        lastCount = newCount;
        setCount(newCount);
        
        // Reset flipping state after animation
        setTimeout(() => {
          setFlippingDigits({ hundreds: false, tens: false, ones: false });
        }, 600);
      } else {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [totalVideos]);

  const hundredsDigit = Math.floor(count / 100);
  const tensDigit = Math.floor((count % 100) / 10);
  const onesDigit = count % 10;

  return (
    <RootStyle>
      <Container maxWidth="lg">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <BoardContainer>
              {/* Screws in corners */}
              <Screw sx={{ top: 16, left: 16 }} />
              <Screw sx={{ top: 16, right: 16 }} />
              <Screw sx={{ bottom: 16, left: 16 }} />
              <Screw sx={{ bottom: 16, right: 16 }} />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FlipDigitContainer>
                  <FlipNumber digit={hundredsDigit} isFlipping={flippingDigits.hundreds} />
                </FlipDigitContainer>

                <FlipDigitContainer>
                  <FlipNumber digit={tensDigit} isFlipping={flippingDigits.tens} />
                </FlipDigitContainer>

                <FlipDigitContainer>
                  <FlipNumber digit={onesDigit} isFlipping={flippingDigits.ones} />
                </FlipDigitContainer>
              </Box>

              <MetalPlate>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#1a1a1a',
                    fontFamily: 'Georgia, serif',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
                  }}
                >
                  VIDEOS
                </Typography>
              </MetalPlate>
            </BoardContainer>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.3)',
                fontFamily: 'Georgia, serif',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                fontStyle: 'italic',
                letterSpacing: '0.1em',
              }}
            >
              Made in San Martin de los Andes • Est. 2025
            </Typography>
          </Box>
        </m.div>
      </Container>
    </RootStyle>
  );
}
