import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { ReportForm } from '../ReportForm';

describe('ReportForm', () => {
  it('shows only the trigger button until clicked', () => {
    render(
      <ReportForm
        triggerLabel={strings.supportReportListingLabel}
        category="listing_quality"
        targetListingId="listing-1"
        buyerKey="+679 000 0000"
        onSubmitReport={() => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: strings.supportReportListingLabel }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(strings.supportReportNoteLabel)).not.toBeInTheDocument();
  });

  it('requires a non-empty note before submitting', async () => {
    const user = userEvent.setup();
    const onSubmitReport = vi.fn();
    render(
      <ReportForm
        triggerLabel={strings.supportReportListingLabel}
        category="listing_quality"
        targetListingId="listing-1"
        buyerKey="+679 000 0000"
        onSubmitReport={onSubmitReport}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.supportReportListingLabel }));
    await user.click(screen.getByRole('button', { name: strings.supportReportSubmitLabel }));

    expect(screen.getByText(strings.supportReportNoteError)).toBeInTheDocument();
    expect(onSubmitReport).not.toHaveBeenCalled();
  });

  it('submits the report and shows the success notice', async () => {
    const user = userEvent.setup();
    const onSubmitReport = vi.fn();
    render(
      <ReportForm
        triggerLabel={strings.supportReportListingLabel}
        category="listing_quality"
        targetListingId="listing-1"
        buyerKey="+679 000 0000"
        onSubmitReport={onSubmitReport}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.supportReportListingLabel }));
    await user.type(
      screen.getByLabelText(strings.supportReportNoteLabel),
      'Price is different in store.',
    );
    await user.click(screen.getByRole('button', { name: strings.supportReportSubmitLabel }));

    expect(onSubmitReport).toHaveBeenCalledWith({
      category: 'listing_quality',
      reportedBy: '+679 000 0000',
      note: 'Price is different in store.',
      targetListingId: 'listing-1',
    });
    expect(screen.getByText(strings.supportReportSuccessNotice)).toBeInTheDocument();
  });

  it('Cancel returns to the trigger button without submitting', async () => {
    const user = userEvent.setup();
    const onSubmitReport = vi.fn();
    render(
      <ReportForm
        triggerLabel={strings.supportReportSuspiciousActivityLabel}
        category="suspicious_activity"
        targetListingId={null}
        buyerKey="+679 000 0000"
        onSubmitReport={onSubmitReport}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: strings.supportReportSuspiciousActivityLabel }),
    );
    await user.click(screen.getByRole('button', { name: strings.supportReportCancelLabel }));

    expect(
      screen.getByRole('button', { name: strings.supportReportSuspiciousActivityLabel }),
    ).toBeInTheDocument();
    expect(onSubmitReport).not.toHaveBeenCalled();
  });
});
