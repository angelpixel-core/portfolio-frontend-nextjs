"use client";

import {
  ReduxProvider,
  ReactQueryProvider,
  ThemeProvider,
} from "@/state/providers";

const RootProvider = ({ children }) => {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
};

export default RootProvider;
