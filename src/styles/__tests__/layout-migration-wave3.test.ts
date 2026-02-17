import * as fs from "fs";
import * as path from "path";
import { extractBlock } from "./helpers/extractBlock";

describe("Story 24.2 — Wave 3: Organismos (AC7)", () => {
  describe("Footer", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/Footer/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".footer-content uses Stack primitive", () => {
      const block = extractBlock(css, ".footer-content");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".footer-col uses Stack primitive", () => {
      const block = extractBlock(css, ".footer-col");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".footer does NOT use legacy sm: breakpoint", () => {
      const block = extractBlock(css, ".footer");
      expect(block).not.toMatch(/\bsm:/);
    });
  });

  describe("ProjectCard", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/ProjectCard/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".project-card uses Stack primitive", () => {
      const block = extractBlock(css, ".project-card");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".project-card--grid .project-card__content uses Stack primitive", () => {
      const block = extractBlock(
        css,
        ".project-card--grid .project-card__content"
      );
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".project-card__tech-stack uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".project-card__tech-stack");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });
  });

  describe("ArticleCard", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/ArticleCard/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".article-card uses Stack primitive", () => {
      const block = extractBlock(css, ".article-card");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".article-card--grid .article-card__content uses Stack primitive", () => {
      const block = extractBlock(
        css,
        ".article-card--grid .article-card__content"
      );
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });
  });

  describe("Auth", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/Auth/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".auth-modal uses Stack primitive", () => {
      const block = extractBlock(css, ".auth-modal");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".auth-panel uses Stack primitive", () => {
      const block = extractBlock(css, ".auth-panel");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".auth-form uses Stack primitive", () => {
      const block = extractBlock(css, ".auth-form");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".auth-field uses Stack primitive", () => {
      const block = extractBlock(css, ".auth-field");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".auth-oauth-row uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".auth-oauth-row");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".auth-tabs uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".auth-tabs");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });
  });

  describe("Chat", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/Chat/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".chatbox_form uses Stack primitive", () => {
      const block = extractBlock(css, ".chatbox_form");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".form-message uses Stack primitive", () => {
      const block = extractBlock(css, ".form-message");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".form-attachment uses Stack primitive", () => {
      const block = extractBlock(css, ".form-attachment");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".form-hours_container uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".form-hours_container");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });
  });

  describe("ArticleContent", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/ArticleContent/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".article-content uses Center primitive", () => {
      const block = extractBlock(css, ".article-content");
      expect(block).toContain("margin-left: auto");
      expect(block).toContain("margin-right: auto");
    });
  });

  describe("ProjectDetail", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/ProjectDetail/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".project-detail uses Center primitive", () => {
      const block = extractBlock(css, ".project-detail");
      expect(block).toContain("margin-left: auto");
      expect(block).toContain("margin-right: auto");
    });

    it(".project-detail__tech-list uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".project-detail__tech-list");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".project-detail__links uses Cluster primitive (flex-wrap)", () => {
      const block = extractBlock(css, ".project-detail__links");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-wrap: wrap");
    });

    it(".project-detail does NOT use legacy lg:/md: breakpoints", () => {
      const block = extractBlock(css, ".project-detail__title");
      expect(block).not.toMatch(/\blg:/);
      expect(block).not.toMatch(/\bmd:/);
    });

    it(".project-detail__gallery does NOT use legacy md: breakpoint", () => {
      const block = extractBlock(css, ".project-detail__gallery");
      expect(block).not.toMatch(/\bmd:/);
    });
  });

  describe("ExperienceStats", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/organisms/ExperienceStats/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".experience-stats uses Switcher primitive", () => {
      const block = extractBlock(css, ".experience-stats");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });

    it(".experience-stats does NOT use legacy xl:/lg:/md: breakpoints", () => {
      const block = extractBlock(css, ".experience-stats");
      expect(block).not.toMatch(/\bxl:/);
      expect(block).not.toMatch(/\blg:/);
      expect(block).not.toMatch(/\bmd:/);
    });
  });

  describe("ArticleListItem", () => {
    const cssPath = path.resolve(
      __dirname,
      "../../ui/molecules/ArticleListItem/styles.css"
    );
    let css: string;
    beforeAll(() => {
      css = fs.readFileSync(cssPath, "utf-8");
    });

    it(".article-list-item uses Switcher primitive", () => {
      const block = extractBlock(css, ".article-list-item");
      expect(block).toContain("display: flex");
      expect(block).toContain("flex-direction: column");
    });
  });
});
