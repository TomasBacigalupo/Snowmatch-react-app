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

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();
  const { currentTab, onChangeTab } = useTabs('general');
  const {translate} = useLocales()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("sm"))
  const ACCOUNT_TABS = [
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
      component: <AccountDocuments/>,
    },
    {
      value: 'school',
      icon: <Iconify icon={'ion:school'} width={20} height={20} />,
      component: <AccountSchool/>,
    },
  ];

  return (
    <Page title="User: Account Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
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
          {ACCOUNT_TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={mobile ? '' : translate("account.tabs." + tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
