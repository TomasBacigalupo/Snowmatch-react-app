import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Device } from '@capacitor/device';

import enLocales from './en.json';
import deLocales from './de.json';
import frLocales from './fr.json';
import esLocales from './es.json';
import ptLocales from './pt.json';

const resources = {
  en: { translations: enLocales },
  de: { translations: deLocales },
  fr: { translations: frLocales },
  es: { translations: esLocales },
  pt: { translations: ptLocales },
};

// Synchronous default language setting (before async detection)
const defaultLang = localStorage.getItem('i18nextLng') || 'es';

i18n
  .use(initReactI18next)
  .use(LanguageDetector) // Keep this for web
  .init({
    resources,
    lng: defaultLang, // Set initial language synchronously
    fallbackLng: 'es',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: { escapeValue: false },
  });

// Asynchronously detect device language (only for mobile)
async function detectAndSetLanguage() {
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      const info = await Device.getLanguageCode();
      const deviceLang = info.value.split('-')[0] || 'es';
      if (deviceLang !== i18n.language) {
        i18n.changeLanguage(deviceLang); // Update i18n instance
      }
    } catch (error) {
      console.error('Error fetching device language:', error);
    }
  }
}

detectAndSetLanguage(); // Run language detection after initialization

export default i18n;