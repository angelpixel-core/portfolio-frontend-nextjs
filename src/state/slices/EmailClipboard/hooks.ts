import { shallowEqual } from "react-redux";
import useAppSelector from "@/hooks/store/AppSelector";
import useAppDispatch from "@/hooks/store/AppDispatch";
import type { RootState } from "@/state/stores";
import {
  markEmailClipboard,
  resetEmailClipboard,
  setEmailClipboard,
  setClipboardError,
  clearClipboardError,
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
  const { isCopied, error } = useAppSelector(
    (state: RootState) => ({
      isCopied: state.emailClipboard.isCopied,
      error: state.emailClipboard.error,
    }),
    shallowEqual
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
