// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';
import SchoolIcon from '@mui/icons-material/School';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
  rental: getIcon('ic_rental'),
  protips: <CastForEducationIcon />,
  videoCoach: <VideoCallIcon />,
  contactSupport: <SupportAgentIcon />,
  help: <HelpOutlineIcon />
};

const navConfigGuestCatedral = [

  // MANAGEMENT
  // ----------------------------------------------------------------------


  // APP
  // ----------------------------------------------------------------------
  {
    //subheader: 'snowMatch',
    items: [
      {
        title: 'match',
        path: PATH_GUEST.root,
        icon: ICONS.match,
        path: PATH_GUEST.independent
        // { title: 'Schools', path: PATH_GUEST.schools },
        ,
      },
      { title: 'protips', path: "/noticias", icon: ICONS.protips },
      { title: 'videoCoach', path: PATH_GUEST.videoCoach, icon: ICONS.videoCoach },
      { title: 'rent', path: PATH_GUEST.calculate, icon: ICONS.rental },
      { title: 'contact', path: "https://blog.snowmatch.pro/soporte/preguntas-frecuentes-faq/", icon: ICONS.contactSupport },
      { title: 'help', path: "https://blog.snowmatch.pro/soporte/", icon: ICONS.help },

      { title: 'chat', path: PATH_GUEST.chat, icon: ICONS.chat },

      // { title: 'kanban', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
    ],
  },
];

export default navConfigGuestCatedral;
