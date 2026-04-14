import { useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Menu, MenuItem } from '@mui/material';
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
import AccountPopover from '../dashboard/header/AccountPopover';
import LanguagePopover from '../dashboard/header/LanguagePopover';
import useLocales from 'src/hooks/useLocales';
import HoverButton from 'src/components/HoverButton';
import Iconify from 'src/components/Iconify';
import { snowmatchBookingWhatsAppUrl } from 'src/utils/snowmatchWhatsApp';

const LANG_PREFIX_PATH = /^\/(es|en|pt|fr)(\/|$)/i;

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

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const theme = useTheme();

  const { pathname } = useLocation();

  const {translate} = useLocales()

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/';

  const [tarifasAnchor, setTarifasAnchor] = useState(null);
  const [escuelaAnchor, setEscuelaAnchor] = useState(null);
  const langSegMatch = pathname.match(LANG_PREFIX_PATH);
  const langPrefix = langSegMatch ? `/${langSegMatch[1].toLowerCase()}` : null;
  const aboutTeamPath = langPrefix ? `${langPrefix}/about-us` : '/about-us';
  const bookWhatsAppHref = snowmatchBookingWhatsAppUrl(translate('languageHome.whatsapp.bookMessage'));

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
          }}
        >
          <Logo />

          {/* <Label color="info" sx={{ ml: 1 }}>
            v3.3.0
          </Label> */}
          <Box sx={{ flexGrow: 1 }} />

          {langPrefix && (
            <>
              <Button
                color="inherit"
                onClick={(e) => setTarifasAnchor(e.currentTarget)}
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={18} />}
                sx={{
                  mr: { xs: 0.5, sm: 1 },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {translate('languageHome.tarifas.menuLabel')}
              </Button>
              <Menu
                anchorEl={tarifasAnchor}
                open={Boolean(tarifasAnchor)}
                onClose={() => setTarifasAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem
                  component={RouterLink}
                  to={`${langPrefix}#tarifas-adultos`}
                  onClick={() => setTarifasAnchor(null)}
                >
                  {translate('languageHome.tarifas.adultos')}
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to={`${langPrefix}#tarifas-ninos`}
                  onClick={() => setTarifasAnchor(null)}
                >
                  {translate('languageHome.tarifas.ninos')}
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to={`${langPrefix}#tarifas-equipos`}
                  onClick={() => setTarifasAnchor(null)}
                >
                  {translate('languageHome.tarifas.equipos')}
                </MenuItem>
                <MenuItem
                  component="a"
                  href={bookWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setTarifasAnchor(null)}
                >
                  {translate('languageHome.tarifas.reservar')}
                </MenuItem>
              </Menu>

              <Button
                color="inherit"
                onClick={(e) => setEscuelaAnchor(e.currentTarget)}
                endIcon={<Iconify icon="eva:arrow-ios-downward-fill" width={18} />}
                sx={{
                  mr: { xs: 0.5, sm: 1 },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {translate('languageHome.escuela.menuLabel')}
              </Button>
              <Menu
                anchorEl={escuelaAnchor}
                open={Boolean(escuelaAnchor)}
                onClose={() => setEscuelaAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <MenuItem
                  component={RouterLink}
                  to={`${langPrefix}#escuela-clases`}
                  onClick={() => setEscuelaAnchor(null)}
                >
                  {translate('languageHome.escuela.clases')}
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to={`${langPrefix}#escuela-rental`}
                  onClick={() => setEscuelaAnchor(null)}
                >
                  {translate('languageHome.escuela.rental')}
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to={`${langPrefix}#escuela-ninos`}
                  onClick={() => setEscuelaAnchor(null)}
                >
                  {translate('languageHome.escuela.ninos')}
                </MenuItem>
                <MenuItem
                  component="a"
                  href={bookWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setEscuelaAnchor(null)}
                >
                  {translate('languageHome.escuela.reservar')}
                </MenuItem>
              </Menu>
            </>
          )}

          <Button
            component={RouterLink}
            to={aboutTeamPath}
            color="inherit"
            sx={{
              mr: { xs: 0.5, sm: 1 },
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {translate('mainHeader.nuestroEquipo')}
          </Button>
          
          {/* {pathname === '/' && isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />} */}
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

          {/* just for testing */}
          <LanguagePopover />
          <AccountPopover/>

          {/* {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />} */}
        </Container>
      </ToolbarStyle>
      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
