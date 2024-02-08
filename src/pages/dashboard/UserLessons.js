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
import { getBookings } from 'src/redux/slices/bookings';

// ----------------------------------------------------------------------

const CustomTab = styled(Tab)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    minWidth: 'auto', // Adjust as needed
    borderRadius: '40px',
    '&.Mui-selected': {
        backgroundColor: 'transparent',
        border: `1px solid black`,
    },
}));

const TabsWrapperStyle = styled('div')(({ theme }) => ({
    zIndex: 9,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: 'white',
    '& .MuiTabs-indicator': {
        backgroundColor: 'transparent', // Set the color of the indicator to white
    }
}));


// ----------------------------------------------------------------------

export default function UserLessons() {
    const { themeStretch } = useSettings();

    const { isTeacher, isStudent } = useAuth();

    const { translate } = useLocales()

    const { currentTab, onChangeTab } = useTabs('pending');

    const [findFriends, setFindFriends] = useState('');

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleFindFriends = (value) => {
        setFindFriends(value);
    };

    useEffect(() => {        
        if(currentTab === 'pending')
            dispatch(getBookings("PENDING"))
        else if(currentTab === 'upcoming')
            dispatch(getBookings("ACCEPTED"))
    }, [dispatch, currentTab])

    return (
        <Page title="User: Lessons">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                {isTeacher && <HeaderBreadcrumbs
                    heading={translate("breadcrumb.lessons")}
                    sx={{ my: 1, mt: 0 }}
                />}

                {isStudent && <HeaderBreadcrumbs
                    heading={translate("breadcrumb.lessons")}
                    links={[
                        { name: 'Match', href: PATH_GUEST.root },
                        { name: translate("breadcrumb.lessons") },
                    ]}
                />}
                {/* Lessons chips filter */}
                <Box sx={{ mb: 2 }}>
                    <TabsWrapperStyle>
                        <Tabs
                            value={currentTab}
                            scrollButtons='none'
                            variant="scrollable"
                            allowScrollButtonsMobile
                            onChange={onChangeTab}
                        >
                            <CustomTab label={translate("lessons.upcoming")} value="upcoming" />
                            <CustomTab label={translate("lessons.pending")} value="pending" />
                            <CustomTab label={translate("lessons.all")} value="all" />
                        </Tabs>
                    </TabsWrapperStyle>
                </Box>
                <UserLessonsList />
            </Container>
        </Page>
    );
}