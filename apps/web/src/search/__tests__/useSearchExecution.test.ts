import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { syntheticListings } from '../../fixtures/syntheticListings';
import { SEARCH_LOADING_DELAY_MS, useSearchExecution } from '../useSearchExecution';

describe('useSearchExecution', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves synchronously on first mount (no artificial delay before the initial browse state)', () => {
    const { result } = renderHook(() =>
      useSearchExecution(syntheticListings, '', 'relevance', null),
    );

    expect(result.current.status).toBe('ready');
  });

  it('genuinely enters the loading state while a new query is pending, then resolves', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useSearchExecution(syntheticListings, query, 'relevance', null),
      { initialProps: { query: '' } },
    );

    expect(result.current.status).toBe('ready');

    rerender({ query: 'Nivaprin' });
    expect(result.current.status).toBe('loading');

    act(() => {
      vi.advanceTimersByTime(SEARCH_LOADING_DELAY_MS);
    });

    expect(result.current.status).toBe('ready');
    if (result.current.status === 'ready') {
      expect(result.current.outcome.rows.length).toBeGreaterThan(0);
    }
  });

  it('debounces rapid query changes to a single settle, not one loading cycle per keystroke', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useSearchExecution(syntheticListings, query, 'relevance', null),
      { initialProps: { query: '' } },
    );

    rerender({ query: 'N' });
    act(() => {
      vi.advanceTimersByTime(SEARCH_LOADING_DELAY_MS / 2);
    });
    rerender({ query: 'Ni' });
    act(() => {
      vi.advanceTimersByTime(SEARCH_LOADING_DELAY_MS / 2);
    });
    // Still pending: the second change reset the timer before it fired.
    expect(result.current.status).toBe('loading');

    act(() => {
      vi.advanceTimersByTime(SEARCH_LOADING_DELAY_MS);
    });
    expect(result.current.status).toBe('ready');
  });

  it('sort/area changes never re-enter the loading state (only the query is debounced)', () => {
    const { result, rerender } = renderHook(
      ({ sort, area }: { sort: 'relevance' | 'price_low_to_high'; area: null | 'harbour' }) =>
        useSearchExecution(syntheticListings, 'Nivaprin', sort, area),
      { initialProps: { sort: 'relevance', area: null } },
    );

    act(() => {
      vi.advanceTimersByTime(SEARCH_LOADING_DELAY_MS);
    });
    expect(result.current.status).toBe('ready');

    rerender({ sort: 'price_low_to_high', area: 'harbour' });

    expect(result.current.status).toBe('ready');
  });

  it('genuinely reaches the safe error state if the search pipeline throws, without crashing', () => {
    const throwingSearch = vi.fn(() => {
      throw new Error('synthetic prototype fault, never a real backend error');
    });

    const { result, rerender } = renderHook(
      ({ query }) =>
        useSearchExecution(syntheticListings, query, 'relevance', null, throwingSearch),
      { initialProps: { query: '' } },
    );

    // isPending is false immediately (committedQuery === query on mount),
    // so the throwing path is exercised on first render too.
    expect(result.current.status).toBe('error');
    expect(throwingSearch).toHaveBeenCalled();

    rerender({ query: 'anything' });
    act(() => {
      vi.advanceTimersByTime(SEARCH_LOADING_DELAY_MS);
    });
    expect(result.current.status).toBe('error');
  });
});
