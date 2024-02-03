import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",

  initialState: {
    isChatOpen: false,
  },

  reducers: {
    initChatState: (state, action) => {
      state.isChatOpen = action.payload;
    },
    setIsChatOpen: (state, action) => {
      if (action.payload !== true && action.payload !== false) return;

      state.isChatCopied = action.payload;
    },
    toggleChat: (state) => {
      state.isChatOpen = !state.isChatOpen;
    },
  },
});

export const { initChatState, setIsChatOpen, toggleChat } = chatSlice.actions;

export default chatSlice.reducer;
