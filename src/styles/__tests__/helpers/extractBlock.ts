/**
 * Extract a CSS block by class/id selector from raw CSS content.
 * Returns the content between the opening { and closing } of the selector.
 * Uses (?:^|\n)\s* anchor to avoid matching compound selectors
 * (e.g. `.parent .child`) while supporting indented selectors
 * (e.g. inside @layer utilities).
 * Handles up to 1 level of nested braces.
 */
export function extractBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`,
    "s"
  );
  const match = css.match(regex);
  return match ? match[1] : "";
}
