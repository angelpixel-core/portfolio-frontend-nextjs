// Stores
export { default as ReduxStore } from "./stores/ReduxStore";
export type { RootState, AppDispatch } from "./stores/ReduxStore";

// Slices
export {
  // authPanel
  setAuthPanel,
  openAuthPanel,
  closeAuthPanel,
  toggleAuthPanel,
  loginSuccess,
  loginError,
  logout,
  clearError,
  getInitialAuthState,
  authPanelReducer,
  useAuthPanel,
  // chatPanel
  setChatPanel,
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
  chatPanelReducer,
  useChatPanel,
  // EmailClipboard
  setEmailClipboard,
  markEmailClipboard,
  resetEmailClipboard,
  setClipboardError,
  clearClipboardError,
  emailClipboardReducer,
  useEmailClipboard,
  // menuPanel
  setMenuPanel,
  openMenuPanel,
  closeMenuPanel,
  toggleMenuPanel,
  menuPanelReducer,
  useMenuPanel,
  // themeMode
  setThemeMode,
  setDarkThemeMode,
  setLightThemeMode,
  toggleThemeMode,
  getInitialTheme,
  themeModeReducer,
  useThemeMode,
} from "./slices";
export type {
  AuthPanelState,
  AuthUser,
  ChatPanelState,
  EmailClipboardState,
  MenuPanelState,
  ThemeMode,
  ThemeModeState,
} from "./slices";

// Providers
export { default as ReduxProvider } from "./providers/ReduxProvider";
export { default as ReactQueryProvider } from "./providers/ReactQueryProvider";
export { default as AuthProvider } from "./providers/AuthProvider";
export { default as ThemeProvider } from "./providers/ThemeProvider";
export { default as TransitionProvider } from "./providers/TransitionProvider";
