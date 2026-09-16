import { computeFlightCoordinates, type FlightCoordinates } from './mascotFlightPhysics.ts';

type MascotScrollyState = 'sleeping' | 'waking' | 'flying' | 'landing' | 'landed';

type MascotLandingStep = 'none' | 'happy-land' | 'impact' | 'rebound' | 'settle' | 'standing';

interface MascotScrollySnapshot {
  state: MascotScrollyState;
  landingStep: MascotLandingStep;
  hasLanded: boolean;
  isAtTop: boolean;
  flightProgress: number; // 0 to 1
}

type Listener = () => void;

class MascotScrollyCoordinator {
  private state: MascotScrollyState = 'sleeping';
  private landingStep: MascotLandingStep = 'none';
  private hasLanded = false;
  private flightProgress = 0;
  private listeners = new Set<Listener>();
  private isInitialized = false;
  private flightRafId: number | null = null;
  private flightStartTime = 0;
  private landingTimeouts: number[] = [];
  private flightDurationMs = 2200;

  // Cached anchor coordinates
  private flightStartCoords = { x: 0, y: 0 };
  private flightTargetCoords = { x: 0, y: 0 };

  public constructor() {
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
      } else {
        setTimeout(() => this.init(), 0);
      }
    }
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    const currentScroll = this.getScrollY();

    if (currentScroll > 260) {
      this.state = 'landed';
      this.landingStep = 'standing';
      this.hasLanded = true;
      this.flightProgress = 1;
      this.notify();
    } else {
      this.state = 'sleeping';
      this.landingStep = 'none';
      this.hasLanded = false;
      this.flightProgress = 0;
      this.notify();
    }

    const handleScroll = () => this.onScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  public getScrollY(): number {
    if (typeof window === 'undefined') return 0;
    const mainContent = document.getElementById('main-content');
    return window.scrollY || document.documentElement.scrollTop || mainContent?.scrollTop || 0;
  }

  private currentSnapshot: MascotScrollySnapshot = {
    state: 'sleeping',
    landingStep: 'none',
    hasLanded: false,
    isAtTop: true,
    flightProgress: 0,
  };

  private updateSnapshot() {
    const isAtTop = this.getScrollY() < 50;
    if (
      this.currentSnapshot.state === this.state &&
      this.currentSnapshot.landingStep === this.landingStep &&
      this.currentSnapshot.hasLanded === this.hasLanded &&
      this.currentSnapshot.isAtTop === isAtTop &&
      this.currentSnapshot.flightProgress === this.flightProgress
    ) {
      return;
    }
    this.currentSnapshot = {
      state: this.state,
      landingStep: this.landingStep,
      hasLanded: this.hasLanded,
      isAtTop,
      flightProgress: this.flightProgress,
    };
  }

  private onScroll() {
    const scrollY = this.getScrollY();

    if (scrollY < 40 && (this.state === 'landed' || this.hasLanded)) {
      this.resetToSleep();
      return;
    }

    if (scrollY > 30 && this.state === 'sleeping') {
      this.triggerFlight();
    }
  }

  public getSnapshot = (): MascotScrollySnapshot => this.currentSnapshot;

  public getServerSnapshot = (): MascotScrollySnapshot => this.currentSnapshot;

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify() {
    this.updateSnapshot();
    for (const listener of this.listeners) {
      listener();
    }
  }

  public getBranchAnchor(): { x: number; y: number } {
    if (typeof document === 'undefined') return { x: 120, y: 300 };
    const perch = document.querySelector('.mascot-branch-perch');
    if (perch) {
      const rect = perch.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    const tree = document.getElementById('peacefulTreeContainer');
    if (!tree) return { x: window.innerWidth * 0.18, y: window.innerHeight * 0.55 };
    const rect = tree.getBoundingClientRect();
    return { x: rect.left + rect.width * 0.63, y: rect.top + rect.height * 0.4 };
  }

  public getStageAnchor(): { x: number; y: number } {
    if (typeof document === 'undefined') return { x: 300, y: 450 };
    const stage =
      document.querySelector('.mascot-stage') || document.querySelector('.mascot-stage-wrapper');
    if (stage) {
      const rect = stage.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
    return { x: window.innerWidth * 0.25, y: window.innerHeight * 0.45 };
  }

  public triggerFlight = () => {
    if (this.state === 'flying' || this.state === 'landing' || this.state === 'landed') return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.completeLanding();
      return;
    }

    this.state = 'waking';
    this.notify();

    this.flightStartCoords = this.getBranchAnchor();
    this.flightTargetCoords = this.getStageAnchor();

    setTimeout(() => {
      if (this.state !== 'waking') return;
      this.state = 'flying';
      this.flightProgress = 0;
      this.flightStartTime = performance.now();
      this.notify();
      this.runFlightLoop();
    }, 600);
  };

  private runFlightLoop = () => {
    if (this.flightRafId) cancelAnimationFrame(this.flightRafId);

    const tick = (now: number) => {
      const elapsed = now - this.flightStartTime;
      const progress = Math.min(elapsed / this.flightDurationMs, 1);
      this.flightProgress = progress;
      this.flightTargetCoords = this.getStageAnchor();

      if (progress >= 1) {
        this.triggerLanding();
      } else {
        this.notify();
        this.flightRafId = requestAnimationFrame(tick);
      }
    };

    this.flightRafId = requestAnimationFrame(tick);
  };

  private clearLandingTimeouts() {
    for (const id of this.landingTimeouts) {
      clearTimeout(id);
    }
    this.landingTimeouts = [];
  }

  public triggerLanding = () => {
    if (this.flightRafId) {
      cancelAnimationFrame(this.flightRafId);
      this.flightRafId = null;
    }
    this.clearLandingTimeouts();
    this.state = 'landing';
    this.flightProgress = 1;

    this.landingStep = 'happy-land';
    this.notify();

    const t1 = setTimeout(() => {
      this.landingStep = 'impact';
      this.notify();
    }, 420) as unknown as number;

    const t2 = setTimeout(() => {
      this.landingStep = 'rebound';
      this.notify();
    }, 840) as unknown as number;

    const t3 = setTimeout(() => {
      this.landingStep = 'settle';
      this.notify();
    }, 1300) as unknown as number;

    const t4 = setTimeout(() => {
      this.landingStep = 'standing';
      this.notify();
    }, 1720) as unknown as number;

    const t5 = setTimeout(() => {
      this.completeLanding();
    }, 2050) as unknown as number;

    this.landingTimeouts.push(t1, t2, t3, t4, t5);
  };

  public completeLanding = () => {
    this.clearLandingTimeouts();
    this.state = 'landed';
    this.landingStep = 'standing';
    this.hasLanded = true;
    this.notify();
  };

  public resetToSleep = () => {
    if (this.flightRafId) {
      cancelAnimationFrame(this.flightRafId);
      this.flightRafId = null;
    }
    this.clearLandingTimeouts();
    this.state = 'sleeping';
    this.landingStep = 'none';
    this.hasLanded = false;
    this.flightProgress = 0;
    this.notify();
  };

  public getCurrentFlightCoords(): FlightCoordinates {
    return computeFlightCoordinates(
      this.flightProgress,
      this.flightStartCoords,
      this.flightTargetCoords,
    );
  }
}

export const mascotScrollyStore = new MascotScrollyCoordinator();
