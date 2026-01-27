/**
 * Icon Component Tests - Story 10.2
 *
 * Tests for PascalCase icon mapping (Twitter, Dribbble).
 * These tests verify that icons render without fallback to QuestionIcon.
 */

import { render, screen } from "@testing-library/react";
import Icon from "../Icon";

// Mock the logger to capture warnings
const mockWarn = jest.fn();
jest.mock("@/lib/logger", () => ({
  logger: {
    warn: (...args: unknown[]) => mockWarn(...args),
  },
}));

// Mock all icon components
jest.mock("@/atoms/icons", () => ({
  DribbbleIcon: ({ className }: { className?: string }) => (
    <span data-testid="dribbble-icon" className={className}>
      DribbbleIcon
    </span>
  ),
  GitHubIcon: ({ className }: { className?: string }) => (
    <span data-testid="github-icon" className={className}>
      GitHubIcon
    </span>
  ),
  LinkedInIcon: ({ className }: { className?: string }) => (
    <span data-testid="linkedin-icon" className={className}>
      LinkedInIcon
    </span>
  ),
  PinterestIcon: ({ className }: { className?: string }) => (
    <span data-testid="pinterest-icon" className={className}>
      PinterestIcon
    </span>
  ),
  TelegramIcon: ({ className }: { className?: string }) => (
    <span data-testid="telegram-icon" className={className}>
      TelegramIcon
    </span>
  ),
  TwitterIcon: ({ className }: { className?: string }) => (
    <span data-testid="twitter-icon" className={className}>
      TwitterIcon
    </span>
  ),
  WhatsAppIcon: ({ className }: { className?: string }) => (
    <span data-testid="whatsapp-icon" className={className}>
      WhatsAppIcon
    </span>
  ),
  QuestionIcon: ({ className }: { className?: string }) => (
    <span data-testid="question-icon" className={className}>
      QuestionIcon
    </span>
  ),
}));

describe("Icon", () => {
  beforeEach(() => {
    mockWarn.mockClear();
  });

  describe("lowercase icon names (existing)", () => {
    it("renders twitter icon for lowercase 'twitter'", () => {
      render(<Icon name="twitter" className="test-class" />);
      expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders dribbble icon for lowercase 'dribbble'", () => {
      render(<Icon name="dribbble" className="test-class" />);
      expect(screen.getByTestId("dribbble-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders github icon for lowercase 'github'", () => {
      render(<Icon name="github" className="test-class" />);
      expect(screen.getByTestId("github-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });
  });

  describe("PascalCase icon names (Story 10.2 fix)", () => {
    it("renders Twitter icon for PascalCase 'Twitter'", () => {
      render(<Icon name="Twitter" className="test-class" />);

      // Should render TwitterIcon, NOT QuestionIcon
      expect(screen.getByTestId("twitter-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("question-icon")).not.toBeInTheDocument();

      // Should NOT log a warning
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders Dribbble icon for PascalCase 'Dribbble'", () => {
      render(<Icon name="Dribbble" className="test-class" />);

      // Should render DribbbleIcon, NOT QuestionIcon
      expect(screen.getByTestId("dribbble-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("question-icon")).not.toBeInTheDocument();

      // Should NOT log a warning
      expect(mockWarn).not.toHaveBeenCalled();
    });
  });

  describe("existing PascalCase mappings", () => {
    it("renders GitHub icon for 'GitHub'", () => {
      render(<Icon name="GitHub" className="test-class" />);
      expect(screen.getByTestId("github-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders LinkedIn icon for 'LinkedIn'", () => {
      render(<Icon name="LinkedIn" className="test-class" />);
      expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders WhatsApp icon for 'WhatsApp'", () => {
      render(<Icon name="WhatsApp" className="test-class" />);
      expect(screen.getByTestId("whatsapp-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders Pinterest icon for 'Pinterest'", () => {
      render(<Icon name="Pinterest" className="test-class" />);
      expect(screen.getByTestId("pinterest-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });

    it("renders Telegram icon for 'Telegram'", () => {
      render(<Icon name="Telegram" className="test-class" />);
      expect(screen.getByTestId("telegram-icon")).toBeInTheDocument();
      expect(mockWarn).not.toHaveBeenCalled();
    });
  });

  describe("fallback behavior", () => {
    it("renders QuestionIcon for unknown icon name", () => {
      render(<Icon name="UnknownNetwork" className="test-class" />);
      expect(screen.getByTestId("question-icon")).toBeInTheDocument();
    });

    it("logs warning for unknown icon name", () => {
      render(<Icon name="UnknownNetwork" className="test-class" />);
      expect(mockWarn).toHaveBeenCalledWith(
        "SocialNetworkLink",
        'Icon "UnknownNetwork" not found in iconMapping',
        { fallback: "QuestionIcon" }
      );
    });
  });

  describe("className propagation", () => {
    it("passes className to icon component", () => {
      render(<Icon name="github" className="custom-class" />);
      const icon = screen.getByTestId("github-icon");
      expect(icon).toHaveClass("custom-class");
    });
  });
});
