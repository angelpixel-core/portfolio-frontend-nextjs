import { configureStore } from "@reduxjs/toolkit";

import chatPanelReducer from "./slices/chatPanel";
import emailCopyReducer from "./slices/emailCopy";
import menuPanelReducer from "./slices/menuPanel";
import themeModeReducer from "./slices/themeMode";

export const store = configureStore({
  reducer: {
    chatPanel: chatPanelReducer,
    emailCopy: emailCopyReducer,
    menuPanel: menuPanelReducer,
    themeMode: themeModeReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
