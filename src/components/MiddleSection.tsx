import type { FC } from 'react';
import type { SupportedLocale } from '../i18n/index.ts';
import { MascotDialog } from './Mascot/index.ts';

export interface MiddleSectionProps {
  locale?: SupportedLocale;
  className?: string;
  'data-testid'?: string;
}

/**
 * Aptitek Middle Section Organism
 * Replaced by the interactive MascotDialog terminal component featuring
 * the animated robot-bird mascot on the left, speech bubble in Recursive Casual Mono,
 * and Undertale-style cheep voice font on the right.
 */
export const MiddleSection: FC<MiddleSectionProps> = ({
  locale = 'fr',
  className,
  'data-testid': dataTestId = 'aptitek-middle-section',
}) => {
  return <MascotDialog locale={locale} className={className} data-testid={dataTestId} />;
};
