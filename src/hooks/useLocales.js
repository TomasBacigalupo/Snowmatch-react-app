import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
// '@mui
import { enUS, deDE, frFR, esES, ptBR, ptPT } from '@mui/material/locale';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'Español',
    value: 'es',
    systemValue: esES,
    //icon: '/assets/i18n/ic_flag_es.svg',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    //icon: '/assets/i18n/ic_flag_en.svg',
  },
  {
    label: 'Português',
    value: 'pt',
    systemValue: ptPT,
    //icon: '/assets/i18n/ic_flag_pt.svg',
  },
  {
    label: 'Français',
    value: 'fr',
    systemValue: frFR,
    //icon: '/assets/i18n/ic_flag_fr.svg',
  },
  // {
  //   label: 'German',
  //   value: 'de',
  //   systemValue: deDE,

  //   icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_de.svg',
  // },
];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langCode = (i18n.language || 'es').split('-')[0];
  const currentLang = LANGS.find((_lang) => _lang.value === langCode) || LANGS[0];

  const handleChangeLanguage = useCallback((newlang) => {
    i18n.changeLanguage(newlang);
  }, [i18n]);

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS,
  };
}
