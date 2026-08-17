import { describe, expect, it } from 'vitest';

import { formatFjd } from '../format';

describe('formatFjd', () => {
  it('formats an integer minor-unit price as FJD major units with two decimals', () => {
    expect(formatFjd(850)).toBe('FJD 8.50');
    expect(formatFjd(100)).toBe('FJD 1.00');
    expect(formatFjd(1120)).toBe('FJD 11.20');
  });

  it('never renders a raw minor-unit integer without the FJD prefix/decimal formatting', () => {
    const formatted = formatFjd(430);

    expect(formatted).not.toBe('430');
    expect(formatted).toMatch(/^FJD \d+\.\d{2}$/);
  });
});
