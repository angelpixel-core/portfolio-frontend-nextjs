import { render, screen } from "@testing-library/react";

import { auth } from "@/lib/auth";
import subscriptionModel from "@/domains/subscription/model";
import AdminSubscriptionsPage from "../page";

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

jest.mock("@/domains/subscription/model", () => ({
  __esModule: true,
  default: {
    getAdminOverviewStats: jest.fn(),
    listForAdmin: jest.fn(),
  },
}));

const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

const mockGetAdminOverviewStats =
  subscriptionModel.getAdminOverviewStats as jest.MockedFunction<
    typeof subscriptionModel.getAdminOverviewStats
  >;

const mockListForAdmin = subscriptionModel.listForAdmin as jest.MockedFunction<
  typeof subscriptionModel.listForAdmin
>;

const originalAdminEmails = process.env.ADMIN_EMAILS;

describe("AdminSubscriptionsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_EMAILS = "admin@angelpixel.io";
    mockGetAdminOverviewStats.mockResolvedValue({
      totalSubscriptions: 4,
      pendingSubscriptions: 2,
      subscribedSubscriptions: 1,
      unsubscribedSubscriptions: 1,
    });
    mockListForAdmin.mockResolvedValue([]);
  });

  afterAll(() => {
    if (typeof originalAdminEmails === "undefined") {
      delete process.env.ADMIN_EMAILS;
      return;
    }

    process.env.ADMIN_EMAILS = originalAdminEmails;
  });

  it("redirects when user is not admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1", email: "user@test.com" },
    } as any);

    await expect(
      AdminSubscriptionsPage({ searchParams: Promise.resolve({}) })
    ).rejects.toThrow("redirected");
    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("renders subscription table and filters for admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "admin-1", email: "admin@angelpixel.io" },
    } as any);
    mockListForAdmin.mockResolvedValue([
      {
        id: "sub-1",
        email: "buyer@test.com",
        status: "pending_confirmation",
        source: "article_cta",
        articleSlug: "why-portfolio-not-convert",
        locale: null,
        confirmedAt: null,
        unsubscribedAt: null,
        createdAt: new Date("2026-04-25T00:00:00.000Z"),
        updatedAt: new Date("2026-04-25T00:00:00.000Z"),
      },
    ]);

    const ui = await AdminSubscriptionsPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(screen.getByText("Subscriptions")).toBeInTheDocument();
    expect(screen.getByText("buyer@test.com")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "pending confirmation" })
    ).toHaveAttribute(
      "href",
      "/admin/subscriptions?status=pending_confirmation"
    );
    expect(screen.getByRole("link", { name: "Manage" })).toHaveAttribute(
      "href",
      "/admin/subscriptions/sub-1"
    );
  });
});
