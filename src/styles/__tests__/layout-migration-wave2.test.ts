import * as fs from "fs";
import * as path from "path";

/**
 * Extract a CSS block by class/id selector from raw CSS content.
 * Returns the content between the opening { and closing } of the selector.
 * Handles up to 1 level of nested braces.
 */
function extractBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `${escaped}\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`,
    "s"
  );
  const match = css.match(regex);
  return match ? match[1] : "";
}

describe("Story 24.2 — Wave 2: Pages", () => {
  describe("Home (AC3)", () => {
    const cssPath = path.resolve(__dirname, "../../app/styles.css");
    let css: string;

    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".home-content uses Stack primitive (display: flex + flex-direction: column)", () => {
      const block = extractBlock(css, ".home-content");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".home-slider-container uses Stack primitive", () => {
      const block = extractBlock(css, ".home-slider-container");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it("--header-height custom property is defined in globals.css", () => {
      const globalsCss = fs.readFileSync(
        path.resolve(__dirname, "../globals.css"),
        "utf-8"
      );
      expect(globalsCss).toContain("--header-height");
    });

    it("calc(100dvh - 114px) is replaced with var(--header-height)", () => {
      // Should use the custom property instead of hardcoded 114px
      expect(css).toContain("var(--header-height");
      expect(css).not.toContain("calc(100dvh - 114px)");
      expect(css).not.toContain("calc(100dvh -114px)");
    });

    it("!important overrides on .main_home-container are preserved", () => {
      expect(css).toContain(".main_home-container");
      const block = extractBlock(css, ".main_home-container");
      expect(block).toContain("!important");
    });

    it(".home_slogan does NOT use legacy sm: breakpoint", () => {
      // Check if sm:text-sm was migrated
      const sloganBlock = extractBlock(css, ".home_slogan");
      expect(sloganBlock).not.toMatch(/\bsm:/);
    });

    it(".home_contact_link does NOT use legacy md: breakpoint", () => {
      const linkBlock = extractBlock(css, ".home_contact-link");
      expect(linkBlock).not.toMatch(/\bmd:/);
    });
  });

  describe("About (AC4)", () => {
    const cssPath = path.resolve(__dirname, "../../app/about/styles.css");
    let css: string;

    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".main_about uses Stack primitive", () => {
      const block = extractBlock(css, ".main_about");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".about-headline-wrapper uses Stack primitive", () => {
      const block = extractBlock(css, ".about-headline-wrapper");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".about_biography-container uses Stack primitive", () => {
      const block = extractBlock(css, ".about_biography-container");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".about-transition-node uses Center primitive (auto margins)", () => {
      const block = extractBlock(css, ".about-transition-node");
      expect(block).toContain("margin-left: auto");
      expect(block).toContain("margin-right: auto");
    });
  });

  describe("Projects (AC5)", () => {
    const cssPath = path.resolve(__dirname, "../../app/projects/styles.css");
    let css: string;

    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".main_projects uses Stack primitive", () => {
      const block = extractBlock(css, ".main_projects");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".projects-blade--hero uses Stack primitive", () => {
      const block = extractBlock(css, ".projects-blade--hero");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".projects-grid uses grid layout (native or @apply)", () => {
      const block = extractBlock(css, ".projects-grid");
      // Accepts both `display: grid` (native) and `@apply grid` (Tailwind)
      const hasGrid =
        block.includes("display: grid") || block.match(/\bgrid\b/);
      expect(hasGrid).toBeTruthy();
    });

    it(".project_container does NOT use legacy sm: breakpoint", () => {
      const block = extractBlock(css, ".project_container");
      expect(block).not.toMatch(/\bsm:/);
    });
  });

  describe("Articles (AC6)", () => {
    const cssPath = path.resolve(__dirname, "../../app/articles/styles.css");
    let css: string;

    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".main_articles uses Stack primitive", () => {
      const block = extractBlock(css, ".main_articles");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".articles-blade--hero uses Stack primitive", () => {
      const block = extractBlock(css, ".articles-blade--hero");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".articles-blade--list uses Center primitive and no legacy sm: breakpoint", () => {
      const block = extractBlock(css, ".articles-blade--list");
      expect(block).toContain("margin-left: auto");
      expect(block).toContain("margin-right: auto");
      expect(block).not.toMatch(/\bsm:/);
    });

    it(".articles-list uses Stack primitive and no legacy sm: breakpoint", () => {
      const block = extractBlock(css, ".articles-list");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
      expect(block).not.toMatch(/\bsm:/);
    });

    it(".articles-list__heading does NOT use legacy sm: breakpoint", () => {
      const block = extractBlock(css, ".articles-list__heading");
      expect(block).not.toMatch(/\bsm:/);
    });
  });
});
