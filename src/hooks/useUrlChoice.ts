import { useEffect, useRef, useState } from "react";

export function useUrlChoice<const T extends string>(
  key: string,
  allowedValues: readonly T[],
  fallback: T,
) {
  const allowedRef = useRef(allowedValues);
  const fallbackRef = useRef(fallback);
  allowedRef.current = allowedValues;
  fallbackRef.current = fallback;

  const readValue = () => {
    const requested = new URLSearchParams(window.location.search).get(key);
    return requested && allowedRef.current.includes(requested as T)
      ? requested as T
      : fallbackRef.current;
  };

  const [value, setValue] = useState<T>(readValue);

  useEffect(() => {
    const syncFromUrl = () => setValue(readValue());
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [key]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (value === fallback) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [fallback, key, value]);

  return [value, setValue] as const;
}
