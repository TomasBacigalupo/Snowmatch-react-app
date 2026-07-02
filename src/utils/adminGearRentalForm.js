export const DEFAULT_RENTAL_LINE = {
  itemId: '',
  variantId: '',
  startDate: '',
  endDate: '',
  unitsReserved: 1,
  renterFirstName: '',
  renterLastName: '',
  renterHeightCm: '',
  renterWeightKg: '',
  renterFootLengthCm: '',
  renterSkiLevel: 'INTERMEDIATE',
};

export function validateRentalLine(rental, t) {
  if (!rental.itemId) {
    return t('adminBookings.rental.validationItem');
  }
  if (!rental.startDate || !rental.endDate) {
    return t('adminBookings.rental.validationDates');
  }
  if (!rental.renterHeightCm || !rental.renterWeightKg || !rental.renterFootLengthCm) {
    return t('adminBookings.rental.validationMeasurements');
  }
  if (!rental.renterSkiLevel) {
    return t('adminBookings.rental.validationLevel');
  }
  const hasFirst = Boolean(rental.renterFirstName?.trim());
  const hasLast = Boolean(rental.renterLastName?.trim());
  if (hasFirst !== hasLast) {
    return t('adminBookings.rental.validationNamePair');
  }
  return null;
}

export function validateRentalFulfillment(rental, t) {
  if (rental.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME') {
    if (!rental.rentalDestinationType || !rental.rentalDestinationDetail?.trim()) {
      return t('adminBookings.rental.validationDestination');
    }
  }
  return null;
}

export function buildRentalLinePayload(rental) {
  const payload = {
    itemId: rental.itemId,
    startDate: rental.startDate,
    endDate: rental.endDate,
    unitsReserved: Number(rental.unitsReserved) || 1,
    renterHeightCm: Number(rental.renterHeightCm),
    renterWeightKg: Number(rental.renterWeightKg),
    renterFootLengthCm: Number(rental.renterFootLengthCm),
    renterSkiLevel: rental.renterSkiLevel,
  };
  if (rental.variantId) {
    payload.variantId = rental.variantId;
  }
  if (rental.renterFirstName?.trim() && rental.renterLastName?.trim()) {
    payload.renterFirstName = rental.renterFirstName.trim();
    payload.renterLastName = rental.renterLastName.trim();
  }
  return payload;
}

export function buildAdminGearBookingPayload(studentId, line, bookingMeta) {
  const payload = {
    studentId,
    ...buildRentalLinePayload(line),
    checkoutPaymentMethod: bookingMeta.paymentMethod,
    rentalFulfillment: bookingMeta.rentalFulfillment,
  };
  if (bookingMeta.rentalFulfillment === 'SHIP_TO_HOTEL_OR_HOME') {
    payload.rentalDestinationType = bookingMeta.rentalDestinationType;
    payload.rentalDestinationDetail = bookingMeta.rentalDestinationDetail?.trim();
  }
  return payload;
}

/** Map API rental line summary into admin form state. */
export function rentalLineFromApiSummary(summary) {
  if (!summary) return { ...DEFAULT_RENTAL_LINE };
  return {
    id: summary.id || null,
    itemId: summary.itemId || '',
    variantId: summary.variantId || '',
    startDate: summary.startDate || '',
    endDate: summary.endDate || '',
    unitsReserved: summary.unitsReserved ?? 1,
    renterFirstName: summary.renterFirstName || '',
    renterLastName: summary.renterLastName || '',
    renterHeightCm: summary.renterHeightCm ?? '',
    renterWeightKg: summary.renterWeightKg ?? '',
    renterFootLengthCm: summary.renterFootLengthCm ?? '',
    renterSkiLevel: summary.renterSkiLevel || 'INTERMEDIATE',
  };
}

export function createEmptyRentalLine() {
  return { ...DEFAULT_RENTAL_LINE };
}

/** Inclusive calendar days between YYYY-MM-DD strings. */
export function countRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff + 1 : 0;
}

export function estimateLineTotal(line, items) {
  const item = items?.find((row) => row.id === line.itemId);
  const pricePerDay = item?.pricePerDay != null ? Number(item.pricePerDay) : 0;
  const days = countRentalDays(line.startDate, line.endDate);
  const units = Number(line.unitsReserved) || 1;
  return pricePerDay * days * units;
}

export function estimateLinesTotal(lines, items) {
  return (lines || []).reduce((sum, line) => sum + estimateLineTotal(line, items), 0);
}

export function getLessonDateBoundsFromBooking(booking) {
  const events = booking?.eventList || [];
  const dates = events
    .map((event) => {
      const raw = event.start || event.startDate;
      if (!raw) return null;
      return String(raw).slice(0, 10);
    })
    .filter(Boolean)
    .sort();
  return {
    min: dates[0] || '',
    max: dates[dates.length - 1] || '',
  };
}

export function buildGearBookingMetaFromBooking(booking) {
  return {
    resort: booking?.resort || 'CERRO_CATEDRAL',
    paymentStatus: booking?.paymentStatus || 'UNPAID',
    paymentMethod: booking?.bookingPaymentMethod || booking?.paymentMethod || 'CASH',
    internalComment: booking?.internalComment || '',
    userComment: booking?.userComment || '',
    state: booking?.state || 'PENDING',
    price: booking?.price ?? 0,
    rentalFulfillment: booking?.rentalFulfillment || 'PICKUP_IN_SHOP',
    rentalDestinationType: booking?.rentalDestinationType || 'HOTEL_OR_CABIN',
    rentalDestinationDetail: booking?.rentalDestinationDetail || '',
  };
}
