/**
 * Pickup / shop reference calculations for alpine ski rental lines.
 * Ski length matches {@link src/pages/rental/UserRentalData.js} (height − 17 … height cm).
 * DIN is a rough recreational estimate — always verify on certified jig.
 */

export function isSkiRentalLine(row) {
  const blob = `${row?.itemName || ''} ${row?.variantSummary || ''}`.toUpperCase();
  if (!blob.trim()) return false;
  if (blob.includes('SNOWBOARD') || (blob.includes('SNOW') && blob.includes('BOARD'))) return false;
  if (blob.includes('BOTA') || blob.includes('BOOT')) return false;
  if (blob.includes('POLE') || blob.includes('BAST')) return false;
  if (blob.includes('CASCO') || blob.includes('HELMET')) return false;
  return blob.includes('SKI') || blob.includes('ESQU');
}

/** @returns {{ from: number, to: number, label: string } | null} */
export function calcSkiLengthRangeCm(heightCm) {
  const h = Number(heightCm);
  if (!Number.isFinite(h) || h <= 0) return null;
  const from = Math.ceil(h - 17);
  const to = Math.round(h);
  if (from > to) return { from: to, to: from, label: `${to}–${from} cm` };
  return { from, to, label: `${from}–${to} cm` };
}

/**
 * Approximate DIN / release setting from weight and skier level (type I-ish).
 * @returns {number | null} half-step e.g. 4, 4.5
 */
export function calcApproxDinSetting(weightKg, skiLevelRaw) {
  const w = Number(weightKg);
  if (!Number.isFinite(w) || w <= 0) return null;
  let din;
  if (w < 30) din = 2.5;
  else if (w < 41) din = 3;
  else if (w < 49) din = 4;
  else if (w < 58) din = 5;
  else if (w < 67) din = 6;
  else if (w < 78) din = 7;
  else if (w < 90) din = 8;
  else din = 9;

  const s = String(skiLevelRaw || '').toLowerCase();
  if (s.includes('begin') || s.includes('princ')) din -= 0.75;
  if (s.includes('expert') || s.includes('avanz')) din += 0.75;

  din = Math.round(Math.min(15, Math.max(1, din)) * 2) / 2;
  return din;
}

/** Boot sole length in mm from foot outline (cm) — rough mondo / jig reference. */
export function calcBootSoleLengthMm(footLengthCm) {
  const f = Number(footLengthCm);
  if (!Number.isFinite(f) || f <= 0) return null;
  return Math.round(f * 10);
}
