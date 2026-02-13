"use client";

import React from "react";
import {
  ReduxProvider,
  ReactQueryProvider,
  AuthProvider,
  ThemeProvider,
  TransitionProvider,
} from "@/state/providers";
import LazyMotionProvider from "@/providers/LazyMotionProvider";

const RootProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
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
