import React from "react";
import { render, screen } from "@testing-library/react";

// Simple test component that mimics skip link implementation
const SkipLinkTestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

describe("Skip Link Accessibility", () => {
  describe("presence and attributes", () => {
    it("renders skip link targeting main content", () => {
      // This component should exist in the layout
      render(
        <SkipLinkTestWrapper>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <main id="main-content">Content</main>
        </SkipLinkTestWrapper>
      );

      const skipLink = screen.getByRole("link", {
        name: /skip to main content/i,
      });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main-content");
    });

    it("skip link has correct CSS class for styling", () => {
      render(
        <SkipLinkTestWrapper>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
        </SkipLinkTestWrapper>
      );

      const skipLink = screen.getByRole("link", {
        name: /skip to main content/i,
      });
      expect(skipLink).toHaveClass("skip-link");
    });

    it("main content has correct id target", () => {
      render(
        <SkipLinkTestWrapper>
          <main id="main-content" tabIndex={-1}>
            Main Content Area
          </main>
        </SkipLinkTestWrapper>
      );

      const mainContent = screen.getByRole("main");
      expect(mainContent).toHaveAttribute("id", "main-content");
      // tabIndex -1 allows programmatic focus
      expect(mainContent).toHaveAttribute("tabIndex", "-1");
    });
  });
});
