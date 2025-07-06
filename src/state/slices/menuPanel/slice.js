import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const menuMenuSlice = createSlice({
  name: "menuPanel",
  initialState,
  reducers: {
    setOpen: (state, action) => {
      state.open = action.payload;
    },
    toggle: (state) => {
      state.open = !state.open;
    },
  },
});

export const { setOpen, toggle } = menuMenuSlice.actions;
export default menuMenuSlice.reducer;
