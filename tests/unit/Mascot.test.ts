import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Mascot, MascotDialog } from '../../src/components/Mascot/index.ts';

const manifestPath = path.resolve('public/sprites/mascot/manifest.json');
const manifestExists = fs.existsSync(manifestPath);

describe.runIf(manifestExists)('Mascot Sprite System & Manifest', () => {
  it('generates a valid manifest with Solarized base03 outline and base3 highlights', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    expect(manifest.name).toBe('Robo-Bird Mascot');
    expect(manifest.palette.OUTLINE).toBe('#002b36'); // Solarized base03 (avoids black)
    expect(manifest.palette.BASE3_GLINT).toBe('#fdf6e3'); // Solarized base3 (avoids pure white)
    expect(Object.keys(manifest.palette).length).toBe(8);
    expect(manifest.frameSize).toEqual({ width: 384, height: 384 });
    expect(manifest.groundBaseline).toBe(360);

    // Verify all sprite files are referenced and exist
    const files = Object.values(manifest.files) as string[];
    expect(files.length).toBeGreaterThanOrEqual(38);
    expect(manifest.files['eye-closed']).toBe('/sprites/mascot/eye-closed.png');
    expect(manifest.files['idle']).toBe('/sprites/mascot/idle.png');

    for (const f of files) {
      const fullPath = path.resolve(path.join('public', f));
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('omits consonant 4 (lipstick lips) and eye-half as specified', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.files['consonant-4']).toBeUndefined();
    expect(manifest.files['talk-rw']).toBeUndefined();
    expect(manifest.files['eye-half']).toBeUndefined();
  });

  it('preserves full landing dust cloud on land-3', () => {
    const land3Path = path.resolve('public/sprites/mascot/land-3.png');
    expect(fs.existsSync(land3Path)).toBe(true);
    const stat = fs.statSync(land3Path);
    expect(stat.size).toBeGreaterThan(5000);
  });

  it('incorporates supplemental Nano Banana visemes and action sprites', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const files = Object.keys(manifest.files);
    expect(files.length).toBe(47);

    // Supplemental Visemes
    expect(manifest.files['talk-fv']).toBe('/sprites/mascot/talk-fv.png');
    expect(manifest.files['talk-lth']).toBe('/sprites/mascot/talk-lth.png');
    expect(manifest.files['talk-woo']).toBe('/sprites/mascot/talk-woo.png');
    expect(manifest.files['talk-shch']).toBe('/sprites/mascot/talk-shch.png');

    // Supplemental Actions
    expect(manifest.files['action-wave']).toBe('/sprites/mascot/action-wave.png');
    expect(manifest.files['action-thumbsup']).toBe('/sprites/mascot/action-thumbsup.png');
    expect(manifest.files['action-thinking']).toBe('/sprites/mascot/action-thinking.png');
    expect(manifest.files['action-celebrate']).toBe('/sprites/mascot/action-celebrate.png');

    // Supplemental Animations
    expect(manifest.animations['wave']).toBeDefined();
    expect(manifest.animations['celebrate']).toBeDefined();
  });
});

describe('Mascot React Components', () => {
  it('renders Mascot in idle state with vector SVG system', () => {
    const html = renderToString(createElement(Mascot, { size: 192 }));
    expect(html).toContain('mascot-container');
    expect(html).toContain('aptipiou-vector-svg');
    expect(html).toContain('mouth-shape-closed');
    expect(html).toContain('eye-left-pupil');
  });

  it.runIf(manifestExists)('vectorizes all body animation sprites into scalable SVG assets', () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(manifest.vectorFiles).toBeDefined();
    const vectorFiles = Object.values(manifest.vectorFiles) as string[];
    expect(vectorFiles.length).toBeGreaterThanOrEqual(47);

    // Verify key body animation SVGs exist
    expect(manifest.vectorFiles['fly-1']).toBe('/sprites/mascot/fly-1.svg');
    expect(manifest.vectorFiles['land-3']).toBe('/sprites/mascot/land-3.svg');
    expect(manifest.vectorFiles['action-wave']).toBe('/sprites/mascot/action-wave.svg');
    expect(manifest.vectorFiles['action-celebrate']).toBe('/sprites/mascot/action-celebrate.svg');

    for (const f of vectorFiles) {
      const fullPath = path.resolve(path.join('public', f));
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('renders vectorized SVG frames during flydown animation', () => {
    const html = renderToString(createElement(Mascot, { size: 192, animation: 'flydown' }));
    expect(html).toContain('mascot-container');
    expect(html).toContain('mascot-sprite-wrapper');
    expect(html).toContain('mascot-anim-flydown');
    expect(html).toContain('.svg');
  });

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
});
