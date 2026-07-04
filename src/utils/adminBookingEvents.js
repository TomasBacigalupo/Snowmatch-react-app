const LESSON_SLOTS = {
  ALL_DAY: { start: [9, 0], end: [17, 0], allDay: true },
  MORNING: { start: [9, 0], end: [13, 0], allDay: false },
  MORNING_2_HS: { start: [10, 0], end: [12, 0], allDay: false },
  AFTERNOON: { start: [13, 0], end: [17, 0], allDay: false },
  AFTERNOON_2_HS: { start: [14, 0], end: [16, 0], allDay: false },
};

export const LESSON_TIME_VALUES = ['MORNING', 'MORNING_2_HS', 'AFTERNOON', 'AFTERNOON_2_HS', 'ALL_DAY'];

export function normalizeLessonTime(lessonTime) {
  if (!lessonTime) return 'ALL_DAY';
  if (lessonTime === 'MORNING_2HS') return 'MORNING_2_HS';
  if (lessonTime === 'AFTERNOON_2HS') return 'AFTERNOON_2_HS';
  return lessonTime;
}

function formatLocalDateTime(dateStr, hour, minute = 0) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const pad = (value) => String(value).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

export function inferLessonTimeFromEvent(event) {
  if (event?.lessonTime) return normalizeLessonTime(event.lessonTime);
  if (event?.allDay) return 'ALL_DAY';

  const start = new Date(event?.start);
  const end = new Date(event?.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'ALL_DAY';

  const sh = start.getHours();
  const sm = start.getMinutes();
  const eh = end.getHours();
  const em = end.getMinutes();

  if (sh === 9 && sm === 0 && eh === 17 && em === 0) return 'ALL_DAY';
  if (sh === 9 && sm === 0 && eh === 13 && em === 0) return 'MORNING';
  if (sh === 10 && sm === 0 && eh === 12 && em === 0) return 'MORNING_2_HS';
  if (sh === 13 && sm === 0 && eh === 17 && em === 0) return 'AFTERNOON';
  if (sh === 14 && sm === 0 && eh === 16 && em === 0) return 'AFTERNOON_2_HS';

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

/** Payload for PUT /api/admin/bookings/:id — date-only strings + lessonTime (same as create). */
export function buildEventListForBookingPut(dateTimes, bookingType = 'ASSIGNED', originalEventList = []) {
  const originalById = new Map(
    (originalEventList || []).filter((event) => event?.id).map((event) => [event.id, event])
  );

  return (dateTimes || [])
    .filter((dateTime) => dateTime.date)
    .map((dateTime, index) => {
      const original = getOriginalEvent(dateTime, index, originalEventList, originalById);
      const lessonTime = normalizeLessonTime(dateTime.time);

      return {
        ...(dateTime.id ? { id: dateTime.id } : {}),
        title: original?.title || (bookingType === 'REFERRED' ? 'Referida' : 'Asignada'),
        start: dateTime.date,
        end: dateTime.date,
        lessonTime,
        price:
          dateTime.price !== '' && dateTime.price != null ? dateTime.price : original?.price,
        eventType: bookingType === 'REFERRED' ? 'REFERRED' : 'CLASS',
        textColor:
          original?.textColor || (bookingType === 'REFERRED' ? '#00FF00' : '#FF0000'),
      };
    });
}

/** Payload for PUT /api/admin/user/:userId/event/:eventId — local start/end datetimes. */
export function buildEventListForCalendarUpdate(
  dateTimes,
  bookingType = 'ASSIGNED',
  originalEventList = []
) {
  const originalById = new Map(
    (originalEventList || []).filter((event) => event?.id).map((event) => [event.id, event])
  );

  return (dateTimes || [])
    .filter((dateTime) => dateTime.date)
    .map((dateTime, index) => {
      const original = getOriginalEvent(dateTime, index, originalEventList, originalById);
      const { start, end, allDay, lessonTime } = buildStartEndFromDateAndLessonTime(
        dateTime.date,
        dateTime.time
      );

      return {
        id: dateTime.id ?? original?.id,
        title: original?.title || (bookingType === 'REFERRED' ? 'Referida' : 'Asignada'),
        start,
        end,
        allDay,
        lessonTime,
        price:
          dateTime.price !== '' && dateTime.price != null ? dateTime.price : original?.price,
        textColor:
          original?.textColor || (bookingType === 'REFERRED' ? '#00FF00' : '#FF0000'),
        type: original?.type,
        resort: original?.resort,
        source: original?.source,
        maxStudents: original?.maxStudents,
      };
    });
}

export function isFailedThunkResult(result) {
  if (!result) return true;
  if (result instanceof Error) return true;
  if (result.response?.status >= 400) return true;
  return false;
}
