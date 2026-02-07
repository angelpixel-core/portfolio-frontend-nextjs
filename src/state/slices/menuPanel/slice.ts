import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "menuPanel";
const OPEN = true;
const CLOSED = false;

export interface MenuPanelState {
  isOpen: boolean;
}

const initialState: MenuPanelState = {
  isOpen: CLOSED,
};

const menuPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setMenuPanel: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    open: (state) => {
      state.isOpen = OPEN;
    },
    close: (state) => {
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
