import { render, screen } from "@testing-library/react";
import SocialNetworkLink from "../index";

// Mock useReducedMotion hook
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock the Icon component
jest.mock("../Icon", () => {
  return function MockIcon({
    name,
    className,
  }: {
    name: string;
    className?: string;
  }) {
    return (
      <span data-testid={`icon-${name}`} className={className}>
        {name}
      </span>
    );
  };
});

describe("SocialNetworkLink", () => {
  const defaultProps = {
    href: "https://github.com/user",
    iconName: "GitHub",
    iconClassName: "",
    ariaLabel: undefined as string | undefined,
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
          href={defaultProps.href}
          iconName={defaultProps.iconName}
          iconClassName=""
          ariaLabel="Visit my GitHub profile"
        />
      );
      const link = screen.getByRole("link", {
        name: "Visit my GitHub profile",
      });
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
          iconClassName=""
          ariaLabel={undefined}
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
          iconClassName=""
          ariaLabel={undefined}
        />
      );
      const link = screen.getByRole("link", { name: "twitter" });
      expect(link).toHaveAttribute("href", "https://twitter.com/user");
    });
  });
});
