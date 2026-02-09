/**
 * @fileoverview Disallow barrel imports in UI and App Router layers.
 * Barrel files (index.ts/js re-exports) prevent effective tree-shaking
 * in Next.js client bundles. See ADR-003.
 *
 * @author Angel DevStack
 */

"use strict";

/** Default barrel alias paths that map to index re-export files */
const DEFAULT_BARREL_PATHS = [
  "@/atoms",
  "@/buttons",
  "@/icons",
  "@/links",
  "@/texts",
  "@/molecules",
  "@/organisms",
  "@/overlays",
  "@/hooks",
];

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow barrel imports in UI/App layers to preserve tree-shaking",
      recommended: false,
    },
    messages: {
      noBarrelImport:
        "Barrel import from '{{source}}' harms tree-shaking. Use a direct path import instead (e.g., '{{source}}/ComponentName' not '{{source}}'). See ADR-003.",
    },
    schema: [
      {
        type: "object",
        properties: {
          barrelPaths: {
            type: "array",
            items: { type: "string" },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const barrelPaths = new Set(options.barrelPaths || DEFAULT_BARREL_PATHS);

    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        // Only flag imports that exactly match a barrel path
        if (!barrelPaths.has(source)) return;

        // Side-effect imports (import "@/molecules") have no specifiers — allow them
        if (node.specifiers.length === 0) return;

        context.report({
          node,
          messageId: "noBarrelImport",
          data: { source },
        });
      },
    };
  },
};
