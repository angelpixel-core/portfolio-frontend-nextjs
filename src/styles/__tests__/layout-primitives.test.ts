import * as fs from "fs";
import * as path from "path";

describe("Every Layout Primitives (Story 24.1)", () => {
  const cssPath = path.resolve(__dirname, "../globals.css");
  let cssContent: string;

  beforeAll(() => {
    cssContent = fs.readFileSync(cssPath, "utf-8");
  });

  it("globals.css file exists", () => {
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  it("primitives are defined inside @layer utilities", () => {
    // Extract @layer utilities block content
    const layerMatch = cssContent.match(/@layer utilities\s*\{([\s\S]*)\}/);
    expect(layerMatch).not.toBeNull();
    const layerContent = layerMatch![1];
    expect(layerContent).toContain(".stack");
    expect(layerContent).toContain(".center");
    expect(layerContent).toContain(".cluster");
    expect(layerContent).toContain(".sidebar");
    expect(layerContent).toContain(".switcher");
    expect(layerContent).toContain(".cover");
    expect(layerContent).toContain(".grid-fluid");
  });

  describe("Stack", () => {
    it("uses flex column layout", () => {
      expect(cssContent).toContain(".stack");
      // Verify it declares flex and column direction
      const stackBlock = extractBlock(cssContent, ".stack");
      expect(stackBlock).toContain("display: flex");
      expect(stackBlock).toContain("flex-direction: column");
    });

    it("does NOT hardcode gap (composable via Tailwind gap-*)", () => {
      const stackBlock = extractBlock(cssContent, ".stack");
      expect(stackBlock).not.toContain("gap:");
    });
  });

  describe("Center", () => {
    it("uses auto margins for horizontal centering", () => {
      const centerBlock = extractBlock(cssContent, ".center");
      expect(centerBlock).toContain("margin-left: auto");
      expect(centerBlock).toContain("margin-right: auto");
    });

    it("does NOT hardcode max-width (composable via Tailwind max-w-*)", () => {
      const centerBlock = extractBlock(cssContent, ".center");
      expect(centerBlock).not.toContain("max-width");
    });
  });

  describe("Cluster", () => {
    it("uses flex wrap layout", () => {
      const clusterBlock = extractBlock(cssContent, ".cluster");
      expect(clusterBlock).toContain("display: flex");
      expect(clusterBlock).toContain("flex-wrap: wrap");
    });

    it("does NOT hardcode gap (composable via Tailwind gap-*)", () => {
      const clusterBlock = extractBlock(cssContent, ".cluster");
      expect(clusterBlock).not.toContain("gap:");
    });
  });

  describe("Sidebar", () => {
    it("uses CSS grid layout", () => {
      const sidebarBlock = extractBlock(cssContent, ".sidebar");
      expect(sidebarBlock).toContain("display: grid");
    });

    it("uses CSS custom properties for column sizing", () => {
      const sidebarBlock = extractBlock(cssContent, ".sidebar");
      expect(sidebarBlock).toContain("--sidebar-main");
      expect(sidebarBlock).toContain("--sidebar-aside");
    });

    it("has default column ratio of 5fr/3fr", () => {
      const sidebarBlock = extractBlock(cssContent, ".sidebar");
      expect(sidebarBlock).toContain("5fr");
      expect(sidebarBlock).toContain("3fr");
    });

    it("does NOT hardcode gap (composable via Tailwind gap-*)", () => {
      const sidebarBlock = extractBlock(cssContent, ".sidebar");
      expect(sidebarBlock).not.toContain("gap:");
    });
  });

  describe("Switcher", () => {
    it("uses flex column as mobile-first base", () => {
      const switcherBlock = extractBlock(cssContent, ".switcher");
      expect(switcherBlock).toContain("display: flex");
      expect(switcherBlock).toContain("flex-direction: column");
    });

    it("does NOT include breakpoint logic (handled via Tailwind modifiers)", () => {
      const switcherBlock = extractBlock(cssContent, ".switcher");
      expect(switcherBlock).not.toContain("@media");
      expect(switcherBlock).not.toContain("flex-row");
    });
  });

  describe("Cover", () => {
    it("uses flex column layout", () => {
      const coverBlock = extractBlock(cssContent, ".cover");
      expect(coverBlock).toContain("display: flex");
      expect(coverBlock).toContain("flex-direction: column");
    });

    it("has 100dvh min-height with 100vh fallback", () => {
      const coverBlock = extractBlock(cssContent, ".cover");
      expect(coverBlock).toContain("min-height: 100vh");
      expect(coverBlock).toContain("min-height: 100dvh");
    });

    it("cover-principal uses flex: 1 to fill space", () => {
      expect(cssContent).toContain(".cover-principal");
      const principalBlock = extractBlock(cssContent, ".cover-principal");
      expect(principalBlock).toContain("flex: 1");
    });
  });

  describe("Grid Fluid", () => {
    it("uses CSS grid layout", () => {
      const gridBlock = extractBlock(cssContent, ".grid-fluid");
      expect(gridBlock).toContain("display: grid");
    });

    it("uses auto-fill for responsive columns", () => {
      const gridBlock = extractBlock(cssContent, ".grid-fluid");
      expect(gridBlock).toContain("auto-fill");
    });

    it("uses --min CSS custom property with 320px default", () => {
      const gridBlock = extractBlock(cssContent, ".grid-fluid");
      expect(gridBlock).toContain("--min");
      expect(gridBlock).toContain("320px");
    });

    it("uses minmax with min() for small viewport safety", () => {
      const gridBlock = extractBlock(cssContent, ".grid-fluid");
      expect(gridBlock).toContain("minmax");
      expect(gridBlock).toContain("min(");
      expect(gridBlock).toContain("100%");
    });
  });
});

/**
 * Extract a CSS block by class name from raw CSS content.
 * Returns the content between the opening { and closing } of the selector.
 * Handles up to 1 level of nested braces. Sufficient for flat primitives.
 */
function extractBlock(css: string, selector: string): string {
  // Escape special regex characters in selector
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Match the selector followed by { ... } (handles nested braces up to 1 level)
  const regex = new RegExp(
    `${escaped}\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`,
    "s"
  );
  const match = css.match(regex);
  return match ? match[1] : "";
}
