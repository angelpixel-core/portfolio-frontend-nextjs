"use client";

import {
  ReduxProvider,
  ReactQueryProvider,
  AuthProvider,
  ThemeProvider,
  TransitionProvider,
} from "@/state/providers";
import LazyMotionProvider from "@/providers/LazyMotionProvider";

const RootProvider = ({ children }) => {
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
