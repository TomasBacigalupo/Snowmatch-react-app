// routes
import { PATH_AUTH, PATH_DOCS, PATH_PAGE, PATH_GUEST } from '../../routes/paths';
// components
import { PATH_AFTER_LOGIN } from '../../config';
// components
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: 'Match a PRO',
    path: '/match',
    children: [
      {
        subheader: 'Options',
        items: [
          { title: 'School PROs', path: PATH_GUEST.school },
          { title: 'Independent PROs', path: PATH_GUEST.independent},
        ],
      }]
  },
 
];

export default menuConfig;
