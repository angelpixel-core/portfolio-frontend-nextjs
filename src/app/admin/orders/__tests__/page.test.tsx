import { render, screen } from "@testing-library/react";

import { auth } from "@/lib/auth";
import orderModel from "@/domains/order/model";
import AdminOrdersPage from "../page";

const mockRedirect = jest.fn((_: string) => {
  throw new Error("redirected");
});

jest.mock("next/headers", () => ({
  headers: jest.fn(async () => new Headers()),
}));

jest.mock("next/navigation", () => ({
  redirect: (value: string) => mockRedirect(value),
}));

jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("@/domains/order/model", () => ({
  __esModule: true,
  default: {
    listForAdmin: jest.fn(),
  },
}));

const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

const mockListForAdmin = orderModel.listForAdmin as jest.MockedFunction<
  typeof orderModel.listForAdmin
>;

const originalAdminEmails = process.env.ADMIN_EMAILS;

describe("AdminOrdersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_EMAILS = "admin@angelpixel.io";
    mockListForAdmin.mockResolvedValue([]);
  });

  afterAll(() => {
    if (typeof originalAdminEmails === "undefined") {
      delete process.env.ADMIN_EMAILS;
      return;
    }

    process.env.ADMIN_EMAILS = originalAdminEmails;
  });

  it("redirects when user is unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);

    await expect(AdminOrdersPage()).rejects.toThrow("redirected");
    expect(mockRedirect).toHaveBeenCalledWith("/");
    expect(mockListForAdmin).not.toHaveBeenCalled();
  });

  it("redirects when authenticated user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1", email: "user@test.com" },
    } as any);

    await expect(AdminOrdersPage()).rejects.toThrow("redirected");
    expect(mockRedirect).toHaveBeenCalledWith("/");
    expect(mockListForAdmin).not.toHaveBeenCalled();
  });

  it("renders order table for allowed admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "admin-1", email: "admin@angelpixel.io" },
    } as any);
    mockListForAdmin.mockResolvedValue([
      {
        id: "order-1",
        status: "paid",
        productKey: "article-why-portfolio-pattern",
        amount: 2900,
        currency: "usd",
        provider: "stripe",
        email: "buyer@test.com",
        userId: "user-1",
        userEmail: "buyer@test.com",
        userName: "Buyer",
        createdAt: new Date("2026-04-22T00:00:00.000Z"),
        updatedAt: new Date("2026-04-22T00:00:00.000Z"),
      },
    ]);

    const ui = await AdminOrdersPage();
    render(ui);

    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("order-1")).toBeInTheDocument();
    expect(
      screen.getByText("article-why-portfolio-pattern")
    ).toBeInTheDocument();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
