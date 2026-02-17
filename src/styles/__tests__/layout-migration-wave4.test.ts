import * as fs from "fs";
import * as path from "path";

function extractBlock(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Use (?:^|\\n) to anchor selector at line start (avoids matching compound selectors)
  const regex = new RegExp(
    `(?:^|\\n)${escaped}\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`,
    "s"
  );
  const match = css.match(regex);
  return match ? match[1] : "";
}

describe("Story 24.2 — Wave 4: Moléculas (AC8)", () => {
  describe("TechnologyFilter", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/molecules/TechnologyFilter/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".tech-filter__chips uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".tech-filter__chips");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });
  });

  describe("SkillSelector", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/molecules/SkillSelector/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".skills_selector uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".skills_selector");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".skills_selector uses Center primitive (mx-auto → native)", () => {
      const block = extractBlock(css, ".skills_selector");
      expect(block).toContain("margin-left: auto");
      expect(block).toContain("margin-right: auto");
    });

    it(".skills_selector does NOT use legacy md: breakpoint", () => {
      const block = extractBlock(css, ".skills_selector");
      expect(block).not.toMatch(/\bmd:/);
    });
  });

  describe("Experience", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/molecules/Experience/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".experience_header uses Switcher primitive", () => {
      const block = extractBlock(css, ".experience_header");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".experience_tags uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".experience_tags");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });
  });

  describe("WordCloud", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/WordCloud/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".word-cloud uses Stack primitive", () => {
      const block = extractBlock(css, ".word-cloud");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".skill-detail uses Stack primitive", () => {
      const block = extractBlock(css, ".skill-detail");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".skill-detail__tech-list uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".skill-detail__tech-list");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".skill-detail__companies-list uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".skill-detail__companies-list");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".skill-detail__keywords-list uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".skill-detail__keywords-list");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });
  });
});
