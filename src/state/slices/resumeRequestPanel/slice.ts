import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "resumeRequestPanel";
const OPEN = true;
const CLOSED = false;

export type ResumeRequestIntentSource = "resume_cta" | "resume_intent";

export interface ResumeRequestIntent {
  source: ResumeRequestIntentSource;
  createdAt: number;
}

export interface ResumeRequestPanelState {
  isOpen: boolean;
  pendingIntent: ResumeRequestIntent | null;
  activeSource: ResumeRequestIntentSource;
}

const initialState: ResumeRequestPanelState = {
  isOpen: CLOSED,
  pendingIntent: null,
  activeSource: "resume_cta",
};

const resumeRequestPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    openResumeRequest: (
      state,
      action: PayloadAction<ResumeRequestIntentSource | undefined>
    ) => {
      state.isOpen = OPEN;
      if (action.payload) {
        state.activeSource = action.payload;
      }
    },
    closeResumeRequest: (state) => {
      state.isOpen = CLOSED;
    },
    setResumeRequestIntent: (
      state,
      action: PayloadAction<ResumeRequestIntent>
    ) => {
      state.pendingIntent = action.payload;
    },
    clearResumeRequestIntent: (state) => {
      state.pendingIntent = null;
    },
    setResumeRequestSource: (
      state,
      action: PayloadAction<ResumeRequestIntentSource>
    ) => {
      state.activeSource = action.payload;
    },
  },
});

export const {
  openResumeRequest,
  closeResumeRequest,
  setResumeRequestIntent,
  clearResumeRequestIntent,
  setResumeRequestSource,
} = resumeRequestPanelSlice.actions;

export default resumeRequestPanelSlice.reducer;
