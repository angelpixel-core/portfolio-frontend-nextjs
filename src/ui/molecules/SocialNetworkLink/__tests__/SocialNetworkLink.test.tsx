import React from "react";
import { render, screen } from "@testing-library/react";
import SocialNetworkLink from "../index";

// Mock framer-motion to avoid animation issues
jest.mock("framer-motion", () => {
  const createMotionComponent = (tag: string) => {
    return React.forwardRef(function MockMotion(
      {
        children,
        className,
        whileHover,
        whileTap,
        ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        whileHover?: unknown;
        whileTap?: unknown;
      },
      ref: React.Ref<HTMLAnchorElement>
    ) {
      const Tag = tag as keyof React.JSX.IntrinsicElements;
      return React.createElement(Tag, { className, ref, ...props }, children);
    });
  };

  const motion = {} as Record<string, ReturnType<typeof createMotionComponent>>;
  motion.a = createMotionComponent("a");
  motion.div = createMotionComponent("div");
  motion.span = createMotionComponent("span");

  return { motion };
});

// Mock the Icon component
jest.mock("../Icon", () => {
  return function MockIcon({ name, className }: { name: string; className?: string }) {
    return <span data-testid={`icon-${name}`} className={className}>{name}</span>;
  };
});

describe("SocialNetworkLink", () => {
  const defaultProps = {
    href: "https://github.com/user",
    iconName: "GitHub",
  };

  describe("rendering", () => {
    it("renders with correct href", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://github.com/user");
    });

    it("renders with target _blank for new tab", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders with rel noopener noreferrer for security", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders the icon component", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      expect(screen.getByTestId("icon-GitHub")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has aria-label from iconName when ariaLabel not provided", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      const link = screen.getByRole("link", { name: "GitHub" });
      expect(link).toBeInTheDocument();
    });

    it("uses custom ariaLabel when provided", () => {
      render(
        <SocialNetworkLink
          {...defaultProps}
          ariaLabel="Visit my GitHub profile"
        />
      );
      const link = screen.getByRole("link", { name: "Visit my GitHub profile" });
      expect(link).toBeInTheDocument();
    });

    it("has title attribute for tooltip", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("title", "GitHub");
    });

    // Note: jest-axe tests can be added when dependency is installed
    // For now, we manually verify accessibility through aria-label and keyboard tests
  });

  describe("keyboard accessibility", () => {
    it("is focusable", () => {
      render(<SocialNetworkLink {...defaultProps} />);
      const link = screen.getByRole("link");
      link.focus();
      expect(document.activeElement).toBe(link);
    });
  });

  describe("different social networks", () => {
    it("renders LinkedIn link correctly", () => {
      render(
        <SocialNetworkLink
          href="https://linkedin.com/in/user"
          iconName="LinkedIn"
        />
      );
      const link = screen.getByRole("link", { name: "LinkedIn" });
      expect(link).toHaveAttribute("href", "https://linkedin.com/in/user");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders Twitter link correctly", () => {
      render(
        <SocialNetworkLink
          href="https://twitter.com/user"
          iconName="twitter"
        />
      );
      const link = screen.getByRole("link", { name: "twitter" });
      expect(link).toHaveAttribute("href", "https://twitter.com/user");
    });
  });
});
