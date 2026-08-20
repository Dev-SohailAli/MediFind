import { strings } from '../content/strings';
import type { SupportReportCategory } from '../support/syntheticSupport';
import { ReportForm } from './ReportForm';

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

export interface ZeroResultStateProps {
  readonly buyerKey?: string | null;
  readonly onSubmitReport?: (input: {
    category: SupportReportCategory;
    reportedBy: string;
    note: string;
    targetListingId: string | null;
  }) => void;
}

export function ZeroResultState({
  buyerKey = null,
  onSubmitReport = () => {},
}: ZeroResultStateProps = {}) {
  return (
    <div className="state-block" role="status">
      <p className="state-block__title">{strings.zeroResultTitle}</p>
      <p className="state-block__body">{strings.zeroResultBody}</p>
      <p className="state-block__body">{strings.zeroResultSubstituteNotice}</p>
      {buyerKey ? (
        <ReportForm
          triggerLabel={strings.supportReportCantFindMedicineLabel}
          category="cant_find_medicine"
          targetListingId={null}
          buyerKey={buyerKey}
          onSubmitReport={onSubmitReport}
        />
      ) : null}
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
