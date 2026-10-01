import { getBookingCustomerLabel } from './adminBookingParticipants';
import { formatAdminBookingResortLabel } from './adminBookingResortOptions';
import { getBookingRentalDateSummary } from './gearRentalDateRange';

export function escapeCsvCell(value) {
  if (value == null) return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

function getResortLabel(resortValue, t) {
  if (resortValue === 'CERRO_CATEDRAL') return 'Catedral';
  return formatAdminBookingResortLabel(resortValue, t);
}

function getBookingTypeLabel(booking, t) {
  if (booking.type === 'GEAR_ONLY') return t('adminBookings.row.equipment');
  if (booking.includesEquipments) {
    return t('adminBookings.rental.lessonBookingCaption', { id: booking.id });
  }
  return '';
}

function bookingToCsvRow(booking, rentalLinesByBookingId, t) {
  const lines =
    rentalLinesByBookingId?.get?.(booking.id) ??
    rentalLinesByBookingId?.[booking.id] ??
    [];
  const { rentalStart, rentalEnd } = getBookingRentalDateSummary(lines);
  const notes = [booking.internalComment, booking.userComment].filter(Boolean).join(' — ');
  return [
    booking.id,
    getBookingCustomerLabel(booking),
    booking.student?.id ?? '',
    rentalStart,
    rentalEnd,
    booking.state ?? '',
    getBookingTypeLabel(booking, t),
    getResortLabel(booking.resort, t),
    booking.price ?? '',
    booking.currency ?? '',
    booking.paymentStatus ?? 'PENDING',
    booking.invoiceCreated ? 'Yes' : 'No',
    notes || '-',
  ];
}

export function buildGearBookingsCsv(bookings, rentalLinesByBookingId, { t } = {}) {
  // Support legacy call signature: buildGearBookingsCsv(bookings, { t })
  let linesMap = rentalLinesByBookingId;
  let translate = t;
  if (rentalLinesByBookingId && typeof rentalLinesByBookingId === 'object' && 't' in rentalLinesByBookingId && !(rentalLinesByBookingId instanceof Map)) {
    translate = rentalLinesByBookingId.t;
    linesMap = new Map();
  }

  const headers = [
    translate('adminBookings.table.id'),
    translate('adminBookings.table.student'),
    translate('adminBookings.exportCsvCustomerId'),
    translate('adminBookings.table.rentalStart'),
    translate('adminBookings.table.rentalEnd'),
    translate('adminBookings.table.state'),
    translate('adminBookings.exportCsvType'),
    translate('adminBookings.table.center'),
    translate('adminBookings.table.price'),
    translate('adminBookings.exportCsvCurrency'),
    translate('adminBookings.table.paymentStatus'),
    translate('adminBookings.table.invoiceCreated'),
    translate('adminBookings.table.notes'),
  ];

  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...bookings.map((booking) =>
      bookingToCsvRow(booking, linesMap, translate).map(escapeCsvCell).join(',')
    ),
  ];

  return `\uFEFF${csvLines.join('\n')}`;
}
