import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Autocomplete,
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import Iconify from '../../components/Iconify';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { DialogAnimate } from '../../components/animate';
import { FormProvider } from '../../components/hook-form';
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useDispatch, useSelector } from '../../redux/store';
import {
  filterTeachers,
  getAdminBusinessMembers,
  getAdminBusinessPending,
  hireTeacher,
  setManagedBusinessId,
} from '../../redux/slices/business';
import { getTeachers } from '../../redux/slices/admin';
import {
  PendingTeacherList,
  ShopFilterSidebar,
  TeacherTagFiltered,
} from '../../sections/@dashboard/e-commerce/shop';

const SCHOOL_BUSINESS_ID = 13;

const getTeacherLabel = (teacher) => {
  if (!teacher) return '';
  const name = [teacher.name, teacher.lastname].filter(Boolean).join(' ');
  return teacher.email ? `${name} (${teacher.email})` : name;
};

const DEFAULT_FILTERS = {
  rating: '',
  gender: [],
  category: [],
  discipline: [],
  language: [],
  from: undefined,
  to: undefined,
  resort: '',
};

function checkOverlap(event, filter) {
  const filterFrom = new Date(filter.from.getFullYear(), filter.from.getMonth(), filter.from.getDate());
  const filterTo = new Date(filter.to.getFullYear(), filter.to.getMonth(), filter.to.getDate());
  const temp1 = event.start.split('-');
  const eventFrom = new Date(temp1[0], temp1[1], temp1[2].split('T')[0]);
  eventFrom.setMonth(eventFrom.getMonth() - 1);
  const temp2 = event.end.split('-');
  const eventTo = new Date(temp2[0], temp2[1], temp2[2].split('T')[0]);
  eventTo.setMonth(eventTo.getMonth() - 1);

  if (filterFrom >= eventFrom && filterTo <= eventTo) {
    return true;
  }
  return false;
}

function applyFilter(teachers, sortBy, filters) {
  const safeFilters = filters || DEFAULT_FILTERS;

  if (safeFilters.from && safeFilters.to) {
    teachers = teachers.filter((teacher) => !teacher.events?.some((event) => checkOverlap(event, safeFilters)));
  }

  if (safeFilters.gender.length > 0) {
    teachers = teachers.filter((teacher) =>
      safeFilters.gender.includes(teacher.gender === 'M' ? 'Male' : teacher.gender === 'F' ? 'Female' : '')
    );
  }

  if (safeFilters.category.length > 0) {
    teachers = teachers.filter((teacher) =>
      teacher.disciplines?.some((discipline) => safeFilters.category.includes(discipline))
    );
  }

  if (safeFilters.language.length > 0) {
    teachers = teachers.filter((teacher) =>
      teacher.speaks?.some((language) => safeFilters.language.includes(language))
    );
  }

  if (safeFilters.resort) {
    teachers = teachers.filter((teacher) => teacher.resorts?.includes(safeFilters.resort));
  }

  if (safeFilters.rating) {
    teachers = teachers.filter((teacher) => {
      const convertRating = (value) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return teacher.stars >= convertRating(safeFilters.rating);
    });
  }

  return teachers;
}

export default function AdminSchoolMembers() {
  const { t } = useTranslation();
  const { themeStretch } = useSettings();
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState('members');
  const [openFilter, setOpenFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { members, pending, sortBy, filters, isLoading, isLoadingModal } = useSelector((state) => state.business);
  const { teachers: teacherSearchResults } = useSelector((state) => state.admin);
  const safeFilters = filters || DEFAULT_FILTERS;
  const isPending = tab === 'pending';
  const sourceTeachers = isPending ? pending : members;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const filteredTeachers = useMemo(() => {
    let result = applyFilter(sourceTeachers, sortBy, safeFilters);
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((teacher) => {
        const fullName = `${teacher.name || ''} ${teacher.lastname || ''}`.toLowerCase();
        return fullName.includes(query) || teacher.email?.toLowerCase().includes(query);
      });
    }
    return result;
  }, [sourceTeachers, sortBy, safeFilters, searchQuery]);

  const defaultValues = useMemo(
    () => ({
      rating: safeFilters.rating,
      gender: safeFilters.gender,
      category: safeFilters.category,
      discipline: safeFilters.discipline,
      language: safeFilters.language,
      from: safeFilters.from,
      to: safeFilters.to,
      resort: safeFilters.resort,
    }),
    [safeFilters]
  );

  const methods = useForm({ defaultValues });
  const { reset, watch, setValue } = methods;
  const values = watch();

  const isDefault =
    !searchQuery.trim() &&
    !values.rating &&
    (values.gender?.length ?? 0) === 0 &&
    (values.category?.length ?? 0) === 0 &&
    (values.discipline?.length ?? 0) === 0 &&
    (values.language?.length ?? 0) === 0 &&
    (!values.from || !values.to) &&
    !values.resort;

  useEffect(() => {
    if (!isAdmin) return undefined;

    dispatch(setManagedBusinessId(SCHOOL_BUSINESS_ID));
    dispatch(getAdminBusinessMembers(SCHOOL_BUSINESS_ID));
    dispatch(getAdminBusinessPending(SCHOOL_BUSINESS_ID));

    return () => {
      dispatch(setManagedBusinessId(null));
    };
  }, [dispatch, isAdmin]);

  useEffect(() => {
    dispatch(filterTeachers(values));
  }, [dispatch, values]);

  useEffect(() => {
    if (!addDialogOpen) return undefined;
    const timer = setTimeout(() => {
      dispatch(getTeachers(0, 'TEACHER', teacherSearch, 0, 25));
    }, 400);
    return () => clearTimeout(timer);
  }, [addDialogOpen, teacherSearch, dispatch]);

  const memberIds = useMemo(() => new Set((members || []).map((member) => member.id)), [members]);
  const addableTeachers = useMemo(
    () => (teacherSearchResults || []).filter((teacher) => !memberIds.has(teacher.id)),
    [teacherSearchResults, memberIds]
  );

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  const handleOpenFilter = () => setOpenFilter(true);
  const handleCloseFilter = () => setOpenFilter(false);

  const handleResetFilter = () => {
    reset();
    setValue('from', undefined);
    setValue('to', undefined);
    handleCloseFilter();
  };

  const handleRemoveRating = () => setValue('rating', '');
  const handleRemoveCategory = (value) => {
    setValue(
      'category',
      safeFilters.category.filter((item) => item !== value)
    );
  };
  const handleRemoveGender = (value) => {
    setValue(
      'gender',
      safeFilters.gender.filter((item) => item !== value)
    );
  };
  const handleRemoveDiscipline = (value) => {
    setValue(
      'discipline',
      safeFilters.discipline.filter((item) => item !== value)
    );
  };
  const handleRemoveLanguage = (value) => {
    setValue(
      'language',
      safeFilters.language.filter((item) => item !== value)
    );
  };
  const handleRemoveRange = () => {
    setValue('from', undefined);
    setValue('to', undefined);
  };
  const handleRemoveResort = () => setValue('resort', '');

  const handleOpenAddDialog = () => {
    setSelectedTeacher(null);
    setTeacherSearch('');
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    if (isAdding) return;
    setAddDialogOpen(false);
    setSelectedTeacher(null);
    setTeacherSearch('');
  };

  const handleAddMember = async () => {
    if (!selectedTeacher?.id) return;
    setIsAdding(true);
    try {
      await dispatch(hireTeacher(selectedTeacher));
      enqueueSnackbar(t('adminSchoolMembers.addMember.success'));
      setAddDialogOpen(false);
      setSelectedTeacher(null);
      setTeacherSearch('');
      dispatch(getAdminBusinessMembers(SCHOOL_BUSINESS_ID));
    } catch (error) {
      enqueueSnackbar(String(error?.message || error), { variant: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Page title={t('adminSchoolMembers.title')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={t('adminSchoolMembers.heading')}
          links={[
            { name: t('adminSchoolMembers.breadcrumbDashboard'), href: PATH_DASHBOARD.root },
            { name: t('adminSchoolMembers.breadcrumbAdmin'), href: PATH_DASHBOARD.admin.root },
            { name: t('adminSchoolMembers.breadcrumbPage') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={handleOpenAddDialog}
            >
              {t('adminSchoolMembers.addMember.button')}
            </Button>
          }
        />

        <Tabs value={tab} onChange={(e, value) => setTab(value)} sx={{ mb: 3 }}>
          <Tab value="members" label={t('adminSchoolMembers.tabs.members')} />
          <Tab value="pending" label={t('adminSchoolMembers.tabs.pending')} />
        </Tabs>

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('adminSchoolMembers.searchPlaceholder')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <FormProvider methods={methods}>
              <ShopFilterSidebar
                onResetAll={handleResetFilter}
                isOpen={openFilter}
                onOpen={handleOpenFilter}
                onClose={handleCloseFilter}
              />
            </FormProvider>
          </Stack>
        </Stack>

        <Stack sx={{ mb: 3 }}>
          {!isDefault && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>{filteredTeachers.length}</strong>
                &nbsp;{t('adminSchoolMembers.teachersFound')}
              </Typography>

              <TeacherTagFiltered
                filters={safeFilters}
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

        <PendingTeacherList
          teachers={filteredTeachers}
          loading={!filteredTeachers.length || isLoading}
          isPending={isPending}
        />

        <DialogAnimate open={addDialogOpen} onClose={handleCloseAddDialog}>
          <DialogTitle>{t('adminSchoolMembers.addMember.title')}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('adminSchoolMembers.addMember.description')}
            </Typography>
            <Autocomplete
              options={addableTeachers}
              value={selectedTeacher}
              onChange={(_, value) => setSelectedTeacher(value)}
              onInputChange={(_, value) => setTeacherSearch(value)}
              getOptionLabel={getTeacherLabel}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={isLoading || isLoadingModal}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('adminSchoolMembers.addMember.searchLabel')}
                  placeholder={t('adminSchoolMembers.addMember.searchPlaceholder')}
                  autoFocus
                />
              )}
              noOptionsText={t('adminSchoolMembers.addMember.noTeachers')}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} disabled={isAdding}>
              {t('adminSchoolMembers.addMember.cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleAddMember}
              loading={isAdding}
              disabled={!selectedTeacher?.id}
            >
              {t('adminSchoolMembers.addMember.confirm')}
            </LoadingButton>
          </DialogActions>
        </DialogAnimate>
      </Container>
    </Page>
  );
}
