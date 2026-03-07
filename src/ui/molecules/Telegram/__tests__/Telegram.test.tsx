/**
 * Telegram Component Tests
 * Story 5.2: Telegram Contact
 * TDD: Tests written BEFORE implementation
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock useProfile hook
const mockProfile = {
  telegram:
    "https://t.me/angelszymczak?text=Hello+Angel,+I+found+your+portfolio+and+would+like+to+connect.",
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

// Mock Telegram icon (direct path import, no barrel)
jest.mock("@/atoms/icons/TelegramIcon", () => ({
  __esModule: true,
  default: ({
    className,
    ...rest
  }: {
    className?: string;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="telegram-icon"
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
import Telegram from "../index";

describe("Telegram", () => {
  beforeEach(() => {
    mockIsLoading = false;
    mockIsError = false;
  });

  describe("rendering", () => {
    it("renders Telegram link", () => {
      render(<Telegram />);

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("renders Telegram icon", () => {
      render(<Telegram />);

      expect(screen.getByTestId("telegram-icon")).toBeInTheDocument();
    });
  });

  describe("t.me format (AC2)", () => {
    it("link uses t.me format with country code", () => {
      render(<Telegram />);

      const links = screen.getAllByRole("link");
      const telegramLink = links.find((link) =>
        link.getAttribute("href")?.includes("t.me")
      );

      expect(telegramLink).toBeInTheDocument();
      expect(telegramLink?.getAttribute("href")).toBe(
        "https://t.me/angelszymczak?text=Hello+Angel,+I+found+your+portfolio+and+would+like+to+connect."
      );
    });
  });

  describe("link attributes (AC1)", () => {
    it("link has target=_blank for new tab", () => {
      render(<Telegram />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("link has rel=noopener noreferrer for security", () => {
      render(<Telegram />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("accessibility", () => {
    it("icon has aria-hidden for screen readers", () => {
      render(<Telegram />);

      const icon = screen.getByTestId("telegram-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("links have accessible name via aria-label", () => {
      render(<Telegram />);

      // Both text link and icon link should have aria-label
      const links = screen.getAllByRole("link", { name: /telegram/i });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute("aria-label");
      });
    });

    it("links are keyboard focusable", () => {
      render(<Telegram />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("loading state", () => {
    it("renders nothing when loading (returns null)", () => {
      mockIsLoading = true;
      render(<Telegram />);

      // Component returns null during loading - no links should be rendered
      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(0);
    });
  });

  describe("error state", () => {
    it("handles error gracefully without crashing", () => {
      mockIsError = true;

      // Should not throw
      expect(() => render(<Telegram />)).not.toThrow();
    });

    it("does not render broken link on error", () => {
      mockIsError = true;
      render(<Telegram />);

      const links = screen.queryAllByRole("link");
      links.forEach((link) => {
        // Should not have href="#" which is poor UX
        const href = link.getAttribute("href");
        expect(href).not.toBe("#");
      });
    });
  });
});
