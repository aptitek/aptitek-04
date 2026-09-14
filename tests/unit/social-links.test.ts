import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { SocialLinks } from '../../src/components/SocialLinks.tsx';

describe('SocialLinks Specifications', () => {
  it('renders LinkedIn, GitHub, Bluesky, and Telegram without X/Twitter', () => {
    const html = renderToString(createElement(SocialLinks, { locale: 'en' }));

    // Verify 4 active platforms exist with their data attributes and classes
    expect(html).toContain('data-social="linkedin"');
    expect(html).toContain('social-icon-btn--linkedin');
    expect(html).toContain('data-social="github"');
    expect(html).toContain('social-icon-btn--github');
    expect(html).toContain('data-social="bluesky"');
    expect(html).toContain('social-icon-btn--bluesky');
    expect(html).toContain('data-social="telegram"');
    expect(html).toContain('social-icon-btn--telegram');

    // Verify X / Twitter is completely absent
    expect(html).not.toContain('x.com');
    expect(html).not.toContain('twitter.com');
    expect(html).not.toContain('data-social="x"');
    expect(html).not.toContain('social-icon-btn--x');
  });

  it('renders correct localized labels in French and English', () => {
    const htmlEn = renderToString(createElement(SocialLinks, { locale: 'en' }));
    expect(htmlEn).toContain('Antoine Gréa on LinkedIn');
    expect(htmlEn).toContain('Aptitek on GitHub');
    expect(htmlEn).toContain('Aptitek on Bluesky');
    expect(htmlEn).toContain('Aptitek on Telegram');

    const htmlFr = renderToString(createElement(SocialLinks, { locale: 'fr' }));
    expect(htmlFr).toContain('Antoine Gréa sur LinkedIn');
    expect(htmlFr).toContain('Aptitek sur GitHub');
    expect(htmlFr).toContain('Aptitek sur Bluesky');
    expect(htmlFr).toContain('Aptitek sur Telegram');
  });
});
