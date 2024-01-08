import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "@/slices/menu/menuSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
  },
});
