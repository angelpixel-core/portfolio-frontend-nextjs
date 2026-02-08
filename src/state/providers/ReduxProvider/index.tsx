"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { ReduxStore } from "@/state/stores";

interface Props {
  children: ReactNode;
}

const ReduxProvider = ({ children }: Props) => {
  return <Provider store={ReduxStore}>{children}</Provider>;
};

export default ReduxProvider;
