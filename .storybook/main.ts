import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const webpack = require("webpack");

    const mockDir = path.join(process.cwd(), ".storybook", "mocks");

    /**
     * Replace domain mock files with Lorem Ipsum versions for Storybook.
     *
     * NormalModuleReplacementPlugin intercepts BOTH import patterns:
     * - Aliased: `@/domains/article/model/mock` (used in story files)
     * - Relative: `./mock` (used in model/index.ts, resolved to full path)
     *
     * This ensures ALL stories get placeholder data without modifying
     * the real domain mock files used by the app and tests.
     */
    const mockReplacements = [
      { pattern: /domains\/profile\/model\/mock/, file: "profile.ts" },
      {
        pattern: /domains\/contact-point\/model\/mock/,
        file: "contact-point.ts",
      },
      {
        pattern: /domains\/job-experience\/model\/mock/,
        file: "job-experience.ts",
      },
      { pattern: /domains\/academic\/model\/mock/, file: "academic.ts" },
      { pattern: /domains\/customer\/model\/mock/, file: "customer.ts" },
      { pattern: /domains\/project\/model\/mock/, file: "project.ts" },
      { pattern: /domains\/article\/model\/mock/, file: "article.ts" },
      { pattern: /domains\/content\/model\/mock/, file: "content.ts" },
    ];

    mockReplacements.forEach(({ pattern, file }) => {
      config.plugins?.push(
        new webpack.NormalModuleReplacementPlugin(
          pattern,
          path.resolve(mockDir, file),
        ),
      );
    });

    return config;
  },
};

export default config;
