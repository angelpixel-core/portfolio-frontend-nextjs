import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { PaymentModal } from "../PaymentModal";

describe("PaymentModal", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    onClose.mockReset();
    global.fetch = jest.fn();
  });

  it("calls create-session API and redirects on successful card checkout", async () => {
    const redirectSpy = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, url: "https://checkout.stripe.com/test" }),
    });

    render(<PaymentModal onClose={onClose} onRedirect={redirectSpy} />);

    fireEvent.click(screen.getByRole("button", { name: "Pay with Card" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/checkout/create-session",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
    });

    const requestBody = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body as string
    );
    expect(requestBody).toEqual({
      productKey: "article-why-portfolio-pattern",
      source: "article-cta",
    });

    await waitFor(() => {
      expect(redirectSpy).toHaveBeenCalledWith(
        "https://checkout.stripe.com/test"
      );
    });
  });

  it("shows fallback message when create-session fails", async () => {
    const redirectSpy = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, error: "provider_error" }),
    });

    render(<PaymentModal onClose={onClose} onRedirect={redirectSpy} />);

    fireEvent.click(screen.getByRole("button", { name: "Pay with Card" }));

    await waitFor(() => {
      expect(
        screen.getByText("Unable to start checkout. Please try again.")
      ).toBeInTheDocument();
    });

    expect(redirectSpy).not.toHaveBeenCalled();
  });

  it("shows loading state while checkout request is in flight", async () => {
    let resolveRequest: (_value: unknown) => void;
    (global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    render(<PaymentModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Pay with Card" }));

    expect(screen.getByText("Redirecting...")).toBeInTheDocument();

    resolveRequest!({
      ok: false,
      json: async () => ({ ok: false, error: "provider_error" }),
    });

    await waitFor(() => {
      expect(screen.queryByText("Redirecting...")).not.toBeInTheDocument();
    });
  });
});
