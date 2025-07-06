import { configureStore } from "@reduxjs/toolkit";

import chatPanelReducer from "./slices/chatPanel";
import emailCopyReducer from "./slices/emailCopy";
import menuPanelReducer from "./slices/menuPanel";

export const store = configureStore({
  reducer: {
    chatPanel: chatPanelReducer,
    emailCopy: emailCopyReducer,
    menuPanel: menuPanelReducer,
  },
});
