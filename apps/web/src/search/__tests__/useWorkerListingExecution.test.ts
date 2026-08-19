import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { SyntheticSearchListing } from '@medifind/contracts';

import { useWorkerListingExecution } from '../useWorkerListingExecution';

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function buildListing(id: string): SyntheticSearchListing {
  return {
    id,
    medicineDisplayName: 'Nivaprin',
    brandName: 'Nivaprin Core',
    activeIngredientDisplayName: 'Bentholine',
    strength: '500 mg',
    dosageForm: 'Tablet',
    packDescription: 'Pack of 20',
    aliases: [],
    pharmacyDisplayName: 'Solandra Pharmacy',
    syntheticArea: 'harbour',
    syntheticDistanceLabel: '2 synthetic km',
    syntheticDistanceRank: 2,
    availability: 'in_stock',
    priceFjdMinor: 1299,
    freshness: 'current',
    lastUpdatedDisplay: '17 Aug 2026',
    searchEligible: true,
  };
}

describe('useWorkerListingExecution', () => {
  it('stays idle and never calls runListing when disabled', () => {
    const runListing = vi.fn();

    const { result } = renderHook(() => useWorkerListingExecution(false, 'listing-1', runListing));

    expect(result.current).toEqual({ status: 'idle' });
    expect(runListing).not.toHaveBeenCalled();
  });

  it('stays idle and never calls runListing when the listing ID is null', () => {
    const runListing = vi.fn();

    const { result } = renderHook(() => useWorkerListingExecution(true, null, runListing));

    expect(result.current).toEqual({ status: 'idle' });
    expect(runListing).not.toHaveBeenCalled();
  });

  it('shows loading synchronously then ready with the resolved listing', async () => {
    const deferred = createDeferred<SyntheticSearchListing>();
    const runListing = vi.fn().mockReturnValue(deferred.promise);
    const listing = buildListing('listing-1');

    const { result } = renderHook(() => useWorkerListingExecution(true, 'listing-1', runListing));

    expect(result.current).toEqual({ status: 'loading' });
    expect(runListing).toHaveBeenCalledTimes(1);
    expect(runListing).toHaveBeenCalledWith('listing-1');

    await act(async () => {
      deferred.resolve(listing);
      await deferred.promise;
    });

    await waitFor(() => expect(result.current).toEqual({ status: 'ready', listing }));
  });

  it('maps a rejected request to the safe error state', async () => {
    const deferred = createDeferred<SyntheticSearchListing>();
    const runListing = vi.fn().mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useWorkerListingExecution(true, 'listing-1', runListing));

    expect(result.current).toEqual({ status: 'loading' });

    await act(async () => {
      deferred.reject(new Error('Worker search unavailable'));
      await deferred.promise.catch(() => undefined);
    });

    await waitFor(() => expect(result.current).toEqual({ status: 'error' }));
  });

  it('ignores an older resolution once the listing ID changes', async () => {
    const firstDeferred = createDeferred<SyntheticSearchListing>();
    const secondDeferred = createDeferred<SyntheticSearchListing>();
    const runListing = vi.fn((listingId: string) =>
      listingId === 'listing-1' ? firstDeferred.promise : secondDeferred.promise,
    );

    const { result, rerender } = renderHook(
      ({ listingId }: { listingId: string }) =>
        useWorkerListingExecution(true, listingId, runListing),
      { initialProps: { listingId: 'listing-1' } },
    );

    expect(result.current).toEqual({ status: 'loading' });

    rerender({ listingId: 'listing-2' });
    expect(result.current).toEqual({ status: 'loading' });
    expect(runListing).toHaveBeenCalledTimes(2);
    expect(runListing).toHaveBeenNthCalledWith(1, 'listing-1');
    expect(runListing).toHaveBeenNthCalledWith(2, 'listing-2');

    const secondListing = buildListing('listing-2');

    // The stale (first) request resolves after the ID has already changed.
    await act(async () => {
      firstDeferred.resolve(buildListing('listing-1'));
      await firstDeferred.promise;
    });

    // Still loading: the stale response for listing-1 must be ignored.
    expect(result.current).toEqual({ status: 'loading' });

    await act(async () => {
      secondDeferred.resolve(secondListing);
      await secondDeferred.promise;
    });

    await waitFor(() =>
      expect(result.current).toEqual({ status: 'ready', listing: secondListing }),
    );
  });

  it('ignores a late resolution after the listing ID becomes null', async () => {
    const deferred = createDeferred<SyntheticSearchListing>();
    const runListing = vi.fn().mockReturnValue(deferred.promise);

    const { result, rerender } = renderHook(
      ({ listingId }: { listingId: string | null }) =>
        useWorkerListingExecution(true, listingId, runListing),
      { initialProps: { listingId: 'listing-1' as string | null } },
    );

    expect(result.current).toEqual({ status: 'loading' });

    rerender({ listingId: null });
    expect(result.current).toEqual({ status: 'idle' });

    await act(async () => {
      deferred.resolve(buildListing('listing-1'));
      await deferred.promise;
    });

    // The late resolution for the discarded selection must not resurrect it.
    expect(result.current).toEqual({ status: 'idle' });
  });

  it('ignores a late resolution after unmount', async () => {
    const deferred = createDeferred<SyntheticSearchListing>();
    const runListing = vi.fn().mockReturnValue(deferred.promise);

    const { result, unmount } = renderHook(() =>
      useWorkerListingExecution(true, 'listing-1', runListing),
    );

    expect(result.current).toEqual({ status: 'loading' });

    unmount();

    await act(async () => {
      deferred.resolve(buildListing('listing-1'));
      await deferred.promise;
    });

    // No assertion on result.current after unmount is meaningful; this test
    // passes by not raising an act() warning or throwing on a stale setState.
  });
});
