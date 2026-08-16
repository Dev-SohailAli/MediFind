export interface PrototypePlaceholderProps {
  title: string;
  body: string;
}

/**
 * Requests/Account tabs render only this: a clear non-functional prototype
 * notice. No profile, authentication or historical request/account content
 * is simulated.
 */
export function PrototypePlaceholder({ title, body }: PrototypePlaceholderProps) {
  return (
    <div className="placeholder">
      <h1 className="placeholder__title">{title}</h1>
      <p className="placeholder__body">{body}</p>
    </div>
  );
}
