// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
import SchoolIcon from '@mui/icons-material/School';

// ----------------------------------------------------------------------

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

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'overview', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      // { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      // { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'profile', path: PATH_DASHBOARD.user.profile },
          // { title: 'cards', path: PATH_DASHBOARD.user.cards },
          // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },

      // E-COMMERCE
      
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'snowMatch',
    items: [
      {
        title: 'match',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.match,
        children: [
          { title: 'School PROs', path: PATH_DASHBOARD.eCommerce.shopSchool },
          { title: 'Independent PROs', path: PATH_DASHBOARD.eCommerce.shopInd },
        ],
      },
      { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      {
        title: 'school',
        path: PATH_DASHBOARD.school.root,
        icon: <SchoolIcon/>,
        children: [
          { title: 'clients', path: PATH_DASHBOARD.school.list },
          { title: 'new client', path: PATH_DASHBOARD.school.new },
        ],
      },
      // { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
     
      // { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
    ],
  },
];

export default navConfig;
