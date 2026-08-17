/** Formats an integer FJD minor-unit price at the display boundary only. */
export function formatFjd(priceFjdMinor: number): string {
  const major = priceFjdMinor / 100;
  return `FJD ${major.toFixed(2)}`;
}
