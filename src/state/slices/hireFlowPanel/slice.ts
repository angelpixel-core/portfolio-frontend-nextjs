import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "hireFlowPanel";
const OPEN = true;
const CLOSED = false;

export type HireFlowIntentSource =
  | "hire_me_floating"
  | "hire_me_header"
  | "hire_me_about"
  | "hire_me_section";

export interface HireFlowIntent {
  source: HireFlowIntentSource;
  createdAt: number;
}

export interface HireFlowPanelState {
  isOpen: boolean;
  pendingIntent: HireFlowIntent | null;
}

const initialState: HireFlowPanelState = {
  isOpen: CLOSED,
  pendingIntent: null,
};

const hireFlowPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    openHireFlow: (state) => {
      state.isOpen = OPEN;
    },
    closeHireFlow: (state) => {
      state.isOpen = CLOSED;
    },
    setHireFlowIntent: (state, action: PayloadAction<HireFlowIntent>) => {
      state.pendingIntent = action.payload;
    },
    clearHireFlowIntent: (state) => {
      state.pendingIntent = null;
    },
  },
});

export const {
  openHireFlow,
  closeHireFlow,
  setHireFlowIntent,
  clearHireFlowIntent,
} = hireFlowPanelSlice.actions;

export default hireFlowPanelSlice.reducer;
