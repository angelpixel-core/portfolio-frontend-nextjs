/**
 * WhatsApp Component Tests
 * Story 5.2: WhatsApp Contact
 * TDD: Tests written BEFORE implementation
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Mock useProfile hook
const mockProfile = {
  whatsapp: "https://wa.me/5491122334455",
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

// Mock WhatsApp icon - the real icon has aria-hidden built-in
jest.mock("@/icons", () => ({
  WhatsAppIcon: ({
    className,
    ...rest
  }: {
    className?: string;
    [key: string]: unknown;
  }) => (
    <svg
      data-testid="whatsapp-icon"
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
import WhatsApp from "../index";

describe("WhatsApp", () => {
  beforeEach(() => {
    mockIsLoading = false;
    mockIsError = false;
  });

  describe("rendering", () => {
    it("renders WhatsApp link", () => {
      render(<WhatsApp />);

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThan(0);
    });

    it("renders WhatsApp icon", () => {
      render(<WhatsApp />);

      expect(screen.getByTestId("whatsapp-icon")).toBeInTheDocument();
    });
  });

  describe("wa.me format (AC2)", () => {
    it("link uses wa.me format with country code", () => {
      render(<WhatsApp />);

      const links = screen.getAllByRole("link");
      const whatsappLink = links.find((link) =>
        link.getAttribute("href")?.includes("wa.me")
      );

      expect(whatsappLink).toBeInTheDocument();
      expect(whatsappLink?.getAttribute("href")).toBe(
        "https://wa.me/5491122334455"
      );
    });
  });

  describe("link attributes (AC1)", () => {
    it("link has target=_blank for new tab", () => {
      render(<WhatsApp />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("target", "_blank");
      });
    });

    it("link has rel=noopener noreferrer for security", () => {
      render(<WhatsApp />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      });
    });
  });

  describe("accessibility", () => {
    it("icon has aria-hidden for screen readers", () => {
      render(<WhatsApp />);

      const icon = screen.getByTestId("whatsapp-icon");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("links have accessible name via aria-label", () => {
      render(<WhatsApp />);

      // Both text link and icon link should have aria-label
      const links = screen.getAllByRole("link", { name: /whatsapp/i });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        expect(link).toHaveAttribute("aria-label");
      });
    });

    it("links are keyboard focusable", () => {
      render(<WhatsApp />);

      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("loading state", () => {
    it("renders nothing when loading (returns null)", () => {
      mockIsLoading = true;
      render(<WhatsApp />);

      // Component returns null during loading - no links should be rendered
      const links = screen.queryAllByRole("link");
      expect(links).toHaveLength(0);
    });
  });

  describe("error state", () => {
    it("handles error gracefully without crashing", () => {
      mockIsError = true;

      // Should not throw
      expect(() => render(<WhatsApp />)).not.toThrow();
    });

    it("does not render broken link on error", () => {
      mockIsError = true;
      render(<WhatsApp />);

      const links = screen.queryAllByRole("link");
      links.forEach((link) => {
        // Should not have href="#" which is poor UX
        const href = link.getAttribute("href");
        expect(href).not.toBe("#");
      });
    });
  });
});
