/** Visible character limit before ellipsis in gear/product lists. */
export const GEAR_LIST_TEXT_MAX = 40;

/**
 * @param {string | number | null | undefined} text
 * @param {number} [maxLength=GEAR_LIST_TEXT_MAX]
 * @returns {{ display: string, full: string, isTruncated: boolean }}
 */
export function truncateGearListText(text, maxLength = GEAR_LIST_TEXT_MAX) {
  const full = text == null ? '' : String(text);
  if (full.length <= maxLength) {
    return { display: full, full, isTruncated: false };
  }
  return { display: `${full.slice(0, maxLength)}...`, full, isTruncated: true };
}
