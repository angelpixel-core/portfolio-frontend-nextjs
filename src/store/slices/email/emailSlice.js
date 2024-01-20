import { createSlice } from "@reduxjs/toolkit";

export const emailSlice = createSlice({
  name: "email",

  initialState: {
    isCopied: false,
  },

  reducers: {
    initEmailState: (state, action) => {
      state.isCopied = action.payload;
    },
    setIsCopied: (state, action) => {
      if (action.payload !== true && action.payload !== false) return;

      state.isCopied = action.payload;
    },
    toggleIsCopied: (state) => {
      state.isCopied = !state.isCopied;
    },
  },
});

export const { initEmailState, setIsCopied, toggleIsCopied } =
  emailSlice.actions;

export default emailSlice.reducer;
