import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "@/slices/menu/menuSlice";
import emailReducer from "@/slices/email/emailSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    email: emailReducer,
  },
});
