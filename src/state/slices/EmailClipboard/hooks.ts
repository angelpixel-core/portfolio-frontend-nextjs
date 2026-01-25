import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  markEmailClipboard,
  resetEmailClipboard,
  setEmailClipboard,
  setClipboardError,
  clearClipboardError,
  EmailClipboardState,
} from "./slice";

interface UseEmailClipboardReturn {
  isCopied: boolean;
  error: string | null;
  setEmailClipboard: (_value: boolean) => void;
  markEmailClipboard: () => void;
  resetEmailClipboard: () => void;
  setClipboardError: (_message: string) => void;
  clearClipboardError: () => void;
}

const useEmailClipboard = (): UseEmailClipboardReturn => {
  const isCopied = useAppSelector(
    (state: { emailClipboard: EmailClipboardState }) =>
      state.emailClipboard.isCopied
  );
  const error = useAppSelector(
    (state: { emailClipboard: EmailClipboardState }) =>
      state.emailClipboard.error
  );
  const dispatch = useAppDispatch();

  return {
    isCopied,
    error,
    setEmailClipboard: (value: boolean) => dispatch(setEmailClipboard(value)),
    markEmailClipboard: () => dispatch(markEmailClipboard()),
    resetEmailClipboard: () => dispatch(resetEmailClipboard()),
    setClipboardError: (message: string) =>
      dispatch(setClipboardError(message)),
    clearClipboardError: () => dispatch(clearClipboardError()),
  };
};

export default useEmailClipboard;
