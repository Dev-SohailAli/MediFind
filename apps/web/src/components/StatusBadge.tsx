export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  glyph: string;
}

const TONE_VAR: Record<BadgeTone, string> = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  neutral: 'var(--color-text-secondary)',
};

/**
 * A status label that is never conveyed by colour alone: every badge pairs
 * a plain-language label with a glyph, and the whole badge is exposed as a
 * single accessible text node.
 */
export function StatusBadge({ label, tone, glyph }: StatusBadgeProps) {
  return (
    <span className="status-badge" role="group" aria-label={label}>
      <span className="status-badge__glyph" style={{ color: TONE_VAR[tone] }} aria-hidden="true">
        {glyph}
      </span>
      <span>{label}</span>
    </span>
  );
}
