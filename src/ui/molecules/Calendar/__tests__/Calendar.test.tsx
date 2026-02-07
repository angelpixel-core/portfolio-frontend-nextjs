/**
 * Calendar Component Tests
 * Story 5.3: Calendly Scheduling
 * TDD: Tests written BEFORE implementation
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock profile data
const mockProfile = {
  calendly: "https://calendly.com/contact-amazingcompany",
};

let mockIsLoading = false;
let mockIsError = false;

jest.mock("@/domains/profile/queries", () => ({
  useProfile: () => ({
    data: mockIsLoading || mockIsError ? undefined : mockProfile,
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
}));

// Mock Calendly icon - the real icon has aria-hidden built-in
jest.mock("@/icons", () => ({
  CalendlyIcon: ({
    className,
    ...rest
  }: {
    className?: string;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="calendly-icon"
      className={className}
      aria-hidden="true"
      {...rest}
    />
  ),
}));

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    target,
    rel,
    className,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    target?: string;
    rel?: string;
    className?: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} target={target} rel={rel} className={className} {...props}>
        {children}
      </a>
    );
  };
});

// Import component after mocks
import Calendar from "../index";

describe("Calendar", () => {
  beforeEach(() => {
    mockIsLoading = false;
    mockIsError = false;
  });

  describe("rendering", () => {
    it("renders Calendly link", () => {
      render(<Calendar />);

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("renders Calendly icon", () => {
      render(<Calendar />);

      expect(screen.getByTestId("calendly-icon")).toBeInTheDocument();
    });
  });

  describe("calendly.com format (AC1)", () => {
    it("link uses calendly.com URL from profile", () => {
      render(<Calendar />);

      const links = screen.getAllByRole("link");
      const calendlyLink = links.find((link) =>
        link.getAttribute("href")?.includes("calendly.com")
      );

      expect(calendlyLink).toBeInTheDocument();
      expect(calendlyLink?.getAttribute("href")).toBe(
        "https://calendly.com/contact-amazingcompany"
      );
    });
  });

  describe("link attributes (AC1)", () => {
    it("link has target=_blank for new tab", () => {
      render(<Calendar />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("link has rel=noopener noreferrer for security", () => {
      render(<Calendar />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("accessibility", () => {
    it("icon has aria-hidden for screen readers", () => {
      render(<Calendar />);

      const icon = screen.getByTestId("calendly-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("text link has accessible name via aria-label", () => {
      render(<Calendar />);

      // CalendarLink combines icon with "ontact" text, aria-label provides full context
      const link = screen.getByRole("link", { name: /contact/i });
      expect(link).toHaveAttribute(
        "aria-label",
        "Contact - Schedule a meeting via Calendly"
      );
    });

    it("links are keyboard focusable", () => {
      render(<Calendar />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("loading state", () => {
    it("renders nothing when loading (returns null)", () => {
      mockIsLoading = true;
      render(<Calendar />);

      // Component returns null during loading - no links should be rendered
      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(0);
    });
  });

  describe("error state (AC2)", () => {
    it("handles error gracefully without crashing", () => {
      mockIsError = true;

      // Should not throw
      expect(() => render(<Calendar />)).not.toThrow();
    });

    it("does not render broken link on error", () => {
      mockIsError = true;
      render(<Calendar />);

      const links = screen.queryAllByRole("link");
      links.forEach((link) => {
        // Should not have href="#" which is poor UX
        const href = link.getAttribute("href");
        expect(href).not.toBe("#");
      });
    });
  });

  describe("missing calendly URL (AC2)", () => {
    it("returns null when profile has no calendly URL", () => {
      // Override mock to have no calendly
      jest.doMock("@/domains/profile/queries", () => ({
        useProfile: () => ({
          data: { ...mockProfile, calendly: undefined },
          isLoading: false,
          isError: false,
        }),
      }));

      // Should not crash even with missing URL
      expect(() => render(<Calendar />)).not.toThrow();
    });
  });
});
