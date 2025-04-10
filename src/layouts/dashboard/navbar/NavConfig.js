// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
import SchoolIcon from '@mui/icons-material/School';
import DiscountIcon from '@mui/icons-material/Discount';
import SnowmatchLogoWithGraduationHat from 'src/assets/graduationHat';
import VideoCallIcon from '@mui/icons-material/VideoCall';

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
  match: getIcon('ic_match'),
  videoCoach: <VideoCallIcon />,
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      { title: 'overview', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'videoCoach', path: PATH_DASHBOARD.general.videoCoachRate, icon: ICONS.videoCoach },
      { title: 'SnowMatch', path: PATH_DASHBOARD.eCommerce.shopInd, icon: ICONS.match, },
      { title: 'clinicas', path: PATH_DASHBOARD.eCommerce.clinics, icon: ICONS.match },

      { title: 'calendar', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
      {
        title: 'school',
        path: PATH_DASHBOARD.school.root,
        icon: <SchoolIcon />,
        children: [
          { title: 'clients', path: PATH_DASHBOARD.school.list },
          // {
          //   title: 'kanban', path: PATH_DASHBOARD.kanban, children: [
          //     { title: 'currentWeek', path: PATH_DASHBOARD.kanban, },
          //   ]
          // },
          // {
          //   title: 'group', path: PATH_DASHBOARD.eCommerce.viewProducts
          // },
          // {
          //   title: 'private', path: PATH_DASHBOARD.eCommerce.newProduct, children: [
          //     { title: 'halfDay', path: PATH_DASHBOARD.eCommerce.PrivateProductHalf, },
          //     { title: 'fullDay', path: PATH_DASHBOARD.eCommerce.PrivateProductFull, },
          //   ]
          // },
        ],
      },
      // { title: 'e-commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      // { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------


  // APP
  // ---------------------------------------------------------------------
];

export default navConfig;
