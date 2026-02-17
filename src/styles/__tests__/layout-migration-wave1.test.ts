import * as fs from "fs";
import * as path from "path";

describe("Story 24.2 — Wave 1: Root Layout + MainContainer", () => {
  describe("Root Layout (globals.css)", () => {
    const cssPath = path.resolve(__dirname, "../globals.css");
    let cssContent: string;

    beforeAll(() => {
      cssContent = fs.readFileSync(cssPath, "utf-8");
    });

    describe(".layout — Cover primitive (AC1)", () => {
      it("has min-height: 100dvh progressive enhancement", () => {
        const layoutBlock = extractBlock(cssContent, ".layout");
        expect(layoutBlock).toContain("min-height: 100vh");
        expect(layoutBlock).toContain("min-height: 100dvh");
      });

      it("uses flex column (cover pattern)", () => {
        const layoutBlock = extractBlock(cssContent, ".layout");
        expect(layoutBlock).toContain("display: flex");
        expect(layoutBlock).toContain("flex-direction: column");
      });

      it("preserves min-width: 320px constraint", () => {
        const layoutBlock = extractBlock(cssContent, ".layout");
        expect(layoutBlock).toContain("min-width: 320px");
      });

      it("preserves max-width: 1024px and centering", () => {
        const layoutBlock = extractBlock(cssContent, ".layout");
        expect(layoutBlock).toContain("max-width: 1024px");
        expect(layoutBlock).toContain("margin-left: auto");
        expect(layoutBlock).toContain("margin-right: auto");
      });
    });

    describe("#main-content — cover-principal (AC1)", () => {
      it("still has flex: 1 to push footer to bottom", () => {
        expect(cssContent).toContain("#main-content");
        const mainBlock = extractBlock(cssContent, "#main-content");
        expect(mainBlock).toContain("flex: 1");
      });
    });
  });

  describe("layout.tsx — cover-principal class (AC1)", () => {
    const layoutPath = path.resolve(__dirname, "../../app/layout.tsx");
    let layoutContent: string;

    beforeAll(() => {
      layoutContent = fs.readFileSync(layoutPath, "utf-8");
    });

    it("main element has cover-principal className", () => {
      // The <main> should include "cover-principal" in its className
      expect(layoutContent).toMatch(/className=.*cover-principal/);
    });

    it("main element preserves id and tabIndex", () => {
      expect(layoutContent).toContain('id="main-content"');
      expect(layoutContent).toContain("tabIndex={-1}");
    });
  });

  describe("MainContainer — Semantic breakpoints (AC2)", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/atoms/hocs/MainContainer/styles.css"
    );
    let cssContent: string;

    beforeAll(() => {
      cssContent = fs.readFileSync(cssPath, "utf-8");
    });

    it("uses semantic breakpoints (tablet: and/or desktop:)", () => {
      // Should have at least one semantic breakpoint
      expect(cssContent).toMatch(/tablet:|desktop:/);
    });

    it("does NOT use legacy breakpoints (xl:, lg:, md:, sm:)", () => {
      // Legacy breakpoints should be removed
      expect(cssContent).not.toMatch(/\bxl:/);
      expect(cssContent).not.toMatch(/\blg:/);
      expect(cssContent).not.toMatch(/\bmd:/);
      expect(cssContent).not.toMatch(/\bsm:/);
    });

    it("preserves inline-block (documented debt)", () => {
      expect(cssContent).toContain("inline-block");
    });

    it("preserves essential styles (bg, z-index)", () => {
      expect(cssContent).toContain("bg-light");
      expect(cssContent).toContain("dark:bg-dark");
      expect(cssContent).toContain("z-0");
    });
  });
});

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
