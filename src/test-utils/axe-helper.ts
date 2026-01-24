import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

/**
 * Helper function to check accessibility violations using jest-axe
 * @param container - The HTML element to scan for a11y violations
 */
export async function checkA11y(container: HTMLElement) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

export { axe, toHaveNoViolations };
