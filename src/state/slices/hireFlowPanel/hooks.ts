import useAppSelector from "@/hooks/store/AppSelector";
import useAppDispatch from "@/hooks/store/AppDispatch";
import type { RootState } from "@/state/stores";
import {
  openHireFlow,
  closeHireFlow,
  setHireFlowIntent,
  clearHireFlowIntent,
} from "./slice";
import type { HireFlowIntent } from "./slice";

export const selectHireFlowIsOpen = (state: RootState) =>
  state.hireFlowPanel.isOpen;
export const selectHireFlowIntent = (state: RootState) =>
  state.hireFlowPanel.pendingIntent;

interface UseHireFlowPanelReturn {
  isOpen: boolean;
  pendingIntent: HireFlowIntent | null;
  openHireFlow: () => void;
  closeHireFlow: () => void;
  setHireFlowIntent: (_intent: HireFlowIntent) => void;
  clearHireFlowIntent: () => void;
}

const useHireFlowPanel = (): UseHireFlowPanelReturn => {
  const isOpen = useAppSelector(selectHireFlowIsOpen);
  const pendingIntent = useAppSelector(selectHireFlowIntent);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    pendingIntent,
    openHireFlow: () => dispatch(openHireFlow()),
    closeHireFlow: () => dispatch(closeHireFlow()),
    setHireFlowIntent: (intent: HireFlowIntent) =>
      dispatch(setHireFlowIntent(intent)),
    clearHireFlowIntent: () => dispatch(clearHireFlowIntent()),
  };
};

export default useHireFlowPanel;
