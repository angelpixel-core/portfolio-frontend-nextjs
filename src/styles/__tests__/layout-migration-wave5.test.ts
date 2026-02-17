import * as fs from "fs";
import * as path from "path";

const LEGACY_BP_REGEX = /\b(sm|md|lg|xl|2xl|xs):/;

/**
 * Story 24.4 — Wave 5: Breakpoint Normalization
 *
 * Validates that ALL remaining legacy breakpoints (max-width)
 * have been replaced with semantic equivalents (min-width).
 *
 * Legacy: sm:, md:, lg:, xl:, 2xl:, xs: (max-width, inverted)
 * Semantic: phablet:, mobile:, tablet:, nav:, stage:, desktop:, wide: (min-width)
 */
describe("Story 24.4 — Wave 5: Breakpoint Normalization", () => {
  describe("Organisms", () => {
    describe("ProjectCard", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/organisms/ProjectCard/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
        expect(css).toMatch(/\bdesktop:/);
      });
    });

    describe("Skills", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/organisms/Skills/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\btablet:/);
        expect(css).toMatch(/\bdesktop:/);
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

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
        expect(css).toMatch(/\bdesktop:/);
      });
    });
  });

  describe("Molecules", () => {
    describe("Article", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/molecules/Article/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\btablet:/);
        expect(css).toMatch(/\bmobile:/);
      });
    });

    describe("skill", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/molecules/skill/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
        expect(css).toMatch(/\bnav:/);
      });
    });

    describe("ExtraInfo", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/molecules/ExtraInfo/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
        expect(css).toMatch(/\bdesktop:/);
      });
    });

    describe("FeaturedArticle", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/molecules/FeaturedArticle/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
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

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
      });
    });

    describe("SocialNetworkLink", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/molecules/SocialNetworkLink/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\btablet:/);
      });
    });
  });

  describe("Atoms", () => {
    describe("BoxShadow", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/atoms/shadows/BoxShadow/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bmobile:/);
      });
    });

    describe("ArrowButton", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/atoms/buttons/ArrowButton/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bnav:/);
      });
    });

    describe("SkillSelectorButton", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/atoms/buttons/SkillSelectorButton/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bnav:/);
      });
    });

    describe("AnimatedTitle", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/atoms/texts/AnimatedTitle/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\btablet:/);
      });
    });

    describe("TransitionerLi", () => {
      const cssPath = path.resolve(
        __dirname,
        "../../ui/atoms/hocs/TransitionerLi/styles.css"
      );
      let css: string;
      beforeAll(() => {
        css = fs.readFileSync(cssPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints", () => {
        expect(css).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(css).toMatch(/\bnav:/);
      });
    });
  });

  describe("Pages", () => {
    describe("ArticleListSkeleton", () => {
      const tsxPath = path.resolve(
        __dirname,
        "../../app/articles/ArticleListSkeleton.tsx"
      );
      let tsx: string;
      beforeAll(() => {
        tsx = fs.readFileSync(tsxPath, "utf-8");
      });

      it("does NOT use any legacy breakpoints in className strings", () => {
        expect(tsx).not.toMatch(LEGACY_BP_REGEX);
      });

      it("uses semantic mobile-first breakpoints", () => {
        expect(tsx).toMatch(/\bmobile:/);
      });
    });
  });
});
