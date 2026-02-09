/**
 * Tests for no-barrel-imports-in-ui ESLint rule.
 * Run: node eslint-rules/__tests__/no-barrel-imports-in-ui.test.js
 */

"use strict";

const { RuleTester } = require("eslint");
const rule = require("../no-barrel-imports-in-ui");

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: "module" },
});

const errorMsg = (source) => ({
  messageId: "noBarrelImport",
  data: { source },
});

ruleTester.run("no-barrel-imports-in-ui", rule, {
  valid: [
    // Direct path imports — always allowed
    { code: 'import Logo from "@/molecules/Logo";' },
    { code: 'import GitHubIcon from "@/atoms/icons/GitHubIcon";' },
    { code: 'import { useReducedMotion } from "@/hooks/ui";' },
    { code: 'import CopyButton from "@/buttons/CopyButton";' },
    { code: 'import NavigationItemLink from "@/links/NavigationItemLink";' },
    { code: 'import Floating from "@/overlays/Floating";' },
    { code: 'import AnimatedTitle from "@/texts/AnimatedTitle";' },

    // Non-UI barrels — allowed (domains, lib, services)
    { code: 'import { User } from "@/domains/user";' },
    { code: 'import { formatDate } from "@/lib/date";' },
    { code: 'import { performOAuthLogin } from "@/services/auth";' },

    // Side-effect imports — no specifiers, allowed
    { code: 'import "@/molecules";' },
    { code: 'import "@/hooks";' },

    // Subpath with named export — allowed
    { code: 'import { useAuthPanel } from "@/state/slices/authPanel";' },

    // Barrel not in default list — allowed
    { code: 'import { RootProvider } from "@/providers";' },

    // Custom barrelPaths config — only flags configured paths
    {
      code: 'import { Logo } from "@/molecules";',
      options: [{ barrelPaths: ["@/icons"] }],
    },
  ],

  invalid: [
    // Named imports from UI barrels
    {
      code: 'import { Logo } from "@/molecules";',
      errors: [errorMsg("@/molecules")],
    },
    {
      code: 'import { GitHubIcon } from "@/icons";',
      errors: [errorMsg("@/icons")],
    },
    {
      code: 'import { CopyButton, MenuButton } from "@/buttons";',
      errors: [errorMsg("@/buttons")],
    },
    {
      code: 'import { NavigationItemLink } from "@/links";',
      errors: [errorMsg("@/links")],
    },
    {
      code: 'import { AnimatedTitle } from "@/texts";',
      errors: [errorMsg("@/texts")],
    },
    {
      code: 'import { Floating } from "@/overlays";',
      errors: [errorMsg("@/overlays")],
    },
    {
      code: 'import { ArticleHoverThumbnail } from "@/atoms";',
      errors: [errorMsg("@/atoms")],
    },
    {
      code: 'import { ArticleContent } from "@/organisms";',
      errors: [errorMsg("@/organisms")],
    },

    // Hooks barrel
    {
      code: 'import { useReducedMotion } from "@/hooks";',
      errors: [errorMsg("@/hooks")],
    },
    {
      code: 'import { useReducedMotion, useTransition } from "@/hooks";',
      errors: [errorMsg("@/hooks")],
    },

    // Default imports from barrels — also a violation
    {
      code: 'import Logo from "@/molecules";',
      errors: [errorMsg("@/molecules")],
    },

    // Custom barrelPaths config
    {
      code: 'import { RootProvider } from "@/providers";',
      options: [{ barrelPaths: ["@/providers"] }],
      errors: [errorMsg("@/providers")],
    },
  ],
});

console.log("All tests passed!");
