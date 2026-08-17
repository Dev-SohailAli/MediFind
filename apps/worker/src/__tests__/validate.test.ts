import { describe, expect, it } from 'vitest';

import { MAX_BODY_BYTES, checkDeclaredBodySize, validateNoBodyPayload } from '../http/validate.js';

describe('request validation seam', () => {
  describe('checkDeclaredBodySize', () => {
    it('accepts a request with no Content-Length header', () => {
      const request = new Request('https://worker.local/v1/health');

      expect(checkDeclaredBodySize(request)).toEqual({ ok: true });
    });

    it('accepts a request declaring a body under the cap', () => {
      const request = new Request('https://worker.local/v1/health', {
        headers: { 'content-length': '10' },
      });

      expect(checkDeclaredBodySize(request)).toEqual({ ok: true });
    });

    it('rejects a request declaring a body over the cap without reading it', () => {
      const request = new Request('https://worker.local/v1/health', {
        headers: { 'content-length': String(MAX_BODY_BYTES + 1) },
      });

      expect(checkDeclaredBodySize(request)).toEqual({
        ok: false,
        code: 'VALIDATION_FAILED',
        messageKey: 'error.validation.body_too_large',
      });
    });
  });

  describe('validateNoBodyPayload', () => {
    it('accepts an empty body', () => {
      expect(validateNoBodyPayload('', null)).toEqual({ ok: true });
    });

    it('rejects a non-empty body on a route that expects none', () => {
      expect(validateNoBodyPayload('{"probe":true}', 'application/json')).toEqual({
        ok: false,
        code: 'VALIDATION_FAILED',
        messageKey: 'error.validation.unexpected_body',
      });
    });

    it('rejects an unsupported content type even for a small body', () => {
      expect(validateNoBodyPayload('<xml/>', 'application/xml')).toEqual({
        ok: false,
        code: 'VALIDATION_FAILED',
        messageKey: 'error.validation.unexpected_body',
      });
    });

    it('rejects an actual body larger than the cap even without a Content-Length header', () => {
      const oversized = 'a'.repeat(MAX_BODY_BYTES + 1);

      expect(validateNoBodyPayload(oversized, null)).toEqual({
        ok: false,
        code: 'VALIDATION_FAILED',
        messageKey: 'error.validation.body_too_large',
      });
    });
  });
});
