import { Box, Container, Typography, Card, CardContent, IconButton, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from '@mui/icons-material';
import { useState } from 'react';

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(2),
  padding: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  '&::-webkit-scrollbar': {
    height: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: '#a8a8a8',
    },
  },
}));

const ResortCard = styled(Card)(({ theme }) => ({
  minWidth: '280px',
  maxWidth: '280px',
  height: 'auto',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '200px',
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
}));

const ContentContainer = styled(CardContent)(({ theme }) => ({
  padding: '16px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const ResortTitle = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.2,
  marginBottom: '4px',
  color: '#222',
}));

const LocationText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#717171',
  marginBottom: '8px',
  fontWeight: 400,
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '13px',
  color: '#222',
  lineHeight: 1.4,
  marginBottom: '12px',
  flexGrow: 1,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: '#666666',
  textDecoration: 'underline',
  fontSize: '12px',
  '&:hover': {
    color: '#000000',
  },
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  display: 'inline-block',
}));

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  width: '40px',
  height: '40px',
  zIndex: 2,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.05)',
  },
}));

const FilterChip = styled(Chip)(({ theme, selected }) => ({
  height: '36px',
  fontSize: '14px',
  fontWeight: 500,
  backgroundColor: selected ? '#000' : '#f7f7f7',
  color: selected ? '#fff' : '#222',
  border: selected ? '1px solid #000' : '1px solid #e0e0e0',
  borderRadius: '18px',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: selected ? '#333' : '#e0e0e0',
    borderColor: '#000',
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: theme.spacing(1),
  padding: theme.spacing(2, 0),
  marginBottom: theme.spacing(3),
  '&::-webkit-scrollbar': {
    height: '4px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1',
    borderRadius: '2px',
  },
}));

const resorts = [
  {
    id: 1,
    name: 'Catedral',
    slug: 'cerro-catedral',
    image: '/assets/bariloche.jpg',
    location: 'Bariloche, Argentina',
    description: 'El centro de esquí más grande de Sudamérica, ubicado en Bariloche',
    lessonTypes: [
      { type: 'ski', label: 'skiLessons' },
      { type: 'snowboard', label: 'snowboardLessons' },
    ],
    categories: [
      { type: 'group', label: 'groupLessons' },
      { type: 'private', label: 'privateLessons' },
      { type: 'children', label: 'childrenLessons' },
    ],
  },
  {
    id: 2,
    name: 'Bayo',
    slug: 'cerro-bayo',
    image: '/assets/bayo.png',
    location: 'Villa La Angostura, Argentina',
    description: 'Centro de esquí familiar en Villa La Angostura con vistas al lago Nahuel Huapi',
    lessonTypes: [
      { type: 'ski', label: 'skiLessons' },
      { type: 'snowboard', label: 'snowboardLessons' },
    ],
    categories: [
      { type: 'group', label: 'groupLessons' },
      { type: 'private', label: 'privateLessons' },
      { type: 'children', label: 'childrenLessons' },
    ],
  },
  {
    id: 3,
    name: 'Chapelco',
    slug: 'cerro-chapelco',
    image: '/assets/chapelco.png',
    location: 'San Martín de los Andes, Argentina',
    description: 'Centro de esquí con vistas panorámicas al lago Lácar en San Martín de los Andes',
    lessonTypes: [
      { type: 'ski', label: 'skiLessons' },
      { type: 'snowboard', label: 'snowboardLessons' },
    ],
    categories: [
      { type: 'group', label: 'groupLessons' },
      { type: 'private', label: 'privateLessons' },
      { type: 'children', label: 'childrenLessons' },
    ],
  },
  {
    id: 4,
    name: 'Perito Moreno',
    slug: 'cerro-perito-moreno',
    image: '/assets/perito-moreno.png',
    location: 'El Bolsón, Argentina',
    description: 'Centro de esquí con nieve en polvo y vistas a la cordillera de los Andes',
    lessonTypes: [
      { type: 'ski', label: 'skiLessons' },
      { type: 'snowboard', label: 'snowboardLessons' },
    ],
    categories: [
      { type: 'group', label: 'groupLessons' },
      { type: 'private', label: 'privateLessons' },
      { type: 'children', label: 'childrenLessons' },
    ],
  }
];

const ResortsAndLessonsSection = () => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const scrollToRight = () => {
    const container = document.getElementById('resorts-scroll-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Definir los filtros disponibles
  const filters = [
    { key: 'all', label: 'Todos' },
    { key: 'ski', label: t('resortsAndLessons.skiLessons') },
    { key: 'snowboard', label: t('resortsAndLessons.snowboardLessons') },
    { key: 'group', label: t('resortsAndLessons.groupLessons') },
    { key: 'private', label: t('resortsAndLessons.privateLessons') },
    { key: 'children', label: t('resortsAndLessons.childrenLessons') },
  ];

  // Filtrar resorts basado en el filtro seleccionado
  const filteredResorts = selectedFilter === 'all' 
    ? resorts 
    : resorts.filter(resort => 
        resort.lessonTypes.some(lesson => lesson.type === selectedFilter) ||
        resort.categories.some(category => category.type === selectedFilter)
      );

  return (
    <section aria-labelledby="resorts-heading">
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography 
            id="resorts-heading"
            variant="h2" 
            component="h2" 
            gutterBottom 
            align="center" 
            sx={{ mb: 6, fontSize: { xs: '2rem', md: '2.5rem' } }}
          >
            {t('resortsAndLessons.title')}
          </Typography>
          
          <Typography
            component="p"
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'text.secondary' }}
          >
            Descubre los mejores centros de esquí de Argentina y reserva tus clases con instructores certificados
          </Typography>

          {/* Filtros */}
          <FilterContainer>
            {filters.map((filter) => (
              <FilterChip
                key={filter.key}
                label={filter.label}
                selected={selectedFilter === filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                clickable
              />
            ))}
          </FilterContainer>

          <Box sx={{ position: 'relative' }}>
            <ScrollContainer id="resorts-scroll-container">
              {filteredResorts.map((resort) => (
                <ResortCard key={resort.id} component={RouterLink} to={`/${resort.slug}`}>
                  <ImageContainer>
                    <img
                      src={resort.image}
                      alt={`${resort.name} - ${resort.location} - Clases de esquí y snowboard`}
                      loading="lazy"
                    />
                  </ImageContainer>
                  
                  <ContentContainer>
                    <ResortTitle component="h3">
                      {resort.name}
                    </ResortTitle>
                    
                    <LocationText>
                      {resort.location}
                    </LocationText>
                    
                    <DescriptionText>
                      {resort.description}
                    </DescriptionText>
                    
                    <Box sx={{ mt: 'auto' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '12px', 
                          fontWeight: 600, 
                          color: '#222', 
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {selectedFilter === 'all' 
                          ? t('resortsAndLessons.lessonTypes')
                          : selectedFilter === 'ski' || selectedFilter === 'snowboard'
                            ? t('resortsAndLessons.categories')
                            : t('resortsAndLessons.lessonTypes')
                        }
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(() => {
                          // Generar links basados en el filtro seleccionado
                          if (selectedFilter === 'all') {
                            // Mostrar todos los tipos de lección
                            return resort.lessonTypes.map((lesson) => (
                              <StyledLink
                                key={lesson.type}
                                to={`/${resort.slug}/${lesson.type}`}
                                aria-label={`${t(`resortsAndLessons.${lesson.label}`)} en ${resort.name}`}
                              >
                                {t(`resortsAndLessons.${lesson.label}`)}
                              </StyledLink>
                            ));
                          } else if (selectedFilter === 'ski' || selectedFilter === 'snowboard') {
                            // Mostrar categorías para el tipo de lección seleccionado
                            return resort.categories.map((category) => (
                              <StyledLink
                                key={`${selectedFilter}-${category.type}`}
                                to={`/${resort.slug}/${selectedFilter}/${category.type}`}
                                aria-label={`${t(`resortsAndLessons.${category.label}`)} ${selectedFilter} en ${resort.name}`}
                              >
                                {t(`resortsAndLessons.${category.label}`)} {selectedFilter}
                              </StyledLink>
                            ));
                          } else if (selectedFilter === 'group' || selectedFilter === 'private' || selectedFilter === 'children') {
                            // Mostrar tipos de lección para la categoría seleccionada
                            return resort.lessonTypes.map((lesson) => (
                              <StyledLink
                                key={`${lesson.type}-${selectedFilter}`}
                                to={`/${resort.slug}/${lesson.type}/${selectedFilter}`}
                                aria-label={`${t(`resortsAndLessons.${lesson.label}`)} ${t(`resortsAndLessons.${selectedFilter}Lessons`)} en ${resort.name}`}
                              >
                                {t(`resortsAndLessons.${lesson.label}`)} - {t(`resortsAndLessons.${selectedFilter}Lessons`)}
                              </StyledLink>
                            ));
                          }
                          return null;
                        })()}
                      </Box>
                    </Box>
                  </ContentContainer>
                </ResortCard>
              ))}
            </ScrollContainer>
            
            <ScrollButton onClick={scrollToRight} aria-label="Scroll right">
              <ChevronRight />
            </ScrollButton>
          </Box>
        </Container>
      </Box>
    </section>
  );
};

export default ResortsAndLessonsSection;
