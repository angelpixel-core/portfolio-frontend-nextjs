"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import {
  ReduxProvider,
  ReactQueryProvider,
  AuthProvider,
  ThemeProvider,
  TransitionProvider,
} from "@/state/providers";
import LazyMotionProvider from "@/providers/LazyMotionProvider";
import { initPlausible } from "@/services/analytics";

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
      <SessionProvider>
        <AuthProvider>
          <ReactQueryProvider>
            <ThemeProvider>
              <LazyMotionProvider>
                <TransitionProvider>{children}</TransitionProvider>
              </LazyMotionProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default RootProvider;
