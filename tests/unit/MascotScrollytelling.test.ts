import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import {
  mascotScrollyStore,
  MascotBranchPerch,
  MascotFlightActor,
} from '../../src/components/Mascot/index.ts';
import { MascotTerminalStage } from '../../src/components/Mascot/MascotTerminalStage.tsx';

describe('Mascot Scrollytelling Architecture & Store', () => {
  it('initializes store snapshot with valid state', () => {
    const snapshot = mascotScrollyStore.getSnapshot();
    expect(snapshot).toBeDefined();
    expect(['sleeping', 'waking', 'flying', 'landing', 'landed']).toContain(snapshot.state);
  });

  it('transitions state through flight, landing, and landed', () => {
    mascotScrollyStore.resetToSleep();
    let snap = mascotScrollyStore.getSnapshot();
    expect(snap.state).toBe('sleeping');
    expect(snap.hasLanded).toBe(false);

    mascotScrollyStore.triggerFlight();
    snap = mascotScrollyStore.getSnapshot();
    expect(snap.state).toBe('waking');

    mascotScrollyStore.triggerLanding();
    snap = mascotScrollyStore.getSnapshot();
    expect(snap.state).toBe('landing');

    mascotScrollyStore.completeLanding();
    snap = mascotScrollyStore.getSnapshot();
    expect(snap.state).toBe('landed');
    expect(snap.hasLanded).toBe(true);

    mascotScrollyStore.resetToSleep();
    snap = mascotScrollyStore.getSnapshot();
    expect(snap.state).toBe('sleeping');
    expect(snap.hasLanded).toBe(false);
  });

  it('computes aerodynamic bezier curve coordinates with banking rotation', () => {
    const coords = mascotScrollyStore.getCurrentFlightCoords();
    expect(coords).toBeDefined();
    expect(typeof coords.startX).toBe('number');
    expect(typeof coords.startY).toBe('number');
    expect(typeof coords.currentX).toBe('number');
    expect(typeof coords.currentY).toBe('number');
    expect(typeof coords.angle).toBe('number');
    expect(coords.angle).toBeGreaterThanOrEqual(-30);
    expect(coords.angle).toBeLessThanOrEqual(40);
  });
});

describe('MascotBranchPerch Component', () => {
  it('renders perched sleeping mascot with wind sway and floating zzz', () => {
    mascotScrollyStore.resetToSleep();
    const html = renderToString(createElement(MascotBranchPerch));

    // When sleeping at top, renders perch with wind sway and sleep vector
    expect(html).toContain('mascot-branch-perch');
    expect(html).toContain('mascot-branch-sway');
    expect(html).toContain('mascot-sleep-breathing');
    expect(html).toContain('mascot-breeze-zzz');
    expect(html).toContain('mascot-zzz-particle');
    expect(html).toContain('/mascot/body/sleep.svg');
    expect(html).toContain('/mascot/eyes/blink.svg');
    expect(html).toContain('/mascot/beak/sleep.svg');
    expect(html).toContain('data-particle="bubbles"');
  });

  it('hides branch perch when mascot has landed or is flying', () => {
    mascotScrollyStore.completeLanding();
    const html = renderToString(createElement(MascotBranchPerch));
    expect(html).toBe('');
    mascotScrollyStore.resetToSleep();
  });
});

describe('MascotFlightActor Component', () => {
  it('returns null when not actively flying or landing', () => {
    mascotScrollyStore.resetToSleep();
    const html = renderToString(createElement(MascotFlightActor));
    expect(html).toBe('');
  });

  it('progresses through landing choreography steps', () => {
    mascotScrollyStore.triggerLanding();
    const snap = mascotScrollyStore.getSnapshot();
    expect(snap.state).toBe('landing');
    expect(['happy-land', 'impact', 'rebound', 'settle', 'standing']).toContain(snap.landingStep);
    mascotScrollyStore.resetToSleep();
  });
});

describe('MascotTerminalStage Component', () => {
  it('renders landing target perch indicator without any ghost mascot when waiting for landing', () => {
    const htmlWaiting = renderToString(
      createElement(MascotTerminalStage, {
        animation: 'idle',
        expression: 'idle',
        viseme: 'closed',
        alt: 'Mascot',
        onPoke: () => {},
        isLanded: false,
      }),
    );
    expect(htmlWaiting).toContain('mascot-stage--waiting');
    expect(htmlWaiting).toContain('mascot-stage-target-perch');
    // Ensure no ghost of the mascot is rendered on stage while waiting
    expect(htmlWaiting).not.toContain('mascot-container');
    expect(htmlWaiting).not.toContain('aptipiou-vector-svg');

    const htmlLanded = renderToString(
      createElement(MascotTerminalStage, {
        animation: 'idle',
        expression: 'idle',
        viseme: 'closed',
        alt: 'Mascot',
        onPoke: () => {},
        isLanded: true,
      }),
    );
    expect(htmlLanded).toContain('mascot-stage--landed');
    expect(htmlLanded).not.toContain('mascot-stage-target-perch');
    expect(htmlLanded).toContain('mascot-container');
  });
});
