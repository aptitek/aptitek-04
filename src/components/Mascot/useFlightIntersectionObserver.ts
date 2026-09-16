import { useEffect, type RefObject } from 'react';
import { mascotScrollyStore } from './mascotScrollyStore.ts';

export function useFlightIntersectionObserver(elementRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            mascotScrollyStore.getSnapshot().state === 'sleeping' &&
            mascotScrollyStore.getScrollY() > 60
          ) {
            mascotScrollyStore.triggerFlight();
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [elementRef]);
}
