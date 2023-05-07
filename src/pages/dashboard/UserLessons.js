import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { Tab, Box, Card, Tabs, Container, Button, IconButton } from '@mui/material';
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
import { useNavigate } from 'react-router';
import CertificateItem from 'src/sections/@dashboard/user/account/CertificateItem';
import UserLessonsList from 'src/sections/@dashboard/user/list/UserLessonsList';
import { dispatch, useDispatch } from 'src/redux/store';
import { getEvents, getLessons } from 'src/redux/slices/calendar';

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
    const { themeStretch } = useSettings();

    const { isTeacher, isStudent } = useAuth();

    const { translate } = useLocales()

    const { currentTab, onChangeTab } = useTabs('profile');

    const [findFriends, setFindFriends] = useState('');

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleFindFriends = (value) => {
        setFindFriends(value);
    };

    useEffect(() => {
        dispatch(getLessons())
    }, [dispatch])

    return (
        <Page title="User: Lessons">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                {isTeacher && <HeaderBreadcrumbs
                    heading={translate("breadcrumb.lessons")}
                    links={[
                        { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
                        { name: translate("breadcrumb.lessons") },
                    ]}
                />}

                {isStudent && <HeaderBreadcrumbs
                    heading={translate("breadcrumb.lessons")}
                    links={[
                        { name: 'Match', href: PATH_GUEST.root },
                        { name: translate("breadcrumb.lessons") },
                    ]}
                />}
                <Card
                    sx={{
                        mb: 3,
                        position: 'relative',
                        padding:'2px'
                    }}
                >
                    <UserLessonsList/>
                </Card>


            </Container>
        </Page>
    );
}