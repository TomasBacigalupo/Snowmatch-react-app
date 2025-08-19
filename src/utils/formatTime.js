import { format, getTime, formatDistanceToNow } from 'date-fns';

// Helper function to parse dates without timezone conversion
const parseDateWithoutTimezone = (date) => {
  if (!date) return new Date(0);
  
  // If it's already a Date object, return it
  if (date instanceof Date) return date;
  
  // If it's a string, remove timezone info and parse as local time
  if (typeof date === 'string') {
    const localDateString = date.replace(/[+-]\d{2}:?\d{2}$/, '').replace('Z', '');
    return new Date(localDateString);
  }
  
  return new Date(0);
};

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(parseDateWithoutTimezone(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(parseDateWithoutTimezone(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
  return getTime(parseDateWithoutTimezone(date));
}

export function fDateTimeSuffix(date) {
  return format(parseDateWithoutTimezone(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(parseDateWithoutTimezone(date), {
    addSuffix: true
  });
}
