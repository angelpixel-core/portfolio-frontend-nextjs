import { render, screen } from "@testing-library/react";

import userModel from "@/domains/user/model";
import { auth } from "@/lib/auth";
import AdminUsersPage from "../page";

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

jest.mock("@/domains/user/model", () => ({
  __esModule: true,
  default: {
    listForAdmin: jest.fn(),
  },
}));

const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

const mockListForAdmin = userModel.listForAdmin as jest.MockedFunction<
  typeof userModel.listForAdmin
>;

const originalAdminEmails = process.env.ADMIN_EMAILS;

describe("AdminUsersPage", () => {
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

    await expect(AdminUsersPage()).rejects.toThrow("redirected");
    expect(mockRedirect).toHaveBeenCalledWith("/");
    expect(mockListForAdmin).not.toHaveBeenCalled();
  });

  it("renders user list for allowed admin", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "admin-1", email: "admin@angelpixel.io" },
    } as any);
    mockListForAdmin.mockResolvedValue([
      {
        id: "user-1",
        email: "buyer@test.com",
        name: "Buyer",
        createdAt: new Date("2026-04-22T00:00:00.000Z"),
        ordersCount: 2,
        paidOrdersCount: 1,
        accessCount: 1,
        lastOrderAt: new Date("2026-04-23T00:00:00.000Z"),
      },
    ]);

    const ui = await AdminUsersPage();
    render(ui);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("buyer@test.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute(
      "href",
      "/admin/users/user-1"
    );
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
