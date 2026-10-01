import axios from './axios';
import { ADMIN_BOOKING_RESORT_FILTER_OPTIONS } from './adminBookingResortOptions';
import { inferLessonTimeFromEvent } from './adminBookingEvents';
import { isBlockedEvent } from './calendarEventStats';
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

function amountToArs(amount, currency, usdToArsRate) {
  const rate = Number(usdToArsRate) > 0 ? Number(usdToArsRate) : DEFAULT_USD_TO_ARS_RATE;
  return currency === 'USD' ? amount * rate : amount;
}

function getTeacherGananciasKey(teacher) {
  return teacher?.id != null ? String(teacher.id) : 'unassigned';
}

function getTeacherGananciasName(teacher, unassignedLabel) {
  if (!teacher) return unassignedLabel;
  const fullName = `${teacher.name || ''} ${teacher.lastname || ''}`.trim();
  return fullName || unassignedLabel;
}

function emptyTeacherGananciasBucket(teacherKey, teacher, teacherName) {
  return {
    teacherKey,
    teacher,
    teacherName,
    dayGrossByCurrency: {},
    dayTeacherByCurrency: {},
    payinParts: [],
    lessonCount: 0,
  };
}

/**
 * Per-teacher day-share payin / payout / lesson count from today's bookings.
 * Gross earnings = payin − payout (no tax). Lesson count only counts lesson bookings.
 */
export function calcAdminTodayGananciasByTeacher(
  lessonBookings,
  gearBookings,
  { unassignedLabel = '—' } = {}
) {
  const levelPrices = buildDefaultLevelHourPrices();
  const byTeacherMap = new Map();

  const ensureTeacher = (teacher) => {
    const teacherKey = getTeacherGananciasKey(teacher);
    if (!byTeacherMap.has(teacherKey)) {
      byTeacherMap.set(
        teacherKey,
        emptyTeacherGananciasBucket(
          teacherKey,
          teacher || null,
          getTeacherGananciasName(teacher, unassignedLabel)
        )
      );
    }
    return byTeacherMap.get(teacherKey);
  };

  const addBooking = (booking, isLesson) => {
    const group = ensureTeacher(booking?.teacher);
    const days = getBookingDayCount(booking);
    const dayGross = (booking?.price || 0) / days;
    const priceCurrency = getBookingCurrency(booking);

    group.dayGrossByCurrency[priceCurrency] =
      (group.dayGrossByCurrency[priceCurrency] || 0) + dayGross;
    if (dayGross !== 0) {
      group.payinParts.push({ amount: dayGross, currency: priceCurrency });
    }

    const teacherShare = getBookingDayTeacherShare(booking, levelPrices);
    group.dayTeacherByCurrency[teacherShare.currency] =
      (group.dayTeacherByCurrency[teacherShare.currency] || 0) + teacherShare.amount;

    if (isLesson) {
      group.lessonCount += 1;
    }
  };

  (lessonBookings ?? []).forEach((booking) => addBooking(booking, true));
  (gearBookings ?? []).forEach((booking) => addBooking(booking, false));

  const byTeacher = [...byTeacherMap.values()]
    .filter(
      (row) =>
        row.lessonCount > 0 ||
        Object.values(row.dayGrossByCurrency).some((v) => v !== 0) ||
        Object.values(row.dayTeacherByCurrency).some((v) => v !== 0)
    )
    .sort((a, b) => {
      if (a.teacherKey === 'unassigned') return 1;
      if (b.teacherKey === 'unassigned') return -1;
      return a.teacherName.localeCompare(b.teacherName, undefined, { sensitivity: 'base' });
    });

  return { byTeacher };
}

/** Consolidate per-teacher raw currency buckets into ARS payin / payout / earnings. */
export function consolidateTeacherGananciasInArs(byTeacher, usdToArsRate = DEFAULT_USD_TO_ARS_RATE) {
  const rate = Number(usdToArsRate) > 0 ? Number(usdToArsRate) : DEFAULT_USD_TO_ARS_RATE;

  const rows = (byTeacher || []).map((row) => {
    let payin = 0;
    let payout = 0;

    Object.entries(row.dayGrossByCurrency || {}).forEach(([currency, amount]) => {
      payin += amountToArs(amount, currency, rate);
    });
    Object.entries(row.dayTeacherByCurrency || {}).forEach(([currency, amount]) => {
      payout += amountToArs(amount, currency, rate);
    });

    const payinPartsArs = (row.payinParts || []).map((part) =>
      amountToArs(part.amount, part.currency, rate)
    );

    return {
      teacherKey: row.teacherKey,
      teacherName: row.teacherName,
      lessonCount: row.lessonCount || 0,
      payin,
      payout,
      earnings: payin - payout,
      payinPartsArs: payinPartsArs.length > 1 ? payinPartsArs : null,
    };
  });

  const totals = rows.reduce(
    (acc, row) => {
      acc.payin += row.payin;
      acc.payout += row.payout;
      acc.earnings += row.earnings;
      acc.lessonCount += row.lessonCount;
      return acc;
    },
    { payin: 0, payout: 0, earnings: 0, lessonCount: 0 }
  );

  const maxEarnings = rows.reduce((max, row) => Math.max(max, row.earnings), 0);

  return { byTeacher: rows, totals, maxEarnings };
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
        phone: existing.phone ?? teacher.phone,
        phoneNumber: existing.phoneNumber ?? teacher.phoneNumber,
        mobile: existing.mobile ?? teacher.mobile,
        mobilePhone: existing.mobilePhone ?? teacher.mobilePhone,
        telephone: existing.telephone ?? teacher.telephone,
        whatsapp: existing.whatsapp ?? teacher.whatsapp,
        whatsappNumber: existing.whatsappNumber ?? teacher.whatsappNumber,
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
      phone: teacher.phone,
      phoneNumber: teacher.phoneNumber,
      mobile: teacher.mobile,
      mobilePhone: teacher.mobilePhone,
      telephone: teacher.telephone,
      whatsapp: teacher.whatsapp,
      whatsappNumber: teacher.whatsappNumber,
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

function localDateKey(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${padDayMonth(date.getMonth() + 1)}-${padDayMonth(date.getDate())}`;
}

/**
 * Match the calendar slice wall-clock adjustment so UTC-stored local times
 * (e.g. midnight Z for an all-day block) land on the intended calendar day.
 */
function calendarWallDateKey(value) {
  if (!value) return null;
  const dateStart = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateStart.getTime())) return null;
  const adjusted = new Date(dateStart.getTime() + dateStart.getTimezoneOffset() * 60000);
  return localDateKey(adjusted);
}

function eventMatchesDay(event, dayKey) {
  if (!dayKey) return false;
  const rawKey = localDateKey(event?.start);
  if (rawKey === dayKey) return true;
  return calendarWallDateKey(event?.start) === dayKey;
}

function normalizeEventsListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function mapLessonTimeToBlockedWindow(lessonTime) {
  if (lessonTime === 'ALL_DAY') return 'ALL_DAY';
  if (lessonTime === 'MORNING' || lessonTime === 'MORNING_2_HS') return 'MORNING';
  if (lessonTime === 'AFTERNOON' || lessonTime === 'AFTERNOON_2_HS') return 'AFTERNOON';
  return null;
}

function adjustEventForCalendarDisplay(event) {
  if (!event?.start) return event;
  const dateStart = new Date(event.start);
  const dateEnd = new Date(event.end || event.start);
  if (Number.isNaN(dateStart.getTime()) || Number.isNaN(dateEnd.getTime())) return event;
  const utcOffset = dateStart.getTimezoneOffset() * 60000;
  return {
    ...event,
    start: new Date(dateStart.getTime() + utcOffset),
    end: new Date(dateEnd.getTime() + utcOffset),
  };
}

/**
 * Fetch a member's calendar events for a month (same API the today chips use).
 */
export async function fetchMemberEventsForMonth(memberId, targetDate = new Date()) {
  if (memberId == null) return [];

  const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
  if (Number.isNaN(date.getTime())) return [];

  const month = date.getMonth() + 1;
  const response = await axios.get(
    `/api/events/byUser/${memberId}?page=1&size=300&month=${month}`
  );
  return normalizeEventsListResponse(response.data)
    .filter((event) => {
      const eventType = String(event?.eventType || '').toUpperCase();
      if (eventType === 'DOFF' && !isBlockedEvent(event)) return false;
      return true;
    })
    .map(adjustEventForCalendarDisplay);
}

/**
 * Fetch a member's calendar events for a single calendar day (month-scoped API + local filter).
 */
export async function fetchMemberEventsForDay(memberId, targetDate = new Date()) {
  if (memberId == null) return [];

  const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
  if (Number.isNaN(date.getTime())) return [];

  const month = date.getMonth() + 1;
  const dayKey = localDateKey(date);
  const response = await axios.get(
    `/api/events/byUser/${memberId}?page=1&size=300&month=${month}`
  );
  const events = normalizeEventsListResponse(response.data);

  const filtered = events.filter((event) => {
    const eventType = String(event?.eventType || '').toUpperCase();
    // Instructor blocks/days-off are stored as DOFF + title "Blocked".
    // Only skip non-block DOFF noise; keep blocked DOFF for day chips.
    if (eventType === 'DOFF' && !isBlockedEvent(event)) return false;
    return eventMatchesDay(event, dayKey);
  });

  return filtered;
}

/**
 * From a day's events, return stable blocked windows:
 * ['ALL_DAY'] | ['MORNING'] | ['AFTERNOON'] | ['MORNING','AFTERNOON']
 */
export function getBlockedWindowsForDay(events) {
  const windows = new Set();

  (events ?? []).forEach((event) => {
    if (!isBlockedEvent(event)) return;
    const window = mapLessonTimeToBlockedWindow(inferLessonTimeFromEvent(event));
    if (window) windows.add(window);
  });

  if (windows.has('ALL_DAY')) {
    return ['ALL_DAY'];
  }

  const result = [];
  if (windows.has('MORNING')) result.push('MORNING');
  if (windows.has('AFTERNOON')) result.push('AFTERNOON');
  return result;
}

export function formatBlockedWindowLabel(window, t) {
  if (window === 'ALL_DAY') return t('adminToday.blockedAllDay');
  if (window === 'MORNING') return t('adminToday.blockedMorning');
  if (window === 'AFTERNOON') return t('adminToday.blockedAfternoon');
  return null;
}

/**
 * Build chip labels for every event on the day (blocks + classes + other).
 */
export function getDayEventChips(events, t) {
  return (events ?? []).map((event, index) => {
    const id = event?.id != null ? event.id : `${event?.start || 'x'}-${index}`;
    const blocked = isBlockedEvent(event);
    const window = mapLessonTimeToBlockedWindow(inferLessonTimeFromEvent(event));

    if (blocked) {
      return {
        key: `block-${id}`,
        label: formatBlockedWindowLabel(window, t) || t('adminToday.blockedAllDay'),
        color: 'warning',
        isBlocked: true,
        eventId: event?.id,
        title: event?.title,
        eventType: event?.eventType,
      };
    }

    const title =
      String(event?.title || '').trim() ||
      String(event?.eventType || '').trim() ||
      t('adminToday.dayEventFallback');
    let label = title;
    if (window === 'MORNING') label = `${title} · ${t('adminToday.timeWindowMorning')}`;
    else if (window === 'AFTERNOON') label = `${title} · ${t('adminToday.timeWindowAfternoon')}`;
    else if (window === 'ALL_DAY') label = `${title} · ${t('adminToday.timeWindowAllDay')}`;

    return {
      key: `event-${id}`,
      label,
      color: 'default',
      isBlocked: false,
      eventId: event?.id,
      title: event?.title,
      eventType: event?.eventType,
    };
  });
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
