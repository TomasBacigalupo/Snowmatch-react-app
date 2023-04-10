import { capitalCase } from 'change-case';
// @mui
import { Container, Tab, Box, Tabs, useTheme, useMediaQuery } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountDocuments,
  AccountNotifications,
  AccountChangePassword,
  AccountSchool
} from '../../sections/@dashboard/user/account';
import useLocales from 'src/hooks/useLocales';
import useAuth from 'src/hooks/useAuth';
import { useEffect, useState } from 'react';
import LoadingScreen from 'src/components/LoadingScreen';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('general');
  const { translate } = useLocales()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  const user = useAuth()
  // const ACCOUNT_TABS = [
  //   {
  //     value: 'social_links',
  //     icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
  //     component: <AccountSocialLinks myProfile={_userAbout} />,
  //   },
  //   {
  //     value: 'documents',
  //     icon: <Iconify icon={'ion:documents'} width={20} height={20} />,
  //     component: <AccountDocuments />,
  //   },

  // ];

  const [tabs, setTabs] = useState([{
    value: 'social_links',
    icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
    component: <AccountSocialLinks myProfile={_userAbout} />,
  },
  {
    value: 'documents',
    icon: <Iconify icon={'ion:documents'} width={20} height={20} />,
    component: <AccountDocuments />,
  },])

  useEffect(() => {
    console.log(user)
    if (user?.user?.role === 'ADMIN') {
      setTabs([
        {
          value: 'general',
          icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
          component: <AccountGeneral />,
        },
        {
          value: 'school',
          icon: <Iconify icon={'ion:school'} width={20} height={20} />,
          component: <AccountSchool />,
        }, 
        {
          value: 'social_links',
          icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
          component: <AccountSocialLinks myProfile={_userAbout} />,
        },
        {
          value: 'documents',
          icon: <Iconify icon={'ion:documents'} width={20} height={20} />,
          component: <AccountDocuments />,
        }])
    }
    else if (user?.user?.role === 'TEACHER') {
      setTabs([
        {
          value: 'general',
          icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
          component: <AccountGeneral />,
        },
        {
          value: 'social_links',
          icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
          component: <AccountSocialLinks myProfile={_userAbout} />,
        },
        {
          value: 'documents',
          icon: <Iconify icon={'ion:documents'} width={20} height={20} />,
          component: <AccountDocuments />,
        }])
    }
    else if (user?.user?.role === 'SCHOOL_ADMIN') {
      setTabs([
        {
          value: 'school',
          icon: <Iconify icon={'ion:school'} width={20} height={20} />,
          component: <AccountSchool />,
        },
        {
          value: 'social_links',
          icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
          component: <AccountSocialLinks myProfile={_userAbout} />,
        },
        {
          value: 'documents',
          icon: <Iconify icon={'ion:documents'} width={20} height={20} />,
          component: <AccountDocuments />,
        }])
    }

  }, [user])

  return (
    <Page title="User: Account Settings">
      {user?.user ? <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate("breadcrumb.account")}
          links={[ 
            { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
            { name: translate("breadcrumb.profile"), href: PATH_DASHBOARD.user.root },
            { name: translate("breadcrumb.editProfile") },
          ]}
        />

        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {tabs.map((tab) => (
            <Tab disableRipple key={tab.value} label={mobile ? '' : translate("account.tabs." + tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {tabs.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container> : <LoadingScreen />}
    </Page>
  );
}
