import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { StealPatternCTA } from "../StealPatternCTA";
import {
  buildTelegramMessage,
  buildTelegramUrl,
} from "@/lib/messaging/telegram";
import { getSocialUrl } from "@/lib/social-urls";
import { trackEvent } from "@/services/analytics";

jest.mock("../PaymentModal", () => ({
  __esModule: true,
  default: () => <div data-testid="payment-modal">Payment modal</div>,
}));

jest.mock("@/lib/messaging/telegram", () => ({
  buildTelegramMessage: jest.fn(),
  buildTelegramUrl: jest.fn(),
}));

jest.mock("@/lib/social-urls", () => ({
  getSocialUrl: jest.fn(),
}));

jest.mock("@/services/analytics", () => ({
  trackEvent: jest.fn(),
}));

const mockBuildTelegramMessage = buildTelegramMessage as jest.MockedFunction<
  typeof buildTelegramMessage
>;
const mockBuildTelegramUrl = buildTelegramUrl as jest.MockedFunction<
  typeof buildTelegramUrl
>;
const mockGetSocialUrl = getSocialUrl as jest.MockedFunction<
  typeof getSocialUrl
>;
const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

const ORIGINAL_MONETIZATION_MODE = process.env.NEXT_PUBLIC_MONETIZATION_MODE;

describe("StealPatternCTA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_MONETIZATION_MODE;

    mockGetSocialUrl.mockReturnValue("https://t.me/angel");
    mockBuildTelegramMessage.mockReturnValue("Hi Angel");
    mockBuildTelegramUrl.mockReturnValue("https://t.me/angel?text=Hi%20Angel");
  });

  afterAll(() => {
    if (typeof ORIGINAL_MONETIZATION_MODE === "undefined") {
      delete process.env.NEXT_PUBLIC_MONETIZATION_MODE;
      return;
    }

    process.env.NEXT_PUBLIC_MONETIZATION_MODE = ORIGINAL_MONETIZATION_MODE;
  });

  it("shows Telegram contact CTA by default", () => {
    render(<StealPatternCTA />);

    const contactLink = screen.getByRole("link", { name: /let's talk/i });
    expect(contactLink).toHaveAttribute(
      "href",
      "https://t.me/angel?text=Hi%20Angel"
    );

    fireEvent.click(contactLink);
    expect(mockTrackEvent).toHaveBeenCalledWith("cta_contact_click", {
      label: "article_lets_talk",
      href: "https://t.me/angel?text=Hi%20Angel",
    });
    expect(screen.queryByTestId("payment-modal")).not.toBeInTheDocument();
  });

  it("shows checkout modal flow when mode is checkout", () => {
    process.env.NEXT_PUBLIC_MONETIZATION_MODE = "checkout";

    render(<StealPatternCTA />);

    fireEvent.click(screen.getByRole("button", { name: "Steal this pattern" }));

    expect(screen.getByTestId("payment-modal")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /let's talk/i })
    ).not.toBeInTheDocument();
  });
});
