/** Travesía Ski & Snowboard Rental — TARIFAS 2026 (agency packages). */

export const AGENCY_GEAR_VALUE = 50000;
export const AGENCY_COMMISSION_FACTOR = 0.75; // 25% commissionable to agency
export const BAUTISMO_LIST_PRICE_PER_PERSON = 120000;
export const BAUTISMO_MAX_PERSONS = 12;

export const AGENCY_BOOKING_PRODUCTS = [
  {
    id: 'bautismo',
    labelKey: 'adminBookings.agencyBooking.products.bautismo',
    category: 'bautismo',
    listPricePerPerson: BAUTISMO_LIST_PRICE_PER_PERSON,
    fixedPersons: null,
  },
  {
    id: 'exclusiva_1',
    labelKey: 'adminBookings.agencyBooking.products.exclusiva1',
    category: 'exclusiva',
    listPrice: 340000,
    fixedPersons: 1,
  },
  {
    id: 'exclusiva_2',
    labelKey: 'adminBookings.agencyBooking.products.exclusiva2',
    category: 'exclusiva',
    listPrice: 400000,
    fixedPersons: 2,
  },
  {
    id: 'exclusiva_3',
    labelKey: 'adminBookings.agencyBooking.products.exclusiva3',
    category: 'exclusiva',
    listPrice: 460000,
    fixedPersons: 3,
  },
  {
    id: 'semi_4',
    labelKey: 'adminBookings.agencyBooking.products.semi4',
    category: 'semi',
    listPrice: 560000,
    fixedPersons: 4,
  },
  {
    id: 'semi_5',
    labelKey: 'adminBookings.agencyBooking.products.semi5',
    category: 'semi',
    listPrice: 620000,
    fixedPersons: 5,
  },
  {
    id: 'semi_6',
    labelKey: 'adminBookings.agencyBooking.products.semi6',
    category: 'semi',
    listPrice: 680000,
    fixedPersons: 6,
  },
];

export function getAgencyBookingProduct(productId) {
  return AGENCY_BOOKING_PRODUCTS.find((p) => p.id === productId) || null;
}

export function resolveAgencyProductPersons(product, selectedPersons) {
  if (!product) return 0;
  if (product.fixedPersons != null) return product.fixedPersons;
  const n = Number(selectedPersons);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(BAUTISMO_MAX_PERSONS, Math.floor(n));
}

export function getAgencyListTotal(product, persons) {
  if (!product || !persons) return 0;
  if (product.listPricePerPerson != null) {
    return product.listPricePerPerson * persons;
  }
  return Number(product.listPrice) || 0;
}

/**
 * Agency net: (listTotal - persons * gearValue) * 0.75
 */
export function getAgencyBookingPrice(product, selectedPersons) {
  const persons = resolveAgencyProductPersons(product, selectedPersons);
  const listTotal = getAgencyListTotal(product, persons);
  const gearTotal = persons * AGENCY_GEAR_VALUE;
  const agencyPrice = (listTotal - gearTotal) * AGENCY_COMMISSION_FACTOR;
  return {
    persons,
    listTotal,
    gearTotal,
    agencyPrice,
  };
}

export function buildAgencyBookingInternalComment({
  agencyName,
  productLabel,
  persons,
  date,
  lessonTime,
  listTotal,
  gearTotal,
  agencyPrice,
}) {
  const parts = [
    `Agencia: ${agencyName || '—'}`,
    `${productLabel} ${persons}p`,
    `${date} ${lessonTime}`,
    `Lista ${listTotal}`,
    `Gear ${gearTotal}`,
    `Agencia ${agencyPrice} (25% com.)`,
    'Equipos incluidos en tarifa',
  ];
  const text = parts.join(' | ');
  return text.length <= 255 ? text : text.slice(0, 255);
}
