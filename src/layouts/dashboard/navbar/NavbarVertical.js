import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import Logo from '../../../components/Logo';
import Scrollbar from '../../../components/Scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import navConfig from './NavConfig';
import navConfigGuest from './NavConfigGuest';
import NavbarDocs from './NavbarDocs';
import NavbarAccount from './NavbarAccount';
import NavbarMenuSkeleton from './NavbarMenuSkeleton';
import CollapseButton from './CollapseButton';
import ResortAdminAccountPopover from '../header/ResortAdminAccountPopover';
import useAuth from 'src/hooks/useAuth';
import { isCerroBayoResortAdmin, isResortAdminNavLoading } from '../../../utils/resortAdminBranding';
import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgIconStyle from '../../../components/SvgIconStyle';
import SchoolIcon from '@mui/icons-material/School';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector } from 'react-redux';
import navConfigGuestCatedral from './NavConfigCatedral';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

const ADMIN_HIDDEN_NAV_TITLES = new Set([
  'overview',
  'videoCoach',
  'SnowMatch',
  'clinicas',
  'calendar',
  'school',
  'chat',
]);

const filterNavForAdmin = (navSections) =>
  navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !ADMIN_HIDDEN_NAV_TITLES.has(item.title)),
    }))
    .filter((section) => section.items.length > 0);

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  match: getIcon('ic_match')
};

const ADMIN_NAV_ITEMS = [
  { title: 'review teachers', path: PATH_DASHBOARD.admin.review, icon: <CastForEducationIcon /> },
  { title: 'review clients', path: PATH_DASHBOARD.admin.reviewClients, icon: <PeopleIcon /> },
  { title: 'lesson bookings', path: PATH_DASHBOARD.admin.bookings, icon: ICONS.booking },
  { title: 'equipment bookings', path: PATH_DASHBOARD.admin.bookingsEquipos, icon: ICONS.booking },
  { title: 'user chats', path: PATH_DASHBOARD.admin.userChats, icon: ICONS.chat },
  { title: 'broadcast lesson', path: PATH_DASHBOARD.admin.broadcastLesson, icon: ICONS.mail },
  { title: 'financial dashboard', path: PATH_DASHBOARD.admin.financial, icon: ICONS.banking },
  { title: 'rental products', path: PATH_DASHBOARD.admin.rental, icon: ICONS.ecommerce },
  { title: 'rental providers', path: PATH_DASHBOARD.admin.rentalProviders, icon: ICONS.ecommerce },
  { title: 'group lessons by resort', path: PATH_DASHBOARD.admin.groupLessonResorts, icon: ICONS.calendar },
  { title: 'resort admins', path: PATH_DASHBOARD.admin.resortAdmins, icon: ICONS.user },
  { title: 'user calendars', path: PATH_DASHBOARD.admin.userCalendars, icon: ICONS.calendar },
];

const RESORT_ADMIN_NAV_ITEMS = [
  { title: 'dashboard', path: PATH_DASHBOARD.admin.dashboard, icon: ICONS.analytics },
  { title: 'review teachers', path: PATH_DASHBOARD.admin.review, icon: <CastForEducationIcon /> },
  { title: 'user calendars', path: PATH_DASHBOARD.admin.userCalendars, icon: ICONS.calendar },
  { title: 'clients', path: PATH_DASHBOARD.admin.reviewClients, icon: <PeopleIcon /> },
  { title: 'lesson bookings', path: PATH_DASHBOARD.admin.bookings, icon: ICONS.booking },
  { title: 'user chats', path: PATH_DASHBOARD.admin.userChats, icon: ICONS.chat },
  { title: 'rental products', path: PATH_DASHBOARD.admin.rental, icon: ICONS.ecommerce },
  { title: 'group lessons by resort', path: PATH_DASHBOARD.admin.groupLessonResorts, icon: ICONS.calendar },
];

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
  isGuest: PropTypes.bool,
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar, isGuest, isAdmin }) {
  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');
  //check if catedral
  const { filters } = useSelector((state) => { return state.teachers })
  const { resort } = filters



  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const { user: authUser, isInitialized } = useAuth();
  const userRole = authUser?.role;
  const navLoading = isResortAdminNavLoading({ isInitialized, user: authUser });
  const showCerroBayoNavSkeleton = navLoading && isCerroBayoResortAdmin(authUser);

  const config = useMemo(() => {
    const base = isGuest
      ? (resort === 'Cerro Catedral' ? navConfigGuestCatedral : navConfigGuest)
      : navConfig;

    if (userRole === 'ADMIN') {
      const adminBase = filterNavForAdmin(base);
      return [...adminBase, {
        items: ADMIN_NAV_ITEMS,
      }];
    }

    if (userRole === 'RESORT_ADMIN') {
      return [{
        items: RESORT_ADMIN_NAV_ITEMS,
      }];
    }

    return base;
  }, [isGuest, resort, userRole]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: { xs: 'env(safe-area-inset-top)', lg: 2 },
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { justifyContent: 'center' }),
        }}
      >
        <NavbarAccount isCollapse={isCollapse} />
        {isDesktop && !isCollapse && (
          <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
        )}
      </Stack>

      {showCerroBayoNavSkeleton ? (
        <NavbarMenuSkeleton count={RESORT_ADMIN_NAV_ITEMS.length} isCollapse={isCollapse} />
      ) : (
        <NavSectionVertical navConfig={config} isCollapse={isCollapse} />
      )}

      <Box sx={{ flexGrow: 1 }} />

      {userRole === 'RESORT_ADMIN' && (!isCollapse || !isDesktop) && (
        <Box
          sx={{
            px: 2.5,
            pb: 3,
            pt: 2,
            display: 'flex',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <ResortAdminAccountPopover logoHeight={48} popoverAbove />
        </Box>
      )}

      {/* {!isCollapse && <NavbarDocs />} */}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
