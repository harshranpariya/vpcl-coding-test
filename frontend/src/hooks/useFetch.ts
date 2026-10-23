import { useCallback, useEffect, useState } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export function useFetch<T>(load: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<FetchState<T>>({ data: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false; // ignore a result that lands after deps changed or the page unmounted
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ data: null, error: null, loading: true });
    load().then(
      (data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      },
      (error: unknown) => {
        if (!cancelled) setState({ data: null, error: toError(error), loading: false });
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const setData = useCallback((data: T) => setState({ data, error: null, loading: false }), []);

  return { ...state, retry, setData };
}

const toError = (e: unknown): Error => (e instanceof Error ? e : new Error('Something went wrong'));
