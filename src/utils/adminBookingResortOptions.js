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

/**
 * API / enum resort id → display label (e.g. CERRO_CATEDRAL → Cerro Catedral).
 * Unknown ids fall back to title-cased words from underscores.
 */
export function formatAdminBookingResortLabel(value, translate) {
  if (value == null || value === '') return '—';
  if (translate) {
    const key = `adminBookingResorts.${value}`;
    const translated = translate(key);
    if (translated !== key) return translated;
  }
  const found = ADMIN_BOOKING_RESORT_OPTIONS.find((o) => o.value === value);
  if (found) return found.label;
  return String(value)
    .split('_')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .filter(Boolean)
    .join(' ');
}
