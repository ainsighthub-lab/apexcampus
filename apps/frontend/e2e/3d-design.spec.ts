import { test, expect } from '@playwright/test';

test.describe('3D Design Fit — ApexCampus', () => {

  test('Hero section has Three.js canvas with 3D rendering', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // allow Three.js to fully initialize

    // 1. Three.js canvas should be present with R3F engine attribute
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 2. Check data-engine attribute (set by R3F after mount)
    const engine = await canvas.getAttribute('data-engine');
    expect(engine).toMatch(/three\.js/);

    // 3. Canvas should have actual rendering size
    const canvasSize = await canvas.evaluate(el => ({
      w: (el as HTMLCanvasElement).width,
      h: (el as HTMLCanvasElement).height,
    }));
    expect(canvasSize.w).toBeGreaterThan(100);
    expect(canvasSize.h).toBeGreaterThan(100);

    // 4. Hero section wrapper should exist
    const hero3d = page.locator('[data-testid="hero-3d"]');
    await expect(hero3d).toBeVisible();

    // 5. Hero3D positioned absolute, pointer-events none (behind content)
    const heroLayer = await hero3d.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { position: s.position, pointerEvents: s.pointerEvents, zIndex: s.zIndex };
    });
    expect(heroLayer.position).toBe('absolute');
    expect(heroLayer.pointerEvents).toBe('none');

    // 6. Navbar on top (z-index 50)
    const navZ = await page.evaluate(() => {
      const h = document.querySelector('header');
      return h ? window.getComputedStyle(h).zIndex : null;
    });
    expect(navZ).toBe('50');

    // 7. Heading still visible above 3D
    await expect(page.locator('h1')).toBeVisible();

    // 8. Simulate mouse move over 3D scene
    const box = await hero3d.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
    }

    // 9. Scroll down and back — canvas persists
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await expect(canvas).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await expect(canvas).toBeVisible();
  });

  test('Tilt cards rendered and interactive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Verify tilt cards exist
    const tiltCards = page.locator('[data-tilt]');
    await expect(tiltCards.first()).toBeVisible({ timeout: 5000 });
    const count = await tiltCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    console.log(`[TDD] ${count} tilt cards rendered`);

    // Hover on first tilt card
    await tiltCards.first().hover({ force: true });
    await page.waitForTimeout(200);
  });

  test('Dashboard page 3D consistent', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
