/**
 * FeaturedProject Component Tests
 * Story 2.3: Demo & Repository Links
 *
 * Future test ideas (tech debt):
 * - Test keyboard navigation (Tab order through links)
 * - Test GitHubIcon renders with aria-hidden
 * - Test image link navigates to detail page
 * - Test title link navigates to detail page
 * - E2E: Verify links actually open in new tab
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

import FeaturedProject from "../index";

describe("FeaturedProject - Demo & Repository Links (Story 2.3)", () => {
  const baseProps = {
    slug: "test-project",
    tags: "React • TypeScript",
    title: "Test Project",
    summary: "A test project description",
    img: "/images/test.jpg",
    demo: undefined,
    repository: undefined,
  };

  describe("Demo link", () => {
    it("renders with security attributes when demo URL provided", () => {
      render(
        <FeaturedProject {...baseProps} demo="https://demo.example.com" />
      );

      const demoLink = screen.getByRole("link", { name: /visit project/i });
      expect(demoLink).toHaveAttribute("href", "https://demo.example.com");
      expect(demoLink).toHaveAttribute("target", "_blank");
      expect(demoLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("is hidden when demo URL not provided", () => {
      render(<FeaturedProject {...baseProps} />);

      expect(
        screen.queryByRole("link", { name: /visit project/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Repository link", () => {
    it("renders with security attributes when repository URL provided", () => {
      render(
        <FeaturedProject
          {...baseProps}
          repository="https://github.com/user/repo"
        />
      );

      // GitHub icon link - find by href since icon has no text
      const repoLinks = screen.getAllByRole("link");
      const repoLink = repoLinks.find((link) =>
        link.getAttribute("href")?.includes("github.com")
      );

      expect(repoLink).toBeInTheDocument();
      expect(repoLink).toHaveAttribute("target", "_blank");
      expect(repoLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("is hidden when repository URL not provided", () => {
      render(<FeaturedProject {...baseProps} />);

      const links = screen.getAllByRole("link");
      const repoLink = links.find((link) =>
        link.getAttribute("href")?.includes("github.com")
      );

      expect(repoLink).toBeUndefined();
    });
  });

  describe("Both links hidden", () => {
    it("hides link container when neither demo nor repository provided", () => {
      render(<FeaturedProject {...baseProps} />);

      // Only internal links to detail page should exist
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "/projects/test-project");
      });
    });
  });
});
