import { useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';
import Label from '../../components/Label';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import { Link as RouterLink } from 'react-router-dom';
import AccountPopover from '../dashboard/header/AccountPopover';
import LanguagePopover from '../dashboard/header/LanguagePopover';
import useLocales from 'src/hooks/useLocales';
import HoverButton from 'src/components/HoverButton';
import ShopProductSearch from 'src/sections/@dashboard/e-commerce/shop/ShopProductSearch';
import { useSelector } from 'src/redux/store';

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

const SearchContainer = styled(Box)(({ theme, isoffset }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: isoffset === 'true' ? '400px' : '600px',
  transition: theme.transitions.create(['width', 'top'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  top: isoffset === 'true' ? '50%' : '100%',
  transform: isoffset === 'true' ? 'translate(-50%, -50%)' : 'translate(-50%, -50%)',
  zIndex: 1000,
}));

// ----------------------------------------------------------------------

export default function MainHeaderWithSearch() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const theme = useTheme();
  const { pathname } = useLocation();
  const {translate} = useLocales();
  const isDesktop = useResponsive('up', 'md');
  const isHome = pathname === '/';
  const { filters } = useSelector((state) => state.teachers);

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent', paddingTop: 'env(safe-area-inset-top)'}}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          
          {pathname === '/' && !isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />} 

          {pathname === '/' && isDesktop && (
          <HoverButton
            component={RouterLink}
            to={"/match/independent"}
            variant="contained"
            sx={{ 
              marginRight: '15px',
              marginLeft: '15px'
           }}
          >
            {translate("landingPRO.independent")}
          </HoverButton>)} 

          {pathname === '/' && isDesktop && (
            <HoverButton
              component={RouterLink}
              to={"/match"}
              variant="contained"
              sx={{
                marginRight: '15px',
                marginLeft: '15px'
              }}
            >
              {translate("landingPRO.school")}
            </HoverButton>)}

          <AccountPopover/>

          <SearchContainer isoffset={isOffset.toString()}>
            <ShopProductSearch filters={filters} teachers={[]} />
          </SearchContainer>
        </Container>
      </ToolbarStyle>
      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
