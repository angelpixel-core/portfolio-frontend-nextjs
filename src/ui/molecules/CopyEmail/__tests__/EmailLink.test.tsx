/**
 * EmailLink Component Tests
 * Story 5.1: Email Contact Access
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Store original env
const originalEnv = process.env;

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    className,
    id,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
    id?: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} className={className} id={id} {...props}>
        {children}
      </a>
    );
  };
});

describe("EmailLink", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("with PROFILE_EMAIL set", () => {
    beforeEach(() => {
      process.env.PROFILE_EMAIL = "contact@example.com";
    });

    it("renders email address as visible text", async () => {
      const { default: EmailLink } = await import("../EmailLink");
      render(<EmailLink />);

      expect(screen.getByText("contact@example.com")).toBeInTheDocument();
    });

    it("renders mailto: href", async () => {
      const { default: EmailLink } = await import("../EmailLink");
      render(<EmailLink />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "mailto:contact@example.com");
    });

    it("has proper aria-label for accessibility", async () => {
      const { default: EmailLink } = await import("../EmailLink");
      render(<EmailLink />);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute(
        "aria-label",
        "Send email to contact@example.com"
      );
    });

    it("has emailTextId for clipboard copy", async () => {
      const { default: EmailLink } = await import("../EmailLink");
      render(<EmailLink />);

      expect(document.getElementById("emailTextId")).toBeInTheDocument();
    });
  });

  describe("without PROFILE_EMAIL set", () => {
    beforeEach(() => {
      delete process.env.PROFILE_EMAIL;
      jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("returns null when env var is not set", async () => {
      const { default: EmailLink } = await import("../EmailLink");
      const { container } = render(<EmailLink />);

      expect(container.firstChild).toBeNull();
    });

    it("logs warning when env var is not set", async () => {
      const { default: EmailLink } = await import("../EmailLink");
      render(<EmailLink />);

      expect(console.warn).toHaveBeenCalledWith(
        "PROFILE_EMAIL environment variable not set"
      );
    });
  });
});
