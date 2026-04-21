import React from "react";
import { render, screen } from "@testing-library/react";

import orderModel from "@/domains/order/model";
import SuccessPage from "../page";

jest.mock("@/domains/order/model", () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}));

const mockFindById = orderModel.findById as jest.MockedFunction<
  typeof orderModel.findById
>;

describe("SuccessPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows unlock section when order is paid", async () => {
    mockFindById.mockResolvedValue({
      id: "order_paid_1",
      productKey: "article-why-portfolio-pattern",
      status: "paid",
      provider: "stripe",
      amount: 2900,
      currency: "usd",
      createdAt: new Date("2026-04-21T00:00:00.000Z"),
      updatedAt: new Date("2026-04-21T00:00:00.000Z"),
    });

    const ui = await SuccessPage({
      searchParams: Promise.resolve({ order_id: "order_paid_1" }),
    });
    render(ui);

    expect(screen.getByText(/payment confirmed/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open unlock resource/i })
    ).toBeInTheDocument();
  });

  it("does not show unlock section when order is pending", async () => {
    mockFindById.mockResolvedValue({
      id: "order_pending_1",
      productKey: "article-why-portfolio-pattern",
      status: "pending",
      provider: "stripe",
      amount: 2900,
      currency: "usd",
      createdAt: new Date("2026-04-21T00:00:00.000Z"),
      updatedAt: new Date("2026-04-21T00:00:00.000Z"),
    });

    const ui = await SuccessPage({
      searchParams: Promise.resolve({ order_id: "order_pending_1" }),
    });
    render(ui);

    expect(screen.getByText(/payment is processing/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /open unlock resource/i })
    ).not.toBeInTheDocument();
  });

  it("does not show unlock section when order is failed", async () => {
    mockFindById.mockResolvedValue({
      id: "order_failed_1",
      productKey: "article-why-portfolio-pattern",
      status: "failed",
      provider: "stripe",
      amount: 2900,
      currency: "usd",
      createdAt: new Date("2026-04-21T00:00:00.000Z"),
      updatedAt: new Date("2026-04-21T00:00:00.000Z"),
    });

    const ui = await SuccessPage({
      searchParams: Promise.resolve({ order_id: "order_failed_1" }),
    });
    render(ui);

    expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /open unlock resource/i })
    ).not.toBeInTheDocument();
  });
});
