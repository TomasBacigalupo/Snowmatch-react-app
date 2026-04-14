/** Maps marketing home slugs to backend {@link com.gschool.model.Resorts} enum names. */
export const GROUP_LESSON_RESORT_SLUG_TO_ENUM = {
  'cerro-catedral': 'CERRO_CATEDRAL',
  'cerro-bayo': 'CERRO_BAYO',
  'cerro-chapelco': 'CHAPELCO',
  'cerro-perito-moreno': 'CERRO_PERITO_MORENO',
};

/** Admin dropdown: value must match Java enum name. */
export const GROUP_LESSON_RESORT_OPTIONS = [
  { value: 'CERRO_CATEDRAL', label: 'Cerro Catedral', slug: 'cerro-catedral' },
  { value: 'CERRO_BAYO', label: 'Cerro Bayo', slug: 'cerro-bayo' },
  { value: 'CHAPELCO', label: 'Chapelco', slug: 'cerro-chapelco' },
  { value: 'CERRO_PERITO_MORENO', label: 'Cerro Perito Moreno', slug: 'cerro-perito-moreno' },
  { value: 'CERRO_CASTOR', label: 'Cerro Castor' },
  { value: 'LA_HOYA', label: 'La Hoya' },
  { value: 'LAS_LEÑAS', label: 'Las Leñas' },
];

export const GROUP_LESSON_CURRENCY_OPTIONS = [
  { value: 'ARS', label: 'ARS' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'CLP', label: 'CLP' },
  { value: 'BRL', label: 'BRL' },
];
