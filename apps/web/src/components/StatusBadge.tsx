import { Ban, CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { iconStrokeWidth } from '../theme/tokens';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  icon: LucideIcon;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  success: 'status-badge--success',
  warning: 'status-badge--warning',
  danger: 'status-badge--danger',
  info: '',
  neutral: 'status-badge--neutral',
};

/** Default per-tone glyph used when a call site does not need a more
 * specific icon (e.g. the shared freshness badge). */
export const TONE_ICON: Record<BadgeTone, LucideIcon> = {
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
  info: Info,
  neutral: Ban,
};

/**
 * A status label that is never conveyed by colour alone: every badge pairs
 * a plain-language label, a tinted background and a distinct Lucide icon,
 * and the whole badge is exposed as a single accessible text node.
 */
export function StatusBadge({ label, tone, icon: Icon }: StatusBadgeProps) {
  const toneClass = TONE_CLASS[tone];
  return (
    <span
      className={toneClass ? `status-badge ${toneClass}` : 'status-badge'}
      role="group"
      aria-label={label}
    >
      <span className="status-badge__glyph" aria-hidden="true">
        <Icon size={16} strokeWidth={iconStrokeWidth} />
      </span>
      <span>{label}</span>
    </span>
  );
}
