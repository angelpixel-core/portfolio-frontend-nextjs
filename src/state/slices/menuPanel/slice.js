import { createSlice } from "@reduxjs/toolkit";

const KEY_NAME = "menuPanel";
const OPEN = true;
const CLOSED = false;

const initialState = {
  isOpen: CLOSED,
};

const menuPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setMenuPanel: (state, action) => {
      state.isOpen = action.payload;
    },
    open: (state, _action) => {
      state.isOpen = OPEN;
    },
    close: (state, _action) => {
      state.isOpen = CLOSED;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  setMenuPanel,
  open: openMenuPanel,
  close: closeMenuPanel,
  toggle: toggleMenuPanel,
} = menuPanelSlice.actions;

export default menuPanelSlice.reducer;
