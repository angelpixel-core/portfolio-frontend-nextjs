import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";

import { ReduxDecorator, QueryDecorator, MotionDecorator } from "./decorators";

import "../src/styles/globals.css";

const portfolioViewports = {
  smallMobile: {
    name: "Small Mobile (base: 0-399px)",
    styles: { width: "375px", height: "667px" },
  },
  phablet: {
    name: "Phablet (400px+)",
    styles: { width: "400px", height: "740px" },
  },
  mobile: {
    name: "Mobile (480px+)",
    styles: { width: "480px", height: "844px" },
  },
  tablet: {
    name: "Tablet (640px+)",
    styles: { width: "640px", height: "1024px" },
  },
  nav: {
    name: "Nav Breakpoint (800px+)",
    styles: { width: "800px", height: "1024px" },
  },
  stage: {
    name: "Stage (960px+)",
    styles: { width: "960px", height: "768px" },
  },
  desktop: {
    name: "Desktop (1025px+)",
    styles: { width: "1025px", height: "768px" },
  },
  wide: {
    name: "Wide (1441px+)",
    styles: { width: "1441px", height: "900px" },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...portfolioViewports,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    ReduxDecorator,
    QueryDecorator,
    MotionDecorator,
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
