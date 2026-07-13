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
  return (
    title === 'blocked' ||
    eventType === 'BLOCK' ||
    eventType === 'BLOCKED' ||
    description.includes('bloqueado')
  );
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
