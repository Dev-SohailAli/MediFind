import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { PrescriptionUploadPanel } from '../PrescriptionUploadPanel';

function cleanPdfFile(): File {
  // Verified against the module's deterministic hash to land in the
  // 'clean' scanner bucket for this exact name+size combination.
  return new File(['x'.repeat(1024)], 'clean-upload-0.pdf', { type: 'application/pdf' });
}

describe('PrescriptionUploadPanel', () => {
  it('prompts to sign in instead of showing the form when signed out', () => {
    render(<PrescriptionUploadPanel buyerKey={null} onUploadPrescription={() => {}} />);

    expect(screen.getByText(strings.reservationSignInPrompt)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.prescriptionUploadSubmitLabel }),
    ).not.toBeInTheDocument();
  });

  it('lists every live pharmacy branch as a selectable option', () => {
    render(<PrescriptionUploadPanel buyerKey="+679 000 0000" onUploadPrescription={() => {}} />);

    const select = screen.getByLabelText(strings.prescriptionUploadPharmacyLabel);
    expect(select).toHaveTextContent('Suva Central Pharmacy (synthetic)');
    expect(select).toHaveTextContent('Harbourview Pharmacy (synthetic)');
    expect(select).toHaveTextContent('Market Square Pharmacy (synthetic)');
    expect(select).not.toHaveTextContent('Gardenview Apothecary (synthetic)');
  });

  it('requires patient name, legibility and consent before submitting', async () => {
    const user = userEvent.setup();
    const onUploadPrescription = vi.fn();
    render(
      <PrescriptionUploadPanel
        buyerKey="+679 000 0000"
        onUploadPrescription={onUploadPrescription}
      />,
    );

    await user.upload(screen.getByLabelText(strings.prescriptionUploadFileLabel), cleanPdfFile());
    await user.click(screen.getByRole('button', { name: strings.prescriptionUploadSubmitLabel }));

    expect(screen.getByText(strings.prescriptionUploadPatientNameError)).toBeInTheDocument();
    expect(screen.getByText(strings.prescriptionUploadLegibilityError)).toBeInTheDocument();
    expect(screen.getByText(strings.prescriptionUploadConsentError)).toBeInTheDocument();
    expect(onUploadPrescription).not.toHaveBeenCalled();
  });

  it('submits a valid upload for a clean file and shows the success notice', async () => {
    const user = userEvent.setup();
    const onUploadPrescription = vi.fn();
    render(
      <PrescriptionUploadPanel
        buyerKey="+679 000 0000"
        onUploadPrescription={onUploadPrescription}
      />,
    );

    await user.type(
      screen.getByLabelText(strings.prescriptionUploadPatientNameLabel),
      'Litia Waqa',
    );
    await user.upload(screen.getByLabelText(strings.prescriptionUploadFileLabel), cleanPdfFile());
    await user.click(screen.getByLabelText(strings.prescriptionUploadLegibilityLabel));
    await user.click(
      screen.getByLabelText(
        strings.prescriptionUploadConsentLabel('Suva Central Pharmacy (synthetic)'),
      ),
    );
    await user.click(screen.getByRole('button', { name: strings.prescriptionUploadSubmitLabel }));

    expect(onUploadPrescription).toHaveBeenCalledTimes(1);
    const created = onUploadPrescription.mock.calls[0]![0];
    expect(created.status).toBe('under_review');
    expect(created.branchId).toBe('suva-central');
    expect(created.buyerKey).toBe('+679 000 0000');
    expect(screen.getByText(strings.prescriptionUploadSuccessNotice)).toBeInTheDocument();
  });

  it('rejects an unsupported file type with a field error, before any scan is attempted', async () => {
    const user = userEvent.setup();
    const onUploadPrescription = vi.fn();
    render(
      <PrescriptionUploadPanel
        buyerKey="+679 000 0000"
        onUploadPrescription={onUploadPrescription}
      />,
    );

    await user.type(
      screen.getByLabelText(strings.prescriptionUploadPatientNameLabel),
      'Litia Waqa',
    );
    const zipFile = new File(['x'], 'archive.zip', { type: 'application/zip' });
    await user.upload(screen.getByLabelText(strings.prescriptionUploadFileLabel), zipFile);
    await user.click(screen.getByLabelText(strings.prescriptionUploadLegibilityLabel));
    await user.click(
      screen.getByLabelText(
        strings.prescriptionUploadConsentLabel('Suva Central Pharmacy (synthetic)'),
      ),
    );
    await user.click(screen.getByRole('button', { name: strings.prescriptionUploadSubmitLabel }));

    expect(screen.getByText(strings.prescriptionUploadFileTypeError)).toBeInTheDocument();
    expect(onUploadPrescription).not.toHaveBeenCalled();
  });
});
