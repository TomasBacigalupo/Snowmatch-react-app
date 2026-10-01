/** Builds a WhatsApp-ready number (digits only) with country code, without double-prefixing. */
export function buildWhatsAppPhone(countryCode, phone) {
  const codeDigits = String(countryCode || '').replace(/\D/g, '');
  const phoneDigits = String(phone || '').replace(/\D/g, '');
  if (!phoneDigits) return codeDigits;
  if (codeDigits && phoneDigits.startsWith(codeDigits)) return phoneDigits;
  return `${codeDigits}${phoneDigits}`;
}
