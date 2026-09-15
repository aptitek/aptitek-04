import type { FC, KeyboardEvent } from 'react';
import { useState, useCallback } from 'react';
import { Box } from 'styled-system/jsx';
import type { SupportedLocale } from '../../i18n/index.ts';
import { useTranslations } from '../../i18n/index.ts';
import { Mascot } from './Mascot.tsx';
import { MascotDialog } from './MascotDialog.tsx';
import type { MascotAnimation, MascotExpression, MascotViseme, DialogStep } from './types.ts';
import './mascot.css';

const DEFAULT_SCRIPT: DialogStep[] = [
  { text: "Pik-pik! [surprise] Hi there! I'm your Aptitek Robo-Bird companion.", audioPitch: 580 },
  {
    text: '[love] Crafted with crisp Solarized pixel art and zero blurry interpolation!',
    audioPitch: 640,
  },
  {
    text: '[happy] Click on me anytime to play, or test my visemes and animations!',
    audioPitch: 600,
  },
];

export interface MascotWidgetProps {
  initialVisible?: boolean | undefined;
  script?: DialogStep[] | undefined;
  className?: string | undefined;
  locale?: SupportedLocale | undefined;
}

function handleKey(cb: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cb();
    }
  };
}

const MascotControls: FC<{ locale: SupportedLocale; onRefly: () => void; onClose: () => void }> = ({
  locale,
  onRefly,
  onClose,
}) => {
  const t = useTranslations(locale);
  return (
    <Box display="flex" gap="6px" marginBlockStart="6px">
      <Box
        role="button"
        tabIndex={0}
        onClick={onRefly}
        onKeyDown={handleKey(onRefly)}
        className="mascot-summon-btn"
      >
        <Box as="span">{t.mascotRefly}</Box>
      </Box>
      <Box
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={handleKey(onClose)}
        className="mascot-summon-btn"
        aria-label={t.mascotClose}
      >
        <Box as="span">{t.mascotClose}</Box>
      </Box>
    </Box>
  );
};

const MascotSummonButton: FC<{
  locale: SupportedLocale;
  className: string;
  onSummon: () => void;
}> = ({ locale, className, onSummon }) => {
  const t = useTranslations(locale);
  return (
    <Box className={`mascot-widget-wrapper ${className}`}>
      <Box
        role="button"
        tabIndex={0}
        onClick={onSummon}
        onKeyDown={handleKey(onSummon)}
        className="mascot-summon-btn"
        aria-label={t.mascotSummon}
      >
        <Box as="span">🐦</Box>
        <Box as="span">{t.mascotSummon}</Box>
      </Box>
    </Box>
  );
};

function useMascotPoke(
  setAnim: (a: MascotAnimation) => void,
  setExpr: (e: MascotExpression) => void,
) {
  const [pokes, setPokes] = useState(0);
  return useCallback(() => {
    const list: Array<{ a: MascotAnimation; e: MascotExpression }> = [
      { a: 'happy', e: 'laugh' },
      { a: 'idle', e: 'surprise' },
      { a: 'idle', e: 'laugh' },
      { a: 'idle', e: 'love' },
      { a: 'idle', e: 'blush' },
      { a: 'idle', e: 'wink' },
    ];
    const pick = list[pokes % list.length];
    if (pick) {
      setAnim(pick.a);
      setExpr(pick.e);
    }
    setPokes((p) => p + 1);
    setTimeout(() => setExpr('idle'), 1800);
  }, [pokes, setAnim, setExpr]);
}

interface MascotStageProps {
  script?: DialogStep[] | undefined;
  sound: boolean;
  locale: SupportedLocale;
  dialogActive: boolean;
  anim: MascotAnimation;
  expr: MascotExpression;
  vis: MascotViseme;
  onSoundToggle: () => void;
  onVisemeChange: (v: MascotViseme) => void;
  onExpressionChange: (e: MascotExpression) => void;
  onDialogComplete: () => void;
  onLandingEnd: () => void;
  onPoke: () => void;
}

const MascotStage: FC<MascotStageProps> = (props) => (
  <Box position="relative">
    {props.dialogActive && (
      <MascotDialog
        script={props.script ?? DEFAULT_SCRIPT}
        soundEnabled={props.sound}
        locale={props.locale}
        onSoundToggle={props.onSoundToggle}
        onVisemeChange={props.onVisemeChange}
        onExpressionChange={props.onExpressionChange}
        onComplete={props.onDialogComplete}
      />
    )}
    <Mascot
      animation={props.anim}
      expression={props.expr}
      viseme={props.vis}
      size={160}
      onAnimationEnd={(a) => {
        if (a === 'landing') props.onLandingEnd();
      }}
      onClick={props.onPoke}
    />
  </Box>
);

export const MascotWidget: FC<MascotWidgetProps> = (props) => {
  const loc = props.locale ?? 'en';
  const [visible, setVisible] = useState(props.initialVisible ?? false);
  const [anim, setAnim] = useState<MascotAnimation>('idle');
  const [expr, setExpr] = useState<MascotExpression>('idle');
  const [vis, setVis] = useState<MascotViseme>('closed');
  const [dialogActive, setDialogActive] = useState(false);
  const [sound, setSound] = useState(true);
  const handlePoke = useMascotPoke(setAnim, setExpr);

  if (!visible) {
    return (
      <MascotSummonButton
        locale={loc}
        className={props.className ?? ''}
        onSummon={() => {
          setVisible(true);
          setAnim('flydown');
        }}
      />
    );
  }

  return (
    <Box className={`mascot-widget-wrapper ${props.className ?? ''}`}>
      <MascotStage
        script={props.script}
        sound={sound}
        locale={loc}
        dialogActive={dialogActive}
        anim={anim}
        expr={expr}
        vis={vis}
        onSoundToggle={() => setSound((prev) => !prev)}
        onVisemeChange={(v) => {
          setVis(v);
          setAnim(v !== 'closed' ? 'speaking' : 'idle');
        }}
        onExpressionChange={setExpr}
        onDialogComplete={() => setDialogActive(false)}
        onLandingEnd={() => {
          setAnim('idle');
          setDialogActive(true);
        }}
        onPoke={handlePoke}
      />
      <MascotControls
        locale={loc}
        onRefly={() => {
          setAnim('flydown');
          setDialogActive(false);
        }}
        onClose={() => setVisible(false)}
      />
    </Box>
  );
};
