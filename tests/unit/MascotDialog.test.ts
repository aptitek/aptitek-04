import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { useTranslations } from '../../src/i18n/index.ts';
import { MascotDialog } from '../../src/components/Mascot/MascotDialog.tsx';
import { MiddleSection } from '../../src/components/MiddleSection.tsx';

describe('MascotDialog Component & Architecture', () => {
  it('exports MascotDialog and MiddleSection correctly', () => {
    expect(MascotDialog).toBeDefined();
    expect(MiddleSection).toBeDefined();
  });

  it('provides bilingual dialogue scripts and terminal metadata in i18n', () => {
    const tFr = useTranslations('fr');
    const tEn = useTranslations('en');

    expect(tFr.mascotTerminalTitle).toContain('aptipiou-terminal');
    expect(tFr.mascotDialogueStep1).toContain('Aptipiou');
    expect(tFr.mascotDialogueStep2).toContain('XP');
    expect(tFr.mascotDialogueStep3).toContain('modules');
    expect(tFr.mascotReplay).toBeDefined();

    expect(tEn.mascotTerminalTitle).toContain('aptipiou-terminal');
    expect(tEn.mascotDialogueStep1).toContain('Aptipiou');
    expect(tEn.mascotDialogueStep2).toContain('XP');
    expect(tEn.mascotDialogueStep3).toContain('modules');
    expect(tEn.mascotReplay).toBeDefined();
  });

  it('defines Recursive Casual Mono typography and terminal styling in mascot.css', () => {
    const cssPath = resolve(process.cwd(), 'src/components/Mascot/mascot.css');
    const css = readFileSync(cssPath, 'utf8');

    expect(css).toContain('.mascot-terminal-section');
    expect(css).toContain('.mascot-terminal-bubble');
    expect(css).toContain('.mascot-speech-bubble');
    expect(css).toContain('.mascot-bubble-tail');
    expect(css).toContain('.mascot-dialog-mono-text');
    expect(css).toContain('var(--font-body)');
    expect(css).toContain("'CASL' 1");
    expect(css).toContain("'MONO' 1");
  });

  it('implements Undertale-style cheep voice font in useMascotAudio.ts', () => {
    const audioPath = resolve(process.cwd(), 'src/components/Mascot/useMascotAudio.ts');
    const audioCode = readFileSync(audioPath, 'utf8');

    expect(audioCode).toContain('playCheepVoice');
    expect(audioCode).toContain('createCheepVoice');
    expect(audioCode).toContain('lowpass');
    expect(audioCode).toContain('aeiouy');
  });

  it('ensures MiddleSection renders MascotDialog as the central landing organism', () => {
    const middleSectionPath = resolve(process.cwd(), 'src/components/MiddleSection.tsx');
    const code = readFileSync(middleSectionPath, 'utf8');

    expect(code).toContain('MascotDialog');
    expect(code).toContain('locale={locale}');
  });
});
