"use client";

import {
  ReduxProvider,
  ReactQueryProvider,
  ThemeProvider,
  TransitionProvider,
} from "@/state/providers";

const RootProvider = ({ children }) => {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
};

export default RootProvider;
