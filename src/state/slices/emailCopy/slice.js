import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  copied: false,
};

const emailCopySlice = createSlice({
  name: "emailCopy",
  initialState,
  reducers: {
    setCopied: (state, action) => {
      state.copied = action.payload;
    },
    markCopied: (state) => {
      state.copied = true;
    },
    resetCopied: (state) => {
      state.copied = false;
    },
  },
});

export const { setCopied, markCopied, resetCopied } = emailCopySlice.actions;
export default emailCopySlice.reducer;
