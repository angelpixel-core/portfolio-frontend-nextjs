import * as fs from "fs";
import * as path from "path";
import { extractBlock } from "./helpers/extractBlock";

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

    it(".skills__selector uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".skills__selector");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".skills__selector uses Center primitive (mx-auto → native)", () => {
      const block = extractBlock(css, ".skills__selector");
      expect(block).toContain("margin-left: auto");
      expect(block).toContain("margin-right: auto");
    });

    it(".skills__selector does NOT use legacy md: breakpoint", () => {
      const block = extractBlock(css, ".skills__selector");
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

    it(".experience__header uses Switcher primitive", () => {
      const block = extractBlock(css, ".experience__header");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".experience__tags uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".experience__tags");
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
