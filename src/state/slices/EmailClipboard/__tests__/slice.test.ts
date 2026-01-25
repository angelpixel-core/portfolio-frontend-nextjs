/**
 * EmailClipboard Slice Tests
 * Story 5.5: Copy Contact to Clipboard
 * TDD: RED phase - tests written before TypeScript migration
 */

import emailClipboardReducer, {
  markEmailClipboard,
  resetEmailClipboard,
  setEmailClipboard,
  setClipboardError,
  clearClipboardError,
} from "../slice";

describe("EmailClipboard slice", () => {
  describe("initial state", () => {
    it("has isCopied set to false", () => {
      const state = emailClipboardReducer(undefined, { type: "unknown" });
      expect(state.isCopied).toBe(false);
    });

    it("has error set to null", () => {
      const state = emailClipboardReducer(undefined, { type: "unknown" });
      expect(state.error).toBeNull();
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
      const initialState = { isCopied: true, error: null };
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
      const initialState = { isCopied: true, error: null };
      const state = emailClipboardReducer(
        initialState,
        setEmailClipboard(false)
      );
      expect(state.isCopied).toBe(false);
    });
  });

  describe("setClipboardError action", () => {
    it("sets error message", () => {
      const state = emailClipboardReducer(
        undefined,
        setClipboardError("Unable to copy. Please select and copy manually.")
      );
      expect(state.error).toBe(
        "Unable to copy. Please select and copy manually."
      );
    });
  });

  describe("clearClipboardError action", () => {
    it("clears error message", () => {
      const initialState = { isCopied: false, error: "Some error" };
      const state = emailClipboardReducer(initialState, clearClipboardError());
      expect(state.error).toBeNull();
    });
  });

  describe("markEmailClipboard clears error", () => {
    it("clears error when copy succeeds", () => {
      const initialState = { isCopied: false, error: "Previous error" };
      const state = emailClipboardReducer(initialState, markEmailClipboard());
      expect(state.isCopied).toBe(true);
      expect(state.error).toBeNull();
    });
  });
});
