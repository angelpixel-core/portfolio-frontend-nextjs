import fs from "fs";
import path from "path";

describe("Layout Accessibility", () => {
  it("html element has lang attribute set to en", () => {
    const layoutPath = path.resolve(__dirname, "../layout.jsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");

    // Check that <html> tag has lang="en" attribute
    const htmlTagMatch = layoutContent.match(/<html[^>]*>/);
    expect(htmlTagMatch).not.toBeNull();

    const htmlTag = htmlTagMatch![0];
    expect(htmlTag).toMatch(/lang=["']en["']/);
  });
});
