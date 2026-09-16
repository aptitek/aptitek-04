import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Mascot, MascotDialog } from '../../src/components/Mascot/index.ts';

const MASCOT_DIR = path.resolve('public/mascot');

describe('Mascot Modular Vector Catalog', () => {
  it('manifest catalog.json exists and specifies 20 bodies, 20 beaks, 12 eyes, and 24 particles', () => {
    const catalogPath = path.join(MASCOT_DIR, 'catalog.json');
    expect(fs.existsSync(catalogPath)).toBe(true);

    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    expect(catalog.version).toBe('2.0.0');
    expect(Object.keys(catalog.categories.body).length).toBe(20);
    expect(Object.keys(catalog.categories.beak).length).toBe(20);
    expect(Object.keys(catalog.categories.eyes).length).toBe(12);
    expect(Object.keys(catalog.categories.particles).length).toBe(24);
  });

  it('includes all 9 speech viseme beaks in the modular catalog', () => {
    const speechVisemes = [
      'talk-closed',
      'talk-a',
      'talk-e',
      'talk-i',
      'talk-o',
      'talk-u',
      'talk-t',
      'talk-fv',
      'talk-wide',
    ];

    for (const viseme of speechVisemes) {
      const filePath = path.join(MASCOT_DIR, 'beak', `${viseme}.svg`);
      expect(fs.existsSync(filePath), `Speech viseme beak ${viseme}.svg must exist`).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('viewBox="0 0 512 512"');
    }
  });

  it('includes full flight and landing modular body sequences', () => {
    const flightBodies = ['fly-upstroke', 'fly-glide', 'fly-downstroke', 'fly-bank'];
    for (const f of flightBodies) {
      const filePath = path.join(MASCOT_DIR, 'body', `${f}.svg`);
      expect(fs.existsSync(filePath), `Flight body ${f}.svg must exist`).toBe(true);
    }

    const landingBodies = [
      'land-touchdown',
      'land-impact',
      'land-settle',
      'land-rebound',
      'land-stand',
    ];
    for (const l of landingBodies) {
      const filePath = path.join(MASCOT_DIR, 'body', `${l}.svg`);
      expect(fs.existsSync(filePath), `Landing body ${l}.svg must exist`).toBe(true);
    }
  });
});

describe('Mascot Core States & Animations', () => {
  it('renders Mascot in idle state with modular vector SVG system', () => {
    const html = renderToString(createElement(Mascot, { size: 192 }));
    expect(html).toContain('mascot-container');
    expect(html).toContain('aptipiou-vector-svg');
    expect(html).toContain('/mascot/body/standing.svg');
    expect(html).toContain('/mascot/eyes/open.svg');
    expect(html).toContain('/mascot/beak/default.svg');
    expect(html).toContain('mouth-shape-closed');
    expect(html).toContain('eye-left-pupil');
  });

  it('renders modular vector SVG frames during flydown animation', () => {
    const html = renderToString(createElement(Mascot, { size: 192, animation: 'flydown' }));
    expect(html).toContain('mascot-container');
    expect(html).toContain('aptipiou-vector-svg');
    expect(html).toContain('mascot-anim-flydown');
    expect(html).toContain('/mascot/body/fly-');
  });

  it('renders modular speech viseme beaks when speaking', () => {
    const htmlA = renderToString(createElement(Mascot, { size: 192, viseme: 'a' }));
    expect(htmlA).toContain('/mascot/beak/talk-a.svg');

    const htmlO = renderToString(createElement(Mascot, { size: 192, viseme: 'o' }));
    expect(htmlO).toContain('/mascot/beak/talk-o.svg');

    const htmlFV = renderToString(createElement(Mascot, { size: 192, viseme: 'fv' }));
    expect(htmlFV).toContain('/mascot/beak/talk-fv.svg');
  });

  it('renders emotional expressions with modular eyes, beaks, and particles', () => {
    const htmlShocked = renderToString(createElement(Mascot, { size: 192, expression: 'shocked' }));
    expect(htmlShocked).toContain('/mascot/eyes/shocked.svg');
    expect(htmlShocked).toContain('/mascot/beak/shocked.svg');
    expect(htmlShocked).toContain('/mascot/particles/emotes/shock-lines.svg');

    const htmlLove = renderToString(createElement(Mascot, { size: 192, expression: 'love' }));
    expect(htmlLove).toContain('/mascot/eyes/love.svg');
    expect(htmlLove).toContain('/mascot/beak/smile.svg');
    expect(htmlLove).toContain('/mascot/particles/hearts/heart-large.svg');
  });
});

describe('Mascot Dialog & Modular Vector Primitives', () => {
  it('renders MascotDialog with typewriter text container and controls', () => {
    const html = renderToString(
      createElement(MascotDialog, {
        script: [{ text: 'Hello Aptitek!' }],
        locale: 'en',
      }),
    );
    expect(html).toContain('mascot-dialog-bubble');
    expect(html).toContain('Aptipiou');
  });

  it('renders AptipiouVector with decoupled mouth visemes and eye states', async () => {
    const { AptipiouVector } = await import('../../src/components/Mascot/vector/index.ts');

    const openHtml = renderToString(
      createElement(AptipiouVector, { mouth: 'open', eyes: 'happy' }),
    );
    expect(openHtml).toContain('mouth-shape-open');
    expect(openHtml).toContain('aptipiou-eyes-happy');

    const roundHtml = renderToString(
      createElement(AptipiouVector, { mouth: 'round', eyes: 'blink' }),
    );
    expect(roundHtml).toContain('mouth-shape-round');
    expect(roundHtml).toContain('aptipiou-eyes-blink');

    const smileHtml = renderToString(
      createElement(AptipiouVector, { mouth: 'smile', eyes: 'wink' }),
    );
    expect(smileHtml).toContain('mouth-shape-smile');
    expect(smileHtml).toContain('aptipiou-eyes-wink');
  });

  it('renders AptipiouVector with modular body data attributes and exports useBodySvg hook', async () => {
    const { AptipiouVector } = await import('../../src/components/Mascot/vector/index.ts');
    const { useBodySvg, prefetchBodies } =
      await import('../../src/components/Mascot/vector/useBodySvg.ts');

    expect(typeof useBodySvg).toBe('function');
    expect(typeof prefetchBodies).toBe('function');

    const html = renderToString(
      createElement(AptipiouVector, {
        body: 'action-wave',
        beak: 'smile',
        eyes: 'happy',
        particle: 'sparkle',
      }),
    );
    expect(html).toContain('data-body="action-wave"');
    expect(html).toContain('data-beak="smile"');
    expect(html).toContain('data-eyes="happy"');
    expect(html).toContain('data-particle="sparkle"');
  });
});
