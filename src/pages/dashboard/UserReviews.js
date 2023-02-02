import { capitalCase } from 'change-case';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { Tab, Box, Card, Tabs, Container, Button, IconButton } from '@mui/material';
import { TeacherDetailsReview } from 'src/sections/@dashboard/e-commerce/teacher-details';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
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

export default function UserReviews() {
    const { themeStretch } = useSettings();

    const { user } = useAuth();

    const { translate } = useLocales()

    const { currentTab, onChangeTab } = useTabs('profile');

    const [findFriends, setFindFriends] = useState('');

    const navigate = useNavigate()

    const handleFindFriends = (value) => {
        setFindFriends(value);
    };

    const PROFILE_TABS = [
        {
            value: 'profile',
            icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
            component: <Profile myProfile={_userAbout} posts={_userFeeds} />,
        }
    ];

    return (
        <Page title="User: Profile">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={translate("breadcrumb.reviews")}
                    links={[
                        { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
                        { name: user?.name || 'Profile' },
                    ]}
                />
                <Card
                    sx={{
                        mb: 3,
                        position: 'relative',
                    }}
                >
                    <TeacherDetailsReview teacher={user} />
                </Card>


            </Container>
        </Page>
    );
}