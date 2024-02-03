import { configureStore } from "@reduxjs/toolkit";

import menuReducer from "@/slices/menu/menuSlice";
import emailReducer from "@/slices/email/emailSlice";
import chatReducer from "@/slices/chat/chatSlice";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    email: emailReducer,
    chat: chatReducer,
  },
});
