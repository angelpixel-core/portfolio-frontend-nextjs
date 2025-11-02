import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  markEmailClipboard,
  resetEmailClipboard,
  setEmailClipboard,
} from "./slice";

const useEmailClipboard = () => {
  const isCopied = useAppSelector((state) => state.emailClipboard.isCopied);
  const dispatch = useAppDispatch();

  return {
    isCopied,
    setEmailClipboard: (value) => dispatch(setEmailClipboard(value)),
    markEmailClipboard: () => dispatch(markEmailClipboard()),
    resetEmailClipboard: () => dispatch(resetEmailClipboard()),
  };
};

export default useEmailClipboard;
