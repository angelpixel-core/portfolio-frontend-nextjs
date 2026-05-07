import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import rulesDirPlugin from "eslint-plugin-rulesdir";

rulesDirPlugin.RULES_DIR = "eslint-rules";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "next",
    "next/core-web-vitals",
    "prettier"
  ),
  {
    plugins: {
      prettier: prettierPlugin,
      rulesdir: rulesDirPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/ui/**/*", "src/app/**/*"],
    rules: {
      "rulesdir/no-barrel-imports-in-ui": [
        "error",
        {
          barrelPaths: [
            "@/atoms",
            "@/buttons",
            "@/icons",
            "@/links",
            "@/texts",
            "@/molecules",
            "@/organisms",
            "@/overlays",
            "@/hooks",
          ],
        },
      ],
    },
  },
];
