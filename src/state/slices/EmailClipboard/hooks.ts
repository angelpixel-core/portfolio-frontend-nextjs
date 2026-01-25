import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  markEmailClipboard,
  resetEmailClipboard,
  setEmailClipboard,
  EmailClipboardState,
} from "./slice";

interface UseEmailClipboardReturn {
  isCopied: boolean;
  setEmailClipboard: (_value: boolean) => void;
  markEmailClipboard: () => void;
  resetEmailClipboard: () => void;
}

const useEmailClipboard = (): UseEmailClipboardReturn => {
  const isCopied = useAppSelector(
    (state: { emailClipboard: EmailClipboardState }) =>
      state.emailClipboard.isCopied
  );
  const dispatch = useAppDispatch();

  return {
    isCopied,
    setEmailClipboard: (value: boolean) => dispatch(setEmailClipboard(value)),
    markEmailClipboard: () => dispatch(markEmailClipboard()),
    resetEmailClipboard: () => dispatch(resetEmailClipboard()),
  };
};

export default useEmailClipboard;
