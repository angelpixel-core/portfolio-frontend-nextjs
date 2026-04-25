import { eq } from "drizzle-orm";

import model from "../index";

jest.mock("drizzle-orm", () => ({
  eq: jest.fn((left, right) => ({ left, right })),
}));

const mockInsertReturning = jest.fn();
const mockInsertOnConflictDoUpdate = jest.fn(() => ({
  returning: mockInsertReturning,
}));
const mockInsertValues = jest.fn(() => ({
  onConflictDoUpdate: mockInsertOnConflictDoUpdate,
}));

const mockUpdateWhere = jest.fn();
const mockUpdateSet = jest.fn(() => ({ where: mockUpdateWhere }));

const mockSelectLimit = jest.fn();
const mockSelectWhere = jest.fn(() => ({ limit: mockSelectLimit }));
const mockSelectFrom = jest.fn(() => ({ where: mockSelectWhere }));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "subscription-1"),
}));

jest.mock("../../../../db", () => ({
  db: {
    insert: jest.fn(() => ({ values: mockInsertValues })),
    update: jest.fn(() => ({ set: mockUpdateSet })),
    select: jest.fn(() => ({ from: mockSelectFrom })),
  },
}));

jest.mock("../../../../db/schema", () => ({
  subscriptions: {
    id: "subscriptions.id",
    email: "subscriptions.email",
  },
}));

describe("subscription model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("createOrUpdatePending normalizes email and upserts pending state", async () => {
    mockInsertReturning.mockResolvedValue([
      {
        id: "subscription-1",
        email: "hello@angelpixel.io",
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

    const result = await model.createOrUpdatePending({
      email: "  HELLO@AngelPixel.io ",
      source: "article_cta",
      articleSlug: "why-portfolio-not-convert",
    });

    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "hello@angelpixel.io",
        status: "pending_confirmation",
      })
    );
    expect(mockInsertOnConflictDoUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        target: "subscriptions.email",
      })
    );
    expect(result.email).toBe("hello@angelpixel.io");
    expect(result.status).toBe("pending_confirmation");
  });

  it("markConfirmed updates status and timestamps", async () => {
    mockUpdateWhere.mockResolvedValue(undefined);

    await model.markConfirmed("sub-42");

    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "subscribed",
        unsubscribedAt: null,
      })
    );
    expect(eq).toHaveBeenCalledWith("subscriptions.id", "sub-42");
    expect(mockUpdateWhere).toHaveBeenCalled();
  });

  it("markUnsubscribed sets unsubscribed status", async () => {
    mockUpdateWhere.mockResolvedValue(undefined);

    await model.markUnsubscribed("sub-99");

    expect(mockUpdateSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unsubscribed",
      })
    );
    expect(eq).toHaveBeenCalledWith("subscriptions.id", "sub-99");
  });

  it("findByEmail normalizes email", async () => {
    mockSelectLimit.mockResolvedValue([
      {
        id: "sub-1",
        email: "hello@angelpixel.io",
        status: "subscribed",
        source: null,
        articleSlug: null,
        locale: null,
        confirmedAt: null,
        unsubscribedAt: null,
        createdAt: new Date("2026-04-25T00:00:00.000Z"),
        updatedAt: new Date("2026-04-25T00:00:00.000Z"),
      },
    ]);

    const result = await model.findByEmail(" HELLO@ANGELPIXEL.IO ");

    expect(eq).toHaveBeenCalledWith(
      "subscriptions.email",
      "hello@angelpixel.io"
    );
    expect(result?.id).toBe("sub-1");
  });

  it("findById returns null when not found", async () => {
    mockSelectLimit.mockResolvedValue([]);

    const result = await model.findById("missing-id");

    expect(eq).toHaveBeenCalledWith("subscriptions.id", "missing-id");
    expect(result).toBeNull();
  });
});
