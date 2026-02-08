"use client";

import {
  ReduxProvider,
  ReactQueryProvider,
  AuthProvider,
  ThemeProvider,
  TransitionProvider,
} from "@/state/providers";

const RootProvider = ({ children }) => {
  return (
    <ReduxProvider>
      <AuthProvider>
        <ReactQueryProvider>
          <ThemeProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default RootProvider;
