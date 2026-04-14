// i18n
import './locales/i18n';

// MUI X Pro (date range pickers) — set REACT_APP_MUI_X_LICENSE in .env to remove license console noise
import { LicenseInfo } from '@mui/x-license';

// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// redux
import { store, persistor } from './redux/store';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

// Check our docs
// https://docs-minimals.vercel.app/authentication/ts-version

import { AuthProvider } from './contexts/JWTContext';
// import { AuthProvider } from './contexts/Auth0Context';
// import { AuthProvider } from './contexts/FirebaseContext';
// import { AuthProvider } from './contexts/AwsCognitoContext';

//
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

if (process.env.REACT_APP_MUI_X_LICENSE) {
  LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_X_LICENSE);
}

// ----------------------------------------------------------------------

const container = document.getElementById('root');

const app = (
  <AuthProvider>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
              <CollapseDrawerProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </CollapseDrawerProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  </AuthProvider>
);

// react-snap prerender fills #root; hydrate to avoid replacing static HTML on load.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
