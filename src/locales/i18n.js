import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
//
import enLocales from './en.json';
import deLocales from './de.json';
import frLocales from './fr.json';
import esLocales from './es.json';
import ptLocales from './pt.json';

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: enLocales },
      de: { translations: deLocales },
      fr: { translations: frLocales },
      es: { translations: esLocales },
      pt: { translations: ptLocales}
    },
    lng: localStorage.getItem('i18nextLng') || 'es',
    fallbackLng: 'es',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
