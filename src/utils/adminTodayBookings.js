import axios from './axios';
import { ADMIN_BOOKING_RESORT_FILTER_OPTIONS } from './adminBookingResortOptions';

const CERRO_CATEDRAL_VALUE = 'CERRO_CATEDRAL';
const CERRO_CATEDRAL_LABEL =
  ADMIN_BOOKING_RESORT_FILTER_OPTIONS.find((o) => o.value === CERRO_CATEDRAL_VALUE)?.label ?? 'Cerro Catedral';

export function matchesCerroCatedral(resort) {
  return resort === CERRO_CATEDRAL_VALUE || resort === CERRO_CATEDRAL_LABEL;
}

export function isSameCalendarDay(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function bookingHappensOnDate(booking, targetDate) {
  if (!Array.isArray(booking?.eventList) || !booking.eventList.length) return false;

  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  return booking.eventList.some((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    if (isSameCalendarDay(start, targetDate)) return true;
    return start <= dayEnd && end >= dayStart;
  });
}

export function normalizeAdminBookingListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function getBookingResort(booking) {
  return (
    booking?.resort ??
    booking?.student?.resortsEnum?.[0] ??
    booking?.student?.resorts?.[0] ??
    null
  );
}

export function filterTodayCerroCatedralBookings(
  bookings,
  targetDate = new Date(),
  { skipEventDateCheck = false } = {}
) {
  return normalizeAdminBookingListResponse(bookings).filter((booking) => {
    if (!matchesCerroCatedral(getBookingResort(booking))) return false;
    if (skipEventDateCheck) return true;
    return bookingHappensOnDate(booking, targetDate);
  });
}

export async function fetchAdminBookingsForToday(bookingKind, targetDate = new Date()) {
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = targetDate.getDate();
  const year = targetDate.getFullYear();

  const params = new URLSearchParams();
  params.append('page', '0');
  params.append('size', '500');
  params.append('month', month);
  params.append('day', String(day));
  params.append('year', String(year));
  params.append('bookingKind', bookingKind);

  const response = await axios.get(`/api/admin/bookings/filter?${params.toString()}`);
  const bookings = normalizeAdminBookingListResponse(response.data);

  // Gear / GEAR_ONLY bookings often have an empty eventList. Trust the API date/kind filter
  // (same as /admin/bookings/equipos) instead of re-filtering client-side.
  if (bookingKind === 'gear') {
    return bookings;
  }

  return filterTodayCerroCatedralBookings(bookings, targetDate);
}

export function getIntentResort(intent) {
  return intent?.resort ?? intent?.groupLessonResort ?? null;
}

export function bookingIntentHappensOnDate(intent, targetDate) {
  if (!Array.isArray(intent?.lines) || !intent.lines.length) return false;

  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);

  return intent.lines.some((line) => {
    const start = new Date(line.startAt);
    const end = new Date(line.endAt || line.startAt);
    if (isSameCalendarDay(start, targetDate)) return true;
    return start <= dayEnd && end >= dayStart;
  });
}

export function filterTodayCerroCatedralBookingIntents(
  intents,
  targetDate = new Date()
) {
  return normalizeAdminBookingListResponse(intents).filter((intent) => {
    if (intent.state && intent.state !== 'OPEN') return false;
    if (!matchesCerroCatedral(getIntentResort(intent))) return false;
    return bookingIntentHappensOnDate(intent, targetDate);
  });
}

export async function fetchAdminBookingIntentsForToday(targetDate = new Date()) {
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  const params = new URLSearchParams();
  params.append('page', '0');
  params.append('size', '500');
  params.append('state', 'OPEN');
  params.append('month', String(month));
  params.append('year', String(year));
  params.append('resort', CERRO_CATEDRAL_VALUE);

  const response = await axios.get(`/api/admin/booking-intents/filter?${params.toString()}`);
  return filterTodayCerroCatedralBookingIntents(response.data, targetDate);
}

export function countTodayParticipants(lessonBookings, gearBookings) {
  const lessonParticipants = (lessonBookings ?? []).reduce(
    (sum, row) => sum + (row.adults ?? 0) + (row.children ?? 0),
    0
  );
  const gearParticipants = (gearBookings ?? []).length;
  return lessonParticipants + gearParticipants;
}

function padDayMonth(value) {
  return String(value).padStart(2, '0');
}

export function formatCompactBookingDateRange(eventList) {
  if (!eventList?.length) return '-';

  const dates = eventList.map((event) => new Date(event.end));
  const start = new Date(Math.min(...dates));
  const end = new Date(Math.max(...dates));

  const startDay = padDayMonth(start.getDate());
  const startMonth = padDayMonth(start.getMonth() + 1);
  const endDay = padDayMonth(end.getDate());
  const endMonth = padDayMonth(end.getMonth() + 1);

  if (isSameCalendarDay(start, end)) {
    return `${startDay}/${startMonth}`;
  }

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${startDay}-${endDay} ${startMonth}`;
  }

  return `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
}
