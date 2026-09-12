import { useCallback, useEffect, useState } from "react";

/**
 * Small reusable async-fetch hook so pages don't each hand-roll
 * loading/error/data state management.
 *
 * Usage: const { data, loading, error, reload } = useAsync(() => fetchThing(), [deps]);
 */
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    asyncFn()
      .then((result) => setData(result))
      .catch((err) => setError(err.message || "Something went wrong."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
