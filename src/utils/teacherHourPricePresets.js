export const LEVEL_HOUR_PRICE_PRESETS = [
  { level: 0, assigned: 19000, referred: 25500 },
  { level: 1, assigned: 28000, referred: 34500 },
  { level: 2, assigned: 38000, referred: 44500 },
  { level: '3+', assigned: 40000, referred: 44500 },
];

/** Default teacher payment rates (first preset). */
export const DEFAULT_TEACHER_HOUR_PRICES = {
  assigned: String(LEVEL_HOUR_PRICE_PRESETS[0].assigned),
  referred: String(LEVEL_HOUR_PRICE_PRESETS[0].referred),
};

/** Editable rates keyed by level preset (`0`, `1`, `2`, `3+`). */
export function buildDefaultLevelHourPrices() {
  return LEVEL_HOUR_PRICE_PRESETS.reduce((acc, preset) => {
    acc[String(preset.level)] = {
      assigned: String(preset.assigned),
      referred: String(preset.referred),
    };
    return acc;
  }, {});
}

/** Map a booking teacher.level to a preset key. Levels >= 3 use `3+`. */
export function getTeacherLevelPriceKey(teacherLevel) {
  const level = Number(teacherLevel);
  if (!Number.isFinite(level) || level < 0) {
    return null;
  }
  if (level >= 3) {
    return '3+';
  }
  if (level === 0 || level === 1 || level === 2) {
    return String(level);
  }
  return null;
}

export function getDefaultMonthRange() {
  const now = new Date();
  return [
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  ];
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getBookingLessonDate(booking) {
  const firstEvent = booking?.eventList?.[0];
  if (!firstEvent?.start) {
    return null;
  }
  const date = new Date(firstEvent.start);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function bookingInDateRange(booking, rangeStart, rangeEnd) {
  const lessonDate = getBookingLessonDate(booking);
  if (!lessonDate) {
    return false;
  }
  if (rangeStart && lessonDate < startOfDay(rangeStart)) {
    return false;
  }
  if (rangeEnd && lessonDate > endOfDay(rangeEnd)) {
    return false;
  }
  return true;
}

export function formatDateParam(date) {
  if (!date) {
    return '';
  }
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
