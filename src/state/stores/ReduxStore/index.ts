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

// Type inference for state and dispatch
export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;
