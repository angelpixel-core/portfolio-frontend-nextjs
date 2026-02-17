import * as fs from "fs";
import * as path from "path";
import { extractBlock } from "./helpers/extractBlock";

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

    it("Story 24.5: .main_home-container has NO !important (inline-block debt resolved)", () => {
      const block = extractBlock(css, ".main_home-container");
      expect(block).not.toContain("!important");
      // Uses min-height instead of rigid height
      expect(block).toContain("min-height");
      expect(block).not.toMatch(/\bheight:.*!important/);
    });

    it("Story 24.5: .home-hero_image-container uses max-height (intrinsic, not rigid height)", () => {
      const block = extractBlock(css, ".home-hero_image-container");
      expect(block).toContain("max-height");
      expect(block).not.toMatch(/^\s*height:/m);
    });

    it("Story 24.5: .home_slogan uses max-height only (no rigid tripleta)", () => {
      const block = extractBlock(css, ".home_slogan");
      expect(block).toContain("max-height");
      expect(block).not.toMatch(/^\s*height:/m);
      expect(block).not.toMatch(/^\s*min-height:/m);
    });

    it(".main_home uses semantic bp: pt-1 base + tablet:pt-0 (was md:pt-1)", () => {
      const block = extractBlock(css, ".main_home");
      expect(block).not.toMatch(/\bmd:/);
      expect(block).toMatch(/pt-1/);
      expect(block).toMatch(/tablet:pt-0/);
    });

    it(".home_slogan uses semantic bp: text-sm base + tablet:text-xs (was sm:text-sm)", () => {
      const sloganBlock = extractBlock(css, ".home_slogan");
      expect(sloganBlock).not.toMatch(/\bsm:/);
      expect(sloganBlock).toMatch(/text-sm/);
      expect(sloganBlock).toMatch(/tablet:text-xs/);
    });

    it(".home_contact-link uses semantic bp: text-base + tablet:text-lg (was md:text-base)", () => {
      const linkBlock = extractBlock(css, ".home_contact-link");
      expect(linkBlock).not.toMatch(/\bmd:/);
      expect(linkBlock).toMatch(/text-base/);
      expect(linkBlock).toMatch(/tablet:text-lg/);
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
