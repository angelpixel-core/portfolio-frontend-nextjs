import { createSlice } from "@reduxjs/toolkit";

const KEY_NAME = "chatPanel";
const OPEN = true;
const CLOSED = false;

const initialState = {
  isOpen: CLOSED,
};

const chatPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setChatPanel: (state, action) => {
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
  setChatPanel,
  open: openChatPanel,
  close: closeChatPanel,
  toggle: toggleChatPanel,
} = chatPanelSlice.actions;

export default chatPanelSlice.reducer;
