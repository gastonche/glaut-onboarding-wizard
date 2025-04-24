import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSampleMutation } from '../use-sample-mutation';

describe('useSampleMutation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global.Math, 'random').mockReturnValue(0.5); // Simulate 1000ms delay
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with loading as false', () => {
    const { result } = renderHook(() => useSampleMutation());
    expect(result.current.loading).toBe(false);
  });

  it('should set loading true, wait, then set loading false', async () => {
    const { result } = renderHook(() => useSampleMutation());

    act(() => {
      result.current.mutate();
    });

    expect(result.current.loading).toBe(true);

    // Fast forward time
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should log the duration', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { result } = renderHook(() => useSampleMutation());

    act(() => {
      result.current.mutate();
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(logSpy).toHaveBeenCalledWith('Mutating in 1000ms...');
    logSpy.mockRestore();
  });

  it('should handle zero delay properly', async () => {
    vi.restoreAllMocks();
    vi.spyOn(global.Math, 'random').mockReturnValue(0); // 0ms delay

    const { result } = renderHook(() => useSampleMutation());

    act(() => {
      result.current.mutate();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.loading).toBe(false);
  });
});
