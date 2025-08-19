import { useEffect, useState, useMemo } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
// @mui
import { Container, Typography, Stack, Drawer, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Card, CardContent } from '@mui/material';
import Slider from 'react-slick';
import { CarouselDots } from '../../components/carousel';
import Iconify from 'src/components/Iconify';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers, filterTeachers, getTeachersWithEvents, resetFilters, getFreeTeachers, loadMoreFreeTeachers } from '../../redux/slices/teachers';

// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import { useLocation } from 'react-router-dom';
// layouts
import MainHeader from 'src/layouts/main/MainHeader';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { FormProvider } from '../../components/hook-form';
// sections
import {
  TeacherTagFiltered,
  ShopProductSort,
  ShopTeacherList,
  ShopFilterSidebar,
  ShopProductSearch,
} from '../../sections/@dashboard/e-commerce/shop';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import useAuth from 'src/hooks/useAuth';
import { useParams } from 'react-router';
import useLocales from 'src/hooks/useLocales';
import ShopOtherTeacherList from 'src/sections/@dashboard/e-commerce/shop/ShopOtherTeachersList';
import IndependentShop from 'src/sections/@dashboard/e-commerce/shop/IndependentShop';
import ShopStandardProducts from 'src/sections/@dashboard/e-commerce/shop/ShopStandardProducts';
import AirbnbFilters from 'src/sections/@dashboard/e-commerce/shop/AirbnbFilters';
import { openCatedral } from 'src/services/facebook';
import { Helmet } from 'react-helmet-async';
import { LoadingButton } from '@mui/lab';
import SchoolProducts from 'src/sections/@dashboard/e-commerce/shop/SchoolProducts';
// ----------------------------------------------------------------------

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// ----------------------------------------------------------------------

export default function EcommerceShop({ isGuest = false, teacherType = "school" }) {

  const { themeStretch } = useSettings();
  const { translate } = useLocales()
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isTeacher = user?.role === "TEACHER"
  const query = useQuery()
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { teachers, sortBy, filters, teachersWithEvents, category, isLoading, isLoadingLoadMore } = useSelector((state) => { return state.teachers })

  useEffect(() => {
    // dispatch(getFreeTeachers
    // if (query.get('resort')) {
    //   dispatch(filterTeachers({ resort: query.get('resort') }))
    // } else if (filters.resort === "") {
    //   dispatch(filterTeachers({ resort: 'Cerro Catedral' }))
    // }

  }, [filters])


  const filteredTeachers = applyFilter(teachers, sortBy, filters, teacherType);

  const resortFromPath = query.get('resort')
  const defaultValues = {
    rating: filters.rating,
    gender: filters.gender,
    category: filters.category,
    discipline: filters.discipline,
    language: filters.language,
    from: filters.from,
    to: filters.to,
    resort: resortFromPath !== null ? resortFromPath : filters.resort,
  };


  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();


  const isDefault =
    !values.rating &&
    values.gender.length == 0 &&
    values.category.length == 0 &&
    values.discipline.length == 0 &&
    values.language.length == 0 &&
    (!values.from || !values.to) &&
    !values.resort;

  useEffect(() => {
    dispatch(getFreeTeachers(filters.from, filters.to, filters.resort, 0));
    //dispatch(getTeachersWithEvents(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    //dispatch(filterTeachers(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    dispatch(resetFilters());
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };

  const handleRemoveCategory = (value) => {
    const newValue = filters.category.filter((item) => item !== value);
    setValue('category', newValue);
  };

  const handleRemoveGender = (value) => {
    const newValue = filters.gender.filter((item) => item !== value);
    setValue('gender', newValue);
  };

  const handleRemoveDiscipline = (value) => {
    const newValue = filters.discipline.filter((item) => item !== value);
    setValue('discipline', newValue);
  };

  const handleRemoveLanguage = (value) => {
    const newValue = filters.language.filter((item) => item !== value);
    setValue('language', newValue);
  };

  const handleRemoveRange = () => {
    setValue('from', undefined);
    setValue('to', undefined);

  };


  const handleRemoveResort = () => {
    setValue('resort', '');
  };

  useEffect(() => {
    if (teacherType === "independent") {
      openCatedral()
    }
  }, [teacherType]);

  const handleLoadMore = () => {
    dispatch(loadMoreFreeTeachers(filters.from, filters.to, filters.resort, page + 1));
    setPage(page + 1);
  }

  // No results contact modal
  const [noResultsOpen, setNoResultsOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const CONTACT_EMAIL = 'office@snowmatch.pro';
  const WHATSAPP_NUMBER = '5492944263223';

  const formatDateInput = (date) => {
    try {
      if (!date) return '';
      const d = new Date(date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) { return ''; }
  };

  const [lead, setLead] = useState({
    name: '',
    phone: '',
    from: formatDateInput(filters.from),
    to: formatDateInput(filters.to),
    resort: filters.resort || '',
  });

  const openNoResultsModal = () => setNoResultsOpen(true);
  const closeNoResultsModal = () => setNoResultsOpen(false);

  useEffect(() => {
    if (!isLoading && filteredTeachers.length === 0 && !autoOpened) {
      setNoResultsOpen(true);
      setAutoOpened(true);
    }
  }, [isLoading, filteredTeachers.length, autoOpened]);

  const buildMessage = () => {
    return `Hola Snowmatch, no encontré instructores disponibles.\n` +
      `Nombre: ${lead.name}\n` +
      `Teléfono: ${lead.phone}\n` +
      `Dónde: ${lead.resort || filters.resort || '-'}\n` +
      `Cuándo: ${lead.from || '-'} al ${lead.to || '-'}\n` +
      `Página: ${typeof window !== 'undefined' ? window.location.href : ''}`;
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = 'Consulta - Clases sin disponibilidad';
    const body = buildMessage();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Page title="Match">
      <Helmet>
        <title>Clases de ski y Experiencias</title>
        <meta name="description" content="Clases de ski en Cerro Catedral" />
        <meta property="og:title" content="Clases de ski en el Cerro Catedral para todos los niveles" />
        <meta property="og:description" content="Reservá tu clase en Bariloche en menos de un minuto con SnowMatch. Más de 30 instructores habilitados. ¡Cupos limitados!" />
        <meta property="og:image" content="https://snowmatchimages.s3.amazonaws.com/profile/ClaseNiñoss.jpeg" />
        <meta property="og:url" content="https://snowmatch.pro" />
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{paddingTop: 'env(safe-area-inset-top)'}}>
        <Stack
          spacing={{ xs: 0, sm: 3 }}
          direction={{ xs: 'row', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
          xs={12}
        >
          {isMobile && 
            <ShopProductSearch filters={filters} teachers={teachers} />
          }

          {/* {!isTeacher && <CartWidget />} */}

          {/* <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
              <FormProvider methods={methods}>
                <ShopFilterSidebar
                  onResetAll={handleResetFilter}
                  isOpen={openFilter}
                  onOpen={handleOpenFilter}
                  onClose={handleCloseFilter}
                  isIndependant={teacherType === "independent"}
                />
              </FormProvider>
              <ShopProductSort />
            </Stack> */}



        </Stack>
        {/* {teacherType === "independent" && <IndependentShop />} */}
        {/* {teacherType === "independent" && category === "premium" && <AirbnbFilters />} */}
        {!isDefault && (
          <Stack sx={{ mb: 3 }}>

            <>
              {/* {(teacherType !== "independent" || category === "premium") &&
                <Typography variant="body2" gutterBottom>
                  <strong>{filteredTeachers.length}</strong>
                  &nbsp;{translate('general.teachers_found')}
                </Typography>
              } */}
              {/* {(teacherType !== "independent") &&
                <TeacherTagFiltered
                  filters={filters}
                  isShowReset={!isDefault && !openFilter}
                  onRemoveRating={handleRemoveRating}
                  onRemoveGender={handleRemoveGender}
                  onRemoveCategory={handleRemoveCategory}
                  onRemoveDiscipline={handleRemoveDiscipline}
                  onRemoveLanguage={handleRemoveLanguage}
                  onRemoveRange={handleRemoveRange}
                  onRemoveResort={handleRemoveResort}
                  onResetAll={handleResetFilter}
                  onOpen={handleOpenFilter}
                  isIndependant={teacherType === "independent"}
                />
              } */}
            </>
          </Stack>
        )}
        {/* manotaso de ahogado muestro todos */}
        {/* {teacherType == "independent" && <ShopTeacherList teachers={teachersWithEvents} loading={!filteredTeachers.length && isDefault} />} */}
        <ShopStandardProducts teachers={filteredTeachers} loading={isLoading} />
        {/* Open manual trigger if needed when empty */}
        {!isLoading && filteredTeachers.length === 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              No encontramos instructores disponibles para tu búsqueda. Podés reservar otros servicios ahora:
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Servicios</Typography>
            <Slider
              dots
              arrows={false}
              slidesToShow={2}
              slidesToScroll={1}
              autoplay
              speed={600}
              responsive={[
                { breakpoint: 900, settings: { slidesToShow: 1 } },
                { breakpoint: 600, settings: { slidesToShow: 1 } },
              ]}
              {...CarouselDots({})}
            >
              {[{ title: 'Pases de esquí', key: 'passes', icon: 'mdi:ski' }, { title: 'Alquiler de equipos', key: 'rental', icon: 'mdi:ski-cross-country' }].map((item) => (
                <Box key={item.key} sx={{ px: 1 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.02),
                    border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <Iconify icon={item.icon} width={22} height={22} />
                      <Typography variant="subtitle1">{item.title}</Typography>
                    </Box>
                    <Button variant="contained" onClick={openNoResultsModal}>Consultar</Button>
                  </Box>
                </Box>
              ))}
            </Slider>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Clases</Typography>
            <Slider
              dots
              arrows={false}
              slidesToShow={2}
              slidesToScroll={1}
              autoplay
              speed={600}
              responsive={[
                { breakpoint: 900, settings: { slidesToShow: 1 } },
                { breakpoint: 600, settings: { slidesToShow: 1 } },
              ]}
              {...CarouselDots({})}
            >
              {[{ title: 'Clase privada', key: 'private', icon: 'mdi:account-tie' }, { title: 'Clase para niños', key: 'kids', icon: 'mdi:baby-face-outline' }, { title: 'Clases grupales', key: 'group', icon: 'mdi:account-group' }].map((item) => (
                <Box key={item.key} sx={{ px: 1 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.02),
                    border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <Iconify icon={item.icon} width={22} height={22} />
                      <Typography variant="subtitle1">{item.title}</Typography>
                    </Box>
                    <Button variant="contained" onClick={openNoResultsModal}>Consultar</Button>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        )}
        {filteredTeachers.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <LoadingButton
              loading={isLoadingLoadMore}
              onClick={handleLoadMore}
              variant="contained"
              sx={{
                bgcolor: 'black',
                color: 'white',
                '&:hover': {
                  bgcolor: 'grey.800',
                },
              }}
            >
              {translate('general.loadMore')}
            </LoadingButton>
          </Box>
        )}
      </Container>
      {/* No results Modal */}
      <Dialog open={noResultsOpen} onClose={closeNoResultsModal} fullWidth maxWidth="sm">
        <DialogTitle>No hay instructores disponibles</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Dejanos tus datos y te contactamos apenas se libere un lugar o te ayudamos a encontrar una opción.
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Desde"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={lead.from}
                onChange={(e) => setLead({ ...lead, from: e.target.value })}
                fullWidth
              />
              <TextField
                label="Hasta"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={lead.to}
                onChange={(e) => setLead({ ...lead, to: e.target.value })}
                fullWidth
              />
            </Stack>
            <TextField
              label="Resort"
              value={lead.resort}
              onChange={(e) => setLead({ ...lead, resort: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
            <Button variant="outlined" onClick={handleEmail} fullWidth>
              Mandar Email
            </Button>
            <Button variant="contained" onClick={handleWhatsApp} fullWidth>
              Enviar por WhatsApp
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
      <><br /></>

    </Page>
  );
}

// ----------------------------------------------------------------------

function checkOverlap(event, filter) {

  const filterFrom = new Date(filter.from.getFullYear(), filter.from.getMonth(), filter.from.getDate())
  const filterTo = new Date(filter.to.getFullYear(), filter.to.getMonth(), filter.to.getDate())

  //const filterFrom = (filter.from.getDate()>=10?filter.from.getDate():"0"+(filter.from.getDate()))+"/"+((filter.from.getMonth()+1)>=10?filter.from.getMonth()+1:"0"+(filter.from.getMonth()+1))+"/"+filter.from.getFullYear();
  //const filterTo = (filter.to.getDate()>=10?filter.to.getDate():"0"+(filter.to.getDate()))+"/"+((filter.to.getMonth()+1)>=10?filter.to.getMonth()+1:"0"+(filter.to.getMonth()+1))+"/"+filter.to.getFullYear();
  const temp1 = event.start.split("-")
  //const eventFrom = temp1[2].split("T")[0] + "/" + temp1[1] + "/" + temp1[0];
  const eventFrom = new Date(temp1[0], temp1[1], temp1[2].split("T")[0])
  eventFrom.setMonth(eventFrom.getMonth() - 1)
  const temp2 = event.end.split("-")
  //const eventTo = temp2[2].split("T")[0] + "/" + temp2[1] + "/" + temp2[0];
  const eventTo = new Date(temp2[0], temp2[1], temp2[2].split("T")[0])
  eventTo.setMonth(eventTo.getMonth() - 1)




  if (filterFrom >= eventFrom && filterTo <= eventTo) {
    return true;
  }
  return false;
}

function applyFilter(teachers, sortBy, filters, teacherType) {
  return teachers;
  teachers = orderBy(teachers, ['stars'], ['desc']);
  // SORT BY
  // if (sortBy === 'featured') {
  //   teachers = orderBy(teachers, ['sold'], ['desc']);
  // }
  // if (sortBy === 'newest') {
  //   teachers = orderBy(teachers, ['createdAt'], ['desc']);
  // }
  // if (sortBy === 'priceDesc') {
  //   teachers = orderBy(teachers, ['price'], ['desc']);
  // }
  // if (sortBy === 'priceAsc') {
  //   teachers = orderBy(teachers, ['price'], ['asc']);
  // }
  // FILTER teacherS
  if (filters.from && filters.to) {
    teachers = teachers.filter((teacher) => !teacher.events?.some((event) => checkOverlap(event, filters)));
  }

  if (filters.gender.length > 0) {
    teachers = teachers.filter((teacher) => filters.gender.includes(teacher.gender == 'M' ? 'Male' : teacher.gender == 'F' ? 'Female' : ''));
  }

  if (filters.category.length > 0) {
    teachers = teachers.filter((teacher) => teacher.disciplines?.some((discipline) => filters.category.includes(discipline)));
  }

  if (filters.language.length > 0) {
    teachers = teachers.filter((teacher) => teacher.speaks?.some((language) => filters.language.includes(language)));
  }

  if (filters.resort) {
    teachers = teachers.filter((teacher) => teacher.resorts?.includes(filters.resort));
  }

  if (filters.rating) {
    teachers = teachers.filter((teacher) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return teacher.stars >= convertRating(filters.rating);
    });
  }

  if (teacherType == "independent") {
    teachers = teachers.filter(t => !t.school && t.resorts?.includes("Cerro Catedral")).sort((a, b) => a.name - b.name).filter((teacher) => teacher.level === filters.level);
  } else if (teacherType == "school") {
    teachers = teachers.filter(t => t.school || t.level < 3 || !t.resorts?.includes("Cerro Catedral"))
  }
  return teachers;
}

