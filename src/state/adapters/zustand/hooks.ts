import { useStore } from "@/state/adapters/zustand/store";
export const useStoreSelector = useStore;
export const useStoreDispatch = () => {}; // Zustand no lo necesita
