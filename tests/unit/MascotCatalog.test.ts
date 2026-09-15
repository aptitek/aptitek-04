import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const MASCOT_DIR = path.resolve('public/mascot');

describe('Mascot Catalog Manifest & Docs', () => {
  it('manifest catalog.json exists and contains all 4 categories', () => {
    const catalogPath = path.join(MASCOT_DIR, 'catalog.json');
    expect(fs.existsSync(catalogPath)).toBe(true);

    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    expect(catalog.version).toBe('2.0.0');
    expect(Object.keys(catalog.categories)).toEqual(
      expect.arrayContaining(['particles', 'beak', 'eyes', 'body']),
    );

    expect(Object.keys(catalog.categories.particles).length).toBe(24);
    expect(Object.keys(catalog.categories.beak).length).toBe(20);
    expect(Object.keys(catalog.categories.eyes).length).toBe(12);
    expect(Object.keys(catalog.categories.body).length).toBe(20);
  });

  it('CATALOG.md documentation exists and covers all sections', () => {
    const docPath = path.join(MASCOT_DIR, 'CATALOG.md');
    expect(fs.existsSync(docPath)).toBe(true);

    const content = fs.readFileSync(docPath, 'utf-8');
    expect(content).toContain('Body Postures');
    expect(content).toContain('Beak Expressions');
    expect(content).toContain('Eye Expressions');
    expect(content).toContain('Peripheral Particles');
  });
});

describe('Mascot Vector Assets Integrity', () => {
  it('all 24 particle SVGs exist and are lightweight (< 2 KB)', () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(MASCOT_DIR, 'catalog.json'), 'utf-8'));
    for (const [id, item] of Object.entries(catalog.categories.particles) as [
      string,
      { path: string },
    ][]) {
      const filePath = path.resolve(path.join('public', item.path));
      expect(fs.existsSync(filePath), `Particle ${id} should exist at ${filePath}`).toBe(true);

      const stats = fs.statSync(filePath);
      expect(stats.size).toBeLessThan(2048);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('<svg');
      expect(content).toContain('</svg>');
    }
  });

  it('all 20 beak SVGs exist and use 512x512 canvas coordinate space', () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(MASCOT_DIR, 'catalog.json'), 'utf-8'));
    for (const [id, item] of Object.entries(catalog.categories.beak) as [
      string,
      { path: string },
    ][]) {
      const filePath = path.resolve(path.join('public', item.path));
      expect(fs.existsSync(filePath), `Beak ${id} should exist at ${filePath}`).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('viewBox="0 0 512 512"');
      expect(content).toContain('inkscape:label="upper_beak"');
    }
  });

  it('all 12 eye SVGs exist and use 512x512 canvas coordinate space', () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(MASCOT_DIR, 'catalog.json'), 'utf-8'));
    for (const [id, item] of Object.entries(catalog.categories.eyes) as [
      string,
      { path: string },
    ][]) {
      const filePath = path.resolve(path.join('public', item.path));
      expect(fs.existsSync(filePath), `Eye ${id} should exist at ${filePath}`).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('viewBox="0 0 512 512"');
      expect(content).toContain('id="mascot_eyes"');
    }
  });

  it('all 20 body SVGs exist and preserve labeled component paths', () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(MASCOT_DIR, 'catalog.json'), 'utf-8'));
    for (const [id, item] of Object.entries(catalog.categories.body) as [
      string,
      { path: string },
    ][]) {
      const filePath = path.resolve(path.join('public', item.path));
      expect(fs.existsSync(filePath), `Body pose ${id} should exist at ${filePath}`).toBe(true);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('viewBox="0 0 512 512"');
      expect(content).toContain('inkscape:label="body"');
      expect(content).toContain('inkscape:label="left_wing"');
    }
  });
});
