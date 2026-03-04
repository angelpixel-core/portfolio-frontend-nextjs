import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("@/atoms/icons/LinkedInIcon", () => ({
  __esModule: true,
  default: ({ colored: _colored, ...props }: Record<string, unknown>) => (
    <svg data-testid="linkedin-icon" {...props} />
  ),
}));

jest.mock("@/atoms/icons/MicrosoftIcon", () => ({
  __esModule: true,
  default: ({ colored: _colored, ...props }: Record<string, unknown>) => (
    <svg data-testid="microsoft-icon" {...props} />
  ),
}));

jest.mock("@/atoms/icons/GooglePlusIcon", () => ({
  __esModule: true,
  default: ({ colored: _colored, ...props }: Record<string, unknown>) => (
    <svg data-testid="google-icon" {...props} />
  ),
}));

import OAuthButtons from "../Form/OAuthButtons";

describe("OAuthButtons", () => {
  it("renders 3 provider buttons with correct aria-labels", () => {
    render(<OAuthButtons />);

    expect(screen.getByLabelText("Continue with LinkedIn")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Continue with Microsoft")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Continue with Google")).toBeInTheDocument();
  });

  it("renders provider icons", () => {
    render(<OAuthButtons />);

    expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
    expect(screen.getByTestId("microsoft-icon")).toBeInTheDocument();
    expect(screen.getByTestId("google-icon")).toBeInTheDocument();
  });

  it("calls onOAuthClick with correct provider name on click", () => {
    const handleOAuthClick = jest.fn();
    render(<OAuthButtons onOAuthClick={handleOAuthClick} />);

    fireEvent.click(screen.getByLabelText("Continue with LinkedIn"));
    expect(handleOAuthClick).toHaveBeenCalledWith("linkedin");

    fireEvent.click(screen.getByLabelText("Continue with Microsoft"));
    expect(handleOAuthClick).toHaveBeenCalledWith("microsoft");

    fireEvent.click(screen.getByLabelText("Continue with Google"));
    expect(handleOAuthClick).toHaveBeenCalledWith("google");

    expect(handleOAuthClick).toHaveBeenCalledTimes(3);
  });

  it("does not crash when onOAuthClick is not provided", () => {
    render(<OAuthButtons />);

    expect(() => {
      fireEvent.click(screen.getByLabelText("Continue with LinkedIn"));
    }).not.toThrow();
  });
});
