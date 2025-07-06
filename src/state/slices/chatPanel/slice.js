import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const chatPanelSlice = createSlice({
  name: "chatPanel",
  initialState,
  reducers: {
    setIsOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { setIsOpen, toggle } = chatPanelSlice.actions;
export default chatPanelSlice.reducer;
