import axios from 'src/utils/axios';

/** Parse YYYY-MM-DD as local calendar date (avoids UTC off-by-one). */
export function parseBookingYmd(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const s = String(value);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(s);
  if (Number.isNaN(dt.getTime())) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function toDayStart(date) {
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Inclusive overlap of two calendar date ranges. */
export function dateRangesOverlap(lineStart, lineEnd, filterStart, filterEnd) {
  const startA = toDayStart(lineStart instanceof Date ? lineStart : parseBookingYmd(lineStart));
  const endA = toDayStart(lineEnd instanceof Date ? lineEnd : parseBookingYmd(lineEnd));
  const startB = toDayStart(filterStart instanceof Date ? filterStart : parseBookingYmd(filterStart));
  const endB = toDayStart(filterEnd instanceof Date ? filterEnd : parseBookingYmd(filterEnd));
  if (!startA || !endA || !startB || !endB) return false;
  return startA <= endB && startB <= endA;
}

/** True if any rental line overlaps the filter range. */
export function bookingMatchesRentalDateRange(rentalLines, filterStart, filterEnd) {
  if (!Array.isArray(rentalLines) || !rentalLines.length) return false;
  return rentalLines.some((line) =>
    dateRangesOverlap(line?.startDate, line?.endDate, filterStart, filterEnd)
  );
}

export function formatYmd(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : parseBookingYmd(date);
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Min start / max end across rental lines (for CSV columns). */
export function getBookingRentalDateSummary(rentalLines) {
  if (!Array.isArray(rentalLines) || !rentalLines.length) {
    return { rentalStart: '', rentalEnd: '' };
  }
  let minStart = null;
  let maxEnd = null;
  rentalLines.forEach((line) => {
    const start = parseBookingYmd(line?.startDate);
    const end = parseBookingYmd(line?.endDate);
    if (start && (!minStart || start < minStart)) minStart = start;
    if (end && (!maxEnd || end > maxEnd)) maxEnd = end;
  });
  return {
    rentalStart: formatYmd(minStart),
    rentalEnd: formatYmd(maxEnd),
  };
}

async function fetchRentalLinesForBooking(bookingId) {
  try {
    const res = await axios.get(`/api/rental/admin/reservations/booking/${bookingId}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

/**
 * Batch-fetch rental lines for booking IDs with a concurrency cap.
 * @returns {Promise<Map<number|string, object[]>>}
 */
export async function fetchRentalLinesForBookings(bookingIds, { concurrency = 8 } = {}) {
  const map = new Map();
  const ids = (bookingIds || []).filter((id) => id != null);
  if (!ids.length) return map;

  let index = 0;
  async function worker() {
    while (index < ids.length) {
      const current = ids[index];
      index += 1;
      const lines = await fetchRentalLinesForBooking(current);
      map.set(current, lines);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, ids.length) }, () => worker());
  await Promise.all(workers);
  return map;
}

/** Calendar years covered by a date range (inclusive). */
export function yearsInDateRange(start, end) {
  const s = toDayStart(start instanceof Date ? start : parseBookingYmd(start));
  const e = toDayStart(end instanceof Date ? end : parseBookingYmd(end));
  if (!s || !e) return [];
  const years = [];
  for (let y = s.getFullYear(); y <= e.getFullYear(); y += 1) {
    years.push(y);
  }
  return years;
}
