import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "@/slices/menu/menuSlice";
import emailReducer from "@/slices/email/emailSlice";
import skillReducer from "@/slices/skill/skillSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    email: emailReducer,
    skill: skillReducer,
  },
});
