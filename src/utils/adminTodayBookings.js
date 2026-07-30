import axios from './axios';
import { ADMIN_BOOKING_RESORT_FILTER_OPTIONS } from './adminBookingResortOptions';
import { buildDefaultLevelHourPrices } from './teacherHourPricePresets';
import { calcBookingPayWithLevelPrices } from './teacherPayoutAmount';

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

function getBookingDayCount(booking) {
  const days = booking?.eventList?.length;
  return days > 0 ? days : 1;
}

function getBookingCurrency(booking) {
  return booking?.currency || 'ARS';
}

function getSuggestedTeacherPayoutCurrency(booking) {
  const currency = (booking?.suggestedTeacherPayoutCurrency || 'ARS').toUpperCase();
  return currency === 'USD' ? 'USD' : 'ARS';
}

function getBookingDayTeacherShare(booking, levelPrices) {
  const days = getBookingDayCount(booking);
  const suggested = booking?.suggestedTeacherPayoutAmount;
  if (suggested != null && suggested !== '' && !Number.isNaN(Number(suggested))) {
    return {
      amount: Number(suggested) / days,
      currency: getSuggestedTeacherPayoutCurrency(booking),
    };
  }
  return {
    amount: calcBookingPayWithLevelPrices(booking, levelPrices) / days,
    currency: 'ARS',
  };
}

function emptyGananciasBucket() {
  return { dayGross: 0, dayTeacher: 0 };
}

function sortGananciasCurrencies(a, b) {
  if (a.currency === 'ARS') return -1;
  if (b.currency === 'ARS') return 1;
  return a.currency.localeCompare(b.currency);
}

/** Day-share revenue net of 30% tax and teacher pay, split by currency. */
export function calcAdminTodayGanancias(lessonBookings, gearBookings) {
  const bookings = [...(lessonBookings ?? []), ...(gearBookings ?? [])];
  const levelPrices = buildDefaultLevelHourPrices();
  const byCurrencyMap = new Map();

  const ensureBucket = (currency) => {
    const key = currency || 'ARS';
    if (!byCurrencyMap.has(key)) {
      byCurrencyMap.set(key, emptyGananciasBucket());
    }
    return byCurrencyMap.get(key);
  };

  bookings.forEach((booking) => {
    const days = getBookingDayCount(booking);
    const priceCurrency = getBookingCurrency(booking);
    const priceBucket = ensureBucket(priceCurrency);
    priceBucket.dayGross += (booking?.price || 0) / days;

    const teacherShare = getBookingDayTeacherShare(booking, levelPrices);
    const teacherBucket = ensureBucket(teacherShare.currency);
    teacherBucket.dayTeacher += teacherShare.amount;
  });

  const byCurrency = [...byCurrencyMap.entries()]
    .map(([currency, bucket]) => {
      const dayTax = bucket.dayGross * 0.3;
      const net = bucket.dayGross * 0.7 - bucket.dayTeacher;
      return {
        currency,
        dayGross: bucket.dayGross,
        dayTax,
        dayTeacher: bucket.dayTeacher,
        net,
      };
    })
    .filter((row) => row.dayGross !== 0 || row.dayTeacher !== 0 || row.net !== 0)
    .sort(sortGananciasCurrencies);

  return { byCurrency };
}

const DEFAULT_USD_TO_ARS_RATE = 1550;

/** Merge all currency rows into a single ARS total using the USD exchange rate. */
export function consolidateGananciasInArs(byCurrency, usdToArsRate = DEFAULT_USD_TO_ARS_RATE) {
  const rate = Number(usdToArsRate) > 0 ? Number(usdToArsRate) : DEFAULT_USD_TO_ARS_RATE;

  let dayGross = 0;
  let dayTeacher = 0;

  (byCurrency || []).forEach((row) => {
    const multiplier = row.currency === 'USD' ? rate : 1;
    dayGross += row.dayGross * multiplier;
    dayTeacher += row.dayTeacher * multiplier;
  });

  const dayTax = dayGross * 0.3;
  const net = dayGross * 0.7 - dayTeacher;

  return {
    currency: 'ARS',
    dayGross,
    dayTax,
    dayTeacher,
    net,
  };
}

export { DEFAULT_USD_TO_ARS_RATE };

export function getBusyTeacherIds(lessonBookings) {
  const busyIds = new Set();
  (lessonBookings ?? []).forEach((booking) => {
    const teacherId = booking?.teacher?.id;
    if (teacherId != null) busyIds.add(String(teacherId));
  });
  return busyIds;
}

function getMemberDisplayName(member) {
  return `${member?.name || ''} ${member?.lastname || member?.lastName || ''}`.trim();
}

export function filterAvailableSchoolMembers(members, lessonBookings) {
  const busyIds = getBusyTeacherIds(lessonBookings);
  return (members ?? [])
    .filter((member) => member?.id != null && !busyIds.has(String(member.id)))
    .slice()
    .sort((a, b) =>
      getMemberDisplayName(a).localeCompare(getMemberDisplayName(b), undefined, { sensitivity: 'base' })
    );
}

function formatDateParam(targetDate) {
  const y = targetDate.getFullYear();
  const m = padDayMonth(targetDate.getMonth() + 1);
  const d = padDayMonth(targetDate.getDate());
  return `${y}-${m}-${d}`;
}

function normalizeAdminTeacherAvailabilityListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function fetchTeachersAvailableOnDay(targetDate = new Date()) {
  const dateParam = formatDateParam(targetDate);
  const response = await axios.get(
    `/api/admin/teacher-availability?date=${encodeURIComponent(dateParam)}`
  );
  return normalizeAdminTeacherAvailabilityListResponse(response.data);
}

export function mergeAvailableTeachers(schoolAvailableMembers, dayAvailableTeachers) {
  const byId = new Map();

  (schoolAvailableMembers ?? []).forEach((member) => {
    if (member?.id == null) return;
    byId.set(String(member.id), {
      ...member,
      sources: ['school'],
    });
  });

  (dayAvailableTeachers ?? []).forEach((teacher) => {
    if (teacher?.id == null) return;
    const id = String(teacher.id);
    const existing = byId.get(id);
    if (existing) {
      byId.set(id, {
        ...existing,
        sources: [...new Set([...(existing.sources ?? []), 'day'])],
        timeWindow: teacher.timeWindow ?? existing.timeWindow,
        startTime: teacher.startTime ?? existing.startTime,
        endTime: teacher.endTime ?? existing.endTime,
        cellphone: existing.cellphone ?? teacher.cellphone,
        countryCode: existing.countryCode ?? teacher.countryCode,
        sports: existing.sports ?? teacher.sports,
        languages: existing.languages ?? teacher.languages ?? teacher.speaks,
      });
      return;
    }
    byId.set(id, {
      id: teacher.id,
      name: teacher.name,
      lastname: teacher.lastname,
      lastName: teacher.lastname,
      level: teacher.level,
      imageLink: teacher.imageLink,
      email: teacher.email,
      cellphone: teacher.cellphone,
      countryCode: teacher.countryCode,
      role: teacher.role,
      sports: teacher.sports,
      languages: teacher.languages ?? teacher.speaks,
      sources: ['day'],
      timeWindow: teacher.timeWindow,
      startTime: teacher.startTime,
      endTime: teacher.endTime,
    });
  });

  // School members first so admins can spot them quickly; then alphabetical within each group
  return Array.from(byId.values()).sort((a, b) => {
    const aIsSchool = a.sources?.includes('school') ? 0 : 1;
    const bIsSchool = b.sources?.includes('school') ? 0 : 1;
    if (aIsSchool !== bIsSchool) return aIsSchool - bIsSchool;
    return getMemberDisplayName(a).localeCompare(getMemberDisplayName(b), undefined, {
      sensitivity: 'base',
    });
  });
}

export function formatAvailabilityWindowLabel(entry, t) {
  const timeWindow = entry?.timeWindow;
  if (timeWindow === 'ALL_DAY') return t('adminToday.timeWindowAllDay');
  if (timeWindow === 'MORNING') return t('adminToday.timeWindowMorning');
  if (timeWindow === 'AFTERNOON') return t('adminToday.timeWindowAfternoon');
  if (timeWindow === 'CUSTOM' && entry?.startTime && entry?.endTime) {
    return `${entry.startTime}–${entry.endTime}`;
  }
  return t('adminToday.sourceAvailable');
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
