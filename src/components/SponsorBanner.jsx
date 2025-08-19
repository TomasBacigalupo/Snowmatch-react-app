import { styled, keyframes } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

const scrollAnimation = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(4, 0),
  background: '#ffffff',
  overflow: 'hidden',
  position: 'relative',
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(8),
  animation: `${scrollAnimation} 30s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

const SponsorLogo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 120,
  height: 60,
  filter: 'grayscale(100%)',
  opacity: 0.6,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    filter: 'grayscale(0%)',
    opacity: 1,
    transform: 'scale(1.05)',
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
}));

const SponsorBanner = ({ sponsors = [] }) => {
  // Si no hay sponsors, usar logos por defecto
  const defaultSponsors = [
    { name: 'Salomon', logo: '/assets/sponsors/salomon.png' },
    { name: 'Atomic', logo: '/assets/sponsors/atomic.png' },
    { name: 'Burton', logo: '/assets/sponsors/burton.png' },
    { name: 'North Face', logo: '/assets/sponsors/northface.png' },
    { name: 'Patagonia', logo: '/assets/sponsors/patagonia.png' },
    { name: 'Columbia', logo: '/assets/sponsors/columbia.png' },
    { name: 'Oakley', logo: '/assets/sponsors/oakley.png' },
    { name: 'Smith', logo: '/assets/sponsors/smith.png' },
  ];

  const sponsorsToShow = sponsors.length > 0 ? sponsors : defaultSponsors;

  return (
    <RootStyle>
      <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
        <ScrollContainer>
          {/* Duplicar los sponsors para crear un efecto de scroll infinito */}
          {[...sponsorsToShow, ...sponsorsToShow].map((sponsor, index) => (
            <SponsorLogo key={`${sponsor.name}-${index}`}>
              {sponsor.logo ? (
                <img 
                  src={sponsor.logo} 
                  alt={`${sponsor.name} logo`}
                  onError={(e) => {
                    // Fallback a texto si la imagen no carga
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <Box
                sx={{
                  display: sponsor.logo ? 'none' : 'block',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: '#666666',
                  textAlign: 'center',
                }}
              >
                {sponsor.name}
              </Box>
            </SponsorLogo>
          ))}
        </ScrollContainer>
      </Container>
    </RootStyle>
  );
};

export default SponsorBanner; 