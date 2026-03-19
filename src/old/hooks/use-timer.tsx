import { useCallback, useEffect, useState } from 'react';

export const useTimer = (initialDelay: number = 60): [number, () => void] => {
  const [timer, setTimer] = useState(initialDelay);
  const [active, setActive] = useState(true);

  useEffect((): void | (() => void) => {
    if (!active) return;

    const interval = setInterval((): void => {
      setTimer((prev): number => {
        if (prev <= 1) {
          clearInterval(interval);
          setActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return (): void => clearInterval(interval);
  }, [active]);

  const restart = useCallback((): void => {
    setTimer(initialDelay);
    setActive(true);
  }, [initialDelay]);

  return [timer, restart];
};
