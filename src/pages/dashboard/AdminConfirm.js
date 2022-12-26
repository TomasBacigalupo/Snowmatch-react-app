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
import { getTeacherByID } from 'src/redux/slices/teachers';
import CertificateItem from 'src/sections/@dashboard/admin/CeritificateItem';

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
    dispatch(getTeacherByID(id, (teacherComplete) => {
      setTeacherData(teacherComplete)
    }))
    setTeacherData(teachers.find((teacher) => teacher.userId === parseInt(id)))
    
    console.log("currentTeacher")
    console.log(currentTeacher)
    console.log(currentTeacher?.name)
  }, [teachers, id]);

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
        {currentTeacher?.documents?.map(document=>(
          <CertificateItem teacherId={currentTeacher.id} {...document}/>
        ))}
        
      </Container>
    </Page>
  );
}
