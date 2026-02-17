/**
 * Viewport vertical assertion helpers (Story 24.3)
 *
 * Reusable helpers for testing vertical layout properties:
 * - Containment: child fits within parent
 * - Reachability: element is within visible viewport
 * - Order: visual top→bottom matches DOM order
 *
 * @see _bmad-output/implementation-artifacts/24-3-vertical-viewport-e2e-tests.md
 */

import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/** Standard viewport heights for vertical testing */
export const VERTICAL_VIEWPORTS = {
  extreme: { width: 1024, height: 400 },
  short: { width: 1024, height: 500 },
  mobile: { width: 375, height: 667 },
  desktop: { width: 1024, height: 800 },
} as const;

interface BoundingRect {
  top: number;
  bottom: number;
  height: number;
}

/**
 * Get bounding rect of an element via page.evaluate().
 * Only valid for elements in normal flow (not position:fixed/absolute).
 */
async function getRect(locator: Locator): Promise<BoundingRect> {
  return locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, height: rect.height };
  });
}

/**
 * Assert that two sibling elements do NOT overlap vertically.
 * Verifies `elementA.bottom <= elementB.top` (with 1px tolerance for subpixel rounding).
 */
export async function assertNoOverlap(
  elementA: Locator,
  elementB: Locator,
  label?: string
): Promise<void> {
  const rectA = await getRect(elementA);
  const rectB = await getRect(elementB);
  const context = label ? ` (${label})` : "";
  expect(
    rectA.bottom,
    `Element A bottom (${rectA.bottom}) should be <= Element B top (${rectB.top})${context}`
  ).toBeLessThanOrEqual(rectB.top + 1);
}

/**
 * Assert that an element is reachable (fully visible within the viewport).
 * Verifies `element.top >= 0 && element.bottom <= viewportHeight`.
 */
export async function assertReachable(
  page: Page,
  locator: Locator,
  label?: string
): Promise<void> {
  const rect = await getRect(locator);
  const viewportHeight = (await page.viewportSize())?.height ?? 0;
  const context = label ? ` (${label})` : "";
  expect(
    rect.top,
    `Element top (${rect.top}) should be >= 0${context}`
  ).toBeGreaterThanOrEqual(0);
  expect(
    rect.bottom,
    `Element bottom (${rect.bottom}) should be <= viewport height (${viewportHeight})${context}`
  ).toBeLessThanOrEqual(viewportHeight + 1);
}

/**
 * Assert that elements maintain visual top→bottom order (DOM order matches visual order).
 * Uses `A.top <= B.top` for ordering — elements may overlap (known F1 at short viewports)
 * but must still appear in correct sequence.
 */
export async function assertOrder(
  locators: Locator[],
  label?: string
): Promise<void> {
  const rects = await Promise.all(locators.map(getRect));
  const context = label ? ` (${label})` : "";
  for (let i = 0; i < rects.length - 1; i++) {
    expect(
      rects[i].top,
      `Element[${i}] top (${rects[i].top}) should be <= Element[${i + 1}] top (${rects[i + 1].top})${context}`
    ).toBeLessThanOrEqual(rects[i + 1].top + 1);
  }
}
