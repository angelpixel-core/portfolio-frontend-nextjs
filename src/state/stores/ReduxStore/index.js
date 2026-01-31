import { configureStore } from "@reduxjs/toolkit";

import {
  authPanelReducer,
  chatPanelReducer,
  emailClipboardReducer,
  menuPanelReducer,
  themeModeReducer,
} from "@/state/slices";

const ReduxStore = configureStore({
  reducer: {
    authPanel: authPanelReducer,
    chatPanel: chatPanelReducer,
    emailClipboard: emailClipboardReducer,
    menuPanel: menuPanelReducer,
    themeMode: themeModeReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default ReduxStore;
