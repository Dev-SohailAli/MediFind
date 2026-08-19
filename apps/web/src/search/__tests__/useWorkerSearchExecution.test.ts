import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { SearchOutcome } from '../searchListings';
import { useWorkerSearchExecution } from '../useWorkerSearchExecution';

const readyOutcome: SearchOutcome = { isEmptyQuery: false, rows: [] };

describe('useWorkerSearchExecution', () => {
  it('does not call the Worker when the API mode is disabled', () => {
    const { result } = renderHook(() => useWorkerSearchExecution(false, '', 'relevance', null));

    expect(result.current).toEqual({ status: 'ready', outcome: { isEmptyQuery: true, rows: [] } });
  });

  it('shows loading and then the Worker outcome for a non-empty query', async () => {
    const runSearch = vi.fn().mockResolvedValue(readyOutcome);

    const { result } = renderHook(() =>
      useWorkerSearchExecution(true, 'Nivaprin', 'relevance', null, runSearch),
    );

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toEqual({ status: 'ready', outcome: readyOutcome }));
    expect(runSearch).toHaveBeenCalledWith({
      query: 'Nivaprin',
      sort: 'relevance',
      selectedArea: null,
    });
  });

  it('maps a rejected Worker call to the existing safe error state', async () => {
    const runSearch = vi.fn().mockRejectedValue(new Error('D1_ERROR: private path'));

    const { result } = renderHook(() =>
      useWorkerSearchExecution(true, 'Nivaprin', 'relevance', null, runSearch),
    );

    await waitFor(() => expect(result.current).toEqual({ status: 'error' }));
  });
});
