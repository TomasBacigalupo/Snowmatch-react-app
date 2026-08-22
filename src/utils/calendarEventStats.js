// Stats helpers for a teacher's calendar events.
// Hours use the same normalization as the admin BookingSummary so numbers
// reconcile with the /bookings stats: a 4h block counts as 3h, and any single
// event is capped at 6h.

// A "blocked" event is an availability block the instructor set (not a real
// class/booking). It is excluded from the KPI counts. Match defensively across
// the shapes the backend/mapper can produce.
export const isBlockedEvent = (event) => {
  if (!event) return false;
  const title = String(event.title ?? '').trim().toLowerCase();
  const description = String(event.description ?? '').toLowerCase();
  const eventType = String(event.eventType ?? '').toUpperCase();
  const textColor = String(event.textColor ?? '').trim().toUpperCase();
  const isRedBlockColor = textColor === '#FF0000' || textColor === '#F44336';
  const isLessonType =
    eventType === 'CLASS' || eventType === 'REFERRED' || eventType === 'APP' || eventType === 'PRODUCT';

  return (
    title === 'blocked' ||
    title.includes('block') ||
    title.includes('bloquead') ||
    eventType === 'BLOCK' ||
    eventType === 'BLOCKED' ||
    description.includes('bloqueado') ||
    // Calendar UI treats solid red (no lesson type) as instructor blocks
    (isRedBlockColor && !isLessonType)
  );
};

const normalizeDateTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString();
};

/** Stable key so the same shared event on multiple bookings is counted once. */
export const getEventKey = (event) => {
  const start = normalizeDateTime(event?.start);
  const end = normalizeDateTime(event?.end);
  if (start && end) {
    return `range:${start}|${end}`;
  }
  if (event?.id != null) {
    return `id:${event.id}`;
  }
  return null;
};

export const getUniqueEventCount = (events) => {
  if (!events?.length) return 0;
  const ids = new Set();
  let withoutId = 0;
  events.forEach((event) => {
    if (event?.id != null) {
      ids.add(String(event.id));
    } else {
      withoutId += 1;
    }
  });
  return ids.size + withoutId;
};

export const getEventHours = (event) => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const hours = (end - start) / (1000 * 60 * 60);
  if (!Number.isFinite(hours) || hours <= 0) return 0;
  if (hours === 4) return 3;
  return Math.min(hours, 6);
};

export const getTotalEventHours = (events) => {
  if (!events?.length) return 0;
  return events.reduce((total, event) => total + getEventHours(event), 0);
};

/**
 * Sum hours across bookings counting each shared event once.
 * Skips blocked events. Optional filters: bookingType, eventType.
 */
export const getUniqueHoursFromBookings = (bookings, { bookingType, eventType } = {}) => {
  if (!bookings?.length) return 0;

  const seen = new Set();
  let total = 0;

  bookings.forEach((booking) => {
    if (bookingType && booking?.type !== bookingType) return;

    (booking?.eventList || []).forEach((event) => {
      if (isBlockedEvent(event)) return;
      if (eventType && event?.eventType !== eventType) return;

      const hours = getEventHours(event);
      if (!hours) return;

      const key = getEventKey(event);
      if (!key) {
        total += hours;
        return;
      }
      if (seen.has(key)) return;
      seen.add(key);
      total += hours;
    });
  });

  return total;
};
