import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "emailClipboard";

export interface EmailClipboardState {
  isCopied: boolean;
}

const initialState: EmailClipboardState = {
  isCopied: false,
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
    },
    clear: (state) => {
      state.isCopied = false;
    },
  },
});

export const {
  setEmailClipboard,
  copy: markEmailClipboard,
  clear: resetEmailClipboard,
} = emailClipboardSlice.actions;

export default emailClipboardSlice.reducer;
