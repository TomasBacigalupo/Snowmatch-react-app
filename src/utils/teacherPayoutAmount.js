function calcEventHours(event) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const eventHours = (end - start) / (1000 * 60 * 60);
  if (eventHours === 4) {
    return 3;
  }
  return Math.min(eventHours, 6);
}

function getHourlyRate(teacherLevel, bookingType) {
  const isReferred = bookingType === 'REFERRED';

  switch (teacherLevel) {
    case 1:
      return isReferred ? 30000 : 23500;
    case 2:
      return isReferred ? 38500 : 32000;
    case 3:
    case 4:
    case 5:
      return isReferred ? 56000 : 49500;
    default:
      return 16000;
  }
}

export function calcBookingTeacherHours(booking) {
  if (!booking?.eventList?.length) {
    return 0;
  }

  return booking.eventList.reduce((hours, event) => hours + calcEventHours(event), 0);
}

export function calcBookingPayWithHourPrice(booking, hourPrices) {
  const isReferred = booking?.type === 'REFERRED';
  const rawPrice = isReferred ? hourPrices?.referred : hourPrices?.assigned;
  const rate = parseFloat(rawPrice);
  if (!rate || rate <= 0) {
    return 0;
  }
  return calcBookingTeacherHours(booking) * rate;
}

export function calcTeacherPayTotalWithHourPrice(bookings, hourPrices) {
  if (!bookings?.length) {
    return 0;
  }

  return bookings.reduce(
    (total, booking) => total + calcBookingPayWithHourPrice(booking, hourPrices),
    0
  );
}

export function hasHourPricesConfigured(hourPrices) {
  const assigned = parseFloat(hourPrices?.assigned);
  const referred = parseFloat(hourPrices?.referred);
  return (assigned > 0) || (referred > 0);
}

export function calcBookingTeacherPay(booking) {
  if (!booking?.teacher?.level || !booking?.eventList?.length) {
    return 0;
  }

  const hourlyRate = getHourlyRate(booking.teacher.level, booking.type);
  const teacherHours = booking.eventList.reduce(
    (hours, event) => hours + calcEventHours(event),
    0
  );

  return teacherHours * hourlyRate;
}

export function calcTeacherPayTotal(bookings) {
  if (!bookings?.length) {
    return 0;
  }

  return bookings.reduce((total, booking) => total + calcBookingTeacherPay(booking), 0);
}
