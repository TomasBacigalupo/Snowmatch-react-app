/**
 * Maps an open booking intent (pending reservation) to the shape expected by BookingDetailsDrawer.
 */
export function normalizeBookingIntent(intent) {
  if (!intent) return null;

  const eventList = (intent.lines || []).map((line) => ({
    start: line.startAt,
    end: line.endAt || line.startAt,
    lessonTime: line.lessonTime,
  }));

  return {
    ...intent,
    eventList,
    includesLunch: intent.includesLaunch ?? intent.includesLunch,
    state: intent.state || 'OPEN',
    isBookingIntent: true,
  };
}
