import { configureStore } from "@reduxjs/toolkit";

import { authPanelReducer } from "@/state/slices/authPanel";
import { chatPanelReducer } from "@/state/slices/chatPanel";
import { emailClipboardReducer } from "@/state/slices/EmailClipboard";
import { menuPanelReducer } from "@/state/slices/menuPanel";
import { themeModeReducer } from "@/state/slices/themeMode";

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

// Type inference for state and dispatch
export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;
