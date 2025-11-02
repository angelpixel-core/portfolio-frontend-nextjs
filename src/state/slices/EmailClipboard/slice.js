import { createSlice } from "@reduxjs/toolkit";

const KEY_NMAE = "emailClipboard";
const COPIED = true;

const initialState = {
  isCopied: !COPIED,
};

const emailClipboardSlice = createSlice({
  name: KEY_NMAE,
  initialState,
  reducers: {
    setEmailClipboard: (state, action) => {
      state.isCopied = action.payload;
    },
    copy: (state) => {
      state.isCopied = COPIED;
    },
    clear: (state) => {
      state.isCopied = !COPIED;
    },
  },
});

export const {
  setEmailClipboard,
  copy: markEmailClipboard,
  clear: resetEmailClipboard,
} = emailClipboardSlice.actions;

export default emailClipboardSlice.reducer;
