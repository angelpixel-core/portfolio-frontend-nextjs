import { desc, eq } from "drizzle-orm";

import model from "../index";

const mockInsertValues = jest.fn();
const mockSelectOrderBy = jest.fn();
const mockSelectWhere = jest.fn(() => ({ orderBy: mockSelectOrderBy }));
const mockSelectFrom = jest.fn(() => ({ where: mockSelectWhere }));

jest.mock("drizzle-orm", () => ({
  eq: jest.fn((left, right) => ({ left, right })),
  desc: jest.fn((value) => ({ value })),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "sub-event-1"),
}));

jest.mock("../../../../db", () => ({
  db: {
    insert: jest.fn(() => ({ values: mockInsertValues })),
    select: jest.fn(() => ({ from: mockSelectFrom })),
  },
}));

jest.mock("../../../../db/schema", () => ({
  subscriptionEvents: {
    subscriptionId: "subscription_event.subscription_id",
    createdAt: "subscription_event.created_at",
  },
}));

describe("subscription-event model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("recordEvent persists event row", async () => {
    mockInsertValues.mockResolvedValue(undefined);

    await model.recordEvent({
      subscriptionId: "sub-1",
      type: "created",
      payload: '{"source":"article_cta"}',
    });

    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "sub-event-1",
        subscriptionId: "sub-1",
        type: "created",
      })
    );
  });

  it("listBySubscriptionId returns ordered events", async () => {
    mockSelectOrderBy.mockResolvedValue([
      {
        id: "evt-2",
        subscriptionId: "sub-1",
        type: "confirmed",
        payload: null,
        createdAt: new Date("2026-04-25T05:00:00.000Z"),
        updatedAt: new Date("2026-04-25T05:00:00.000Z"),
      },
    ]);

    const result = await model.listBySubscriptionId("sub-1");

    expect(eq).toHaveBeenCalledWith(
      "subscription_event.subscription_id",
      "sub-1"
    );
    expect(desc).toHaveBeenCalledWith("subscription_event.created_at");
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("evt-2");
  });
});
