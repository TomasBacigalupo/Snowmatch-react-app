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
import { getTeachers, getTeacher, getTeacherDocuments} from '../../redux/slices/admin'

import { _userList } from '../../_mock';
import CertificateItem from 'src/sections/@dashboard/admin/CeritificateItem';

// ----------------------------------------------------------------------

export default function AdminConfirm() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id } = useParams();

  const dispatch = useDispatch();

  const isEdit = true; 
 
  const { teacher, documents } = useSelector((state) =>{return state.admin});



  // useEffect(() => {
  //   dispatch(getTeacherByID(id, (teacherComplete) => {
  //     setTeacherData(teacherComplete)
  //   }))
  //   setTeacherData(teachers.find((teacher) => teacher.userId === parseInt(id)))
  // }, [teachers, id]);

  useEffect(() => {
    dispatch(getTeachers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTeacher(id));
  }, [dispatch,id]);

  useEffect(() => {
    dispatch(getTeacherDocuments(id));
  }, [dispatch,id]);


  useEffect(()=>{
    console.log("documents",documents)
    console.log("teacher",teacher)
  },[dispatch, documents, teacher ])

  return (
    <Page title="Admin: Confirm a new teacher">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={'Confirm a new teacher'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Admin', href: PATH_DASHBOARD.admin.review },
            { name: teacher?.name || "asd" },
          ]}
        />
        <AdminConfirmForm isEdit={isEdit} currentTeacher={teacher} />
        {documents?.map(document=>(
          <CertificateItem teacherId={teacher.id} {...document}/>
        ))}
        
      </Container>
    </Page>
  );
}
