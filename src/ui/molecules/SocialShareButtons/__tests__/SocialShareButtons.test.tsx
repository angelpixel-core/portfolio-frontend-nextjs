/**
 * SocialShareButtons Component Tests
 * Story 4.3: Social Sharing
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SocialShareButtons from "../index";

// Mock window.open for popup tests
const mockWindowOpen = jest.fn();
Object.defineProperty(window, "open", {
  writable: true,
  value: mockWindowOpen,
});

// Mock window dimensions for centering calculation
Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
Object.defineProperty(window, "innerHeight", { writable: true, value: 768 });
Object.defineProperty(window, "screenX", { writable: true, value: 0 });
Object.defineProperty(window, "screenY", { writable: true, value: 0 });

describe("SocialShareButtons", () => {
  const defaultProps = {
    url: "https://example.com/articles/test-article",
    title: "Test Article Title",
  };

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  describe("rendering", () => {
    it("renders Twitter/X share button with correct aria-label", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      expect(twitterButton).toBeInTheDocument();
    });

    it("renders LinkedIn share button with correct aria-label", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const linkedInButton = screen.getByRole("button", {
        name: /share on linkedin/i,
      });
      expect(linkedInButton).toBeInTheDocument();
    });

    it("renders share label", () => {
      render(<SocialShareButtons {...defaultProps} />);

      expect(screen.getByText(/share/i)).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("buttons are focusable (keyboard accessible)", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      const linkedInButton = screen.getByRole("button", {
        name: /share on linkedin/i,
      });

      expect(twitterButton).not.toHaveAttribute("tabindex", "-1");
      expect(linkedInButton).not.toHaveAttribute("tabindex", "-1");
    });

    it("buttons have type=button to prevent form submission", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      const linkedInButton = screen.getByRole("button", {
        name: /share on linkedin/i,
      });

      expect(twitterButton).toHaveAttribute("type", "button");
      expect(linkedInButton).toHaveAttribute("type", "button");
    });

    it("icons have aria-hidden for screen readers", () => {
      const { container } = render(<SocialShareButtons {...defaultProps} />);

      const svgIcons = container.querySelectorAll("svg");
      svgIcons.forEach((icon) => {
        expect(icon).toHaveAttribute("aria-hidden", "true");
      });
    });

    it("container has role=group with aria-label for screen readers", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const group = screen.getByRole("group", { name: /share this article/i });
      expect(group).toBeInTheDocument();
    });
  });

  describe("Twitter/X share functionality", () => {
    it("opens popup with Twitter intent URL on click", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      fireEvent.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      const [url, windowName, features] = mockWindowOpen.mock.calls[0];

      expect(url).toContain("https://twitter.com/intent/tweet");
      expect(windowName).toBe("twitter-share");
      expect(features).toContain("noopener");
      expect(features).toContain("noreferrer");
    });

    it("Twitter URL includes encoded title as text param", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      fireEvent.click(twitterButton);

      const [url] = mockWindowOpen.mock.calls[0];
      // URLSearchParams encodes spaces as + which is valid
      expect(url).toContain("text=Test+Article+Title");
    });

    it("Twitter URL includes encoded article URL", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      fireEvent.click(twitterButton);

      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain(
        "url=https%3A%2F%2Fexample.com%2Farticles%2Ftest-article"
      );
    });
  });

  describe("LinkedIn share functionality", () => {
    it("opens popup with LinkedIn share URL on click", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const linkedInButton = screen.getByRole("button", {
        name: /share on linkedin/i,
      });
      fireEvent.click(linkedInButton);

      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      const [url, windowName, features] = mockWindowOpen.mock.calls[0];

      expect(url).toContain("https://www.linkedin.com/sharing/share-offsite/");
      expect(windowName).toBe("linkedin-share");
      expect(features).toContain("noopener");
      expect(features).toContain("noreferrer");
    });

    it("LinkedIn URL includes encoded article URL", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const linkedInButton = screen.getByRole("button", {
        name: /share on linkedin/i,
      });
      fireEvent.click(linkedInButton);

      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain(
        "url=https%3A%2F%2Fexample.com%2Farticles%2Ftest-article"
      );
    });
  });

  describe("popup window behavior", () => {
    it("popup has specified dimensions", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      fireEvent.click(twitterButton);

      const [, , features] = mockWindowOpen.mock.calls[0];
      expect(features).toContain("width=");
      expect(features).toContain("height=");
    });

    it("popup has position for centering", () => {
      render(<SocialShareButtons {...defaultProps} />);

      const twitterButton = screen.getByRole("button", {
        name: /share on twitter/i,
      });
      fireEvent.click(twitterButton);

      const [, , features] = mockWindowOpen.mock.calls[0];
      expect(features).toContain("left=");
      expect(features).toContain("top=");
    });
  });
});
