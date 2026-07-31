const LESSON_SLOTS = {
  ALL_DAY: { start: [9, 0], end: [17, 0], allDay: true },
  MORNING: { start: [9, 0], end: [13, 0], allDay: false },
  MORNING_2_HS: { start: [10, 0], end: [12, 0], allDay: false },
  AFTERNOON: { start: [13, 0], end: [17, 0], allDay: false },
  AFTERNOON_2_HS: { start: [14, 0], end: [16, 0], allDay: false },
};

const CLOCK_SLOT_MATCHES = [
  { lessonTime: 'ALL_DAY', start: [9, 0], end: [17, 0] },
  { lessonTime: 'ALL_DAY', start: [10, 0], end: [17, 0] },
  { lessonTime: 'MORNING', start: [9, 0], end: [13, 0] },
  { lessonTime: 'MORNING', start: [10, 0], end: [13, 0] },
  { lessonTime: 'MORNING_2_HS', start: [10, 0], end: [12, 0] },
  { lessonTime: 'AFTERNOON', start: [13, 0], end: [17, 0] },
  { lessonTime: 'AFTERNOON', start: [14, 0], end: [17, 0] },
  { lessonTime: 'AFTERNOON_2_HS', start: [14, 0], end: [16, 0] },
];

export const LESSON_TIME_VALUES = ['MORNING', 'MORNING_2_HS', 'AFTERNOON', 'AFTERNOON_2_HS', 'ALL_DAY'];

export function normalizeLessonTime(lessonTime, fallback = 'ALL_DAY') {
  if (!lessonTime) return fallback;

  const value = String(lessonTime).toUpperCase();
  if (value === 'MORNING_2HS' || value === 'MORNING_2_HS') return 'MORNING_2_HS';
  if (value === 'AFTERNOON_2HS' || value === 'AFTERNOON_2_HS') return 'AFTERNOON_2_HS';
  if (value === 'FULL_DAY' || value === 'ALL_DAY') return 'ALL_DAY';
  if (LESSON_TIME_VALUES.includes(value)) return value;

  return fallback;
}

function formatLocalDateTime(dateStr, hour, minute = 0) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const pad = (value) => String(value).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

function parseWallClockTime(value) {
  if (!value) return null;

  const str = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  // UTC / offset datetimes: interpret in the user's local timezone.
  if (/Z$|[+-]\d{2}:\d{2}$/.test(str)) {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }

  const timeMatch = str.match(/T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (timeMatch) {
    return {
      hour: parseInt(timeMatch[1], 10),
      minute: parseInt(timeMatch[2], 10),
    };
  }

  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}

function timesMatch(left, right) {
  return left.hour === right[0] && left.minute === right[1];
}

function inferLessonTimeFromClock(start, end) {
  for (const slot of CLOCK_SLOT_MATCHES) {
    if (timesMatch(start, slot.start) && timesMatch(end, slot.end)) {
      return slot.lessonTime;
    }
  }

  const durationMinutes = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute);
  if (durationMinutes <= 0) return null;

  const durationHours = durationMinutes / 60;

  if (durationHours <= 2.5) {
    return start.hour < 12 ? 'MORNING_2_HS' : 'AFTERNOON_2_HS';
  }
  if (durationHours <= 4.5) {
    return start.hour < 12 ? 'MORNING' : 'AFTERNOON';
  }
  if (durationHours >= 6) {
    return 'ALL_DAY';
  }

  return null;
}

export function inferLessonTimeFromEvent(event) {
  const fromLessonTime = normalizeLessonTime(event?.lessonTime, null);
  if (fromLessonTime) return fromLessonTime;

  const start = parseWallClockTime(event?.start);
  const end = parseWallClockTime(event?.end);

  if (start && end) {
    const fromClock = inferLessonTimeFromClock(start, end);
    if (fromClock) return fromClock;
  }

  if (event?.allDay) return 'ALL_DAY';

  return 'ALL_DAY';
}

export function buildStartEndFromDateAndLessonTime(date, lessonTime) {
  const normalized = normalizeLessonTime(lessonTime);
  const slot = LESSON_SLOTS[normalized] || LESSON_SLOTS.ALL_DAY;

  return {
    start: formatLocalDateTime(date, slot.start[0], slot.start[1]),
    end: formatLocalDateTime(date, slot.end[0], slot.end[1]),
    allDay: slot.allDay,
    lessonTime: normalized,
  };
}

/** Teacher billable hours from a lesson slot (4h calendar block → 3h). */
export function calcTeacherHoursFromLessonTime(lessonTime, fallback = 'ALL_DAY') {
  const normalized = normalizeLessonTime(lessonTime, fallback);
  const slot = LESSON_SLOTS[normalized] || LESSON_SLOTS.ALL_DAY;
  const startMinutes = slot.start[0] * 60 + slot.start[1];
  const endMinutes = slot.end[0] * 60 + slot.end[1];
  const eventHours = (endMinutes - startMinutes) / 60;

  if (Math.abs(eventHours - 4) < 0.01) {
    return 3;
  }
  return Math.min(eventHours, 6);
}

/** Sum teacher hours from edit-modal date/time rows. */
export function calcTeacherHoursFromDateTimes(dateTimes) {
  return (dateTimes || [])
    .filter((row) => row?.date)
    .reduce((total, row) => total + calcTeacherHoursFromLessonTime(row.time), 0);
}

export function createEmptyDateTimeRow() {
  return { id: null, date: '', time: 'ALL_DAY', price: '' };
}

export function eventListToDateTimes(eventList) {
  if (!eventList?.length) {
    return [createEmptyDateTimeRow()];
  }

  return eventList.map((event) => ({
    id: event.id ?? null,
    date: String(event.start || '').slice(0, 10),
    time: inferLessonTimeFromEvent(event),
    price: event.price ?? '',
  }));
}

function getOriginalEvent(dateTime, index, originalEventList, originalById) {
  if (dateTime.id) return originalById.get(dateTime.id);
  return originalEventList[index];
}

function formatBackendDateTime(dateStr) {
  // yyyy-MM-dd — JavaTimeModule parses date-only LocalDateTime at midnight.
  return dateStr;
}

/** Payload for PUT admin bookings / booking-intents — local date + lessonTime (same as create). */
export function buildEventListForBookingPut(dateTimes, bookingType = 'ASSIGNED', originalEventList = []) {
  const originalById = new Map(
    (originalEventList || []).filter((event) => event?.id).map((event) => [event.id, event])
  );

  return (dateTimes || [])
    .filter((dateTime) => dateTime.date)
    .map((dateTime, index) => {
      const original = getOriginalEvent(dateTime, index, originalEventList, originalById);
      const lessonTime = normalizeLessonTime(dateTime.time);
      const start = formatBackendDateTime(dateTime.date);

      return {
        ...(dateTime.id ? { id: dateTime.id } : {}),
        title: original?.title || (bookingType === 'REFERRED' ? 'Referida' : 'Asignada'),
        start,
        end: start,
        lessonTime,
        price:
          dateTime.price !== '' && dateTime.price != null ? dateTime.price : original?.price,
        eventType: bookingType === 'REFERRED' ? 'REFERRED' : 'CLASS',
        textColor:
          original?.textColor || (bookingType === 'REFERRED' ? '#00FF00' : '#FF0000'),
      };
    });
}

export function buildEventScheduleUpdates(dateTimes) {
  return (dateTimes || [])
    .filter((dateTime) => dateTime.date && dateTime.id)
    .map((dateTime) => ({
      id: dateTime.id,
      ...buildStartEndFromDateAndLessonTime(dateTime.date, dateTime.time),
    }));
}
