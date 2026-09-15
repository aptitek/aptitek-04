import type { FC } from 'react';
import { createElement } from 'react';
import { Switch } from 'reapti';
import { Box } from 'styled-system/jsx';
import { useSoundState } from './Mascot/useSoundState.ts';

export interface SoundSwitchProps {
  ariaLabel?: string | undefined;
  className?: string | undefined;
}

const VolumeOnIcon: FC = () =>
  createElement(
    'span',
    {
      className: 'material-symbols-rounded switch-mdi-icon',
      'aria-hidden': 'true',
    },
    'volume_up',
  );

const VolumeOffIcon: FC = () =>
  createElement(
    'span',
    {
      className: 'material-symbols-rounded switch-mdi-icon',
      'aria-hidden': 'true',
    },
    'volume_off',
  );

export const SoundSwitch: FC<SoundSwitchProps> = ({ ariaLabel, className }) => {
  const { soundEnabled, toggleSound } = useSoundState();

  const wrapperClass = className ? `sound-switch-wrapper ${className}` : 'sound-switch-wrapper';

  return (
    <Box className={wrapperClass}>
      <Switch
        checked={soundEnabled}
        onChange={toggleSound}
        size="medium"
        ariaLabel={ariaLabel ?? ''}
        dataTestId="sound-switch"
        handleIconOn={<VolumeOnIcon />}
        handleIconOff={<VolumeOffIcon />}
        peekingIconOn={<VolumeOffIcon />}
        peekingIconOff={<VolumeOnIcon />}
      />
    </Box>
  );
};
