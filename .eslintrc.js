const rulesDirPlugin = require("eslint-plugin-rulesdir");
rulesDirPlugin.RULES_DIR = "eslint-rules";

module.exports = {
  extends: ["eslint:recommended", "next", "next/core-web-vitals", "prettier"],
  plugins: ["prettier", "rulesdir"],
  env: {
    jest: true,
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "off",
  },
  overrides: [
    {
      files: ["src/ui/**/*", "src/app/**/*"],
      rules: {
        "rulesdir/no-barrel-imports-in-ui": [
          "warn",
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
  ],
};
