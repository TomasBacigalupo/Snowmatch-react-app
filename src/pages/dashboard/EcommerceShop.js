import { useEffect, useState, useMemo } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container, Typography, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers, filterTeachers } from '../../redux/slices/teachers';

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

// ----------------------------------------------------------------------

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

// ----------------------------------------------------------------------

export default function EcommerceShop({isGuest=false, teacherType="school"}) {

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const { user } = useAuth();
  const query = useQuery()
  const [openFilter, setOpenFilter] = useState(false);

  const { teachers, sortBy, filters } = useSelector((state) => { return state.teachers })

  useEffect(()=>{
    console.log('test', query.get('resort'))
    dispatch(filterTeachers({resort: query.get('resort')}))
  }, [])

  //const { products, sortBy } = useSelector((state) => state.product);

  const filteredTeachers = applyFilter(teachers, sortBy, filters, teacherType);

  const defaultValues = {
    rating: filters.rating,
    gender: filters.gender,
    category: filters.category,
    discipline: filters.discipline,
    language: filters.language,
    from: filters.from,
    to: filters.to,
    resort: query.get('resort'),
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
    dispatch(getTeachers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterTeachers(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleRemoveRange();
    //handleRemoveResort();
    handleCloseFilter();
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


  return (
    <Page title="Match">
      
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Match"
          links={[
            !isGuest? { name: 'Dashboard', href: PATH_DASHBOARD.root} : {name: 'Home', href: '/'},
            !isGuest? { name: 'Match', href: PATH_DASHBOARD.eCommerce.root} : { name: 'Match', href: PATH_GUEST.root},
            { name: 'Pro',}
          ]}
        />
        {isGuest}
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <ShopProductSearch teachers={filteredTeachers} />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <FormProvider methods={methods}>
              <ShopFilterSidebar
                onResetAll={handleResetFilter}
                isOpen={openFilter}
                onOpen={handleOpenFilter}
                onClose={handleCloseFilter}
              />
            </FormProvider>

            {/*<ShopProductSort />*/}

          </Stack>
        </Stack>

        <Stack sx={{ mb: 3 }}>
          {!isDefault && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>{filteredTeachers.length}</strong>
                &nbsp;Teachers found
              </Typography>

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
              />
            </>
          )}
        </Stack>

        <ShopTeacherList teachers={filteredTeachers} loading={!filteredTeachers.length && isDefault} />
      </Container>
      <><br /></>

    </Page>
  );
}

// ----------------------------------------------------------------------

function checkOverlap(event,filter){

  const filterFrom = new Date(filter.from.getFullYear(), filter.from.getMonth(), filter.from.getDate())
  const filterTo = new Date(filter.to.getFullYear(), filter.to.getMonth(), filter.to.getDate())

  //const filterFrom = (filter.from.getDate()>=10?filter.from.getDate():"0"+(filter.from.getDate()))+"/"+((filter.from.getMonth()+1)>=10?filter.from.getMonth()+1:"0"+(filter.from.getMonth()+1))+"/"+filter.from.getFullYear();
  //const filterTo = (filter.to.getDate()>=10?filter.to.getDate():"0"+(filter.to.getDate()))+"/"+((filter.to.getMonth()+1)>=10?filter.to.getMonth()+1:"0"+(filter.to.getMonth()+1))+"/"+filter.to.getFullYear();
  const temp1 = event.start.split("-")
  //const eventFrom = temp1[2].split("T")[0] + "/" + temp1[1] + "/" + temp1[0];
  const eventFrom = new Date(temp1[0], temp1[1],temp1[2].split("T")[0])
  eventFrom.setMonth(eventFrom.getMonth()-1)
  const temp2 = event.end.split("-")
  //const eventTo = temp2[2].split("T")[0] + "/" + temp2[1] + "/" + temp2[0];
  const eventTo = new Date(temp2[0], temp2[1],temp2[2].split("T")[0])
  eventTo.setMonth(eventTo.getMonth()-1)




  if (filterFrom >= eventFrom && filterTo <= eventTo) {
    return true;
  }
  return false;
}

function applyFilter(teachers, sortBy, filters, teacherType) {

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
  if(filters.from && filters.to){
    teachers = teachers.filter((teacher) => !teacher.events?.some((event) => checkOverlap(event,filters)));
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
  if(teacherType=="independent"){
    teachers = teachers.filter(t=>!t.school && t.level>=3 && t.resorts?.includes("Cerro Catedral"))
  } else if(teacherType=="school"){
    teachers = teachers.filter(t=>t.school || t.level<3 || !t.resorts?.includes("Cerro Catedral") )
  }
  return teachers;
}

