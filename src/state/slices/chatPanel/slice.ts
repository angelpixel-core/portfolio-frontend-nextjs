import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "chatPanel";
const OPEN = true;
const CLOSED = false;

export interface ChatPanelState {
  isOpen: boolean;
  context?: {
    projectName?: string;
    source?: "project_teaser" | "header" | "footer";
  };
}

const initialState: ChatPanelState = {
  isOpen: CLOSED,
  context: undefined,
};

const chatPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setChatPanel: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    open: (state) => {
      state.isOpen = OPEN;
    },
    close: (state) => {
      state.isOpen = CLOSED;
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    setContext: (state, action: PayloadAction<ChatPanelState["context"]>) => {
      state.context = action.payload;
    },
    clearContext: (state) => {
      state.context = undefined;
    },
  },
});

export const {
  setChatPanel,
  open: openChatPanel,
  close: closeChatPanel,
  toggle: toggleChatPanel,
  setContext: setChatContext,
  clearContext: clearChatContext,
} = chatPanelSlice.actions;

export default chatPanelSlice.reducer;
