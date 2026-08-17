import { describe, expect, it } from 'vitest';

import { checkVersion } from '../security/version.js';

describe('version/precondition check seam', () => {
  it('accepts a request that supplies the current record version', () => {
    expect(checkVersion('v3', 'v3')).toEqual({ ok: true });
  });

  it('rejects a stale version as a conflict', () => {
    expect(checkVersion('v3', 'v2')).toEqual({ ok: false, code: 'CONFLICT' });
  });

  it('rejects a missing version as a conflict rather than assuming current', () => {
    expect(checkVersion('v3', undefined)).toEqual({ ok: false, code: 'CONFLICT' });
  });
});
