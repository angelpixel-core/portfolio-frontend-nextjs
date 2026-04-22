import { render, screen } from "@testing-library/react";

import userModel from "@/domains/user/model";
import { auth } from "@/lib/auth";
import AdminUserDetailPage from "../page";

const mockRedirect = jest.fn((_: string) => {
  throw new Error("redirected");
});

const mockNotFound = jest.fn(() => {
  throw new Error("not-found");
});

jest.mock("next/headers", () => ({
  headers: jest.fn(async () => new Headers()),
}));

jest.mock("next/navigation", () => ({
  redirect: (value: string) => mockRedirect(value),
  notFound: () => mockNotFound(),
}));

jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("@/domains/user/model", () => ({
  __esModule: true,
  default: {
    getAdminDetailById: jest.fn(),
  },
}));

const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

const mockGetAdminDetailById =
  userModel.getAdminDetailById as jest.MockedFunction<
    typeof userModel.getAdminDetailById
  >;

const originalAdminEmails = process.env.ADMIN_EMAILS;

describe("AdminUserDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_EMAILS = "admin@angelpixel.io";
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
      AdminUserDetailPage({ params: Promise.resolve({ id: "user-1" }) })
    ).rejects.toThrow("redirected");
    expect(mockRedirect).toHaveBeenCalledWith("/");
    expect(mockGetAdminDetailById).not.toHaveBeenCalled();
  });

  it("calls notFound when user detail does not exist", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "admin-1", email: "admin@angelpixel.io" },
    } as any);
    mockGetAdminDetailById.mockResolvedValue(null);

    await expect(
      AdminUserDetailPage({ params: Promise.resolve({ id: "missing-user" }) })
    ).rejects.toThrow("not-found");
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders user detail tables", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "admin-1", email: "admin@angelpixel.io" },
    } as any);
    mockGetAdminDetailById.mockResolvedValue({
      user: {
        id: "user-1",
        email: "buyer@test.com",
        name: "Buyer",
        createdAt: new Date("2026-04-20T00:00:00.000Z"),
      },
      stats: {
        ordersCount: 2,
        paidOrdersCount: 1,
        accessCount: 1,
        lastOrderAt: new Date("2026-04-22T00:00:00.000Z"),
      },
      orders: [
        {
          id: "order-1",
          status: "paid",
          productKey: "article-why-portfolio-pattern",
          amount: 2900,
          currency: "usd",
          provider: "stripe",
          email: "buyer@test.com",
          createdAt: new Date("2026-04-22T00:00:00.000Z"),
          updatedAt: new Date("2026-04-22T00:00:00.000Z"),
        },
      ],
      access: [
        {
          id: "access-1",
          productKey: "article-why-portfolio-pattern",
          createdAt: new Date("2026-04-22T00:00:00.000Z"),
          updatedAt: new Date("2026-04-22T00:00:00.000Z"),
        },
      ],
    });

    const ui = await AdminUserDetailPage({
      params: Promise.resolve({ id: "user-1" }),
    });
    render(ui);

    expect(screen.getAllByText("buyer@test.com").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Access" })).toBeInTheDocument();
    expect(screen.getByText("order-1")).toBeInTheDocument();
    expect(screen.getByText("access-1")).toBeInTheDocument();
  });
});
