import { useEffect, useRef, useSyncExternalStore, type FC } from 'react';
import { Box } from 'styled-system/jsx';
import { mascotScrollyStore } from './mascotScrollyStore.ts';
import { AptipiouVector } from './vector/index.ts';
import { useMascotAudio } from './useMascotAudio.ts';
import { FlightLeaves } from './FlightLeaves.tsx';
import {
  resolveFlightFrame,
  resolveLandingFrame,
  resolveFlightDeformation,
  resolveLandingTransform,
  type LandingPoseTransform,
} from './mascotFlightPhysics.ts';

function useLandingImpactAudio(state: string, landingStep: string): void {
  const audio = useMascotAudio({ enabled: true });
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (state === 'landing' && landingStep === 'impact') {
      if (!hasPlayedRef.current) {
        hasPlayedRef.current = true;
        audio.playLand();
      }
    } else if (state !== 'landing') {
      hasPlayedRef.current = false;
    }
  }, [state, landingStep, audio]);
}

interface ActorStyleParams {
  el: HTMLElement | null;
  x: number;
  y: number;
  size: number;
  rot: number;
  scaleX: number;
  scaleY: number;
}

function applyActorStyles(params: ActorStyleParams): void {
  const { el, x, y, size, rot, scaleX, scaleY } = params;
  if (!el) return;
  const half = Math.round(size / 2);
  const left = Math.round(x - half);
  const top = Math.round(y - half);

  el.style.transform = `translate3d(${left}px, ${top}px, 0) rotate(${rot}deg) scale(${scaleX}, ${scaleY})`;
  el.style.inlineSize = `${size}px`;
  el.style.blockSize = `${size}px`;
}

interface ActorLayout {
  size: number;
  targetX: number;
  targetY: number;
  angle: number;
  transform: LandingPoseTransform;
}

function computeActorLayout(
  isLanding: boolean,
  progress: number,
  landingStep: string,
): ActorLayout {
  const coords = mascotScrollyStore.getCurrentFlightCoords();
  const size = isLanding ? 192 : Math.round(88 + (192 - 88) * progress);
  const transform = isLanding
    ? resolveLandingTransform(landingStep)
    : resolveFlightDeformation(progress);

  return {
    size,
    targetX: isLanding ? coords.targetX : coords.currentX,
    targetY: (isLanding ? coords.targetY : coords.currentY) + transform.offsetY,
    angle: isLanding ? transform.rotateDeg : coords.angle,
    transform,
  };
}

export const MascotFlightActor: FC = () => {
  const scrollyState = useSyncExternalStore(
    mascotScrollyStore.subscribe,
    mascotScrollyStore.getSnapshot,
    mascotScrollyStore.getServerSnapshot,
  );

  const containerRef = useRef<HTMLElement | null>(null);
  useLandingImpactAudio(scrollyState.state, scrollyState.landingStep);

  const isFlying = scrollyState.state === 'flying';
  const isLanding = scrollyState.state === 'landing';
  const progress = scrollyState.flightProgress;

  const layout = computeActorLayout(isLanding, progress, scrollyState.landingStep);

  useEffect(() => {
    applyActorStyles({
      el: containerRef.current,
      x: layout.targetX,
      y: layout.targetY,
      size: layout.size,
      rot: layout.angle,
      scaleX: layout.transform.scaleX,
      scaleY: layout.transform.scaleY,
    });
  });

  if (!isFlying && !isLanding) {
    return null;
  }

  const frame = isLanding
    ? resolveLandingFrame(scrollyState.landingStep)
    : resolveFlightFrame(progress);

  const actorClass = isLanding
    ? `mascot-flight-overlay mascot-landing-actor mascot-landing-step-${scrollyState.landingStep}`
    : 'mascot-flight-overlay mascot-flying-actor';

  return (
    <Box ref={containerRef as never} className={actorClass} aria-hidden="true">
      {!isLanding && <FlightLeaves />}
      <AptipiouVector
        size={layout.size}
        body={frame.body}
        eyes={frame.eyes}
        beak={frame.beak}
        particle={frame.particle}
        className="mascot-flight-vector"
      />
    </Box>
  );
};
