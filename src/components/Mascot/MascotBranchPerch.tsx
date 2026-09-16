import { useSyncExternalStore, type FC, type KeyboardEvent } from 'react';
import { Box } from 'styled-system/jsx';
import { mascotScrollyStore } from './mascotScrollyStore.ts';
import { AptipiouVector } from './vector/index.ts';
import { useMascotAudio } from './useMascotAudio.ts';
import { Svg, Path } from './vector/svg-primitives.ts';

export interface MascotBranchPerchProps {
  className?: string;
  onWake?: () => void;
  ariaLabel?: string;
  title?: string;
}

function handleWakeInteraction(
  audio: ReturnType<typeof useMascotAudio>,
  onWake?: () => void,
): void {
  audio.playChirp(680, 0.08);
  onWake?.();
  mascotScrollyStore.triggerFlight();

  const targetSection = document.querySelector('.mascot-terminal-section');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function handlePerchKey(e: KeyboardEvent, trigger: () => void): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    trigger();
  }
}

function shouldHidePerch(state: string, hasLanded: boolean): boolean {
  if (hasLanded) return true;
  return state === 'flying' || state === 'landing';
}

function SleepingParticles(): React.ReactNode {
  return (
    <Box className="mascot-breeze-zzz" aria-hidden="true">
      <Svg viewBox="0 0 16 16" className="mascot-zzz-particle zzz-1">
        <Path
          d="M3 4h8L4 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Svg viewBox="0 0 16 16" className="mascot-zzz-particle zzz-2">
        <Path
          d="M3 4h8L4 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      <Svg viewBox="0 0 16 16" className="mascot-zzz-particle zzz-3">
        <Path
          d="M3 4h8L4 12h8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Box>
  );
}

function PerchVector({ isWaking }: { isWaking: boolean }): React.ReactNode {
  if (isWaking) {
    return (
      <AptipiouVector
        size={88}
        body="wakeup-stretch"
        eyes="open"
        beak="default"
        className="mascot-branch-vector"
      />
    );
  }
  return (
    <AptipiouVector
      size={88}
      body="sleep"
      eyes="blink"
      beak="sleep"
      particle="bubbles"
      className="mascot-branch-vector"
    />
  );
}

export const MascotBranchPerch: FC<MascotBranchPerchProps> = (props) => {
  const scrollyState = useSyncExternalStore(
    mascotScrollyStore.subscribe,
    mascotScrollyStore.getSnapshot,
    mascotScrollyStore.getServerSnapshot,
  );

  const audio = useMascotAudio({ enabled: true });

  if (shouldHidePerch(scrollyState.state, scrollyState.hasLanded)) {
    return null;
  }

  const isWaking = scrollyState.state === 'waking';
  const trigger = () => handleWakeInteraction(audio, props.onWake);
  const perchClass = props.className
    ? `mascot-branch-perch ${props.className}`
    : 'mascot-branch-perch';
  const swayClass = isWaking ? 'mascot-branch-sway mascot-waking-sway' : 'mascot-branch-sway';
  const breathClass = isWaking
    ? 'mascot-sleep-breathing mascot-waking-stretch'
    : 'mascot-sleep-breathing';

  return (
    <Box
      className={perchClass}
      role="button"
      tabIndex={0}
      onClick={trigger}
      onKeyDown={(e: KeyboardEvent) => handlePerchKey(e, trigger)}
      aria-label={props.ariaLabel}
      title={props.title}
    >
      <Box className={swayClass}>
        <Box className={breathClass}>
          <PerchVector isWaking={isWaking} />
        </Box>
        {!isWaking && <SleepingParticles />}
      </Box>
    </Box>
  );
};
