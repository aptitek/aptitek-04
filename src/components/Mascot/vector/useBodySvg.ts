import { useEffect, useState } from 'react';

const CACHE = new Map<string, string>();
const PENDING = new Map<string, Promise<string>>();

function extractCharacterMarkup(svgText: string): string {
  const match = svgText.match(/<g id="mascot_character"[\s\S]*<\/g>\s*<\/svg>/);
  if (match) {
    return match[0].replace(/<\/svg>\s*$/, '');
  }
  return svgText;
}

function fetchBodySvgInternal(body: string): Promise<string> {
  if (CACHE.has(body)) {
    return Promise.resolve(CACHE.get(body)!);
  }
  if (PENDING.has(body)) {
    return PENDING.get(body)!;
  }

  if (typeof window === 'undefined') {
    return Promise.resolve('');
  }

  const promise = fetch(`/mascot/body/${body}.svg`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching body SVG: ${body}`);
      return res.text();
    })
    .then((text) => {
      const markup = extractCharacterMarkup(text);
      CACHE.set(body, markup);
      PENDING.delete(body);
      return markup;
    })
    .catch((err) => {
      PENDING.delete(body);
      console.warn(`[useBodySvg] Could not load /mascot/body/${body}.svg`, err);
      return '';
    });

  PENDING.set(body, promise);
  return promise;
}

export function prefetchBodies(bodies: string[]): void {
  if (typeof window === 'undefined') return;
  for (const b of bodies) {
    if (!CACHE.has(b) && !PENDING.has(b)) {
      void fetchBodySvgInternal(b);
    }
  }
}

export function useBodySvg(body: string): string {
  const [content, setContent] = useState<string>(() => CACHE.get(body) ?? '');
  const cached = CACHE.get(body);
  const activeContent = cached ?? content;

  useEffect(() => {
    if (CACHE.has(body)) {
      return;
    }

    let active = true;
    void fetchBodySvgInternal(body).then((markup) => {
      if (active && markup) {
        setContent(markup);
      }
    });

    return () => {
      active = false;
    };
  }, [body]);

  return activeContent;
}
