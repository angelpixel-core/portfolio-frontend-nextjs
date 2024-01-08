import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",

  initialState: {
    isOpen: false,
  },

  reducers: {
    initMenuState: (state, action) => {
      state.isOpen = action.payload;
    },
    setIsOpen: (state, action) => {
      if (action.payload !== true && action.payload !== false) return;

      state.isOpen = action.payload;
    },
    toggleMenu: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { initMenuState, setIsOpen, toggleMenu } = menuSlice.actions;

export default menuSlice.reducer;
