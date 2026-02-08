import { getInitials } from "../utils";

describe("getInitials", () => {
  it("returns two initials from full name", () => {
    expect(getInitials({ email: "john@test.com", name: "John Doe" })).toBe(
      "JD"
    );
  });

  it("returns two initials from multi-word name (first + second)", () => {
    expect(
      getInitials({ email: "a@test.com", name: "Alice Marie Johnson" })
    ).toBe("AM");
  });

  it("returns single initial from single-word name", () => {
    expect(getInitials({ email: "john@test.com", name: "John" })).toBe("J");
  });

  it("returns first letter of email when no name provided", () => {
    expect(getInitials({ email: "john@test.com" })).toBe("J");
  });

  it("uppercases initials from lowercase name", () => {
    expect(getInitials({ email: "a@test.com", name: "alice bob" })).toBe("AB");
  });

  it("handles name with extra whitespace", () => {
    expect(getInitials({ email: "a@test.com", name: "  John   Doe  " })).toBe(
      "JD"
    );
  });

  it("returns email initial when name is empty string", () => {
    expect(getInitials({ email: "mary@test.com", name: "" })).toBe("M");
  });

  it('returns "?" when email is empty string and no name', () => {
    expect(getInitials({ email: "" })).toBe("?");
  });
});
