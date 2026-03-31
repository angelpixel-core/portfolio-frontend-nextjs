import useAppSelector from "@/hooks/store/AppSelector";
import useAppDispatch from "@/hooks/store/AppDispatch";
import type { RootState } from "@/state/stores";
import {
  openResumeRequest,
  closeResumeRequest,
  setResumeRequestIntent,
  clearResumeRequestIntent,
  setResumeRequestSource,
} from "./slice";
import type { ResumeRequestIntent, ResumeRequestIntentSource } from "./slice";

export const selectResumeRequestIsOpen = (state: RootState) =>
  state.resumeRequestPanel.isOpen;
export const selectResumeRequestIntent = (state: RootState) =>
  state.resumeRequestPanel.pendingIntent;
export const selectResumeRequestSource = (state: RootState) =>
  state.resumeRequestPanel.activeSource;

interface UseResumeRequestPanelReturn {
  isOpen: boolean;
  pendingIntent: ResumeRequestIntent | null;
  activeSource: ResumeRequestIntentSource;
  openResumeRequest: (_source?: ResumeRequestIntentSource) => void;
  closeResumeRequest: () => void;
  setResumeRequestIntent: (_intent: ResumeRequestIntent) => void;
  clearResumeRequestIntent: () => void;
  setResumeRequestSource: (_source: ResumeRequestIntentSource) => void;
}

const useResumeRequestPanel = (): UseResumeRequestPanelReturn => {
  const isOpen = useAppSelector(selectResumeRequestIsOpen);
  const pendingIntent = useAppSelector(selectResumeRequestIntent);
  const activeSource = useAppSelector(selectResumeRequestSource);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    pendingIntent,
    activeSource,
    openResumeRequest: (_source?: ResumeRequestIntentSource) =>
      dispatch(openResumeRequest(_source)),
    closeResumeRequest: () => dispatch(closeResumeRequest()),
    setResumeRequestIntent: (intent: ResumeRequestIntent) =>
      dispatch(setResumeRequestIntent(intent)),
    clearResumeRequestIntent: () => dispatch(clearResumeRequestIntent()),
    setResumeRequestSource: (source: ResumeRequestIntentSource) =>
      dispatch(setResumeRequestSource(source)),
  };
};

export default useResumeRequestPanel;
