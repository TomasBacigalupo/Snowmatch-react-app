function calcEventHours(event) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const eventHours = (end - start) / (1000 * 60 * 60);
  if (eventHours === 4) {
    return 3;
  }
  return Math.min(eventHours, 6);
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
