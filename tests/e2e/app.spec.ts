import { test, expect } from '@playwright/test';

test('English landing page renders SeasonHero with Milkshake font and M3e slider', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Aptitek/i);
  await expect(page.locator('#app-root')).toBeVisible();
  await expect(page.locator('.app-header')).toBeVisible();

  // Verify SeasonHero organism
  const seasonHero = page.locator('[data-testid="season-hero"]');
  await expect(seasonHero).toBeVisible();

  // Verify HeroTicker with new English slogan
  const ticker = page.locator('[data-testid="season-hero-ticker"]');
  await expect(ticker).toBeVisible();
  await expect(ticker).toContainText('Step by step,');
  await expect(ticker).toContainText('Apti');
  await expect(ticker).toContainText('-tude for');
  await expect(ticker).toContainText('takes its flight !');

  // Verify Brand Name in Milkshake font
  const brandMilkshake = page.locator('.brand-name-milkshake');
  await expect(brandMilkshake).toBeVisible();
  await expect(brandMilkshake).toContainText('Apti');

  // Verify M3e Season Slider Dock
  const sliderDock = page.locator('[data-testid="season-slider-dock"]');
  await expect(sliderDock).toBeVisible();

  const m3eSlider = page.locator('[data-testid="season-m3e-slider"]');
  await expect(m3eSlider).toBeVisible();
});

test('French localized page renders Petit Apti and French proverb', async ({ page }) => {
  await page.goto('/fr');
  await expect(page).toHaveTitle(/Aptitek 04/i);

  // Check language switch link
  const localeSwitch = page.locator('[data-testid="locale-switch"]');
  await expect(localeSwitch).toBeVisible();
  await expect(localeSwitch).toHaveText('EN');

  // Verify French copy
  const ticker = page.locator('[data-testid="season-hero-ticker"]');
  await expect(ticker).toBeVisible();
  await expect(ticker).toContainText('Petit');
  await expect(ticker).toContainText('Apti');
  await expect(ticker).toContainText('fait son nid !');

  // Verify Milkshake brand
  const brand = page.locator('.brand-name-milkshake');
  await expect(brand).toContainText('Apti');
});

test('Theme switcher toggles between light and dark modes affecting SeasonBackground and HeroTicker', async ({
  page,
}) => {
  await page.goto('/');
  const switchElement = page.locator('[data-testid="theme-switch"]');
  await expect(switchElement).toBeVisible();

  const seasonBg = page.locator('.season_bg_root');
  await expect(seasonBg).toBeVisible();

  // Initial theme
  const initialMode = await seasonBg.getAttribute('data-mode');

  // Toggle theme
  await switchElement.click();

  // Verify season background mode changed to contrast mode
  const expectedMode = initialMode === 'dark' ? 'light' : 'dark';
  await expect(seasonBg).toHaveAttribute('data-mode', expectedMode);

  // Verify document data-theme
  await expect(page.locator('html')).toHaveAttribute('data-theme', expectedMode);
});

test('Season presets update the active season badge', async ({ page }) => {
  await page.goto('/');
  const statusNumber = page.locator('.season-status-number');
  await expect(statusNumber).toBeVisible();
  await expect(statusNumber).toHaveText('0.00');

  // Click Summer preset
  const summerChip = page.locator('.season-chips-container [data-segment-id="summer"]');
  if (await summerChip.isVisible()) {
    await summerChip.click();
    await expect(statusNumber).toHaveText('1.00');
  }
});
