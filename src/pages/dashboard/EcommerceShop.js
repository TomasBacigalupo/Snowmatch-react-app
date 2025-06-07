import { useEffect, useState, useMemo } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, } from '@mui/material/styles';
// @mui
import { Container, Typography, Stack, Drawer, Button, Box } from '@mui/material';
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
      <Container maxWidth={themeStretch ? false : 'lg'}>
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
        {teacherType === "independent" && <IndependentShop />}
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
      </Container>
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

