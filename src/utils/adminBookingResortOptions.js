/**
 * Values must match {@code com.gschool.model.Resorts} enum constant names (API query params / payloads).
 */

export const ADMIN_BOOKING_RESORT_FILTER_OPTIONS = [
  { value: 'CERRO_CATEDRAL', label: 'Cerro Catedral' },
  { value: 'CHAPELCO', label: 'Chapelco' },
  { value: 'CERRO_BAYO', label: 'Cerro Bayo' },
  { value: 'CERRO_CASTOR', label: 'Cerro Castor' },
  { value: 'PENITENTES', label: 'Las Pendientes' },
  { value: 'LAGO_HERMOSO', label: 'Lago Hermoso' },
  { value: 'LAS_LEÑAS', label: 'Las Leñas' },
  { value: 'CERRO_PERITO_MORENO', label: 'Cerro Perito Moreno' },
];

/** Filter bar + admin create booking modal (adds Chile resorts available in the modal). */
export const ADMIN_BOOKING_RESORT_OPTIONS = [
  ...ADMIN_BOOKING_RESORT_FILTER_OPTIONS,
  { value: 'PORTILLO', label: 'Portillo' },
  { value: 'LA_PARVA', label: 'La Parva' },
];
