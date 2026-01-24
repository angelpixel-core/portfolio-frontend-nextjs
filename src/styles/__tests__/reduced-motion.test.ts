import * as fs from "fs";
import * as path from "path";

describe("Reduced Motion CSS", () => {
  const cssPath = path.resolve(__dirname, "../reduced-motion.css");
  let cssContent: string;

  beforeAll(() => {
    cssContent = fs.readFileSync(cssPath, "utf-8");
  });

  it("reduced-motion.css file exists", () => {
    expect(fs.existsSync(cssPath)).toBe(true);
  });

  it("contains prefers-reduced-motion media query", () => {
    expect(cssContent).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("contains animation-duration rule", () => {
    expect(cssContent).toContain("animation-duration");
  });

  it("contains animation-iteration-count rule", () => {
    expect(cssContent).toContain("animation-iteration-count");
  });

  it("contains transition-duration rule", () => {
    expect(cssContent).toContain("transition-duration");
  });

  it("contains scroll-behavior rule", () => {
    expect(cssContent).toContain("scroll-behavior");
  });

  it("uses 0.01ms for instant completion (not 0)", () => {
    // Using 0.01ms ensures animations complete their final state
    // instead of being stuck at initial state
    expect(cssContent).toContain("0.01ms");
  });

  it("applies to all elements via universal selector", () => {
    expect(cssContent).toMatch(/\*[\s\S]*::before[\s\S]*::after/);
  });
});
