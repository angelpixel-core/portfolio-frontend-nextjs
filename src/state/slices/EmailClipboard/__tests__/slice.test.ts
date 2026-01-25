/**
 * EmailClipboard Slice Tests
 * Story 5.5: Copy Contact to Clipboard
 * TDD: RED phase - tests written before TypeScript migration
 */

import emailClipboardReducer, {
  markEmailClipboard,
  resetEmailClipboard,
  setEmailClipboard,
} from "../slice";

describe("EmailClipboard slice", () => {
  describe("initial state", () => {
    it("has isCopied set to false", () => {
      const state = emailClipboardReducer(undefined, { type: "unknown" });
      expect(state.isCopied).toBe(false);
    });
  });

  describe("markEmailClipboard action", () => {
    it("sets isCopied to true", () => {
      const state = emailClipboardReducer(undefined, markEmailClipboard());
      expect(state.isCopied).toBe(true);
    });
  });

  describe("resetEmailClipboard action", () => {
    it("sets isCopied to false", () => {
      const initialState = { isCopied: true };
      const state = emailClipboardReducer(initialState, resetEmailClipboard());
      expect(state.isCopied).toBe(false);
    });
  });

  describe("setEmailClipboard action", () => {
    it("sets isCopied to provided value (true)", () => {
      const state = emailClipboardReducer(undefined, setEmailClipboard(true));
      expect(state.isCopied).toBe(true);
    });

    it("sets isCopied to provided value (false)", () => {
      const initialState = { isCopied: true };
      const state = emailClipboardReducer(
        initialState,
        setEmailClipboard(false)
      );
      expect(state.isCopied).toBe(false);
    });
  });
});
