import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",

  initialState: {
    isMenuOpen: false,
  },

  reducers: {
    initMenuState: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      if (action.payload !== true && action.payload !== false) return;

      state.isMenuOpen = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { initMenuState, setIsMenuOpen, toggleMenu } = menuSlice.actions;

export default menuSlice.reducer;
