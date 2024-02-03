import { createSlice } from "@reduxjs/toolkit";

export const emailSlice = createSlice({
  name: "email",

  initialState: {
    isEmailCopied: false,
  },

  reducers: {
    initEmailState: (state, action) => {
      state.isEmailCopied = action.payload;
    },
    setIsEmailCopied: (state, action) => {
      if (action.payload !== true && action.payload !== false) return;

      state.isEmailCopied = action.payload;
    },
    toggleIsEmailCopied: (state) => {
      state.isEmailCopied = !state.isEmailCopied;
    },
  },
});

export const { initEmailState, setIsEmailCopied, toggleIsEmailCopied } =
  emailSlice.actions;

export default emailSlice.reducer;
