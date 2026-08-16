/**
 * Non-network deep-link URIs for the two always-available pharmacy contact
 * actions (docs/claude-design-agent-brief.md "Components and interaction
 * rules": Call and Directions). `tel:`/`geo:` are OS-handled URI schemes
 * resolved by the browser's own navigation, not an application network
 * request — see apps/web/__tests__/boundary.test.ts, which forbids any
 * outbound fetch/socket/http(s) call but not these.
 */

/** Strips display formatting (spaces, the "(synthetic)" label) down to a
 * dialable `tel:` URI. */
export function buildTelHref(phoneDisplay: string): string {
  const digits = phoneDisplay.replace(/[^0-9+]/g, '');
  return `tel:${digits}`;
}

/** Builds a `geo:` URI carrying the verified public branch coordinates and
 * a human-readable label, per ADR-214 (public branch location only, never
 * buyer/device location). */
export function buildDirectionsHref(latitude: number, longitude: number, label: string): string {
  const coordinates = `${latitude},${longitude}`;
  return `geo:${coordinates}?q=${coordinates}(${encodeURIComponent(label)})`;
}
