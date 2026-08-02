import { DEFAULT_USD_TO_ARS_RATE } from './adminTodayBookings';
import {
  calcTeacherHoursFromLessonTime,
  inferLessonTimeFromEvent,
} from './adminBookingEvents';
import { getTeacherLevelPriceKey } from './teacherHourPricePresets';

export const HOURLY_PAYOUT_CAP_ARS = 80000;

const IVA_RATE = 1.21;
const IIBB_RATE = 0.04;
const NON_CASH_PAYOUT_SHARE = 0.8;
const CASH_PAYOUT_SHARE = 0.5;

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Suggested instructor payout from booking price, currency, payment method, and teacher hours.
 * Always returns amounts in ARS (USD prices are converted at usdToArsRate).
 */
export function calcSuggestedPayoutBreakdown({
  price,
  currency = 'ARS',
  paymentMethod,
  hours = 0,
  usdToArsRate = DEFAULT_USD_TO_ARS_RATE,
}) {
  const teacherHours = Number(hours) || 0;
  const isCash = paymentMethod === 'CASH';
  const rate = Number(usdToArsRate) > 0 ? Number(usdToArsRate) : DEFAULT_USD_TO_ARS_RATE;
  const empty = {
    priceArs: 0,
    netOfIva: null,
    ingresosBrutos: null,
    uncappedSuggested: 0,
    cap: roundMoney(teacherHours * HOURLY_PAYOUT_CAP_ARS),
    suggested: 0,
    isCash,
    hours: teacherHours,
    currencyConverted: currency === 'USD',
    usdToArsRate: rate,
  };

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return empty;
  }

  const priceArs = roundMoney(currency === 'USD' ? numericPrice * rate : numericPrice);

  let uncappedSuggested;
  let netOfIva = null;
  let ingresosBrutos = null;

  if (isCash) {
    uncappedSuggested = roundMoney(priceArs * CASH_PAYOUT_SHARE);
  } else {
    netOfIva = roundMoney(priceArs / IVA_RATE);
    ingresosBrutos = roundMoney(netOfIva * IIBB_RATE);
    uncappedSuggested = roundMoney((netOfIva - ingresosBrutos) * NON_CASH_PAYOUT_SHARE);
  }

  const cap = roundMoney(teacherHours * HOURLY_PAYOUT_CAP_ARS);
  const suggested = roundMoney(
    teacherHours > 0 ? Math.min(uncappedSuggested, cap) : uncappedSuggested
  );

  return {
    priceArs,
    netOfIva,
    ingresosBrutos,
    uncappedSuggested,
    cap,
    suggested,
    isCash,
    hours: teacherHours,
    currencyConverted: currency === 'USD',
    usdToArsRate: rate,
  };
}

function calcEventHours(event) {
  const start = new Date(event?.start);
  const end = new Date(event?.end);
  const diffMs = end - start;

  if (Number.isFinite(diffMs) && diffMs > 0) {
    const eventHours = diffMs / (1000 * 60 * 60);
    if (Math.abs(eventHours - 4) < 0.01) {
      return 3;
    }
    return Math.min(eventHours, 6);
  }

  return calcTeacherHoursFromLessonTime(inferLessonTimeFromEvent(event));
}

function getHourlyRate(teacherLevel, bookingType) {
  const isReferred = bookingType === 'REFERRED';

  switch (teacherLevel) {
    case 1:
      return isReferred ? 30000 : 23500;
    case 2:
      return isReferred ? 38500 : 32000;
    case 3:
    case 4:
    case 5:
      return isReferred ? 56000 : 49500;
    default:
      return 16000;
  }
}

function normalizeDateTime(value) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toISOString();
}

function getEventKey(event) {
  const start = normalizeDateTime(event?.start);
  const end = normalizeDateTime(event?.end);
  if (start && end) {
    return `range:${start}|${end}`;
  }
  if (event?.id != null) {
    return `id:${event.id}`;
  }
  return null;
}

export function calcBookingTeacherHours(booking) {
  if (!booking?.eventList?.length) {
    return 0;
  }

  return booking.eventList.reduce((hours, event) => hours + calcEventHours(event), 0);
}

/** Unique events across bookings (shared events counted once). */
export function collectUniqueEvents(bookings) {
  const byKey = new Map();

  (bookings || []).forEach((booking) => {
    (booking?.eventList || []).forEach((event) => {
      const key = getEventKey(event);
      if (!key) {
        return;
      }
      const existing = byKey.get(key);
      if (existing) {
        // Prefer REFERRED when the same event is on mixed booking types
        if (booking?.type === 'REFERRED') {
          existing.isReferred = true;
        }
        return;
      }
      byKey.set(key, {
        event,
        hours: calcEventHours(event),
        isReferred: booking?.type === 'REFERRED',
      });
    });
  });

  return [...byKey.values()];
}

export function calcUniqueTeacherHours(bookings) {
  return collectUniqueEvents(bookings).reduce((total, item) => total + item.hours, 0);
}

export function calcUniqueHoursByType(bookings) {
  return collectUniqueEvents(bookings).reduce(
    (acc, item) => {
      if (item.isReferred) {
        acc.referred += item.hours;
      } else {
        acc.assigned += item.hours;
      }
      return acc;
    },
    { assigned: 0, referred: 0 }
  );
}

export function calcBookingPayWithHourPrice(booking, hourPrices) {
  const isReferred = booking?.type === 'REFERRED';
  const rawPrice = isReferred ? hourPrices?.referred : hourPrices?.assigned;
  const rate = parseFloat(rawPrice);
  if (!rate || rate <= 0) {
    return 0;
  }
  return calcBookingTeacherHours(booking) * rate;
}

export function getSuggestedTeacherPayoutAmount(booking) {
  const raw = booking?.suggestedTeacherPayoutAmount;
  if (raw == null || raw === '') {
    return 0;
  }
  const suggested = typeof raw === 'number' ? raw : Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(suggested) || suggested <= 0) {
    return 0;
  }
  return suggested;
}

/**
 * Prefer suggested teacher payout when set; otherwise hours × hour price.
 */
export function calcBookingPayoutAmount(booking, hourPrices) {
  const suggested = getSuggestedTeacherPayoutAmount(booking);
  if (suggested > 0) {
    return suggested;
  }
  return calcBookingPayWithHourPrice(booking, hourPrices);
}

export function buildBookingPayoutItems(bookings, hourPrices, paidBookingIds) {
  const paid = paidBookingIds instanceof Set ? paidBookingIds : new Set(paidBookingIds || []);

  return (bookings || [])
    .filter((booking) => booking?.id != null && !paid.has(booking.id))
    .map((booking) => {
      const suggested = getSuggestedTeacherPayoutAmount(booking);
      if (suggested > 0) {
        return {
          bookingId: booking.id,
          amount: suggested,
          source: 'suggested',
          currency:
            booking?.suggestedTeacherPayoutCurrency || booking?.currency || 'ARS',
        };
      }

      const hourPriceAmount = calcBookingPayWithHourPrice(booking, hourPrices);
      if (hourPriceAmount > 0) {
        return {
          bookingId: booking.id,
          amount: hourPriceAmount,
          source: 'hourPrice',
          currency: 'ARS',
        };
      }

      return null;
    })
    .filter(Boolean);
}

export function calcTeacherPayTotalWithHourPrice(bookings, hourPrices) {
  if (!bookings?.length) {
    return 0;
  }

  const assignedRate = parseFloat(hourPrices?.assigned);
  const referredRate = parseFloat(hourPrices?.referred);

  return collectUniqueEvents(bookings).reduce((total, item) => {
    const rate = item.isReferred ? referredRate : assignedRate;
    if (!rate || rate <= 0) {
      return total;
    }
    return total + item.hours * rate;
  }, 0);
}

/** Pay each booking with rates for that booking's teacher.level. */
export function calcBookingPayWithLevelPrices(booking, levelPrices) {
  const key = getTeacherLevelPriceKey(booking?.teacher?.level);
  if (!key || !levelPrices?.[key]) {
    return 0;
  }
  return calcBookingPayWithHourPrice(booking, levelPrices[key]);
}

export function calcTeacherPayTotalWithLevelPrices(bookings, levelPrices) {
  if (!bookings?.length) {
    return 0;
  }

  return bookings.reduce(
    (total, booking) => total + calcBookingPayWithLevelPrices(booking, levelPrices),
    0
  );
}

/** Sum member pending payout from hours-by-level rows and editable level rates. */
export function calcPendingMemberPayoutFromHoursByLevel(rows, levelPrices) {
  return (rows || []).reduce((total, row) => {
    const level = Number(row?.level);
    if (!Number.isFinite(level)) {
      return total;
    }
    const levelKey = level >= 3 ? '3+' : String(level);
    const prices = levelPrices?.[levelKey];
    if (!prices) {
      return total;
    }
    const assignedRate = parseFloat(prices.assigned) || 0;
    const referredRate = parseFloat(prices.referred) || 0;
    return (
      total +
      (row.assignedHours || 0) * assignedRate +
      (row.requiredHours || 0) * referredRate
    );
  }, 0);
}

export function hasHourPricesConfigured(hourPrices) {
  const assigned = parseFloat(hourPrices?.assigned);
  const referred = parseFloat(hourPrices?.referred);
  return (assigned > 0) || (referred > 0);
}

export function calcBookingTeacherPay(booking) {
  if (!booking?.teacher?.level || !booking?.eventList?.length) {
    return 0;
  }

  const hourlyRate = getHourlyRate(booking.teacher.level, booking.type);
  const teacherHours = booking.eventList.reduce(
    (hours, event) => hours + calcEventHours(event),
    0
  );

  return teacherHours * hourlyRate;
}

export function calcTeacherPayTotal(bookings) {
  if (!bookings?.length) {
    return 0;
  }

  return bookings.reduce((total, booking) => total + calcBookingTeacherPay(booking), 0);
}
