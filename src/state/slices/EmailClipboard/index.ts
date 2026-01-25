export {
  setEmailClipboard,
  markEmailClipboard,
  resetEmailClipboard,
  setClipboardError,
  clearClipboardError,
} from "./slice";
export { default as emailClipboardReducer } from "./slice";
export { default as useEmailClipboard } from "./hooks";
export type { EmailClipboardState } from "./slice";
