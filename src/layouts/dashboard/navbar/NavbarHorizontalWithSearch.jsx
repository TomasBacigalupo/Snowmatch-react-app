import { memo, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container, AppBar } from '@mui/material';
// config
import { HEADER } from '../../../config';
// components
import { NavSectionHorizontal } from '../../../components/nav-section';
//
import navConfig from './NavConfig';
import { PATH_DASHBOARD, PATH_GUEST } from 'src/routes/paths';
// redux
import { useSelector } from 'src/redux/store';
// hooks
import useLocales from 'src/hooks/useLocales';


// ----------------------------------------------------------------------


const RootStyle = styled(AppBar)(({ theme, isScrolled }) => ({
  transition: theme.transitions.create(['top', 'transform', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: '100%',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT + 45,
  backgroundColor: 'white',
  transform: isScrolled ? 'translateY(-100%)' : 'translateY(0)',
  opacity: isScrolled ? 0 : 1,
}));

// ----------------------------------------------------------------------

function NavbarHorizontalWithSearch() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get resort from Redux business slice
  const { filters } = useSelector((state) => state.teachers);
  const resort = filters.resort || '';
  
  // Get current language and translations
  const { currentLang, translate } = useLocales();
  const currentLanguage = currentLang?.value || 'es';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <RootStyle isScrolled={isScrolled}>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={
          [
            {
              items: [
                { title: `📰 ${translate('menu.navbar.news')}`, path: "/noticias", },
                { title: `⛷️ ${translate('menu.navbar.classes')}`, path: `/${currentLanguage}/search/${resort}`, },
                { title: `🎥 ${translate('menu.navbar.videoCorrections')}`, path: PATH_DASHBOARD.general.videoCoachRate,   },
                { title: `🎿 ${translate('menu.navbar.rental')}`, path: `/rental/${resort}`,  },
              ],
            }
          ]
        } />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontalWithSearch);
