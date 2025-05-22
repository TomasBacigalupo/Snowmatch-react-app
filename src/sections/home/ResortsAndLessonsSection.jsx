import { Box, Container, Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const ResortCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: '#666666',
  textDecoration: 'underline',
  '&:hover': {
    color: '#000000',
  },
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(1),
  display: 'inline-block',
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

  return (
    <section aria-labelledby="resorts-heading">
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
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

          <Grid container spacing={4} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {resorts.map((resort) => (
              <Grid item key={resort.id} xs={12} sm={6} md={4} component="li">
                <ResortCard>
                  <Box
                    component="figure"
                    sx={{
                      height: 200,
                      m: 0,
                      position: 'relative',
                    }}
                  >
                    <img
                      src={resort.image}
                      alt={`${resort.name} - ${resort.location} - Clases de esquí y snowboard`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h3" component="h3" gutterBottom sx={{ fontSize: '1.5rem' }}>
                      {resort.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {resort.location}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {resort.description}
                    </Typography>
                    
                    <Box component="nav" aria-label={`${resort.name} opciones de clases`} sx={{ mt: 3 }}>
                      <Typography variant="h4" component="h4" fontWeight="bold" gutterBottom sx={{ fontSize: '1.1rem' }}>
                        {t('resortsAndLessons.lessonTypes')}:
                      </Typography>
                      <Box component="ul" sx={{ mb: 2, listStyle: 'none', p: 0, m: 0 }}>
                        {resort.lessonTypes.map((lesson) => (
                          <Box component="li" key={lesson.type}>
                            <StyledLink
                              to={`/${resort.slug}/${lesson.type}`}
                              aria-label={`${t(`resortsAndLessons.${lesson.label}`)} en ${resort.name}`}
                            >
                              {t(`resortsAndLessons.${lesson.label}`)}
                            </StyledLink>
                          </Box>
                        ))}
                      </Box>

                      <Typography variant="h4" component="h4" fontWeight="bold" gutterBottom sx={{ fontSize: '1.1rem' }}>
                        {t('resortsAndLessons.categories')}:
                      </Typography>
                      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                        {resort.categories.map((category) => (
                          <Box component="li" key={category.type}>
                            <StyledLink
                              to={`/${resort.slug}/ski/${category.type}`}
                              aria-label={`${t(`resortsAndLessons.${category.label}`)} en ${resort.name}`}
                            >
                              {t(`resortsAndLessons.${category.label}`)} esqui
                            </StyledLink>
                            <StyledLink
                              to={`/${resort.slug}/snowboard/${category.type}`}
                              aria-label={`${t(`resortsAndLessons.${category.label}`)} en ${resort.name}`}
                            >
                              {t(`resortsAndLessons.${category.label}`)} snowboard
                            </StyledLink>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </ResortCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </section>
  );
};

export default ResortsAndLessonsSection;
