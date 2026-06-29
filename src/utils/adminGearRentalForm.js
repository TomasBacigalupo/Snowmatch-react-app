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
