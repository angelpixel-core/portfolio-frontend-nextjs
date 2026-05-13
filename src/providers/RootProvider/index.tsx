"use client";

import React, { useEffect } from "react";
import {
  ReduxProvider,
  ReactQueryProvider,
  AuthProvider,
  ThemeProvider,
  TransitionProvider,
} from "@/state/providers";
import LazyMotionProvider from "@/providers/LazyMotionProvider";
import { initPlausible } from "@/observability/analytics";

const RootProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  useEffect(() => {
    initPlausible();
  }, []);

  return (
    <ReduxProvider>
      <AuthProvider>
        <ReactQueryProvider>
          <ThemeProvider>
            <LazyMotionProvider>
              <TransitionProvider>{children}</TransitionProvider>
            </LazyMotionProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default RootProvider;
