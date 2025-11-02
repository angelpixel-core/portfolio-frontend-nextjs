"use client";

import { Provider } from "react-redux";
// HASTA aca aver que pasa
import { ReduxStore } from "@/state/stores";

const ReduxProvider = ({ children }) => {
  return <Provider store={ReduxStore}>{children}</Provider>;
};

export default ReduxProvider;
