import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/services/auth/types";

const KEY_NAME = "authPanel";
const OPEN = true;
const CLOSED = false;

export type { AuthUser };

export interface AuthPanelState {
  isOpen: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  error: string | null;
}

const initialState: AuthPanelState = {
  isOpen: CLOSED,
  isAuthenticated: false,
  user: null,
  error: null,
};

const authPanelSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setAuthPanel: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    open: (state) => {
      state.isOpen = OPEN;
    },
    close: (state) => {
      state.isOpen = CLOSED;
      state.error = null; // Clear error on close
    },
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
      state.isOpen = CLOSED;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuthPanel,
  open: openAuthPanel,
  close: closeAuthPanel,
  toggle: toggleAuthPanel,
  loginSuccess,
  loginError,
  logout,
  clearError,
} = authPanelSlice.actions;

export default authPanelSlice.reducer;
