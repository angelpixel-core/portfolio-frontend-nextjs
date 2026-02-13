import type { Decorator } from "@storybook/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { authPanelReducer } from "@/state/slices/authPanel";
import { chatPanelReducer } from "@/state/slices/chatPanel";
import { emailClipboardReducer } from "@/state/slices/EmailClipboard";
import { menuPanelReducer } from "@/state/slices/menuPanel";
import { themeModeReducer } from "@/state/slices/themeMode";

const reducers = {
  authPanel: authPanelReducer,
  chatPanel: chatPanelReducer,
  emailClipboard: emailClipboardReducer,
  menuPanel: menuPanelReducer,
  themeMode: themeModeReducer,
};

const ReduxDecorator: Decorator = (Story, context) => {
  const initialState = context.parameters?.redux?.initialState;
  const store = configureStore({
    reducer: reducers,
    preloadedState: initialState,
  });

  return (
    <Provider store={store}>
      <Story />
    </Provider>
  );
};

export default ReduxDecorator;
