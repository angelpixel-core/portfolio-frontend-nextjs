import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/stores/ReduxStore";

const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
