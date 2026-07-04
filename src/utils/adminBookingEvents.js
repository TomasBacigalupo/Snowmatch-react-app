import dayjs from 'dayjs';

export const LESSON_TIME_VALUES = ['MORNING', 'MORNING_2_HS', 'AFTERNOON', 'AFTERNOON_2_HS', 'ALL_DAY'];

export function normalizeLessonTime(lessonTime) {
  if (!lessonTime) return 'ALL_DAY';
  if (lessonTime === 'MORNING_2HS') return 'MORNING_2_HS';
  if (lessonTime === 'AFTERNOON_2HS') return 'AFTERNOON_2_HS';
  return lessonTime;
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
    time: normalizeLessonTime(event.lessonTime),
    price: event.price ?? '',
  }));
}

function mapSingleEventForApi(dateTime, bookingType) {
  const lessonTime = normalizeLessonTime(dateTime.time);
  const base = {
    ...(dateTime.id ? { id: dateTime.id } : {}),
    title: bookingType === 'REFERRED' ? 'Referida' : 'Asignada',
    start: dateTime.date,
    end: dateTime.date,
    lessonTime,
    price: dateTime.price,
    eventType: bookingType === 'REFERRED' ? 'REFERRED' : 'CLASS',
    textColor: bookingType === 'REFERRED' ? '#00FF00' : '#FF0000',
  };

  if (lessonTime === 'AFTERNOON') {
    return { ...base, start: dayjs(base.start), end: dayjs(base.start), lessonTime: 'AFTERNOON' };
  }
  if (lessonTime === 'AFTERNOON_2_HS') {
    return { ...base, start: dayjs(base.start), end: dayjs(base.start), lessonTime: 'AFTERNOON_2_HS' };
  }
  if (lessonTime === 'MORNING_2_HS') {
    return { ...base, start: dayjs(base.start), end: dayjs(base.start), lessonTime: 'MORNING_2_HS' };
  }
  if (lessonTime === 'MORNING') {
    return { ...base, start: dayjs(base.start), end: dayjs(base.start), lessonTime: 'MORNING' };
  }
  return { ...base, start: dayjs(base.start), end: dayjs(base.start), lessonTime: 'ALL_DAY' };
}

export function buildEventListForApi(dateTimes, bookingType = 'ASSIGNED') {
  return (dateTimes || [])
    .filter((dateTime) => dateTime.date)
    .map((dateTime) => mapSingleEventForApi(dateTime, bookingType));
}
