import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import AdminConfirmForm from '../../sections/@dashboard/admin/AdminConfirmForm';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../redux/store';
import { getTeachers } from '../../redux/slices/admin'

import { _userList } from '../../_mock';

// ----------------------------------------------------------------------

export default function AdminConfirm() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const dispatch = useDispatch();

  const isEdit = true;
 
  const { teachers = {} } = useSelector((state) =>{console.log(state);return state.admin});

  const [currentTeacher, setTeacherData]= useState(null);


  useEffect(() => {
    console.log(teachers)
    console.log("teachers")
    setTeacherData(teachers.find((teacher) => teacher.id === parseInt(id)))
    console.log("currentTeacher")
    console.log(currentTeacher)
    console.log(currentTeacher?.name)
  }, [teachers,currentTeacher, id]);

  useEffect(() => {
    dispatch(getTeachers());
  }, [dispatch]);

  return (
    <Page title="Admin: Confirm a new teacher">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Confirm a new teacher'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.review },
            { name: currentTeacher?.name || "asd" },
          ]}
        />

        <AdminConfirmForm isEdit={isEdit} currentTeacher={currentTeacher} />
      </Container>
    </Page>
  );
}
