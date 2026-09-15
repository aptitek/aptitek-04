import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'aptitek-mascot-sound';
const EVENT_KEY = 'aptitek-sound-change';

function getStoredSound(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function useSoundState(propSound?: boolean, onToggle?: () => void) {
  const [internal, setInternal] = useState(getStoredSound);
  const soundEnabled = propSound ?? internal;

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      if (typeof custom.detail === 'boolean') {
        setInternal(custom.detail);
      } else {
        setInternal(getStoredSound());
      }
    };
    window.addEventListener(EVENT_KEY, handleEvent);
    window.addEventListener('storage', handleEvent);
    return () => {
      window.removeEventListener(EVENT_KEY, handleEvent);
      window.removeEventListener('storage', handleEvent);
    };
  }, []);

  const toggleSound = useCallback(() => {
    if (onToggle) {
      onToggle();
      return;
    }
    setInternal((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore storage error
      }
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: next }));
      return next;
    });
  }, [onToggle]);

  return { soundEnabled, toggleSound };
}
