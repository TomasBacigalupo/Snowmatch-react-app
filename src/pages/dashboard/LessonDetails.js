import { capitalCase } from 'change-case';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { Tab, Box, Card, Tabs, Container, Button, IconButton, Grid, LinearProgress } from '@mui/material';
import { TeacherDetailsReview } from 'src/sections/@dashboard/e-commerce/teacher-details';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
    Profile,
    ProfileCover,
    ProfileFriends,
    ProfileGallery,
    ProfileFollowers,
} from '../../sections/@dashboard/user/profile';
import useLocales from 'src/hooks/useLocales';
import { useNavigate, useParams } from 'react-router';
import CertificateItem from 'src/sections/@dashboard/user/account/CertificateItem';
import UserLessonsList from 'src/sections/@dashboard/user/list/UserLessonsList';
import ContactCard from 'src/sections/@dashboard/user/cards/ContactCard';
import { useDispatch, useSelector } from 'src/redux/store';
import { useEffect } from 'react';
import { getEvents, getLessonById } from 'src/redux/slices/calendar';
import { CommentsDisabledOutlined } from '@mui/icons-material';
import EventInfoCard from 'src/sections/@dashboard/user/cards/EventInfoCard';
import { getTeacherByEmail } from 'src/redux/slices/teachers';
import EventCard from 'src/sections/@dashboard/user/cards/EventCard';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
    zIndex: 9,
    bottom: 0,
    width: '100%',
    display: 'flex',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
        justifyContent: 'center',
    },
    [theme.breakpoints.up('md')]: {
        justifyContent: 'flex-end',
        paddingRight: theme.spacing(3),
    },
}));

// ----------------------------------------------------------------------

export default function UserLessons() {
    const {isStudent, isTeacher} = useAuth()
    const { themeStretch } = useSettings();
    const { translate } = useLocales();
    const {isLoading, lesson} = useSelector(state => state.calendar)
    const {eventId} = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getLessonById(eventId))
    }, [dispatch])
    
    return (
        <Page title="Lesson">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                {isStudent && <HeaderBreadcrumbs
                    heading={translate("breadcrumb.lesson_details")}
                    links={[
                        { name: 'Match', href: PATH_GUEST.root },
                        { name: translate("breadcrumb.lessons"), href: PATH_GUEST.root +'/lessons' },
                        { name: translate("breadcrumb.lesson_details") },
                    ]}
                />}
                {isTeacher && <HeaderBreadcrumbs
                    heading={translate("breadcrumb.lesson_details")}
                    links={[
                        { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
                        { name: translate("breadcrumb.lessons"), href: PATH_DASHBOARD.user.lessons },
                        { name: translate("breadcrumb.lesson_details") },
                    ]}
                />}
                
                {isLoading && <LinearProgress/> }
                {!isLoading && isStudent && lesson.owner && 
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <ContactCard 
                            user={lesson.owner}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <EventInfoCard lesson={lesson}/>
                    </Grid>
                </Grid>}
                {!isLoading && isTeacher && lesson?.students?.length > 0 &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <ContactCard
                                user={lesson?.students[0]}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <EventCard lessons={[lesson]} showInfo={false}/>
                        </Grid>
                    </Grid>}
            </Container>
        </Page>
    );
}