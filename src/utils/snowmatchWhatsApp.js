/** +54 9 2944 26-3223 — wa.me format (no +, spaces, or dashes) */
export const SNOWMATCH_BOOKING_WHATSAPP_PHONE = '5492944263223';

export function snowmatchBookingWhatsAppUrl(messageText) {
  return `https://wa.me/${SNOWMATCH_BOOKING_WHATSAPP_PHONE}?text=${encodeURIComponent(messageText)}`;
}
