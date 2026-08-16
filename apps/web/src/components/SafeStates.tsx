import { strings } from '../content/strings';

function StateBlock({ title, body }: { title: string; body?: string }) {
  return (
    <div className="state-block">
      <p className="state-block__title">{title}</p>
      {body ? <p className="state-block__body">{body}</p> : null}
    </div>
  );
}

export function BrowseEmptyState() {
  return <StateBlock title={strings.browseEmptyTitle} body={strings.browseEmptyBody} />;
}

export function ZeroResultState() {
  return (
    <div className="state-block" role="status">
      <p className="state-block__title">{strings.zeroResultTitle}</p>
      <p className="state-block__body">{strings.zeroResultBody}</p>
      <p className="state-block__body">{strings.zeroResultSubstituteNotice}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <p className="state-block__title">{strings.loadingLabel}</p>
    </div>
  );
}

export function OfflineState() {
  return <StateBlock title={strings.offlineTitle} body={strings.offlineBody} />;
}

export function ErrorState() {
  return (
    <div className="state-block" role="alert">
      <p className="state-block__title">{strings.errorTitle}</p>
      <p className="state-block__body">{strings.errorBody}</p>
    </div>
  );
}
