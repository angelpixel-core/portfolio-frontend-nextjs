import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "emailClipboard";

export interface EmailClipboardState {
  isCopied: boolean;
  error: string | null;
}

const initialState: EmailClipboardState = {
  isCopied: false,
  error: null,
};

const emailClipboardSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setEmailClipboard: (state, action: PayloadAction<boolean>) => {
      state.isCopied = action.payload;
    },
    copy: (state) => {
      state.isCopied = true;
      state.error = null; // Clear error on successful copy
    },
    clear: (state) => {
      state.isCopied = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setEmailClipboard,
  copy: markEmailClipboard,
  clear: resetEmailClipboard,
  setError: setClipboardError,
  clearError: clearClipboardError,
} = emailClipboardSlice.actions;

export default emailClipboardSlice.reducer;
