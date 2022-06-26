import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container, Typography, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers,filterTeachers } from '../../redux/slices/teachers';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// layouts
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

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function EcommerceShop() {
  
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { teachers, sortBy, filters } = useSelector((state) => {console.log(state);return state.teachers})

  //const { products, sortBy } = useSelector((state) => state.product);

  const filteredTeachers = applyFilter(teachers, sortBy, filters);

  const defaultValues = {
    rating: filters.rating,
    gender: filters.gender,
    category: filters.category,
    discipline: filters.discipline,
    language: filters.language,
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
    values.language.length == 0;

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

  return (
    <Page title="Match">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Match"
          links={[
            { name: 'Match' },
            {
              name: 'Pro',
            }
          ]}
        />

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
         {/*<ShopProductSearch />*/} 

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
                onResetAll={handleResetFilter}
              />
            </>
          )}
        </Stack>

        <ShopTeacherList teachers={filteredTeachers} loading={!filteredTeachers.length && isDefault} />
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applyFilter(teachers, sortBy, filters) {

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
  if (filters.gender.length > 0) {
    teachers = teachers.filter((teacher) => filters.gender.includes(teacher.gender == 'M'?'Male':'Female'));
  }

  if (filters.category.length > 0) {
    teachers = teachers.filter((teacher) => teacher.discipline?.some((discipline) => filters.category.includes(discipline)));
  }

  if (filters.language.length > 0) {
    teachers = teachers.filter((teacher) => teacher.speaks?.some((language) => filters.language.includes(language)));
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
  return teachers;
}
